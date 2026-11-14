// Build-time data access. Everything a page shows comes from content/ (editable copy + keywords),
// data/actors.json (public Store facts + schema field lists), data/stats.json (aggregates) and
// data/samples/<slug>/ (fresh tester runs). Nothing keyword-related is hardcoded in templates.
import siteJson from '../../content/site.json';
import actorsData from '../../data/actors.json';
import statsJson from '../../data/stats.json';

const load = (mods) => Object.values(mods).map((m) => m.default ?? m);
const actorContent = load(import.meta.glob('../../content/actors/*.json', { eager: true }));
const hubContent = load(import.meta.glob('../../content/hubs/*.json', { eager: true }));
const pageContent = load(import.meta.glob('../../content/pages/*.json', { eager: true }));
const sampleMods = import.meta.glob('../../data/samples/*/sample.json', { eager: true });
const runMods = import.meta.glob('../../data/samples/*/run.json', { eager: true });

export const site = siteJson;
export const stats = statsJson;
export const BASE = site.brand.url;
export const pricesFetchedAt = actorsData.fetchedAt.slice(0, 10);

const factsBySlug = new Map(actorsData.actors.map((a) => [a.slug, a]));
const sampleFor = (pageSlug) => {
  const s = Object.entries(sampleMods).find(([p]) => p.includes(`/samples/${pageSlug}/`));
  const r = Object.entries(runMods).find(([p]) => p.includes(`/samples/${pageSlug}/`));
  return s && r ? { rows: s[1].default ?? s[1], run: r[1].default ?? r[1] } : null;
};

export const actors = actorContent
  .map((c) => {
    const facts = factsBySlug.get(c.slug);
    const pageSlug = c.slug.toLowerCase();
    return { ...c, pageSlug, url: `/docs/${pageSlug}.html`, goUrl: `/go/${pageSlug}`, facts, sample: sampleFor(pageSlug) };
  })
  .filter((a) => a.facts)
  .sort((a, b) => a.label.localeCompare(b.label));

export const categoryIds = Object.keys(site.categories);
export const hubs = hubContent.map((h) => ({ ...h, url: h.kind === 'source' ? `/source/${h.id}.html` : `/category/${h.id}.html` }));
export const categoryHub = (id) => hubs.find((h) => h.kind === 'category' && h.id === id);
export const sourceHub = (id) => hubs.find((h) => h.kind === 'source' && h.id === id);
export const page = (id) => pageContent.find((p) => p.id === id);
export const actorsIn = (cat) => actors.filter((a) => a.category === cat);
export const actorsFromSource = (hubId) => actors.filter((a) => a.sourceHub === hubId);
// one-line card text: the meta description up to its colon (if the lead is long enough), cut at a word
export function blurb(a) {
  const m = a.metaDescription;
  const i = m.indexOf(': ');
  let t = i >= 35 ? m.slice(0, i) : m;
  if (t.length > 120) t = t.slice(0, 117).replace(/[\s,;:]+\S*$/, '') + '…';
  return t;
}
// Home demo: actors with a real sample and a "demo" block in their content file
export const demoPool = () => actors.filter((a) => a.demo && a.sample);
export const mostUsed = (n) => [...actors].sort((a, b) => b.facts.usersRank - a.facts.usersRank).slice(0, n);

// ---------- pricing (real Store pricing, never invented) ----------
const money = (n) => {
  if (n == null) return '';
  if (n >= 1) return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(2);
  return '$' + n.toFixed(4).replace(/0+$/, '');
};
export function priceRows(a) {
  const p = a.facts.pricing;
  if (p.model !== 'PAY_PER_EVENT') return [];
  return p.events.map((e) => ({
    title: e.title,
    unit: e.oneTime ? 'per run' : 'per 1,000',
    free: e.priceFreePlanUsd == null ? '' : money(e.oneTime ? e.priceFreePlanUsd : e.priceFreePlanUsd * 1000),
    lowest: e.priceLowestUsd == null ? '' : money(e.oneTime ? e.priceLowestUsd : e.priceLowestUsd * 1000),
    description: e.description,
    primary: e.primary,
    oneTime: e.oneTime,
  }));
}
export function priceSummary(a) {
  const p = a.facts.pricing;
  if (p.model === 'FREE') return 'No per-result charge: you pay only the Apify platform usage of your runs.';
  if (p.model !== 'PAY_PER_EVENT') return 'See current pricing on the Apify Store.';
  const evs = p.events.filter((e) => !e.oneTime);
  const main = evs.find((e) => e.primary) || evs[0];
  if (!main) return 'Pay per event; see the price table.';
  const free = money(main.priceFreePlanUsd * 1000);
  const low = money(main.priceLowestUsd * 1000);
  const tail = main.priceLowestUsd < main.priceFreePlanUsd ? `, down to ${low} on higher Apify plans` : '';
  return `${free} per 1,000 × "${main.title}" on the Apify free plan${tail}.`;
}
export function priceShort(a) {
  const p = a.facts.pricing;
  if (p.model === 'FREE') return 'No per-result fee';
  if (p.model !== 'PAY_PER_EVENT') return '';
  const evs = p.events.filter((e) => !e.oneTime);
  const main = evs.find((e) => e.primary) || evs[0];
  return main ? `from ${money(main.priceLowestUsd * 1000)} / 1K` : 'Pay per event';
}

