// /api/demo: the "Try it live" box. Order of checks: method + body → actor + URL allowed → the actor's DEFAULT link?
// answer from KV DEMO_SAMPLES (no human check, no quota; refreshed daily by refreshSamples() on the cron) → Turnstile →
// 24 h cache → per-visitor and global limits (one Durable Object, exact counts) → the backend (Cloud Run, or Apify
// Standby; see DEMO_BACKEND) → allow-listed fields, max 10 rows. The browser never sees a token or a backend URL.
import { DurableObject } from 'cloudflare:workers';
import ACTORS from './demo-actors.json';

// Per-actor settings live in demo-actors.json (add an actor there; guide: live-demo/ADD-AN-ACTOR.md).
const LIVE = Object.fromEntries(Object.entries(ACTORS).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, {
  ...v,
  hostList: v.hosts,
  hosts: { test: (host) => v.hosts.some((h) => host === h || host.endsWith('.' + h)) },
}]));
// Limits are per visitor ACROSS all demo actors (20/day in total), plus one global daily cap for everyone.
const LIMITS = { perIpHour: 8, perIpDay: 20, globalDay: 500, timeoutMs: 70000, cacheSecs: 86400, maxRows: 10 };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

// Exact counters: per visitor (hashed IP, never stored raw) and global per UTC day.
export class DemoGuard extends DurableObject {
  async fetch(request) {
    const { ip, op } = await request.json();
    const now = Date.now();
    const day = new Date().toISOString().slice(0, 10);
    const g = (await this.ctx.storage.get('global')) || { day, n: 0 };
    if (g.day !== day) { g.day = day; g.n = 0; }
    const key = 'ip:' + ip;
    const list = ((await this.ctx.storage.get(key)) || []).filter((t) => now - t < 86400000);
    if (op === 'refund') {
      list.pop(); g.n = Math.max(0, g.n - 1);
      await this.ctx.storage.put(key, list); await this.ctx.storage.put('global', g);
      return Response.json({ ok: true });
    }
    if (g.n >= LIMITS.globalDay) return Response.json({ ok: false, msg: "The live demo has reached today's limit for everyone.", signup: true, kind: 'global' });
    if (list.length >= LIMITS.perIpDay) return Response.json({ ok: false, msg: `You have used today's ${plural(LIMITS.perIpDay, 'free live demo', 'free live demos')}.`, signup: true, kind: 'day' });
    if (list.filter((t) => now - t < 3600000).length >= LIMITS.perIpHour) return Response.json({ ok: false, msg: `You have used this hour's ${plural(LIMITS.perIpHour, 'live demo', 'live demos')}. Try again later.`, signup: true, kind: 'hour' });
    list.push(now); g.n++;
    await this.ctx.storage.put(key, list); await this.ctx.storage.put('global', g);
    await this.ctx.storage.setAlarm(now + 86400000); // tidy up old visitor keys
    return Response.json({ ok: true, remaining: LIMITS.perIpDay - list.length });
  }
  async alarm() {
    const all = await this.ctx.storage.list({ prefix: 'ip:' });
    const now = Date.now();
    for (const [k, v] of all) if (!v.some((t) => now - t < 86400000)) await this.ctx.storage.delete(k);
  }
}

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('').slice(0, 32);
}
function pickBackends(env, cfg, actorId) {
  // Which backend runs the demos: vars.DEMO_BACKEND in wrangler.jsonc = "cloudrun" (default, Google Cloud Run) |
  // "apify" (Apify Standby, cfg.upstream + run-only token) | "cloudrun+apify" (Cloud Run, then Apify on failure).
  // Moving back to Apify: live-demo/README.md, section "Switch backend". Cloud Run URLs: Worker secret
  // DEMO_CLOUDRUN_URLS ({"<actor id>": "https://…run.app"}), never in this public repo; X-Demo-Secret = DEMO_CLOUDRUN_SECRET.
  const mode = String(env.DEMO_BACKEND || 'cloudrun');
  let cloudrun = ''; try { cloudrun = JSON.parse(env.DEMO_CLOUDRUN_URLS || '{}')[actorId] || ''; } catch {}
  const backends = [];
  if (mode.includes('cloudrun') && cloudrun && env.DEMO_CLOUDRUN_SECRET) backends.push({ name: 'cloudrun', url: cloudrun, headers: { 'X-Demo-Secret': env.DEMO_CLOUDRUN_SECRET }, ms: mode === 'cloudrun' ? LIMITS.timeoutMs : 45000 });
  if (mode.includes('apify') && cfg.upstream && env.DEMO_APIFY_TOKEN) backends.push({ name: 'apify', url: cfg.upstream, headers: { Authorization: `Bearer ${env.DEMO_APIFY_TOKEN}` }, ms: LIMITS.timeoutMs });
  if (backends.length === 1) backends.push(backends[0]); // one backend: it gets the quick retry
  return backends;
}

