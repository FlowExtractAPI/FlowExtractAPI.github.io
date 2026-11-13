// check-content.mjs: fails the build when the keyword-control rules are broken.
// One content file per page; unique primaryKeyword across ALL pages; title <= 60; meta <= 160;
// every public actor has a content file and every content file a public actor.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const dirFiles = (d) => fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => path.join(d, f)) : [];

const site = read(path.join(ROOT, 'content/site.json'));
const categories = new Set(Object.keys(site.categories));
const sourceHubs = new Set(Object.keys(site.sourceHubs || {}));
const actors = read(path.join(ROOT, 'data/actors.json')).actors;
const errors = [];
const pages = [];

for (const f of dirFiles(path.join(ROOT, 'content/actors'))) pages.push({ kind: 'actor', file: f, doc: read(f) });
for (const f of dirFiles(path.join(ROOT, 'content/hubs'))) pages.push({ kind: 'hub', file: f, doc: read(f) });
for (const f of dirFiles(path.join(ROOT, 'content/pages'))) pages.push({ kind: 'page', file: f, doc: read(f) });

const kw = new Map();
for (const { kind, file, doc } of pages) {
  const name = path.relative(ROOT, file);
  for (const k of ['primaryKeyword', 'title', 'h1', 'metaDescription', 'intro', 'lastKeywordChange']) {
    if (!doc[k] || typeof doc[k] !== 'string') errors.push(`${name}: missing ${k}`);
  }
  if (doc.title && doc.title.length > 60) errors.push(`${name}: title ${doc.title.length} > 60 chars`);
  if (doc.metaDescription && doc.metaDescription.length > 160) errors.push(`${name}: metaDescription ${doc.metaDescription.length} > 160 chars`);
  if (doc.metaDescription && doc.metaDescription.length < 70) errors.push(`${name}: metaDescription ${doc.metaDescription.length} < 70 chars`);
  const k = (doc.primaryKeyword || '').trim().toLowerCase();
  if (k) {
    if (kw.has(k)) errors.push(`${name}: primaryKeyword "${k}" already used by ${kw.get(k)}`);
    else kw.set(k, name);
  }
  if (kind === 'actor') {
    if (!categories.has(doc.category)) errors.push(`${name}: unknown category "${doc.category}"`);
    if (doc.sourceHub && !sourceHubs.has(doc.sourceHub) && !(site.plannedSourceHubs || []).includes(doc.sourceHub)) errors.push(`${name}: unknown sourceHub "${doc.sourceHub}"`);
    if (!['basic', 'unique'].includes(doc.mode)) errors.push(`${name}: mode must be basic or unique`);
    if (!actors.some((a) => a.slug === doc.slug)) errors.push(`${name}: slug "${doc.slug}" is not a public actor in data/actors.json`);
    if (doc.mode === 'unique') {
      const run = path.join(ROOT, 'data/samples', doc.slug.toLowerCase(), 'run.json');
      if (!fs.existsSync(run)) errors.push(`${name}: unique mode needs data/samples/${doc.slug.toLowerCase()}/run.json`);
    }
  }
}
for (const a of actors) {
  if (!pages.some((p) => p.kind === 'actor' && p.doc.slug === a.slug)) errors.push(`public actor ${a.slug} has no content/actors file`);
}
if (errors.length) {
  console.error(`content check FAILED (${errors.length}):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`content check OK: ${pages.length} pages, ${kw.size} unique primary keywords`);
