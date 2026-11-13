import { actors, toCsv } from '../../../lib/site.js';
export function getStaticPaths() {
  return actors.filter((a) => a.sample).map((a) => ({ params: { slug: a.pageSlug }, props: { a } }));
}
export function GET({ props }) {
  return new Response('\uFEFF' + toCsv(props.a.sample.rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
