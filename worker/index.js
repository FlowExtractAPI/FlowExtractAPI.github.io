// Edge script for flowextractapi.com. Static assets (and public/_redirects) answer every request that matches a
// file; this script only runs for addresses that are NOT files:
//   /go/<slug>                 -> count a Store click, 302 to the actor's Apify Store page (with ?fpr)
//   /dl/<slug>/sample.csv|json -> count a data-explorer download, serve /data/<slug>/sample.* as a download
//   /e (POST)                  -> count a click or a browser error sent by the page script (usage() below)
//   anything else              -> the site's 404 page with status 404
// Counting: one Analytics Engine data point per event (event, slug, file, our own page path). No cookies, no IP,
// no visitor identifiers. Nothing here calls Apify or any scraper.
import storeLinks from './store-links.json';
import { handleDemo, DemoGuard, refreshSamples } from './demo.js';
export { DemoGuard };

// blob5 = 'human' when a browser sends a user-activated navigation (Sec-Fetch-User: ?1, set only when a person clicks)
// and the user agent is not a known bot; otherwise 'bot'. Crawlers and link checkers that ignore robots.txt land in 'bot'.
const BOT_UA = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|python|curl|wget|httpclient|axios|node|go-http|java|scrapy|lighthouse|facebookexternalhit|embedly/i;
function who(request) {
  const ua = request.headers.get('user-agent') || '';
  return request.headers.get('sec-fetch-user') === '?1' && ua && !BOT_UA.test(ua) ? 'human' : 'bot';
}

function record(env, event, slug, file, request) {
  try {
    let from = '';
    const ref = request.headers.get('referer');
    if (ref) { const u = new URL(ref); if (u.hostname.endsWith('flowextractapi.com')) from = u.pathname; }
    env.EVENTS?.writeDataPoint({ blobs: [event, slug, file, from, event.startsWith('demo_') ? 'human' : who(request)], doubles: [1], indexes: [slug] });
  } catch { /* counting must never break a request */ }
}

// POST /e from the page script in src/layouts/Base.astro: { t: 'ui_click'|'ui_error', p: page path, l: label, d: detail }.
// Same-site only, small bodies only; one data point: blobs [event, label, detail, page, who]. No cookie, IP or id.
async function usage(request, env) {
  const site = request.headers.get('sec-fetch-site');
  const origin = request.headers.get('origin') || '';
  if (request.method !== 'POST' || (site && site !== 'same-origin') || (origin && !/^https:\/\/(www\.)?flowextractapi\.com$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) return new Response(null, { status: 204 });
  try {
    const raw = await request.text();
    if (raw.length > 1200) return new Response(null, { status: 204 });
    const m = JSON.parse(raw);
    const event = m.t === 'ui_error' ? 'ui_error' : 'ui_click';
    const ua = request.headers.get('user-agent') || '';
    env.EVENTS?.writeDataPoint({ blobs: [event, String(m.l || '').slice(0, 96), String(m.d || '').slice(0, 160), String(m.p || '').slice(0, 120), ua && !BOT_UA.test(ua) ? 'human' : 'bot'], doubles: [1], indexes: [event] });
  } catch { /* counting must never break anything */ }
  return new Response(null, { status: 204 });
}

async function notFound(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url)));
  return new Response(page.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export default {
  // daily cron (wrangler.jsonc triggers): refresh the ready-made answers of the live demos' default links
  async scheduled(event, env, ctx) { ctx.waitUntil(refreshSamples(env)); },
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/demo') return handleDemo(request, env, ctx, record);
    if (url.pathname === '/e') return usage(request, env);
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
