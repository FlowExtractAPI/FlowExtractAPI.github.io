// site-stats.mjs: what visitors click and which errors their browsers hit, from the cookie-free page script in
// src/layouts/Base.astro (events ui_click / ui_error in Analytics Engine dataset flowextract_site_events).
//   node scripts/site-stats.mjs [days=7] [page-path-filter]
// Needs CF_ANALYTICS_TOKEN in D:\Dev\FlowExtract-API\live-demo\.env (Account Analytics: Read). Bots are left out.
// Store clicks, downloads and live-demo runs: node scripts/demo-stats.mjs [days].
import fs from 'node:fs';

const ACCOUNT = '3f0ee85fc436f30b05dd07e986c87115';
const days = Number(process.argv[2] || 7);
const pageFilter = process.argv[3] || '';
const line = fs.readFileSync('D:/Dev/FlowExtract-API/live-demo/.env', 'utf8').split(/\r?\n/).find((l) => l.startsWith('CF_ANALYTICS_TOKEN='));
const token = line && line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
if (!token) { console.error('Add CF_ANALYTICS_TOKEN to live-demo/.env (Account Analytics: Read).'); process.exit(1); }
const q = async (sql) => {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: sql });
  const t = await r.text(); if (!r.ok) { console.error(`HTTP ${r.status}: ${t.slice(0, 300)}`); process.exit(1); }
  return (JSON.parse(t).data || []).filter((x) => !pageFilter || String(x.page).includes(pageFilter));
};
const since = `timestamp > NOW() - INTERVAL '${days}' DAY AND blob5 = 'human'`;
const clicks = await q(`SELECT blob4 AS page, blob2 AS clicked, SUM(_sample_interval) AS n FROM flowextract_site_events
  WHERE blob1 = 'ui_click' AND ${since} GROUP BY page, clicked ORDER BY n DESC LIMIT 200`);
const errors = await q(`SELECT blob4 AS page, blob2 AS error, blob3 AS detail, SUM(_sample_interval) AS n, MAX(timestamp) AS last FROM flowextract_site_events
  WHERE blob1 = 'ui_error' AND ${since} GROUP BY page, error, detail ORDER BY n DESC LIMIT 100`);
console.log(`\nClicks, last ${days} days (humans only)${pageFilter ? `, pages containing "${pageFilter}"` : ''}:`);
if (clicks.length) console.table(clicks.map((x) => ({ page: x.page, clicked: x.clicked, count: Number(x.n) }))); else console.log('  none yet');
console.log(`\nBrowser errors, last ${days} days:`);
if (errors.length) console.table(errors.map((x) => ({ page: x.page, error: x.error, detail: x.detail, count: Number(x.n), last: x.last }))); else console.log('  none');
