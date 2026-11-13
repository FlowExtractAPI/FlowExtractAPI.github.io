// refresh-sample.mjs: run one actor (or several) on the FREE TESTER account and refresh its data explorer sample.
//
//   node scripts/refresh-sample.mjs <slug> [<slug> ...]
//
// Input per actor: data/samples/<slug>/input.json  ->  { "input": {...}, "maxItems": 20, "mask": {...} }
//   mask.drop:          field paths removed from every item (photos, avatars, private contact data)
//   mask.pseudonymize:  field paths replaced by "Person 1", "Person 2"... (names of private individuals)
// Output: data/samples/<slug>/sample.json (<= 20 masked items) and run.json (run ID, date, item count, cost).
//
// Rules (START.md 8, 9, 13): tester token only, read from the forge .env and never printed; usage checked before
// and after; one run per actor; max 5 concurrent; stop at the credit limit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = process.env.FORGE_ENV || 'D:/Dev/Apify/Actors/apify-actor-forge/.env';
const TOKEN_NAME = process.env.TESTER_TOKEN_NAME || 'APIFY_TOKEN_TESTER_1';
const OWNER = 'dz_omar';
const MAX_CONCURRENT = 5;

function token() {
  const line = fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/).find((l) => l.startsWith(TOKEN_NAME + '='));
  if (!line) throw new Error(`${TOKEN_NAME} not found in the forge .env`);
  return line.slice(TOKEN_NAME.length + 1).trim().replace(/^['"]|['"]$/g, '');
}
const TOKEN = token();
async function api(method, p, body) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch('https://api.apify.com/v2' + p, {
        method,
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(120000),
      });
      const text = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status} on ${method} ${p.split('?')[0]}: ${text.slice(0, 200)}`);
      return text ? JSON.parse(text) : null;
    } catch (e) {
      if (attempt >= 4 || /HTTP 4\d\d/.test(e.message)) throw e;
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
}
async function usage(label) {
  const { data } = await api('GET', '/users/me/limits');
  const used = data.current && data.current.monthlyUsageUsd;
  const max = data.limits && data.limits.maxMonthlyUsageUsd;
  console.log(`[usage ${label}] ${TOKEN_NAME}: $${(used ?? 0).toFixed(3)} of $${max ?? '?'} this cycle`);
  return { used: used ?? 0, max: max ?? Infinity };
}
const getPath = (o, p) => p.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
function setPath(o, p, val) {
  const ks = p.split('.');
  let cur = o;
  for (let i = 0; i < ks.length - 1; i++) { if (cur[ks[i]] == null || typeof cur[ks[i]] !== 'object') return; cur = cur[ks[i]]; }
  if (val === undefined) delete cur[ks[ks.length - 1]]; else if (ks[ks.length - 1] in cur) cur[ks[ks.length - 1]] = val;
}
function mask(items, cfg = {}) {
  const names = new Map();
  return items.map((it) => {
    const x = structuredClone(it);
    const walk = (obj, fn) => { if (Array.isArray(obj)) obj.forEach((e) => walk(e, fn)); else if (obj && typeof obj === 'object') fn(obj); };
    for (const p of cfg.drop || []) {
      // "reviews[].reviewer.avatar" style: [] walks arrays
      const parts = p.split('[].');
      const apply = (obj, i) => {
        if (i === parts.length - 1) return walk(obj, (o) => setPath(o, parts[i], undefined));
        walk(obj, (o) => apply(getPath(o, parts[i]), i + 1));
      };
      apply(x, 0);
    }
    for (const p of cfg.pseudonymize || []) {
      const parts = p.split('[].');
      const apply = (obj, i) => {
        if (i === parts.length - 1) return walk(obj, (o) => {
          const v = getPath(o, parts[i]);
          if (v == null || v === '') return;
          if (!names.has(v)) names.set(v, `Person ${names.size + 1}`);
          setPath(o, parts[i], names.get(v));
        });
        walk(obj, (o) => apply(getPath(o, parts[i]), i + 1));
      };
      apply(x, 0);
    }
    return x;
  });
}
// Allow-list projection (preferred over mask): only the named fields reach the sample.
//   cfg.typeField: field that names the record type (default "_type"); cfg.project: { <type>: { column: spec } }
//   spec = "path.to.field" | { "path": "...", "as": "date" | "pseudonym" }
function project(items, cfg) {
  const typeField = cfg.typeField || '_type';
  const people = new Map();
  const out = [];
  for (const it of items) {
    const type = cfg.project[it[typeField]] ? it[typeField] : (cfg.project['*'] ? '*' : null);
    if (!type) continue;
    const row = { record_type: it[typeField] ?? null };
    for (const [col, spec] of Object.entries(cfg.project[type])) {
      const s = typeof spec === 'string' ? { path: spec } : spec;
      let v = getPath(it, s.path);
      if (v != null && s.as === 'date') v = new Date((typeof v === 'number' && v < 1e12 ? v * 1000 : v)).toISOString().slice(0, 10);
      if (s.as === 'present') v = v != null && v !== '';
      if (v != null && v !== '' && s.as === 'pseudonym') { if (!people.has(v)) people.set(v, `${s.label || 'Person'} ${people.size + 1}`); v = people.get(v); }
      if (v != null && typeof v === 'object') v = JSON.stringify(v);
      row[col] = v ?? null;
    }
    out.push(row);
  }
  return out;
}
async function refresh(arg) {
  // "<slug>@<runId>" collects an existing run instead of starting a new one (e.g. after a network drop)
  const [slug, existingRunId] = arg.split('@');
  const dir = path.join(ROOT, 'data/samples', slug.toLowerCase());
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'input.json'), 'utf8'));
  const actor = (JSON.parse(fs.readFileSync(path.join(ROOT, 'data/actors.json'), 'utf8')).actors.find((a) => a.slug.toLowerCase() === slug.toLowerCase()) || {}).slug || slug;
  const maxItems = Math.min(cfg.maxItems || 20, 20);
  const q = new URLSearchParams({ memory: String(cfg.memoryMbytes || 1024), timeout: String(cfg.timeoutSecs || 600) });
  if (cfg.maxTotalChargeUsd) q.set('maxTotalChargeUsd', String(cfg.maxTotalChargeUsd));
  const { data: run } = existingRunId
    ? await api('GET', `/actor-runs/${existingRunId}`)
    : await api('POST', `/acts/${OWNER}~${actor}/runs?${q}`, cfg.input);
  console.log(`[${slug}] ${existingRunId ? 'collecting' : 'started'} run ${run.id}`);
  let r = run;
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(r.status)) {
    ({ data: r } = await api('GET', `/actor-runs/${run.id}?waitForFinish=60`));
  }
  const { data: ds } = await api('GET', `/datasets/${r.defaultDatasetId}`);
  const items = await api('GET', `/datasets/${r.defaultDatasetId}/items?clean=true&limit=${maxItems}`);
  if (process.env.RAW_DIR) fs.writeFileSync(path.join(process.env.RAW_DIR, `${slug.toLowerCase()}-raw.json`), JSON.stringify(items, null, 2)); // local review only, never in the repo
  const sample = cfg.project ? project(items, cfg) : mask(items, cfg.mask);
  const runInfo = {
    actor: `${OWNER}/${actor}`,
    runId: r.id,
    status: r.status,
    date: (r.finishedAt || r.startedAt || '').slice(0, 10),
    finishedAt: r.finishedAt,
    itemCount: ds.itemCount,
    sampleCount: sample.length,
    costUsd: r.usageTotalUsd ?? null,
    buildNumber: r.buildNumber || null,
    account: TOKEN_NAME,
  };
  if (r.status === 'SUCCEEDED' && sample.length) {
    fs.writeFileSync(path.join(dir, 'sample.json'), JSON.stringify(sample, null, 2) + '\n');
    fs.writeFileSync(path.join(dir, 'run.json'), JSON.stringify(runInfo, null, 2) + '\n');
  }
  console.log(`[${slug}] ${r.status} · items ${ds.itemCount} · sample ${sample.length} · cost $${runInfo.costUsd ?? '?'}`);
  return runInfo;
}

const slugs = process.argv.slice(2);
if (!slugs.length) { console.error('usage: node scripts/refresh-sample.mjs <slug> [...]'); process.exit(2); }
const before = await usage('before');
if (before.used >= before.max) { console.error('credit limit reached; stopping'); process.exit(1); }
const results = [];
for (let i = 0; i < slugs.length; i += MAX_CONCURRENT) {
  results.push(...await Promise.all(slugs.slice(i, i + MAX_CONCURRENT).map((s) => refresh(s).catch((e) => ({ slug: s, error: e.message })))));
  const u = await usage('after batch');
  if (u.used >= u.max) { console.error('credit limit reached; stopping'); break; }
}
for (const r of results) if (r.error) console.log(`[${r.slug}] ERROR ${r.error}`);
