// parity.mjs: checks every address in REBUILD/URLS.md against a running site.
//   node scripts/parity.mjs http://127.0.0.1:8787            (local wrangler dev)
//   node scripts/parity.mjs https://flowextractapi-site.<sub>.workers.dev
// Expectations are parsed from URLS.md tables (column "expected"): 200, "200 ≡" (sha256 prefix must match),
// "301 → target", 404. Pattern rows with <slug> are expanded with the slug list in section F.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = (process.argv[2] || 'http://127.0.0.1:8787').replace(/\/$/, '');
const urlsMd = fs.readFileSync(process.env.URLS_MD || path.resolve(ROOT, '../REBUILD/URLS.md'), 'utf8');
const slugs = ((urlsMd.match(/^Slugs: (.+)\.$/m) || [])[1] || '').split(',').map((s) => s.trim()).filter(Boolean);
const checks = [];
for (const line of urlsMd.split('\n')) {
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 4 || !cells[1].startsWith('/')) continue;
  const raw = cells[1];
  const expected = cells[3];
  const hash = (cells[4] || '').match(/^[0-9a-f]{16}$/) ? cells[4] : null;
  const paths = raw.includes(',') ? raw.split(',').map((p) => p.trim()) : [raw];
  for (let p of paths) {
    if (p.startsWith('/seo/<slug>')) p = '/seo/skool-scraper-pro.json';
    const expanded = p.includes('<slug>') ? slugs.map((s) => p.replace('<slug>', s).replace(' (no extension)', '')) : [p];
    for (const u of expanded) {
      let m;
      if ((m = expected.match(/^301 → (\S+)/))) checks.push({ path: u, status: 301, location: m[1].replace('<slug>', u.match(/\/docs\/(?:actors\/)?([^/.]+)/)?.[1] || '') });
      else if (/^200/.test(expected)) checks.push({ path: u, status: 200, hash: expected.includes('≡') ? hash : null });
      else if (/^404/.test(expected)) checks.push({ path: u, status: 404 });
    }
  }
}
checks.push({ path: '/this-page-does-not-exist-12345', status: 404 });

let fail = 0;
const results = [];
async function run(c) {
  let r;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try { r = await fetch(base + c.path, { redirect: 'manual', signal: AbortSignal.timeout(30000) }); break; }
    catch (e) { if (attempt === 3) { results.push(`FAIL ${c.path}: ${e.message}`); fail++; return; } }
  }
  const loc = r.headers.get('location');
  const locPath = loc ? loc.replace(base, '').replace(/^https?:\/\/[^/]+/, '') : null;
  let ok = r.status === c.status;
  let why = `got ${r.status}${loc ? ' → ' + locPath : ''}, want ${c.status}${c.location ? ' → ' + c.location : ''}`;
  if (ok && c.location && locPath !== c.location) ok = false;
  if (ok && c.hash) {
    const buf = Buffer.from(await r.arrayBuffer());
    const h = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
    if (h !== c.hash) { ok = false; why = `sha256 ${h} != ${c.hash}`; }
  }
  if (!ok) { fail++; results.push(`FAIL ${c.path}: ${why}`); }
}
const seen = new Set();
const unique = checks.filter((c) => !seen.has(c.path) && seen.add(c.path));
for (let i = 0; i < unique.length; i += 16) await Promise.all(unique.slice(i, i + 16).map(run));
console.log(results.join('\n'));
console.log(`parity: ${unique.length - fail}/${unique.length} OK against ${base}`);
process.exit(fail ? 1 : 0);
