# 📝 Facebook Posts Scraper

Scrape posts from **public Facebook pages and profiles** without an account, cookies or an API key. Paste page links, choose how many posts you want, and get every post's text, date, reactions by type, comments, shares, video views and plays, photos, videos, shared links and events.

## 📝 What is Facebook Posts Scraper?

Facebook Posts Scraper collects the posts of any public Facebook page or profile and turns them into structured data you can export or analyse:

- 👥 **Pages and profiles** — brands, media, public figures and public personal profiles. Normal page links, `profile.php?id=` links and `/people/` links all work.
- ❤️ **Full engagement** — total reactions plus the breakdown (like, love, care, haha, wow, sad, angry), comment count and share count.
- 🎬 **Video numbers** — both **views** and **plays** (plays include replays), plus duration, thumbnail and captions file.
- 🖼️ **Media** — every photo in a post or album (image URL, size, alt text) and videos (link, thumbnail, duration, live flag).
- 🔁 **Shares done right** — when a post shares another post (live videos, reshares), you get the shared post's text, author and media.
- 🔗 **Links and events** — shared links (URL, title, description, source) and events (name, link, summary).
- ⏪ **Go back in time** — "Only posts older than" jumps straight to a date, even years back. "Only posts newer than" stops at a date.
- ⚡ **Fast on big jobs** — a page with thousands of posts is read in parallel date ranges; 1,000 posts take about 2–3 minutes.
- 📚 **Many pages per run** — add as many pages as you like; several are scraped at the same time.

## 📊 What Facebook posts data can I extract?

| Field | Description |
|---|---|
| `postId`, `url` | Post ID and link |
| `text` | The post's own text |
| `textOrSharedText` | The post's text, or the shared post's text when the post has none |
| `time`, `timestamp` | Publication time (ISO 8601 UTC and Unix seconds) |
| `pageName`, `pageId`, `pageUrl`, `author` | Who published it |
| `reactionsCount`, `reactions` | Total reactions and the breakdown by type |
| `commentsCount`, `sharesCount` | Comment and share counts |
| `videoViewCount`, `videoPlayCount` | Video views and plays (video posts) |
| `media` | Photos and videos with image/thumbnail URLs, sizes, duration, alt text |
| `link`, `event`, `sharedPost` | Shared link, event or post, when there is one |
| `feedbackId` | Facebook's ID for the post's comments — use it with a comment scraper |
| `inputUrl`, `scrapedAt` | The link you entered and when the row was collected |

## 🎯 Use cases

- 📣 **Social listening & brand monitoring** — track what brands, competitors or public figures post and how audiences react.
- 🔍 **Content research** — find which formats (video, photo, link) get the most reactions and shares on a page.
- 📈 **Marketing analytics** — export a page's post history to a spreadsheet or BI tool for reporting.
- 🎓 **Academic & media research** — collect a page's posts for a date range, years back.
- 🤖 **Dataset building** — feed post text and engagement into AI, NLP or sentiment pipelines.

## 🚀 How do I use Facebook Posts Scraper?

1. Open the Actor and paste one or more **Facebook page or profile links** (one per line).
2. Set **Max posts per page** (newest first).
3. Optional: pick a **date range** — a calendar date or a relative period like `3 months`.
4. Click **Start** ▷.
5. Download the results as JSON, CSV, Excel or HTML, or read them through the API.

## ➡️ Input

| Field | What it does | Default |
|---|---|---|
| 🔗 **Facebook page or profile URLs** | Public pages or profiles, e.g. `https://www.facebook.com/nasa`. Links to posts, groups, events, reels or other websites are rejected in the form. | — |
| 🔢 **Max posts per page** | Posts to collect from each page, newest first. | 50 |
| 📅 **Only posts newer than** | Stop at this date. A date (`2024-01-31`) or a relative period (`3 months`). UTC. | — |
| ⏪ **Only posts older than** | Start from this date and go back in time. A date (`2022-12-31`) or relative (`1 year`). UTC. | — |
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

When a page can't be scraped (private, removed, login-only), the dataset gets one row with an `error` message for it instead of posts, and the other pages continue.

## 🧰 More Facebook tools

| Actor | What it does |
|---|---|
| 💬 [Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63) | Comments and replies from posts, reels, photos and videos — pairs with this Actor's `feedbackId` and post links |
| 📢 [Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63) | Ads from the Meta Ad Library: creatives, copy, dates and advertisers |
| 🔗 [Facebook Ads URL Parser](https://apify.com/dz_omar/facebook-ads-url?fpr=smcx63) | Ad Library search links turned into structured ad data |

## ❓ FAQ

**Do I need a Facebook account or cookies?**
No. The Actor reads public posts exactly as a logged-out visitor sees them.

**How far back can it go?**
Years. Use **Only posts older than** to start at any date. On a few old pages Facebook itself stops serving posts before a certain date for logged-out visitors; the run then ends with what is available.

**Can I scrape groups, single posts, comments or Marketplace?**
Not with this Actor — it collects a page's or profile's posts. Single post links and group links are rejected in the input form. Each post includes `feedbackId`, which comment scrapers can use.

**Why is a residential proxy required?**
Facebook refuses post requests from datacenter IPs. Residential proxy is the default; you don't need to change anything.

**Why did a page return fewer posts than I asked for?**
The page has fewer public posts in that date range, or some posts are visible only to logged-in users or specific countries.

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
