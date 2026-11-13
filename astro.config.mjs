import { defineConfig } from 'astro/config';

// build.format 'file' keeps the indexed addresses: src/pages/docs/[slug].astro -> /docs/<slug>.html
// PUBLIC_DESIGN=a|b picks the design direction for the pilot (wall 3); output goes to dist/ (or dist-a, dist-b).
const design = process.env.PUBLIC_DESIGN;
export default defineConfig({
  site: 'https://flowextractapi.com',
  build: { format: 'file' },
  outDir: design ? `./dist-${design}` : './dist',
  devToolbar: { enabled: false },
  compressHTML: true,
});