async function runDemo(cfg, backends, target) {
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LIMITS.timeoutMs);
  let rows = [], total = null, error = null;
  // Retry once when the first answer came back quickly with nothing (empty stream, source said 429…): a new
  // request gets a fresh proxy IP. Never retry a slow failure (visitor already waited) or "all demos busy".
  let busy = false;
  let served = '';
  for (let i = 0; i < backends.length && !rows.length && !busy && !(i > 0 && backends[i] === backends[i - 1] && Date.now() - t0 > 25000); i++) try {
    error = null;
    const b = backends[i];
    const signal = AbortSignal.any([ctrl.signal, AbortSignal.timeout(b.ms)]);
    const r = await fetch(b.url, { method: 'POST', signal, headers: { ...b.headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target }) });
    const text = await r.text();
    if (!r.ok || !/"type":"batch"/.test(text)) console.log(`demo ${b.name} ${r.status}: ${text.slice(0, 300)}`);
    if (/"type":"batch"/.test(text)) served = b.name;
    // Apify refuses new Standby containers when the run-only account is at its concurrent-run limit
    if (!r.ok && /cannot-start-actor-runs|concurrent/i.test(text)) { busy = true; error = 'All live demos are busy right now. Please try again in a minute.'; break; }
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === 'batch' && Array.isArray(ev.data)) rows.push(...ev.data);
      else if (ev.type === 'property' && ev.data && !ev.data.status) rows.push(ev.data);
      else if ((ev.type === 'failed' || ev.type === 'error') && !error) error = `${cfg.name} returned no results for this link. Check that it opens a search or a single item page.`;
      if (ev.type === 'progress' && ev.total) total = ev.total;
    }
  } catch (e) {
    error = e.name === 'AbortError' || e.name === 'TimeoutError' ? 'The demo took too long. Try another link.' : 'The demo backend is not reachable right now.';
  }
  clearTimeout(timer);
  // fields: { "<actor output path, dots for nesting>": "<name shown>" }; pseudonymize: shown names whose values are
  // private people (commenters, reviewers) → "Viewer 1", "Viewer 2"… (label: cfg.pseudonymLabel); dates: shown names
  // turned into YYYY-MM-DD (unix seconds/ms or ISO strings)
  const pick = (o, p) => p.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
  const people = new Map();
  const trimmed = rows.slice(0, LIMITS.maxRows).map((p) => {
    const row = {};
    for (const [k, v] of Object.entries(cfg.fields)) {
      let val = pick(p, k);
      if (val === undefined || val === null || val === '') continue;
      if ((cfg.dates || []).includes(v)) { const d = typeof val === 'number' ? new Date(val < 1e12 ? val * 1000 : val) : new Date(val); if (!isNaN(d)) val = d.toISOString().slice(0, 10); }
      if ((cfg.pseudonymize || []).includes(v)) { if (!people.has(val)) people.set(val, `${cfg.pseudonymLabel || 'Person'} ${people.size + 1}`); val = people.get(val); }
      row[v] = val;
    }
    return row;
  }).filter((row) => Object.keys(row).length >= 2); // a row with almost none of the allow-listed fields (e.g. a summary row) is not shown
  return { rows: trimmed, total, error, served };
}

// two links are the same demo input when they differ only by '#…', a trailing slash or letter case of the host
function sameLink(a, b) {
  try { const x = new URL(a), y = new URL(b); return x.host.toLowerCase() === y.host.toLowerCase() && x.pathname.replace(/\/$/, '') === y.pathname.replace(/\/$/, '') && x.search === y.search; } catch { return false; }
}
const shape = (cfg, actorId, target, r, ms) => ({ actor: actorId, url: target, rows: r.rows, count: r.rows.length, total: r.total, ms, store: cfg.store, display: cfg.display });

// Cron (wrangler.jsonc triggers): run every demo's default link once and keep the answer in KV DEMO_SAMPLES, so the
// first click on "Run it live" with the example link is instant for everyone, everywhere. A failed refresh keeps the
// previous answer. Counted as demo_sample_refresh (ok | failed) in Analytics Engine.
export async function refreshSamples(env) {
  await Promise.allSettled(Object.entries(LIVE).filter(([, cfg]) => cfg.sample && env.DEMO_SAMPLES).map(async ([id, cfg]) => {
    const t0 = Date.now();
    const r = await runDemo(cfg, pickBackends(env, cfg, id), cfg.sample).catch(() => ({ rows: [] }));
    // a thin answer (< 3 rows, e.g. cut by the time limit) never replaces a fuller saved one
    const prev = r.rows.length && r.rows.length < 3 ? await env.DEMO_SAMPLES.get(id, 'json').catch(() => null) : null;
    if (r.rows.length && !(prev && prev.rows && prev.rows.length > r.rows.length)) await env.DEMO_SAMPLES.put(id, JSON.stringify({ ...shape(cfg, id, cfg.sample, r, Date.now() - t0), refreshedAt: new Date().toISOString() }));
    try { env.EVENTS?.writeDataPoint({ blobs: ['demo_sample_refresh', id, r.rows.length ? 'ok' : 'failed', '', 'cron'], doubles: [r.rows.length], indexes: [id] }); } catch {}
    console.log(`sample ${id}: ${r.rows.length} rows in ${Date.now() - t0} ms`);
  }));
}

