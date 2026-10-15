# 📝 Facebook Posts Scraper — Pages, Groups & Profiles

Scrape posts from **public Facebook pages, profiles and public groups** without an account, cookies or an API key. Paste links, choose how many posts you want, and get every post's text, date, reactions by type, comments, shares, video views and plays, photos, videos, shared links and events.

## 📝 What is Facebook Posts Scraper?

Facebook Posts Scraper collects the posts of any public Facebook page, profile or public group and turns them into structured data you can export or analyse:

- 👥 **Pages and profiles** — brands, media, public figures and public personal profiles. Normal page links, `profile.php?id=` links and `/people/` links all work.
- 🏘️ **Public groups** — every post in a public group's discussion, newest first, with the member who posted it. Mix pages and groups in one run.
- ❤️ **Full engagement** — total reactions plus the breakdown (like, love, care, haha, wow, sad, angry), comment count and share count.
- 🎬 **Video numbers** — both **views** and **plays** (plays include replays), plus duration, thumbnail and captions file.
- 🖼️ **Media** — every photo in a post or album (image URL, size, alt text) and videos (link, thumbnail, duration, live flag).
- 🔁 **Shares done right** — when a post shares another post (live videos, reshares), you get the shared post's text, author and media.
- 🔗 **Links and events** — shared links (URL, title, description, source) and events (name, link, summary).
- ⏪ **Go back in time** — on pages and profiles, "Only posts older than" jumps straight to a date, even years back. "Only posts newer than" stops at a date (pages and groups).
- ⚡ **Fast on big jobs** — a page with thousands of posts is read in parallel date ranges; 1,000 posts take about 2–3 minutes.
- 📚 **Many pages and groups per run** — add as many links as you like; several are scraped at the same time.

## 📊 What Facebook posts data can I extract?

| Field | Description |
|---|---|
| `postId`, `url` | Post ID and link |
| `text` | The post's own text |
| `textOrSharedText` | The post's text, or the shared post's text when the post has none |
| `time`, `timestamp` | Publication time (ISO 8601 UTC and Unix seconds) |
| `sourceType` | `page` (pages and profiles) or `group` |
| `pageName`, `pageId`, `pageUrl` | The page, profile or group the post comes from |
| `author` | Who published it — in groups, the member |
| `reactionsCount`, `reactions` | Total reactions and the breakdown by type |
| `commentsCount`, `sharesCount` | Comment and share counts |
| `videoViewCount`, `videoPlayCount` | Video views and plays (video posts) |
| `media` | Photos and videos with image/thumbnail URLs, sizes, duration, alt text |
| `link`, `event`, `sharedPost` | Shared link, event or post, when there is one |
| `feedbackId` | Facebook's ID for the post's comments — use it with a comment scraper |
| `inputUrl`, `scrapedAt` | The link you entered and when the row was collected |

## 🎯 Use cases

- 📣 **Social listening & brand monitoring** — track what brands, competitors or public figures post and how audiences react.
- 🏘️ **Community monitoring** — follow what members of public groups ask, recommend, sell or complain about.
- 🔍 **Content research** — find which formats (video, photo, link) get the most reactions and shares on a page.
- 📈 **Marketing analytics** — export a page's post history to a spreadsheet or BI tool for reporting.
- 🎓 **Academic & media research** — collect a page's posts for a date range, years back.
- 🤖 **Dataset building** — feed post text and engagement into AI, NLP or sentiment pipelines.

## 🚀 How do I use Facebook Posts Scraper?

1. Open the Actor and paste one or more **Facebook page, profile or public group links** (one per line).
2. Set **Max posts per page or group** (newest first).
3. Optional: pick a **date range** — a calendar date or a relative period like `3 months`.
4. Click **Start** ▷.
5. Download the results as JSON, CSV, Excel or HTML, or read them through the API.

## ➡️ Input

| Field | What it does | Default |
|---|---|---|
| 🔗 **Facebook page, profile or group URLs** | Public pages, profiles or public groups, e.g. `https://www.facebook.com/nasa` or `https://www.facebook.com/groups/995281237262612`. Links to single posts, events, reels or other websites are rejected in the form. | — |
| 🔢 **Max posts per page or group** | Posts to collect from each page or group, newest first. | 50 |
| 📅 **Only posts newer than** | Stop at this date. A date (`2024-01-31`) or a relative period (`3 months`). UTC. | — |
| ⏪ **Only posts older than** | Start from this date and go back in time. Pages jump straight there; groups read and skip the newer posts first. A date (`2022-12-31`) or relative (`1 year`). UTC. | — |
| 🛡️ **Proxy** | Residential proxy is required for Facebook and is the default. | Residential |

Example — the 500 newest posts of two pages, published in 2025:

```json
{
    "startUrls": [
        "https://www.facebook.com/nasa",
        "https://www.facebook.com/natgeo"
    ],
    "resultsLimit": 500,
    "onlyPostsNewerThan": "2025-01-01",
    "onlyPostsOlderThan": "2026-01-01"
}
```

## ⬅️ Output

Results are stored in a dataset, one row per post. Download them as JSON, CSV, Excel, XML or HTML, or read them through the API.

### 📘 Example of extracted Facebook post data

Long URLs shortened:

