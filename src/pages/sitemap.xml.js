// sitemap.xml: every indexable page; lastmod = the page's own content date (keyword change or sample run), not the build date.
import { actors, hubs, page, BASE } from '../lib/site.js';

const max = (...d) => d.filter(Boolean).sort().slice(-1)[0];
export function GET() {
  const urls = [
    { loc: '/', lastmod: page('home').lastKeywordChange },
    ...hubs.map((h) => ({ loc: h.url, lastmod: max(h.lastKeywordChange, h.updated) })),
    ...actors.map((a) => ({ loc: a.url, lastmod: max(a.lastKeywordChange, a.updated, a.sample && a.sample.run.date) })),
    ...['about', 'contact', 'privacy'].map((id) => ({ loc: `/${id}.html`, lastmod: page(id).lastKeywordChange })),
    { loc: '/zoom-downloader/' },
  ];
  const body = urls.map((u) => `  <url><loc>${BASE}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } });
}
