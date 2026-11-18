// build.mjs: `npm run build` = content check → redirects → astro build → dist check.
// Astro/Vite on Windows silently DROP the page stylesheet <link> when the working folder's drive letter is lowercase
// (d:\Dev\… instead of D:\Dev\…: module ids no longer match, pages render unstyled). Happened on deploy 6bfac2df,
// 2026-11-18. So every step runs with an upper-case drive letter, whatever shell started it; check-dist.mjs fails the
// build if any page still lacks its stylesheet.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..').replace(/^([a-z]):/, (m, d) => d.toUpperCase() + ':');
// PUBLIC_CF_WEB_ANALYTICS_TOKEN (public by design): site/.env wins (Astro reads it); otherwise it is taken from
// live-demo/.env, where the operator keeps the project's other keys. Never printed.
import fs from 'node:fs';
if (!process.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN) {
  const read = (f) => { try { return (fs.readFileSync(f, 'utf8').split(/\r?\n/).find((l) => l.startsWith('PUBLIC_CF_WEB_ANALYTICS_TOKEN=')) || '').split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, ''); } catch { return ''; } };
  const tok = read(path.join(ROOT, '.env')) || read(path.join(ROOT, '..', 'live-demo', '.env'));
  if (tok) process.env.PUBLIC_CF_WEB_ANALYTICS_TOKEN = tok;
}
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32', env: process.env });
  if (r.status !== 0) process.exit(r.status || 1);
};
run('node', ['scripts/check-content.mjs']);
run('node', ['scripts/gen-redirects.mjs']);
run('npx', ['astro', 'build']);
run('node', ['scripts/check-dist.mjs']);
