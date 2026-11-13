import { BASE } from '../lib/site.js';
export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
