// pull-data.mjs: refresh the build's public data files. Runs on the operator's machine only.
//
// Reads (never writes): the public Apify Store list, each actor's .actor/ schemas under D:\Dev\Apify
// (folder map in scripts/sources.json), and the PRIVATE snapshot ../../FlowExtract_API_Actors.json.
// Writes: data/actors.json (public per-actor facts) and data/stats.json (aggregate totals only).
// Rule: no per-actor private snapshot data ever reaches data/. Nothing here reads a README.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APIFY_DIR = process.env.APIFY_DIR || 'D:/Dev/Apify';
const SNAPSHOT = path.resolve(ROOT, '..', 'FlowExtract_API_Actors.json');
const OWNER = 'dz_omar';
const FPR = 'smcx63';
const sources = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/sources.json'), 'utf8'));

const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const clean = (s, max = 220) => {
  if (!s) return '';
  let t = String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const firstSentence = t.match(/^(.{20,}?[.!?])(\s|$)/);
  if (firstSentence && firstSentence[1].length <= max) t = firstSentence[1];
  if (t.length > max) t = t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
  return t;
};

async function fetchStore() {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const r = await fetch(`https://api.apify.com/v2/store?username=${OWNER}&limit=200`, { signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      return j.data.items.filter((a) => a.username === OWNER);
    } catch (e) {
      console.warn(`store fetch attempt ${attempt} failed: ${e.message}`);
      if (attempt === 4) throw e;
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
}

function pricing(info) {
  if (!info) return { model: 'UNKNOWN', events: [] };
  const model = info.pricingModel;
  if (model !== 'PAY_PER_EVENT') {
    const out = { model, events: [] };
    if (info.pricePerUnitUsd != null) out.pricePerUnitUsd = info.pricePerUnitUsd;
    if (info.trialMinutes != null) out.trialMinutes = info.trialMinutes;
    return out;
  }
  const ev = (info.pricingPerEvent && info.pricingPerEvent.actorChargeEvents) || {};
  const events = Object.entries(ev).map(([id, e]) => {
    const tiers = e.eventTieredPricingUsd || {};
    const prices = Object.values(tiers).map((t) => t.tieredEventPriceUsd).filter((n) => typeof n === 'number');
    const free = tiers.FREE ? tiers.FREE.tieredEventPriceUsd : (e.eventPriceUsd ?? null);
    return {
      id,
      title: e.eventTitle || id,
      description: clean(e.eventDescription, 200),
      oneTime: !!e.isOneTimeEvent,
      primary: !!e.isPrimaryEvent,
      priceFreePlanUsd: free,
      priceLowestUsd: prices.length ? Math.min(...prices) : free,
    };
  });
  return { model, events };
}

function inputFields(dir) {
  const base = path.join(APIFY_DIR, dir, '.actor');
  let aj; try { aj = readJSON(path.join(base, 'actor.json')); } catch { return []; }
  let schema = null;
  try {
    if (aj.input && typeof aj.input === 'object') schema = aj.input;
    else schema = readJSON(path.join(base, typeof aj.input === 'string' ? aj.input : 'input_schema.json'));
  } catch { return []; }
  const req = new Set(schema.required || []);
  return Object.entries(schema.properties || {})
    .filter(([, p]) => p && p.editor !== 'hidden' && !/proxy/i.test(p.editor || ''))
    .map(([name, p]) => ({
      name,
      title: clean(p.title, 80),
      type: p.type || 'string',
      required: req.has(name),
      description: clean(p.description, 200),
      ...(p.enum && p.enum.length <= 12 ? { options: p.enum.map(String) } : {}),
    }));
}

function outputFields(dir) {
  const base = path.join(APIFY_DIR, dir, '.actor');
  let aj; try { aj = readJSON(path.join(base, 'actor.json')); } catch { return []; }
  let ds = aj.storages && aj.storages.dataset;
  try { if (typeof ds === 'string') ds = readJSON(path.join(base, ds)); } catch { ds = null; }
  if (!ds) return [];
  const labels = {};
  const viewOrder = [];
  for (const v of Object.values(ds.views || {})) {
    const props = (v.display && v.display.properties) || {};
    for (const [k, p] of Object.entries(props)) if (p && p.label && !labels[k]) labels[k] = clean(p.label, 60);
    for (const f of ((v.transformation && v.transformation.fields) || [])) if (!viewOrder.includes(f)) viewOrder.push(f);
  }
  const props = (ds.fields && ds.fields.properties) || {};
  const names = Object.keys(props).length ? Object.keys(props) : viewOrder;
  return names.map((name) => {
    const p = props[name] || {};
    const type = Array.isArray(p.type) ? p.type.filter((t) => t !== 'null').join(' | ') : (p.type || '');
    return { name, label: labels[name] || clean(p.title, 60) || '', type, description: clean(p.description, 200) };
  });
}

function snapshotStats(publicCount) {
  if (!fs.existsSync(SNAPSHOT)) return null;
  const snap = readJSON(SNAPSHOT);
  const all = (snap.actors || []).filter((a) => a.is_public !== false);
  const sum = (k) => all.reduce((t, a) => t + (Number(a.stats && a.stats[k]) || 0), 0);
  const roundDown = (n) => {
    if (n >= 1e6) return Math.floor(n / 1e5) / 10 + 'M+';
    if (n >= 1e5) return Math.floor(n / 1e5) * 100 + 'K+';
    if (n >= 1e4) return (Math.floor(n / 1000) * 1000).toLocaleString('en-US') + '+';
    if (n >= 1000) return (Math.floor(n / 100) * 100).toLocaleString('en-US') + '+';
    return String(n);
  };
  const runs = sum('totalRuns');
  const users = sum('totalUsers');
  return {
    generatedAt: new Date().toISOString(),
    snapshotFetchedAt: snap.fetched_at || snap.fetchedAt || snap.generated_at || null,
    actors: { value: publicCount, display: String(publicCount), source: 'live Apify Store list' },
    runs: { value: runs, display: roundDown(runs), source: 'snapshot, public actors' },
    users: { value: users, display: roundDown(users), source: 'snapshot, public actors' },
  };
}

// Each actor's own Store icon, self-hosted (no third-party image requests from visitors).
const ICON_SRC = path.join(ROOT, 'data/icon-sources.json'); // which Store URL each icon came from (not deployed)
const iconSrc = fs.existsSync(ICON_SRC) ? JSON.parse(fs.readFileSync(ICON_SRC, 'utf8')) : {};
async function downloadIcon(a) {
  if (!a.pictureUrl) return null;
  const rel = `icons/${a.name.toLowerCase()}.webp`;
  const out = path.join(ROOT, 'public', rel);
  if (fs.existsSync(out) && iconSrc[a.name] === a.pictureUrl) return '/' + rel;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(a.pictureUrl, { signal: AbortSignal.timeout(30000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
      iconSrc[a.name] = a.pictureUrl;
      return '/' + rel;
    } catch (e) {
      if (attempt === 3) { console.warn(`icon ${a.name}: ${e.message}`); return fs.existsSync(out) ? '/' + rel : null; }
    }
  }
}

const store = await fetchStore();
const actors = [];
const missing = [];
for (const a of store.sort((x, y) => x.name.localeCompare(y.name))) {
  const dir = sources[a.name];
  if (!dir) missing.push(a.name);
  actors.push({
    slug: a.name,
    pageSlug: a.name.toLowerCase(),
    id: a.id,
    storeTitle: a.title,
    storeDescription: a.description,
    storeUrl: `https://apify.com/${OWNER}/${a.name}?fpr=${FPR}`,
    icon: await downloadIcon(a),
    apifyCategories: a.categories || [],
    usersRank: (a.stats && a.stats.totalUsers) || 0, // public Store number; used only to order "most used", never displayed
    pricing: pricing(a.currentPricingInfo),
    input: dir ? inputFields(dir) : [],
    output: dir ? outputFields(dir) : [],
  });
}
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(ICON_SRC, JSON.stringify(iconSrc, null, 2) + '\n');
fs.writeFileSync(path.join(ROOT, 'data/actors.json'), JSON.stringify({ fetchedAt: new Date().toISOString(), owner: OWNER, actors }, null, 2) + '\n');
const stats = snapshotStats(actors.length);
if (stats) fs.writeFileSync(path.join(ROOT, 'data/stats.json'), JSON.stringify(stats, null, 2) + '\n');
console.log(`actors: ${actors.length} · no source folder: ${missing.join(', ') || 'none'} · stats: ${stats ? `${stats.runs.display} runs, ${stats.users.display} users` : 'snapshot missing'}`);
const thin = actors.filter((a) => !a.input.length || !a.output.length).map((a) => `${a.slug}(in ${a.input.length}/out ${a.output.length})`);
if (thin.length) console.log('fields missing for:', thin.join(', '));
