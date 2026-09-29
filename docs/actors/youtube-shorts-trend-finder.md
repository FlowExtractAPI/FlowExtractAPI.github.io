# YouTube Shorts Scraper — Keyword Search, Views & Date Filter

Find the YouTube Shorts that are actually **popular**, for any keyword, creator, or hashtag — and only the ones published inside the window you care about.

Most Shorts scrapers take a channel URL and hand back everything that channel ever posted. This one starts from **what you are searching for**, checks every Short it finds, and returns them ranked by real numbers.

---

## What makes it different

**Search by keyword, not just by channel.** Type `IShowSpeed`, `Kai Cenat`, `mrbeast challenge`, or any topic. You do not need to know the channel first.

**"Popular" means exact view counts.** Every Short is enriched to its precise view count — `25,939,392`, not `26M`. Ranking on rounded numbers puts thousands of Shorts in the same bucket; this returns a true order.

**Likes and comments on every row.** Not just views — you also get exact like and comment counts, plus an engagement rate per 1,000 views that stays comparable across Shorts of wildly different reach.

**The date filter is real.** Every Short carries its exact publish timestamp, and the timeframe is applied against that. When you ask for the last 7 days, you get the last 7 days.

**Four ways to rank:**

| Rank by | Finds |
|---|---|
| **Views** | The biggest all-time hits |
| **Views per day** | What is popping *right now* |
| **Viral score** | Fast climbers, weighted toward recent uploads |
| **Newest** | Most recently published |

Every row also carries `engagementRate` (likes + comments per 1,000 views), so you can separate a Short that got reach from one that got a reaction.

Views per day is usually what people mean by "trending": a 3-day-old Short on 2M views beats a 2-year-old Short on 5M.

**Results arrive while the run is still going.** Rows are written to the dataset as each Short is checked, best candidates first — you are not waiting for the whole run to finish before you see anything. Ask for 1,000 Shorts and the first ones show up in seconds.

**Depth on creators.** When your keyword matches a creator, the Actor also reads that creator's full Shorts catalogue — so a search for a big name returns hundreds of candidates to rank, not the handful that fit on one page of results.

---

## Input

Everything is auto-detected. You never pick a mode.

| Input | Example |
|---|---|
| Keyword | `IShowSpeed`, `kai cenat rage` |
| Channel handle or URL | `@MrBeast`, `youtube.com/@MrBeast` |
| Hashtag | `#gaming` |
| Direct Shorts URL | `youtube.com/shorts/...` |

```json
{
  "queries": ["IShowSpeed", "Kai Cenat"],
  "timeframe": "last30d",
  "sortBy": "views",
  "maxResults": 50,
  "minViews": 0
}
```

| Field | What it does |
|---|---|
| `queries` | Keywords, channels, hashtags, or Shorts URLs |
| `timeframe` | `last24h`, `last7d`, `last30d`, `last90d`, `lastYear`, `allTime` |
| `sortBy` | `views`, `velocity`, `viralScore`, `newest` |
| `maxResults` | How many Shorts to return after ranking |
| `minViews` | Drop anything below this exact view count |
| `includeChannelShorts` | Also read a matched creator's Shorts tab (default on) |
| `country` | Region used for results and locale |

---

## Output

One row per Short:

```json
{
  "videoId": "-KUPXrRQ93w",
  "title": "LIFTING THE HEAVIEST BLOCK IN THE WORLD",
  "url": "https://www.youtube.com/shorts/-KUPXrRQ93w",
  "views": 25939392,
  "likes": 916278,
  "comments": 15583,
  "engagementRate": 35.92,
  "viewsPerDay": 1329147,
  "viralScore": 1756955,
  "publishedAt": "2026-08-15T04:00:26-07:00",
  "ageDays": 19.6,
  "durationSeconds": 40,
  "channelName": "IShowSpeed",
  "channelId": "UCWsDFcIhY2DBi3GB5uykGXA",
  "channelUrl": "https://www.youtube.com/channel/UCWsDFcIhY2DBi3GB5uykGXA",
  "description": "...",
  "keywords": ["ishowspeed"],
  "category": "Gaming",
  "thumbnail": "https://i.ytimg.com/vi/-KUPXrRQ93w/sardefault.jpg"
}
```

Export as JSON, CSV, Excel, or XML, or pull it straight from the API.

---

## Use it for

- **Content research** — see which formats and hooks are working in your niche this week
- **Engagement benchmarking** — compare like/comment rates, not just raw view counts
- **Trend spotting** — catch Shorts climbing fast before they peak
- **Competitor tracking** — monitor any creator's Shorts performance over time
- **Sponsorship and talent scouting** — find creators whose Shorts consistently land
- **Datasets** — feed short-form video performance data into your own models

---

## Good to know

- Returns **public data only** — no login, no cookies, no account required.
- Rows stream out as they are found, ordered best-first by whatever you chose in `sortBy`. Because rows cannot be reordered once written, treat that order as best-effort: every row carries its exact `views`, `viewsPerDay`, `viralScore` and `engagementRate`, so sort the finished dataset on those if you need a guaranteed order.
- The run stops as soon as `maxResults` is reached, so you are never charged for Shorts beyond what you asked for.
- Every returned Short is confirmed to be a Short by its actual duration, so long-form videos never leak into your results.
- A Short whose publish date cannot be established is excluded from a filtered run rather than guessed at.
- Widen `timeframe` or lower `minViews` if a narrow search returns fewer rows than you expected — very recent windows genuinely contain fewer Shorts.

---

## Support

🌐 Website [flowextractapi.com](https://flowextractapi.com) · 📧 flowextractapi@outlook.com · 💬 GitHub [FlowExtractAPI](https://github.com/FlowExtractAPI) · 💼 LinkedIn [flowextract-api](https://www.linkedin.com/in/flowextract-api/) · 🐦 X [@FlowExtractAPI](https://x.com/FlowExtractAPI) · 📱 Facebook [flowextractapi](https://www.facebook.com/flowextractapi) · 🎵 TikTok [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

Public data only · respects source rate limits and terms · no storage of personal information · suitable for commercial use · No affiliation with or endorsement by YouTube is implied.

*YouTube Shorts Scraper — by FlowExtract API. Turn any website into structured data.*
