// deploy.mjs: one command to publish flowextractapi.com and tell search engines what changed.
//   npm run deploy            build + checks, wrangler deploy, IndexNow ping for new/changed sitemap URLs
//   npm run deploy -- --all   same, but announce every sitemap URL
// Google re-reads /sitemap.xml on its own (lastmod per page); Bing, Yandex, Seznam and Naver get an IndexNow ping.
// The IndexNow key is public by design (file /<key>.txt on the site).
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'));
const HOST = new URL(site.brand.url).host;
const KEY = site.indexNowKey;
const all = process.argv.includes('--all');
const parse = (xml) => new Map([...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?<\/url>/g)].map((m) => [m[1], m[2] || '']));

async function liveSitemap() {
  try {
    const r = await fetch(`${site.brand.url}/sitemap.xml`, { signal: AbortSignal.timeout(30000) });
    return r.ok ? parse(await r.text()) : new Map();
  } catch { return new Map(); }
}

const before = await liveSitemap();
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
execSync('npx wrangler deploy', { cwd: ROOT, stdio: 'inherit' });
const after = parse(fs.readFileSync(path.join(ROOT, 'dist/sitemap.xml'), 'utf8'));
const changed = [...after].filter(([loc, mod]) => all || !before.has(loc) || before.get(loc) !== mod).map(([loc]) => loc);
if (!changed.length) { console.log('IndexNow: no new or changed URLs'); process.exit(0); }
if (!KEY) { console.log('IndexNow: no indexNowKey in content/site.json; skipped'); process.exit(0); }

// The key file must be live before the ping.
const keyUrl = `${site.brand.url}/${KEY}.txt`;
for (let i = 0; i < 10; i++) {
  try { const r = await fetch(keyUrl, { signal: AbortSignal.timeout(15000) }); if (r.ok && (await r.text()).trim() === KEY) break; } catch {}
  await new Promise((res) => setTimeout(res, 3000));
}
const body = { host: HOST, key: KEY, keyLocation: keyUrl, urlList: changed.slice(0, 10000) };
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000),
});
console.log(`IndexNow: ${changed.length} URL(s) → HTTP ${r.status} ${r.status === 200 || r.status === 202 ? '(accepted)' : await r.text()}`);
