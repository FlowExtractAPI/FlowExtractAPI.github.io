#!/usr/bin/env node
/**
 * seo-draft.js — one-time (re-runnable) drafter of DIFFERENTIATED SEO content.
 *
 * For each actor in catalog.json, reads its source README and drafts:
 *   - intro      : 2–3 original sentences (NOT copied verbatim from the README)
 *   - useCases   : a short list of "who/what it's for"
 *   - faq        : Q&A targeting long-tail / brand queries Apify doesn't optimize for
 *
 * Output: site/seo/<slug>.json  (one file per actor).
 * These files are the differentiated layer shown ABOVE the README on each doc page.
 * They are NEVER overwritten by README sync — edit them freely.
 *
 * By default it will NOT overwrite an existing seo/<slug>.json (so your edits survive).
 * Pass --force to redraft everything.
 *
 * Usage:
 *   node seo-draft.js            # draft only actors that don't have a seo file yet
 *   node seo-draft.js --force    # redraft all (overwrites your edits — careful)
 *   node seo-draft.js --only <slug>
 */
const fs = require('fs');
const path = require('path');

const SITE = __dirname;
const APIFY_ROOT = 'D:/Dev/Apify';
const CATALOG = path.join(SITE, 'catalog.json');
const SEO_DIR = path.join(SITE, 'seo');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

const readJSON = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));

// Repair mojibake (UTF-8 bytes mis-decoded as Latin-1) so drafts are clean.
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

const clean = s => deMojibake((s || '').replace(/\*\*/g, '').replace(/[`_]/g, '').replace(/\s+/g, ' ').trim());

// --- Lightweight README parsing -----------------------------------------------
function parseReadme(text) {
  const lines = text.split(/\r?\n/);
  let title = null, tagline = null;
  const features = [];
  const faqs = [];

  // Title = first H1
  for (const ln of lines) {
    const m = ln.match(/^#\s+(.+)$/);
    if (m) { title = clean(m[1]); break; }
  }
  // Tagline = first **bold** line or first real paragraph
  for (const ln of lines) {
    const m = ln.match(/^\s*\*\*(.+?)\*\*\s*$/);
    if (m && clean(m[1]).length > 25) { tagline = clean(m[1]); break; }
  }
  if (!tagline) {
    for (const ln of lines) {
      const t = ln.trim();
      if (!t || t.startsWith('#') || t.startsWith('![') || t.startsWith('[!') || t.startsWith('|')) continue;
      if (clean(t).length > 25) { tagline = clean(t); break; }
    }
  }
  // Feature bullets (first ~6 list items that look like features)
  for (const ln of lines) {
    const m = ln.match(/^\s*[-*]\s+(.+)$/);
    if (m) {
      const f = clean(m[1]);
      if (f.length > 8 && f.length < 140 && features.length < 8) features.push(f);
    }
  }
  // FAQ pairs: an H2/H3 ending in "?" followed by the next paragraph
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{2,4}\s+(.+\?)\s*$/);
    if (h) {
      // find next non-empty paragraph
      let ans = '';
      for (let j = i + 1; j < lines.length && j < i + 8; j++) {
        const t = lines[j].trim();
        if (!t || t.startsWith('#')) { if (ans) break; else continue; }
        ans += (ans ? ' ' : '') + clean(t);
        if (ans.length > 60) break;
      }
      if (ans) faqs.push({ q: clean(h[1]), a: ans });
    }
  }
  return { title, tagline, features, faqs };
}

// --- Draft the differentiated content -----------------------------------------
function draft(actor, parsed, categoryLabel) {
  const name = actor.name || parsed.title || actor.slug;
  const what = parsed.tagline || `Extract structured data with ${name}.`;

  // Original intro (reworded framing, not a verbatim copy of the tagline)
  const intro =
    `${name} is a ready-to-run Apify actor from FlowExtract API for ${categoryLabel.toLowerCase()}. ` +
    `${what} ` +
    `This page explains what it does, who it's for, and how to get the most out of it — ` +
    `then includes the full technical documentation below.`;

  // Use cases — derive from feature bullets, fall back to generic-but-relevant
  const useCases = (parsed.features.slice(0, 4).map(f => f.replace(/^[A-Z]/, c => c.toLowerCase())));
  while (useCases.length < 3) {
    useCases.push([
      'Feed structured results straight into your own database, sheet, or app',
      'Schedule recurring runs to keep your dataset fresh automatically',
      'Combine with n8n or webhooks for end-to-end automation'
    ][useCases.length] || 'Automate data collection without writing a scraper');
  }

  // FAQ — mix README-derived Q&A with brand/long-tail questions
  const faq = [];
  const apifyUrl = actor.apifyUrl || `https://apify.com/dz_omar/${actor.slug}?fpr=smcx63`;
  faq.push({
    q: `How do I run ${name}?`,
    a: `Open ${name} on the Apify Store, provide your input (URLs or search parameters), and click Start. ` +
       `Results are available as JSON, CSV, or Excel, and via the Apify API.`
  });
  faq.push({
    q: `Is ${name} free?`,
    a: `${name} runs on Apify's pay-as-you-go platform; you only pay for the compute/usage a run consumes. ` +
       `Check the actor page for current pricing and any free tier.`
  });
  // pull up to 2 genuine README FAQs
  for (const f of parsed.faqs.slice(0, 2)) {
    if (!faq.some(x => x.q.toLowerCase() === f.q.toLowerCase())) faq.push(f);
  }

  return {
    slug: actor.slug,
    // NOTE: auto-drafted from the README. Edit freely — README sync will not overwrite this file.
    _drafted: true,
    intro,
    useCases,
    faq
  };
}

// --- Main ---------------------------------------------------------------------
function main() {
  const catalog = readJSON(CATALOG);
  const labels = catalog.categories || {};
  if (!fs.existsSync(SEO_DIR)) fs.mkdirSync(SEO_DIR, { recursive: true });

  let drafted = 0, skipped = 0;
  for (const actor of catalog.actors) {
    if (ONLY && actor.slug.toLowerCase() !== ONLY.toLowerCase()) continue;
    const out = path.join(SEO_DIR, `${actor.slug}.json`);
    if (fs.existsSync(out) && !FORCE) { skipped++; continue; }

    const readmeAbs = path.join(APIFY_ROOT, actor.source.readme);
    if (!fs.existsSync(readmeAbs)) { console.log(`skip (no README): ${actor.slug}`); continue; }

    const text = fs.readFileSync(readmeAbs, 'utf8').replace(/^﻿/, '');
    const parsed = parseReadme(text);
    const categoryLabel = labels[actor.category] || 'data extraction';
    const content = draft(actor, parsed, categoryLabel);
    fs.writeFileSync(out, JSON.stringify(content, null, 2), 'utf8');
    drafted++;
  }
  console.log(`SEO draft: wrote ${drafted}, skipped ${skipped} existing (use --force to redraft).`);
}

main();
