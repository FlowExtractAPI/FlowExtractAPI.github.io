// /api/demo: the "Try it live" box. Order of checks: method + body → actor + URL allowed → Turnstile → 24 h cache →
// per-visitor and global limits (one Durable Object, exact counts) → the demo actor's Standby URL (token = Worker
// secret DEMO_APIFY_TOKEN, run-only account) → allow-listed fields, max 10 rows. The browser never sees a token.
import { DurableObject } from 'cloudflare:workers';
import ACTORS from './demo-actors.json';

// Per-actor settings live in demo-actors.json (add an actor there; guide: live-demo/ADD-AN-ACTOR.md).
const LIVE = Object.fromEntries(Object.entries(ACTORS).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, {
  ...v,
  hostList: v.hosts,
  hosts: { test: (host) => v.hosts.some((h) => host === h || host.endsWith('.' + h)) },
}]));
// Limits are per visitor ACROSS all demo actors (20/day in total), plus one global daily cap for everyone.
const LIMITS = { perIpHour: 8, perIpDay: 20, globalDay: 500, timeoutMs: 50000, cacheSecs: 86400, maxRows: 10 };
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
  if (!env.TURNSTILE_SECRET || !env.DEMO_APIFY_TOKEN) return json(503, { error: 'The live demo is not switched on yet.' });

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
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LIMITS.timeoutMs);
  let rows = [], total = null, error = null;
  for (let attempt = 1; attempt <= 2 && !rows.length && !(error && attempt > 1); attempt++) try {
    const r = await fetch(cfg.upstream, { method: 'POST', signal: ctrl.signal, headers: { Authorization: `Bearer ${env.DEMO_APIFY_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target }) });
    const text = await r.text();
    if (!r.ok || !/"type":"batch"/.test(text)) console.log(`demo upstream ${r.status}: ${text.slice(0, 300)}`);
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === 'batch' && Array.isArray(ev.data)) rows.push(...ev.data);
      else if (ev.type === 'property' && ev.data && !ev.data.status) rows.push(ev.data);
      else if ((ev.type === 'failed' || ev.type === 'error') && !error) error = `${cfg.name} returned no results for this link. Check that it opens a search or a single item page.`;
      if (ev.type === 'progress' && ev.total) total = ev.total;
    }
    if (!rows.length && !error && attempt === 1) continue; // empty stream: try once more
  } catch (e) {
    error = e.name === 'AbortError' ? 'The demo took too long (50 s limit). Try a smaller search.' : 'The demo backend is not reachable right now.';
  }
  clearTimeout(timer);
  const trimmed = rows.slice(0, LIMITS.maxRows).map((p) => Object.fromEntries(Object.entries(cfg.fields).filter(([k]) => p[k] !== undefined && p[k] !== null).map(([k, v]) => [v, p[k]])));
  if (!trimmed.length) {
    ctx.waitUntil(guard(env, { ip: visitor, op: 'refund' }));
    record(env, 'demo_failed', String(body.actor), String(error || 'no rows').slice(0, 60), request); // our failure: the visitor keeps the try
    return json(502, { error: error || 'No results for this link.' });
  }
  const out = { actor: body.actor, url: target, rows: trimmed, count: trimmed.length, total, ms: Date.now() - t0, store: cfg.store, display: cfg.display };
  const extra = { remaining: ok.remaining, limits: { day: LIMITS.perIpDay, hour: LIMITS.perIpHour } };
  ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${LIMITS.cacheSecs}` } })));
  record(env, 'demo_run', body.actor, 'live', request);
  return json(200, { ...out, ...extra, cached: false });
}
