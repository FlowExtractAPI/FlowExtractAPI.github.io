import { BASE } from '../lib/site.js';
export function GET() {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /go/\nDisallow: /dl/\nDisallow: /api/\nDisallow: /e$\n\nSitemap: ${BASE}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
