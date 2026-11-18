// build.mjs: `npm run build` = content check → redirects → astro build → dist check.
// Astro/Vite on Windows silently DROP the page stylesheet <link> when the working folder's drive letter is lowercase
// (d:\Dev\… instead of D:\Dev\…: module ids no longer match, pages render unstyled). Happened on deploy 6bfac2df,
// 2026-11-18. So every step runs with an upper-case drive letter, whatever shell started it; check-dist.mjs fails the
// build if any page still lacks its stylesheet.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..').replace(/^([a-z]):/, (m, d) => d.toUpperCase() + ':');
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status || 1);
};
run('node', ['scripts/check-content.mjs']);
run('node', ['scripts/gen-redirects.mjs']);
run('npx', ['astro', 'build']);
run('node', ['scripts/check-dist.mjs']);
