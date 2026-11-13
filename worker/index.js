// Edge script for flowextractapi.com. Static assets (and public/_redirects) answer every request that matches a
// file; this script only runs for addresses that are NOT files:
//   /go/<slug>                 -> count a Store click, 302 to the actor's Apify Store page (with ?fpr)
//   /dl/<slug>/sample.csv|json -> count a data-explorer download, serve /data/<slug>/sample.* as a download
//   anything else              -> the site's 404 page with status 404
// Counting: one Analytics Engine data point per event (event, slug, file, our own page path). No cookies, no IP,
// no visitor identifiers. Nothing here calls Apify or any scraper.
import storeLinks from './store-links.json';

function record(env, event, slug, file, request) {
  try {
    let from = '';
    const ref = request.headers.get('referer');
    if (ref) { const u = new URL(ref); if (u.hostname.endsWith('flowextractapi.com')) from = u.pathname; }
    env.EVENTS?.writeDataPoint({ blobs: [event, slug, file, from], doubles: [1], indexes: [slug] });
  } catch { /* counting must never break a request */ }
}

async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
  return new Response(page.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const go = url.pathname.match(/^\/go\/([a-z0-9-]+)\/?$/);
    if (go && storeLinks[go[1]]) {
      record(env, 'store_click', go[1], '', request);
      return Response.redirect(storeLinks[go[1]], 302);
    }
    const dl = url.pathname.match(/^\/dl\/([a-z0-9-]+)\/(sample\.(csv|json))$/);
    if (dl) {
      const file = await env.ASSETS.fetch(new Request(new URL(`/data/${dl[1]}/${dl[2]}`, request.url)));
      if (file.status === 200) {
        record(env, 'download', dl[1], dl[2], request);
        const headers = new Headers(file.headers);
        headers.set('Content-Disposition', `attachment; filename="${dl[1]}-sample.${dl[3]}"`);
        return new Response(file.body, { status: 200, headers });
      }
    }
    return notFound(request, env);
  },
};