```json
{
  "postId": "1643634053798631",
  "url": "https://www.facebook.com/reel/1134423309335584/",
  "text": "New crew soon!\n\nCrew-13 is scheduled to launch to the International Space Station tomorrow, Oct. 1. …",
  "textOrSharedText": "New crew soon!\n\nCrew-13 is scheduled to launch to the International Space Station tomorrow, Oct. 1. …",
  "time": "2026-09-30T15:17:34.000Z",
  "timestamp": 1790781454,
  "pageName": "NASA - National Aeronautics and Space Administration",
  "pageId": "100044561550831",
  "pageUrl": "https://www.facebook.com/NASA/",
  "author": { "id": "100044561550831", "name": "NASA - National Aeronautics and Space Administration", "url": "https://www.facebook.com/NASA" },
  "reactionsCount": 1582,
  "reactions": { "like": 1332, "love": 208, "care": 25, "haha": 8, "wow": 7, "angry": 2 },
  "commentsCount": 60,
  "sharesCount": 166,
  "videoViewCount": 20174,
  "videoPlayCount": 101097,
  "media": [
    {
      "type": "video",
      "id": "1134423309335584",
      "url": "https://www.facebook.com/reel/1134423309335584/",
      "thumbnail": "https://scontent.xx.fbcdn.net/v/…",
      "durationMs": 61504,
      "isLive": false,
      "captionsUrl": "https://scontent.xx.fbcdn.net/v/…",
      "width": 3840,
      "height": 2160
    }
  ],
  "link": null,
  "event": null,
  "sharedPost": null,
  "feedbackId": "ZmVlZGJhY2s6MTY0MzYzNDA1Mzc5ODYzMQ==",
  "inputUrl": "https://www.facebook.com/nasa",
  "scrapedAt": "2026-10-01T12:35:54.987Z"
}
```

When a page or group can't be scraped (private, removed, members-only), the dataset gets one row with an `error` message for it instead of posts, and the others continue.

## 💰 How much does it cost to scrape Facebook posts?

You pay only for what you get — no subscription and no platform usage on top. Prices per **1,000 posts** by Apify plan:

| Apify plan | Free | Bronze | Silver | Gold | Platinum | Diamond |
|---|---|---|---|---|---|---|
| Price per 1,000 posts | $2.50 | $1.50 | $1.30 | $1.10 | $1.10 | $1.10 |

Small fixed charges, same on every plan:

| Event | Price | When |
|---|---|---|
| Actor start | $0.002 | Once per run (per GB of memory; default 512 MB = one event) |
| Page or group scraped | $0.002 | Once per link that returns at least one post — links that return nothing are not charged |
| Group post skipped (date filter) | $0.0005 | Only with **Only posts older than** on a group: each newer post read on the way to that date |

Example: 1,000 posts from one page on the Bronze plan ≈ **$1.50**. Set **Max cost per run** in the run options and the Actor stops exactly at that amount, delivering every post you paid for.

## 🧰 More Facebook tools

| Actor | What it does |
|---|---|
| 💬 [Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63) | Comments and replies from posts, reels, photos and videos — pairs with this Actor's `feedbackId` and post links |
| 📢 [Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63) | Ads from the Meta Ad Library: creatives, copy, dates and advertisers |
| 🔗 [Facebook Ads URL Parser](https://apify.com/dz_omar/facebook-ads-url?fpr=smcx63) | Ad Library search links turned into structured ad data |

## ❓ FAQ

**Do I need a Facebook account or cookies?**
No. The Actor reads public posts exactly as a logged-out visitor sees them.

**How far back can it go on pages and profiles?**
Years. Use **Only posts older than** to start at any date. On a few old pages Facebook itself stops serving posts before a certain date for logged-out visitors; the run then ends with what is available.

**Can I scrape Facebook groups?**
Yes — **public** groups. Paste the group link (`https://www.facebook.com/groups/<id or name>`). Private groups show their posts only to members, so they return an error row instead of posts.

**How far back can groups go?**
As far as you are willing to read: group feeds are read from the newest post backwards, so "Only posts older than" on a group first reads (and skips) the newer posts. A date years back in a busy group takes much longer than on a page, where the jump is instant.

**Can I scrape single posts, comments or Marketplace?**
Not with this Actor — it collects the posts of pages, profiles and groups. Single post links are rejected in the input form. Each post includes `feedbackId`, which comment scrapers can use.

**Why is a residential proxy required?**
Facebook refuses post requests from datacenter IPs. Residential proxy is the default; you don't need to change anything.

**Why did a page or group return fewer posts than I asked for?**
It has fewer public posts in that date range, or some posts are visible only to logged-in users, members or specific countries.

**How do relative dates work?**
They count back from the moment the run starts, in UTC. Months and years are calendar months and years; days, weeks and hours are exact. `3 months` in **Only posts newer than** means "posts from the last 3 months". `1 year` in **Only posts older than** means "posts published more than a year ago". Use both to get a window — e.g. newer than `2 years` and older than `1 year` returns the posts of the year before last. The newer-than period must be the longer one; a reversed range stops the run with a message explaining the fix.

## 🔗 Integrations

Export to Google Sheets, Airtable or a database, trigger runs on a schedule, and connect the output to Make, Zapier, n8n or your own code through the [Apify API](https://docs.apify.com/api/v2).

## Support

- 🌐 Website: [flowextractapi.com](https://flowextractapi.com)
- 📧 Email: flowextractapi@outlook.com
- 💬 GitHub: [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 LinkedIn: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 X: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 Facebook: [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 TikTok: [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

- Collects **public data only** — what any logged-out visitor can see.
- Respects the source's rate limits; you are responsible for using the data in line with Facebook's terms and the laws that apply to you (e.g. GDPR).
- The Actor stores no personal information beyond the run's own dataset, which you control.
- Suitable for commercial use.
- No affiliation with or endorsement by Facebook or Meta Platforms, Inc. is implied.

*Facebook Posts Scraper — by FlowExtract API. Turn any website into structured data.*
