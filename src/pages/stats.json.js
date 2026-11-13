// Public aggregate stats (kept from the old site, same shape). Totals only.
import { stats, actors, categoryIds } from '../lib/site.js';
export function GET() {
  const out = {
    generatedAt: stats.generatedAt,
    actors: { value: actors.length, display: String(actors.length) },
    runs: { value: stats.runs.value, display: stats.runs.display },
    users: { value: stats.users.value, display: stats.users.display },
    categories: { value: categoryIds.length },
  };
  return new Response(JSON.stringify(out, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
