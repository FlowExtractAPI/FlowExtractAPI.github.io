// demo-stats.mjs: how the "Try it live" box is used, per actor and per day (Workers Analytics Engine).
//   node scripts/demo-stats.mjs [days=7]
// Needs CF_ANALYTICS_TOKEN in D:\Dev\FlowExtract-API\live-demo\.env: a Cloudflare API token with the single permission
// "Account Analytics: Read" (create at https://dash.cloudflare.com/profile/api-tokens). The value is never printed.
// Events: demo_run (blob3 = live|cached), demo_refused (hour|day|global), demo_failed, demo_human_failed,
// plus store_click / download from the rest of the site.
import fs from 'node:fs';

const ACCOUNT = '3f0ee85fc436f30b05dd07e986c87115';
const days = Number(process.argv[2] || 7);
const env = fs.readFileSync('D:/Dev/FlowExtract-API/live-demo/.env', 'utf8').split(/\r?\n/).find((l) => l.startsWith('CF_ANALYTICS_TOKEN='));
const token = env && env.slice(env.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
if (!token) { console.error('Add CF_ANALYTICS_TOKEN to live-demo/.env (Account Analytics: Read).'); process.exit(1); }
const sql = `SELECT toDate(timestamp) AS day, blob1 AS event, blob2 AS actor, blob3 AS detail, SUM(_sample_interval) AS n
  FROM flowextract_site_events WHERE timestamp > NOW() - INTERVAL '${days}' DAY
  GROUP BY day, event, actor, detail ORDER BY day DESC, event, actor`;
const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: sql });
const text = await r.text();
if (!r.ok) { console.error(`HTTP ${r.status}: ${text.slice(0, 300)}`); process.exit(1); }
const rows = JSON.parse(text).data || [];
if (!rows.length) { console.log(`No events in the last ${days} days.`); process.exit(0); }
console.table(rows.map((x) => ({ day: x.day, event: x.event, actor: x.actor, detail: x.detail, count: Number(x.n) })));
