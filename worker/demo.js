// /api/demo: the "Try it live" box. Order of checks: method + body → actor + URL allowed → Turnstile → 24 h cache →
// per-visitor and global limits (one Durable Object, exact counts) → the demo actor's Standby URL (token = Worker
// secret DEMO_APIFY_TOKEN, run-only account) → allow-listed fields, max 10 rows. The browser never sees a token.
import { DurableObject } from 'cloudflare:workers';

const LIVE = {
  idealista: {
    hosts: /(^|\.)idealista\.(com|pt|it|fr)$/i,
    upstream: 'https://mourad-22--idealista-demo.apify.actor/',
    store: 'https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63',
    // Listing data only: no contact names or phones. The listing photo (operator decision 2026-11-14) is a property
    // photo shown by URL, not people.
    fields: { thumbnail: 'image', price: 'price', address: 'address', description: 'description', propertyType: 'type', operation: 'operation', size: 'size_m2', rooms: 'rooms', bathrooms: 'bathrooms', priceByArea: 'price_per_m2', floor: 'floor', exterior: 'exterior', hasLift: 'lift', municipality: 'municipality', district: 'district', neighborhood: 'neighborhood', province: 'province', country: 'country', status: 'condition', newDevelopment: 'new_development', propertyCode: 'property_code', url: 'url' },
    // How the card view uses the fields (from the actor's dataset_schema "Search" view: image, price, address, description)
    display: { image: 'image', price: 'price', currency: 'EUR', title: 'address', text: 'description', link: 'url', facts: [['rooms', 'rooms'], ['bathrooms', 'baths'], ['size_m2', 'm²'], ['municipality', '']] },
  },
};
const LIMITS = { perIpHour: 3, perIpDay: 5, globalDay: 500, timeoutMs: 50000, cacheSecs: 86400, maxRows: 10 };

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
    if (g.n >= LIMITS.globalDay) return Response.json({ ok: false, msg: "The live demo has reached today's limit for everyone.", signup: true });
    if (list.length >= LIMITS.perIpDay) return Response.json({ ok: false, msg: `You have used today's ${LIMITS.perIpDay} free live demos.`, signup: true });
    if (list.filter((t) => now - t < 3600000).length >= LIMITS.perIpHour) return Response.json({ ok: false, msg: `That was ${LIMITS.perIpHour} live demos this hour.`, signup: true });
    list.push(now); g.n++;
    await this.ctx.storage.put(key, list); await this.ctx.storage.put('global', g);
    await this.ctx.storage.setAlarm(now + 86400000); // tidy up old visitor keys
    return Response.json({ ok: true });
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
  try { host = new URL(target).hostname; } catch { return json(400, { error: 'Paste a full Idealista link (https://www.idealista.com/…).' }); }
  if (!cfg.hosts.test(host)) return json(400, { error: 'This demo only accepts Idealista links (Spain, Portugal, Italy, France).' });
  if (!env.TURNSTILE_SECRET || !env.DEMO_APIFY_TOKEN) return json(503, { error: 'The live demo is not switched on yet.' });

  const ip = request.headers.get('CF-Connecting-IP') || '';
  // DEMO_TURNSTILE_OPTIONAL=1 (testing): a request without a token is allowed; a token that is sent must still be valid.
  const optional = env.DEMO_TURNSTILE_OPTIONAL === '1' && !body.turnstile;
  const ts = new FormData();
  ts.append('secret', env.TURNSTILE_SECRET); ts.append('response', String(body.turnstile || '')); ts.append('remoteip', ip);
  const verdict = optional ? { success: true } : await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: ts }).then((r) => r.json()).catch(() => ({ success: false }));
  if (!verdict.success) return json(403, { error: 'The human check did not pass. Reload the page and try again.' });

  const cacheKey = new Request(`https://flowextractapi.com/__demo-cache/v2/${body.actor}/${await sha(target.split('#')[0])}`);
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) { const c = await hit.json(); record(env, 'demo_run', body.actor, 'cached', request); return json(200, { ...c, cached: true }); }

  const visitor = await sha(ip + '|' + (env.DEMO_IP_SALT || 'flowextract'));
  const ok = await guard(env, { ip: visitor, op: 'take' });
  if (!ok.ok) return json(429, { error: ok.msg, signup: !!ok.signup });

  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LIMITS.timeoutMs);
  let rows = [], total = null, error = null;
  try {
    const r = await fetch(cfg.upstream, { method: 'POST', signal: ctrl.signal, headers: { Authorization: `Bearer ${env.DEMO_APIFY_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url: target }) });
    const text = await r.text();
    if (!r.ok || !/"type":"batch"/.test(text)) console.log(`demo upstream ${r.status}: ${text.slice(0, 300)}`);
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      let ev; try { ev = JSON.parse(line); } catch { continue; }
      if (ev.type === 'batch' && Array.isArray(ev.data)) rows.push(...ev.data);
      else if (ev.type === 'property' && ev.data && !ev.data.status) rows.push(ev.data);
      else if ((ev.type === 'failed' || ev.type === 'error') && !error) error = 'Idealista did not return results for this link.';
      if (ev.type === 'progress' && ev.total) total = ev.total;
    }
  } catch (e) {
    error = e.name === 'AbortError' ? 'The demo took too long (50 s limit). Try a smaller search.' : 'The demo backend is not reachable right now.';
  } finally { clearTimeout(timer); }
  const trimmed = rows.slice(0, LIMITS.maxRows).map((p) => Object.fromEntries(Object.entries(cfg.fields).filter(([k]) => p[k] !== undefined && p[k] !== null).map(([k, v]) => [v, p[k]])));
  if (!trimmed.length) {
    ctx.waitUntil(guard(env, { ip: visitor, op: 'refund' })); // our failure: the visitor keeps the try
    return json(502, { error: error || 'No results for this link.' });
  }
  const out = { actor: body.actor, url: target, rows: trimmed, count: trimmed.length, total, ms: Date.now() - t0, store: cfg.store, display: cfg.display };
  ctx.waitUntil(cache.put(cacheKey, new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${LIMITS.cacheSecs}` } })));
  record(env, 'demo_run', body.actor, 'live', request);
  return json(200, { ...out, cached: false });
}
