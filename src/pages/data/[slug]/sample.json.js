// Data explorer downloads: the same masked sample shown on the page.
import { actors } from '../../../lib/site.js';
export function getStaticPaths() {
  return actors.filter((a) => a.sample).map((a) => ({ params: { slug: a.pageSlug }, props: { a } }));
}
export function GET({ props }) {
  return new Response(JSON.stringify(props.a.sample.rows, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
