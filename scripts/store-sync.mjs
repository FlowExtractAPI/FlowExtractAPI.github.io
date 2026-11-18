// store-sync.mjs: STEP 0 of every task on the site. What changed on the Apify Store since the last sync, and which
// pages no longer match it. Public Store API only (no token).
//
//   node scripts/store-sync.mjs          report only
//   node scripts/store-sync.mjs --save   report, then remember this state (data/store-state.json) as "last sync"
//
// Reports:
//   NEW      public actor with no page (content/actors/<slug>.json missing)  -> add a page (see REBUILD/ACTORS.md)
//   GONE     page whose actor is no longer public                            -> ask the operator (redirect or keep)
//   CHANGED  Store title / SEO title / description / SEO description / README / categories / pricing since last sync
//   NAME     the Store title changed since last sync AND the page label/h1 differs from the new Store name (title before
//            its emoji / hook part). Page names that differ on purpose (chosen for a search keyword) are not reported
//            until the operator renames the actor again.
// After acting on a report: node scripts/pull-data.mjs && node scripts/gen-redirects.mjs, edit content, deploy,
// then run this again with --save.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATE = path.join(ROOT, 'data/store-state.json');
const OWNER = 'dz_omar';
const save = process.argv.includes('--save');

const get = async (url) => {
  for (let i = 1; i <= 4; i++) {
    try { const r = await fetch(url, { signal: AbortSignal.timeout(60000) }); if (r.ok) return (await r.json()).data; throw new Error('HTTP ' + r.status); }
    catch (e) { if (i === 4) throw e; await new Promise((ok) => setTimeout(ok, 1500 * i)); }
  }
};
// "Idealista Scraper API 🏠 Any Search URL, No Result Cap & France" -> "Idealista Scraper API"
const baseName = (t) => String(t || '').split(/\s[\p{Extended_Pictographic}☀-➿]|\s[|–—:]\s/u)[0].trim();

const list = (await get(`https://api.apify.com/v2/store?username=${OWNER}&limit=200`)).items;
const now = {};
for (let i = 0; i < list.length; i += 8) {
  await Promise.all(list.slice(i, i + 8).map(async (s) => {
    const a = await get(`https://api.apify.com/v2/acts/${OWNER}~${s.name}`);
    const price = (a.pricingInfos || []).slice(-1)[0] || null;
    now[a.name.toLowerCase()] = {
      name: a.name, title: a.title || '', seoTitle: a.seoTitle || '', description: a.description || '',
      seoDescription: a.seoDescription || '', readme: a.readmeSummary || '', categories: (a.categories || []).join(','),
      pricing: price ? JSON.stringify(price.pricingPerEvent || price.pricePerUnitUsd || price.pricingModel) : '', modifiedAt: a.modifiedAt,
    };
  }));
}
const before = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')).actors : null;
const pages = Object.fromEntries(fs.readdirSync(path.join(ROOT, 'content/actors')).filter((f) => f.endsWith('.json'))
  .map((f) => { const c = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/actors', f), 'utf8')); return [c.slug.toLowerCase(), c]; }));

const out = [];
for (const [slug, a] of Object.entries(now)) {
  if (!pages[slug]) out.push(`NEW      ${slug} · "${a.title}"`);
  const b = before && before[slug];
  if (b) {
    for (const k of ['title', 'seoTitle', 'description', 'seoDescription', 'readme', 'categories', 'pricing']) {
      if ((b[k] || '') !== (a[k] || '')) out.push(`CHANGED  ${slug} · ${k}` + (k === 'readme' || k === 'pricing' ? '' : `\n           was: ${String(b[k]).slice(0, 160)}\n           now: ${String(a[k]).slice(0, 160)}`));
    }
  }
  const p = pages[slug];
  if (p && b && b.title !== a.title) {
    const want = baseName(a.title);
    for (const k of ['label', 'h1']) if (p[k] !== want && !p[`${k}Override`]) out.push(`NAME     ${slug} · ${k} "${p[k]}" ≠ Store "${want}"`);
  }
}
for (const slug of Object.keys(pages)) if (!now[slug]) out.push(`GONE     ${slug} · page exists, actor not public on the Store`);

console.log(`Store: ${Object.keys(now).length} public actors · pages: ${Object.keys(pages).length} · last sync: ${before ? JSON.parse(fs.readFileSync(STATE, 'utf8')).syncedAt : 'never'}`);
console.log(out.length ? out.sort().join('\n') : 'Nothing changed: every page matches the Store.');
if (save) { fs.writeFileSync(STATE, JSON.stringify({ syncedAt: new Date().toISOString(), actors: now }, null, 2) + '\n'); console.log('saved data/store-state.json'); }
