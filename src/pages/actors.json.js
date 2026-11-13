// Public catalog file (kept from the old site): display fields only. No private snapshot data.
import { actors, site } from '../lib/site.js';
export function GET() {
  const out = actors.map((a) => ({
    slug: a.slug, name: a.label, title: a.title, description: a.metaDescription, category: a.category,
    categoryName: site.categories[a.category].name, source: a.source, page: `${site.brand.url}${a.url}`, apifyUrl: a.facts.storeUrl,
  }));
  return new Response(JSON.stringify(out, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
