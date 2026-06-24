#!/usr/bin/env node
/**
 * sync.js — FlowExtract API documentation synchronizer
 *
 * Keeps the website docs in step with the actor source READMEs under D:\Dev\Apify,
 * WITHOUT re-reading every actor on every run. Change detection is a cheap SHA-256
 * hash of each source README compared against .sync-manifest.json.
 *
 * What it does (per run):
 *   1. Read catalog.json (the source of truth: slug -> source README + category).
 *   2. For each actor, hash its source README and compare to the manifest.
 *   3. For CHANGED / NEW actors only:
 *        - copy source README -> docs/actors/<slug>.md   (the rendered mirror)
 *        - ensure docs/<slug>.html shell exists (from docs/_template.html)
 *        - update the manifest hash
 *   4. Rebuild actors.json (card data) from catalog.json every run (cheap, deterministic).
 *   5. Print a summary of exactly what changed.
 *
 * Usage:
 *   node sync.js                 # detect + regenerate changed, write files
 *   node sync.js --check         # detect only, write nothing (dry run)
 *   node sync.js --only <slug>   # force-process a single actor (e.g. after adding one)
 *   node sync.js --all           # ignore manifest, regenerate everything
 *
 * Commit + push is intentionally NOT done here (git is driven by the assistant/you
 * after reviewing the summary). See README for the full workflow.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { marked } = require('marked');

marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

// --- Paths ---------------------------------------------------------------
const SITE_DIR     = __dirname;
const APIFY_ROOT   = 'D:/Dev/Apify';                       // source of actor code
const BASE_URL     = 'https://flowextractapi.com';         // for canonical / OG / sitemap
const CATALOG      = path.join(SITE_DIR, 'catalog.json');
const MANIFEST     = path.join(SITE_DIR, '.sync-manifest.json');
const ACTORS_JSON  = path.join(SITE_DIR, 'actors.json');
const STATS_JSON   = path.join(SITE_DIR, 'stats.json');    // PUBLIC aggregate stats only
const SEO_DIR      = path.join(SITE_DIR, 'seo');           // differentiated content per actor
const DOCS_DIR     = path.join(SITE_DIR, 'docs');
const ACTORS_MD    = path.join(DOCS_DIR, 'actors');
const TEMPLATE     = path.join(DOCS_DIR, '_template.html');
const SITEMAP      = path.join(SITE_DIR, 'sitemap.xml');
const ROBOTS       = path.join(SITE_DIR, 'robots.txt');

// PRIVATE Apify snapshot — lives ONE LEVEL UP, outside site/, never deployed.
// We read it at build time, extract only public fields, and write public stats.json.
const PRIVATE_SNAPSHOT = path.join(SITE_DIR, '..', 'FlowExtract_API_Actors.json');

// --- Args ----------------------------------------------------------------
const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const FORCE_ALL  = args.includes('--all');
const onlyIdx    = args.indexOf('--only');
const ONLY_SLUG  = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

// --- Helpers -------------------------------------------------------------
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
const log = (...a) => console.log(...a);

function loadManifest() {
  if (!fs.existsSync(MANIFEST)) return { generatedAt: null, actors: {} };
  try { return readJSON(MANIFEST); } catch { return { generatedAt: null, actors: {} }; }
}

// Honest round-DOWN with suffix: 736,709 -> "700K+", 7,150 -> "7,000+". Never inflates.
function roundDown(n) {
  n = Number(n) || 0;
  if (n < 1000) return String(n);
  if (n < 1e6) {
    if (n >= 1e5) return `${Math.floor(n / 1e5) * 100}K+`;
    return `${(Math.floor(n / 1000) * 1000).toLocaleString('en-US')}+`;
  }
  return `${(Math.floor(n / 1e5) / 10).toFixed(1)}M+`;
}

// Read the PRIVATE snapshot (from outside site/) and return ONLY public aggregates +
// a public image map. No per-actor private stats ever leave this function.
function readSnapshot() {
  if (!fs.existsSync(PRIVATE_SNAPSHOT)) return null;
  let snap;
  try { snap = readJSON(PRIVATE_SNAPSHOT); } catch { return null; }
  const all = Array.isArray(snap.actors) ? snap.actors : [];
  const pub = all.filter(a => a.is_public === true);
  const sum = (key) => all.reduce((t, a) => t + (Number(a.stats && a.stats[key]) || 0), 0);

  // Public image/title/description lookup by slug (the only per-actor fields the site shows)
  const bySlug = {};
  for (const a of all) {
    if (a.name) bySlug[a.name.toLowerCase()] = {
      title: a.title || null, description: a.description || null,
      picture_url: a.picture_url || null, is_public: a.is_public === true
    };
  }

  return {
    stats: {
      actors:     pub.length,
      runs:       sum('totalRuns'),
      users:      sum('totalUsers')
    },
    bySlug
  };
}

// Repair double/single mojibake: text whose UTF-8 bytes were wrongly decoded as Latin-1
// (the Ã.../Â... soup). Reverses it; returns original if it doesn't cleanly improve.
function deMojibake(s) {
  if (!s || !/[ÃÂÅ]/.test(s)) return s;
  let cur = s;
  for (let i = 0; i < 2; i++) {
    try {
      const fixed = Buffer.from(cur, 'latin1').toString('utf8');
      if (!fixed.includes('�') && fixed !== cur) cur = fixed; else break;
    } catch { break; }
  }
  return cur;
}

// Pull a clean one-line description from a README's first bold line or first real paragraph.
function descriptionFromReadme(readmeAbs) {
  if (!fs.existsSync(readmeAbs)) return null;
  let text;
  try { text = fs.readFileSync(readmeAbs, 'utf8').replace(/^﻿/, ''); } catch { return null; }
  const lines = text.split(/\r?\n/);
  // Prefer the first **bold** tagline (common in these READMEs)
  for (const ln of lines) {
    const m = ln.match(/^\s*\*\*(.+?)\*\*\s*$/);
    if (m && m[1].trim().length > 20) return m[1].trim();
  }
  // Else first non-empty, non-heading, non-image, non-badge line
  for (const ln of lines) {
    const t = ln.trim();
    if (!t || t.startsWith('#') || t.startsWith('![') || t.startsWith('[!') || t.startsWith('|')) continue;
    const clean = t.replace(/\*\*/g, '').replace(/[_*`]/g, '').trim();
    if (clean.length > 20) return clean;
  }
  return null;
}

// --- SEO / page rendering helpers --------------------------------------------
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Read the differentiated content for an actor (seo/<slug>.json), if present.
function readSeo(slug) {
  const p = path.join(SEO_DIR, `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  try { return readJSON(p); } catch { return null; }
}

// Build the unique (original) content block that sits ABOVE the README.
function uniqueContentHTML(actor, seo, categoryLabel) {
  if (!seo) return '';
  const parts = [];
  parts.push(`<div class="actor-intro">`);
  if (seo.intro) parts.push(`<p class="actor-intro-lead">${esc(seo.intro)}</p>`);
  if (Array.isArray(seo.useCases) && seo.useCases.length) {
    parts.push(`<h2 id="use-cases">Use cases</h2><ul class="actor-usecases">`);
    parts.push(seo.useCases.map(u => `<li>${esc(u)}</li>`).join(''));
    parts.push(`</ul>`);
  }
  if (Array.isArray(seo.faq) && seo.faq.length) {
    parts.push(`<h2 id="faq">Frequently asked questions</h2><div class="actor-faq">`);
    parts.push(seo.faq.map(f =>
      `<details class="faq-item"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join(''));
    parts.push(`</div>`);
  }
  parts.push(`<h2 id="documentation">Documentation</h2>`);
  parts.push(`</div>`);
  return parts.join('\n');
}

// JSON-LD: SoftwareApplication + FAQ. PUBLIC fields only — no private stats/reviews.
function jsonLd(actor, seo, descr, canonical) {
  const graph = [{
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: actor.name,
    description: descr,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: canonical,
    sameAs: actor.apifyUrl,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', category: 'pay-per-use' },
    publisher: { '@type': 'Organization', name: 'FlowExtract API', url: BASE_URL },
    ...(actor.image ? { image: actor.image } : {})
  }];
  if (seo && Array.isArray(seo.faq) && seo.faq.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faq.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }
  return JSON.stringify(graph.length === 1 ? graph[0] : graph);
}

// Render one complete, SEO-ready doc page from the template + README markdown.
function renderDocPage(template, actor, readmeMd, seo, categoryLabel) {
  const canonical = `${BASE_URL}/docs/${actor.docsPath || actor.slug}.html`;
  const name = actor.name || actor.slug;
  const descr = (actor.description || name).replace(/\s+/g, ' ').trim().slice(0, 300);
  const title = `${actor.metaTitle || name} | FlowExtract API`;
  const image = actor.image || `${BASE_URL}/favicon.ico`;
  const heroImg = actor.image
    ? `<img class="actor-hero-img" src="${esc(actor.image)}" alt="${esc(name)}" width="110" height="110">`
    : `<div class="actor-hero-img actor-hero-img--placeholder">${esc((name[0] || '?').toUpperCase())}</div>`;

  const readmeHtml = marked.parse(deMojibake(readmeMd));

  const repl = {
    TITLE: esc(title),
    DESCRIPTION: esc(descr),
    CANONICAL: esc(canonical),
    IMAGE: esc(image),
    JSONLD: jsonLd(actor, seo, descr, canonical),
    NAME: esc(name),
    CATEGORY_LABEL: esc(categoryLabel),
    APIFY_URL: esc(actor.apifyUrl),
    HERO_IMAGE: heroImg,
    UNIQUE_CONTENT: uniqueContentHTML(actor, seo, categoryLabel),
    README_HTML: readmeHtml
  };
  return template.replace(/\{\{(\w+)\}\}/g, (m, key) => (key in repl ? repl[key] : m));
}

// Read an actor's .actor/actor.json (UTF-8 safe) to source clean display fields.
function readActorJson(srcDir) {
  if (!srcDir) return null;
  const base = path.join(APIFY_ROOT, srcDir.replace(/\//g, path.sep));
  for (const p of [path.join(base, '.actor', 'actor.json'), path.join(base, 'actor.json')]) {
    if (fs.existsSync(p)) { try { return readJSON(p); } catch { return null; } }
  }
  return null;
}

// --- Main ----------------------------------------------------------------
function main() {
  if (!fs.existsSync(CATALOG)) { console.error('catalog.json not found.'); process.exit(1); }
  const catalog  = readJSON(CATALOG);
  const manifest = loadManifest();
  const template = fs.existsSync(TEMPLATE) ? fs.readFileSync(TEMPLATE, 'utf8') : null;
  const templateHash = template ? sha256(template).slice(0, 12) : '';
  const snapshot = readSnapshot(); // public aggregates + image map (private data stays out)

  if (!fs.existsSync(ACTORS_MD)) fs.mkdirSync(ACTORS_MD, { recursive: true });

  let actors = catalog.actors;
  if (ONLY_SLUG) {
    actors = actors.filter(a => a.slug.toLowerCase() === ONLY_SLUG.toLowerCase());
    if (actors.length === 0) { console.error(`Slug not in catalog: ${ONLY_SLUG}`); process.exit(1); }
  }

  const changed = [];
  const missing = [];
  const unchanged = [];
  let catalogDirty = false;

  for (const a of actors) {
    // Display name: prefer clean actor.json title; always repair any lingering mojibake.
    const aj = readActorJson(a.source && a.source.dir);
    if (aj && aj.title && aj.title.trim() && aj.title.trim() !== a.name) { a.name = aj.title.trim(); catalogDirty = true; }
    const fixedName = deMojibake(a.name);
    if (fixedName !== a.name) { a.name = fixedName; catalogDirty = true; }

    // Description sources, in order of trust:
    //   1) clean actor.json description
    //   2) README first bold tagline / paragraph (always clean UTF-8)
    //   3) repair whatever is currently in the catalog (last resort)
    let desc = (aj && aj.description && aj.description.trim()) ? aj.description.trim() : null;
    if (!desc || /[ÃÂÅ]/.test(desc)) {
      const fromReadme = a.source && a.source.readme
        ? descriptionFromReadme(path.join(APIFY_ROOT, a.source.readme)) : null;
      if (fromReadme) desc = fromReadme;
    }
    if (!desc) desc = deMojibake(a.description || '');
    desc = deMojibake(desc);
    if (desc && desc !== a.description) { a.description = desc; catalogDirty = true; }

    const url = `https://apify.com/dz_omar/${a.slug}?fpr=smcx63`;
    if (a.apifyUrl !== url) { a.apifyUrl = url; catalogDirty = true; }

    // Fill a missing card image from the snapshot's public picture_url (not private data).
    if (!a.image && snapshot && snapshot.bySlug[a.slug.toLowerCase()]) {
      const pic = snapshot.bySlug[a.slug.toLowerCase()].picture_url;
      if (pic) { a.image = pic; catalogDirty = true; }
    }

    const srcReadme = path.join(APIFY_ROOT, a.source.readme);
    if (!fs.existsSync(srcReadme)) { missing.push(a.slug); continue; }

    const readmeMd = fs.readFileSync(srcReadme, 'utf8');
    const seo = readSeo(a.slug);
    // A page is "changed" if its README, its differentiated SEO content, OR the template changed.
    const hash = sha256(readmeMd + ' ' + JSON.stringify(seo || {}) + ' ' + templateHash);
    const prev = manifest.actors[a.slug];

    const isChanged = FORCE_ALL || ONLY_SLUG || !prev || prev.hash !== hash;
    if (!isChanged) { unchanged.push(a.slug); continue; }

    changed.push(a.slug);
    if (CHECK_ONLY) continue;

    const categoryLabel = (catalog.categories && catalog.categories[a.category]) || 'data extraction';

    // 1) refresh the rendered mirror (kept for reference/debug)
    fs.writeFileSync(path.join(ACTORS_MD, `${a.slug}.md`), readmeMd, 'utf8');

    // 2) render the full SEO-ready, pre-rendered HTML page
    if (template) {
      const out = path.join(DOCS_DIR, `${a.docsPath || a.slug}.html`);
      fs.writeFileSync(out, renderDocPage(template, a, readmeMd, seo, categoryLabel), 'utf8');
    }

    // 3) update manifest
    manifest.actors[a.slug] = { hash, syncedAt: new Date().toISOString(), readme: a.source.readme };
  }

  // 3b) Remove orphan docs whose slug is no longer in the catalog (full runs only).
  const removed = [];
  if (!CHECK_ONLY && !ONLY_SLUG) {
    const valid = new Set(catalog.actors.map(a => (a.docsPath || a.slug)));
    const validMd = new Set(catalog.actors.map(a => a.slug));
    for (const f of fs.readdirSync(ACTORS_MD)) {
      if (f.endsWith('.md') && !validMd.has(f.slice(0, -3))) {
        fs.unlinkSync(path.join(ACTORS_MD, f)); removed.push('actors/' + f);
      }
    }
    for (const f of fs.readdirSync(DOCS_DIR)) {
      if (f.endsWith('.html') && f !== '_template.html' && !valid.has(f.slice(0, -5))) {
        fs.unlinkSync(path.join(DOCS_DIR, f)); removed.push(f);
      }
    }
    for (const slug of Object.keys(manifest.actors)) {
      if (!validMd.has(slug)) delete manifest.actors[slug];
    }
  }

  // 4) Rebuild actors.json (card data) from the catalog — always, it's cheap.
  if (!CHECK_ONLY) {
    const cards = catalog.actors.map(a => ({
      id: a.slug,
      name: a.name,
      image: a.image || '',
      category: a.category,
      subcategory: a.subcategory || null,
      description: a.description || '',
      // Launch-on-Apify URL is always derived from the slug (owner rule), so it can never go stale.
      apifyUrl: a.apifyUrl || `https://apify.com/dz_omar/${a.slug}?fpr=smcx63`,
      docsPath: a.docsPath || a.slug,
      readmeFile: `${a.slug}.md`,
      metaTitle: a.metaTitle || a.name,
      metaDescription: a.metaDescription || a.description || '',
      featured: !!a.featured
    }));
    fs.writeFileSync(ACTORS_JSON, JSON.stringify(cards, null, 2), 'utf8');

    // Write PUBLIC stats.json — aggregate totals only, computed from the private snapshot.
    // This is the only place site stats come from; the private JSON never ships.
    if (snapshot) {
      const s = snapshot.stats;
      const publicStats = {
        generatedAt: new Date().toISOString(),
        actors:     { value: s.actors, display: String(s.actors) },
        runs:       { value: s.runs,   display: roundDown(s.runs) },
        users:      { value: s.users,  display: roundDown(s.users) },
        categories: { value: catalog.categories ? Object.keys(catalog.categories).length : null }
      };
      fs.writeFileSync(STATS_JSON, JSON.stringify(publicStats, null, 2), 'utf8');
    }

    manifest.generatedAt = new Date().toISOString();
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');

    // Persist refreshed display fields back into the catalog (UTF-8, no BOM).
    if (catalogDirty && !ONLY_SLUG) fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2), 'utf8');

    // 4b) sitemap.xml + robots.txt (full runs only, so a single --only doesn't shrink them)
    if (!ONLY_SLUG) {
      const today = new Date().toISOString().slice(0, 10);
      // Standalone landing pages (not actor docs) — add new ones here.
      const EXTRA_PAGES = [
        { loc: `${BASE_URL}/zoom-downloader/`, priority: '0.9' }
      ];
      const urls = [
        { loc: `${BASE_URL}/`, priority: '1.0' },
        ...EXTRA_PAGES,
        ...catalog.actors.map(a => ({
          loc: `${BASE_URL}/docs/${a.docsPath || a.slug}.html`,
          lastmod: (manifest.actors[a.slug] && manifest.actors[a.slug].syncedAt
                     ? manifest.actors[a.slug].syncedAt.slice(0, 10) : today),
          priority: '0.8'
        }))
      ];
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map(u =>
          `  <url><loc>${u.loc}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
          `<priority>${u.priority}</priority></url>`).join('\n') +
        `\n</urlset>\n`;
      fs.writeFileSync(SITEMAP, sitemap, 'utf8');

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
      fs.writeFileSync(ROBOTS, robots, 'utf8');
    }
  }

  // 5) Summary
  log('\nFlowExtract docs sync' + (CHECK_ONLY ? ' (check-only)' : ''));
  log('='.repeat(48));
  log(`Catalog actors scanned : ${actors.length}`);
  log(`Changed / regenerated  : ${changed.length}${changed.length ? '  -> ' + changed.join(', ') : ''}`);
  log(`Unchanged (skipped)    : ${unchanged.length}`);
  if (missing.length) log(`Missing source README  : ${missing.length}  -> ${missing.join(', ')}`);
  if (!CHECK_ONLY && typeof removed !== 'undefined' && removed.length)
    log(`Removed orphan docs    : ${removed.length}  -> ${removed.join(', ')}`);
  if (CHECK_ONLY) {
    log('\nDry run — no files written.');
  } else {
    log('\nWrote: docs/actors/*.md (changed), docs/*.html (changed), actors.json, .sync-manifest.json');
    if (changed.length) log('Next: review, then commit + push (see README).');
    else log('Nothing changed — no commit needed.');
  }
}

main();