// ---------- fields ----------
// Most useful first: fields the actor's own dataset views label, then the rest; diagnostics and run bookkeeping last.
const DIAG = /^(error|etsy_error|hint|warning|status_?message|shops?_(requested|delivered)|listings?_delivered|scraped_|source_url|source_ref|include[A-Z]|catalog_position|run_|charged|_)/i;
export const outputFields = (a) => {
  const all = a.facts.output.filter((f) => !f.name.startsWith('_') && !['includeReviews', 'error', 'etsy_error'].includes(f.name));
  return [
    ...all.filter((f) => f.label && !DIAG.test(f.name)),
    ...all.filter((f) => !f.label && !DIAG.test(f.name)),
    ...all.filter((f) => DIAG.test(f.name)),
  ];
};
export const inputFields = (a) => a.facts.input;
const human = (s) => s.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
const stripEmoji = (s) => s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
export const inputTitle = (f) => stripEmoji(f.title || '') || human(f.name);

// ---------- questions: the content file's own first, then facts-based answers ----------
export function faqFor(a) {
  const out = [...(a.faq || [])];
  out.push({ q: `How much does ${a.label} cost?`, a: priceSummary(a) + ' Apify gives every account a monthly free credit, so small tests usually cost nothing.' });
  const req = inputFields(a).filter((f) => f.required);
  const firstInputs = (req.length ? req : inputFields(a).slice(0, 2)).map((f) => inputTitle(f).toLowerCase());
  if (firstInputs.length) out.push({ q: 'What do I need to give it?', a: `${req.length ? 'Required' : 'Start with'}: ${firstInputs.join(', ')}. Every other setting has a default, so you can run it with just ${req.length === 1 || firstInputs.length === 1 ? 'that' : 'those'}.` });
  const of = outputFields(a);
  if (of.length) out.push({ q: 'What data does it return?', a: `Up to ${of.length} fields per record, including ${of.slice(0, 6).map((f) => f.label || human(f.name)).join(', ')}. The full list is in the field table on this page.` });
  out.push({ q: 'How do I get the results into a spreadsheet or my app?', a: 'Each run saves its results in an Apify dataset. Download it as JSON, CSV, Excel, XML or HTML, call the Apify API from your code, or connect it to Make, Zapier, n8n or Google Sheets.' });
  return out;
}

export function related(a, n = 5) {
  const same = (x) => x.slug !== a.slug;
  const fromSource = a.sourceHub ? actors.filter((x) => same(x) && x.sourceHub === a.sourceHub) : [];
  const fromCat = actors.filter((x) => same(x) && x.category === a.category && !fromSource.includes(x));
  return [...fromSource, ...fromCat].slice(0, n);
}

export const breadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: BASE + it.url })),
});
export const faqJsonLd = (faq) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export function softwareJsonLd(a) {
  const p = a.facts.pricing;
  const evs = p.events.filter((e) => !e.oneTime);
  const main = evs.find((e) => e.primary) || evs[0];
  const offers = p.model === 'FREE'
    ? { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'No per-result charge; Apify platform usage applies.' }
    : main ? { '@type': 'Offer', price: (main.priceFreePlanUsd * 1000).toFixed(2), priceCurrency: 'USD', description: `Per 1,000 ${main.title} events on the Apify free plan.` } : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: a.h1,
    description: a.metaDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web (Apify platform)',
    url: BASE + a.url,
    ...(offers ? { offers } : {}),
    publisher: { '@type': 'Organization', name: site.brand.name, url: BASE },
  };
}

// sample rows -> CSV (RFC 4180)
export function toCsv(rows) {
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v) => { if (v == null) return ''; const s = String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n') + '\r\n';
}