const guard = (env, body) => env.DEMO_GUARD.get(env.DEMO_GUARD.idFromName('global')).fetch('https://guard/', { method: 'POST', body: JSON.stringify(body) }).then((r) => r.json());

export async function handleDemo(request, env, ctx, record) {
  if (request.method !== 'POST') return json(405, { error: 'POST only' });
  let body = {};
  try { body = await request.json(); } catch {}
  const cfg = LIVE[String(body.actor || '')];
  if (!cfg) return json(400, { error: 'This scraper is coming soon to the live demo.' });
  const target = String(body.url || '').trim().slice(0, 1000);
  let host;
  try { host = new URL(target).hostname; } catch { return json(400, { error: `Paste a full ${cfg.name} link (https://www.${cfg.hostList[0]}/…).` }); }
  if (!cfg.hosts.test(host)) return json(400, { error: `This demo only accepts ${cfg.name} links (${cfg.hostList.join(', ')}).` });
  // default link of this demo: ready-made answer from KV (same data a live run gives, refreshed daily)
  const isSample = cfg.sample && sameLink(target, cfg.sample);
  if (isSample && env.DEMO_SAMPLES) {
    const saved = await env.DEMO_SAMPLES.get(body.actor, 'json').catch(() => null);
    if (saved && saved.rows && saved.rows.length) { record(env, 'demo_run', body.actor, 'sample', request); return json(200, { ...saved, ms: 0, cached: true, sample: true }); }
  }
  const backends = pickBackends(env, cfg, body.actor);
  if (!env.TURNSTILE_SECRET || !backends.length) return json(503, { error: 'The live demo is not switched on yet.' });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  // DEMO_TURNSTILE_OPTIONAL=1 (testing): a request without a token is allowed; a token that is sent must still be valid.
  const optional = env.DEMO_TURNSTILE_OPTIONAL === '1' && !body.turnstile;
  const ts = new FormData();
  ts.append('secret', env.TURNSTILE_SECRET); ts.append('response', String(body.turnstile || '')); ts.append('remoteip', ip);
  const verdict = optional ? { success: true } : await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: ts }).then((r) => r.json()).catch(() => ({ success: false }));
  if (!verdict.success) console.log(`demo human check failed: token length ${String(body.turnstile || '').length}, codes ${JSON.stringify(verdict['error-codes'] || [])}, hostname ${verdict.hostname || '-'}`);
  if (!verdict.success) { record(env, 'demo_human_failed', String(body.actor), String((verdict['error-codes'] || [])[0] || ''), request); return json(403, { error: 'The human check did not pass. Reload the page and try again.' }); }

  const cacheKey = new Request(`https://flowextractapi.com/__demo-cache/v2/${body.actor}/${await sha(target.split('#')[0])}`);
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) { const c = await hit.json(); record(env, 'demo_run', body.actor, 'cached', request); return json(200, { ...c, cached: true }); }

  const visitor = await sha(ip + '|' + (env.DEMO_IP_SALT || 'flowextract'));
  const ok = await guard(env, { ip: visitor, op: 'take' });
  if (!ok.ok) { ok.remaining = 0; record(env, 'demo_refused', String(body.actor), ok.kind || '', request); return json(429, { error: ok.msg, signup: !!ok.signup, remaining: 0, limits: { day: LIMITS.perIpDay, hour: LIMITS.perIpHour } }); }

  const t0 = Date.now();
  const { rows: trimmed, total, error, served } = await runDemo(cfg, backends, target);
  if (!trimmed.length) {
    ctx.waitUntil(guard(env, { ip: visitor, op: 'refund' }));
    record(env, 'demo_failed', String(body.actor), String(error || 'no rows').slice(0, 60), request); // our failure: the visitor keeps the try
    return json(502, { error: error || 'No results for this link.' });
  }
  const out = shape(cfg, body.actor, target, { rows: trimmed, total }, Date.now() - t0);
  if (isSample && env.DEMO_SAMPLES) ctx.waitUntil(env.DEMO_SAMPLES.put(body.actor, JSON.stringify({ ...out, refreshedAt: new Date().toISOString() })));
  const extra = { remaining: ok.remaining, limits: { day: LIMITS.perIpDay, hour: LIMITS.perIpHour } };
  ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${LIMITS.cacheSecs}` } })));
  record(env, 'demo_run', body.actor, served === 'cloudrun' ? 'live-cloudrun' : 'live', request);
  return json(200, { ...out, ...extra, cached: false });
}
