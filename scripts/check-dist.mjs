// check-dist.mjs: the START.md "Checks" list, enforced on the built HTML. Fails the build on any error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.resolve(ROOT, process.argv[2] || (process.env.PUBLIC_DESIGN ? `dist-${process.env.PUBLIC_DESIGN}` : 'dist'));
const BASE = 'https://flowextractapi.com';
const UNTOUCHED = [/^simple-merge\//, /^zoom-downloader\//, /^google[0-9a-f]+\.html$/];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(DIST).map((f) => path.relative(DIST, f).split(path.sep).join('/'));
const errors = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

let pages = 0;
for (const f of files) {
  if (UNTOUCHED.some((re) => re.test(f))) continue;
  const full = path.join(DIST, f);
  const body = fs.readFileSync(full, 'utf8');
  // nothing secret or private anywhere in the output
  if (/apify_api_[A-Za-z0-9]{10,}/.test(body)) err(f, 'contains an Apify token');
  if (/api\.apify\.com/.test(body)) err(f, 'calls api.apify.com (no live calls allowed)');
  if (/FlowExtract_API_Actors|totalUsers30Days|usersRank|D:[\\/]Dev/.test(body)) err(f, 'contains private snapshot fields or local paths');
  if (f.startsWith('data/') && fs.statSync(full).size > 100 * 1024) err(f, 'sample file over 100 KB');
  if (!f.endsWith('.html')) continue;
  pages++;
  const h1 = (body.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(f, `${h1} <h1> elements`);
  const title = decode((body.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  if (!title) err(f, 'no <title>');
  else if (title.length > 60) err(f, `title ${title.length} > 60`);
  const meta = decode((body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  if (!meta) err(f, 'no meta description');
  else if (meta.length > 160) err(f, `meta description ${meta.length} > 160`);
  const noindex = /<meta name="robots" content="noindex"/.test(body);
  if (!noindex) {
    const canon = (body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    const expected = BASE + (f === 'index.html' ? '/' : '/' + f);
    if (canon !== expected) err(f, `canonical ${canon} != ${expected}`);
  }
  for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { err(f, 'invalid JSON-LD'); }
  }
  const internal = new Set([...body.matchAll(/href="(\/[^"#]*|https:\/\/flowextractapi\.com[^"#]*)/g)].map((m) => m[1]));
  if (internal.size < 3) err(f, `only ${internal.size} internal links`);
  for (const m of body.matchAll(/href="(https:\/\/apify\.com\/dz_omar[^"]*)"/g)) if (!decode(m[1]).includes('fpr=smcx63')) err(f, `Store link without fpr: ${m[1]}`);
  if (f !== 'index.html' && f !== '404.html' && !/aria-label="Breadcrumb"/.test(body)) err(f, 'no breadcrumbs');
  if (f.startsWith('docs/')) {
    if (!/class="btn[^"]*" href="\/go\/[a-z0-9-]+" rel="nofollow"/.test(body)) err(f, 'no Store CTA (/go/<slug>)');
    if (/class="explorer"/.test(body)) {
      const slug = f.replace(/^docs\//, '').replace(/\.html$/, '');
      const run = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/samples', slug, 'run.json'), 'utf8'));
      if (!body.includes(`a run on ${run.date}`)) err(f, `explorer date does not match run.json (${run.date})`);
      for (const ext of ['csv', 'json']) if (!fs.existsSync(path.join(DIST, 'data', slug, `sample.${ext}`))) err(f, `missing download sample.${ext}`);
    }
  }
}
for (const must of ['index.html', '404.html', 'sitemap.xml', 'robots.txt', '_redirects', 'google476e7ab5832fa67e.html', 'favicon.ico', 'simple-merge/index.html', 'zoom-downloader/index.html']) {
  if (!files.includes(must)) err(must, 'missing from build output');
}
for (const leak of ['catalog.json', 'config.json', 'services.json', 'package.json', 'sync.js']) if (files.includes(leak)) err(leak, 'must not be deployed');
if (errors.length) {
  console.error(`dist check FAILED (${errors.length}):\n- ` + errors.slice(0, 60).join('\n- '));
  process.exit(1);
}
console.log(`dist check OK: ${pages} HTML pages, ${files.length} files in ${path.basename(DIST)}`);
