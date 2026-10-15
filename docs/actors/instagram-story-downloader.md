# 📥 Instagram Story Downloader — Save Story Highlights as MP4 & JPG, No Login

**Instagram Story Downloader** saves the **Story Highlights** of any public Instagram profile — every video
and photo, stored as a permanent file you can download any time — together with the highlight title,
position, post date, links and mentions. It also tells you whether the profile has a **24-hour story live
right now**.

No Instagram account, no cookies, no browser extension. Paste usernames or highlight links and run.

- 🎞️ **Every item of every highlight**: videos (MP4) and photos (JPG) at the best available resolution
- 💾 **Permanent files**: stored copies keep working after Instagram's own links expire
- 🟢 **Live-story check**: `has_active_story` + `latest_story_at` for every profile
- ⭐ **Whole profile or one highlight**: scan a profile, or download a single highlight by its link
- 🧾 **Clean, flat rows**: one row per photo/video, ready for spreadsheets, BI tools and AI agents
- 🔁 **Interruption-safe**: a run that is moved or restarted resumes without duplicate results or charges

## Why download Instagram Story Highlights?

Highlights are the stories a brand or creator chose to keep: product launches, FAQs, reviews, event
recaps, behind-the-scenes series. They are a curated archive of an account's best short-form content,
and they are only viewable inside Instagram's story player, with links that expire.

- **Brand & competitor monitoring**: keep a copy of every highlight a competitor publishes
- **Influencer marketing**: archive sponsored highlight content as campaign proof
- **Content research**: collect short-form video examples by niche
- **Social listening & AI datasets**: structured media + metadata for analysis and training
- **Backups**: save your own account's highlights as files

## What data does Instagram Story Downloader extract?

### 🎞️ Highlight items (one row per photo or video)

| Field | Description |
|---|---|
| `username`, `user_id` | Profile that posted the highlight |
| `highlight_id`, `highlight_title`, `highlight_url` | The highlight it belongs to |
| `position` | 1-based position inside the highlight |
| `item_id`, `shortcode` | Instagram's ids for the story item |
| `media_type` | `video` or `image` |
| `taken_at`, `taken_at_unix` | When the story was originally posted |
| `file` | **Stored copy**: `url`, `download_url` (forces download), `file_name`, `size_bytes`, `content_type` |
| `video_url`, `image_url` | Instagram's direct media links (expire after a few days) |
| `video_duration_seconds`, `has_audio`, `width`, `height` | Media details |
| `link_urls`, `mentions`, `hashtags`, `locations`, `music` | Story stickers |
| `accessibility_caption` | Instagram's alt text, when present |

### 👤 Profiles (one row per profile)

| Field | Description |
|---|---|
| `username`, `full_name`, `user_id`, `profile_url` | Identity |
| `has_active_story`, `latest_story_at` | Whether a 24-hour story is live, and when it was posted |
| `highlight_count`, `highlights[]` | Every highlight: id, title, link, cover image |
| `is_private`, `is_verified`, `follower_count` | Account details |

The dataset has three views: **Highlight items**, **Profiles** and **All fields**.

## ⚙️ How to use Instagram Story Downloader

1. Add one or more **profiles**: `nasa`, `@nasa` or `https://www.instagram.com/nasa/`
2. Optionally add **highlight links** to download specific highlights only
3. Keep **Save files permanently** on to get MP4/JPG files, or turn it off for data + Instagram links only
4. Set **Max highlight items** to control the size (and cost) of the run, then click **Start**

### Input example

```json
{
  "profiles": ["nasa", "https://www.instagram.com/nike/"],
  "highlightUrls": ["https://www.instagram.com/stories/highlights/18195781759377100/"],
  "downloadMedia": true,
  "maxItems": 100,
  "maxHighlightsPerProfile": 0
}
```

| Input | Description |
|---|---|
| `profiles` | Usernames, profile URLs or story links (a story link collects that profile's highlights) |
| `highlightUrls` | Highlight URLs, `highlight:<id>` or bare ids |
| `downloadMedia` | Store every file permanently (default `true`) |
| `maxItems` | Stop after this many photos/videos in the whole run; `0` = no limit (default `200`) |
| `maxHighlightsPerProfile` | Only the first N highlights of each profile; `0` = all |

## 📊 Sample output

```json
{
  "type": "highlight_item",
  "username": "nasa",
  "highlight_title": "Roman",
  "highlight_url": "https://www.instagram.com/stories/highlights/18195781759377100/",
  "position": 1,
  "item_id": "3975089864169193671",
  "media_type": "video",
  "taken_at": "2026-08-30T11:00:53.000Z",
  "video_duration_seconds": 26.8,
  "file": {
    "url": "https://api.apify.com/v2/key-value-stores/…/records/video-nasa_18195781759377100_3975089864169193671.mp4?signature=…",
    "download_url": "https://api.apify.com/v2/key-value-stores/…/records/video-nasa_…mp4?signature=…&attachment=true",
    "file_name": "video-nasa_18195781759377100_3975089864169193671.mp4",
    "size_bytes": 912066,
    "content_type": "video/mp4"
  },
  "video_url": "https://instagram.fna.fbcdn.net/…mp4?…",
  "image_url": "https://instagram.fna.fbcdn.net/…jpg?…",
  "link_urls": ["https://go.nasa.gov/…"]
}
```

```json
{
  "type": "profile",
  "username": "nasa",
  "full_name": "NASA",
  "has_active_story": true,
  "latest_story_at": "2026-10-09T15:57:24.000Z",
  "highlight_count": 5,
  "highlights": [{ "highlight_id": "18195781759377100", "title": "Roman", "url": "https://www.instagram.com/stories/highlights/18195781759377100/" }]
}
```

## 💰 Pricing

Pay per result. You are only charged for what is delivered to your dataset, never for a failed
lookup, a duplicate or anything not delivered.

| Event | Entry plan | Bronze | Silver | Gold+ |
|---|---|---|---|---|
| **Highlight item** (one photo or video) | $1.80 / 1,000 | $1.50 / 1,000 | $1.30 / 1,000 | $1.10 / 1,000 |
| **Profile scanned** (highlight list + live-story check) | $1.50 / 1,000 | $1.30 / 1,000 | $1.10 / 1,000 | $1.00 / 1,000 |

### Stored files are billed by the Universal File Downloader

With **Save files permanently** on, files are stored by
[Universal File Downloader](https://apify.com/dz_omar/universal-downloader?fpr=smcx63), which runs on your
own Apify account and bills its own **File downloaded** event ($9.00 / 1,000 files on the entry plan,
$6.00 Bronze, $5.00 Silver, $4.00 Gold+) plus a few seconds of platform usage. You can see each download
run in your Apify Console. Turn the option off to pay only the events above.

**Your Max cost per run covers both.** When you set a spending limit, the Actor sizes the run so that its
own charges plus the file-storage charges stay within it.

Example: NASA's 5 highlights (89 photos and videos) on the entry plan cost about $0.16 as data only, or
about $0.96 with every file stored permanently.

## ❓ FAQ

**Do I need an Instagram account or cookies?**
No. The Actor reads only what Instagram shows publicly, with no login.

**Can it download 24-hour stories?**
Not in this version: Instagram only shows them to signed-in viewers. Every profile row tells you whether a
story is live right now (`has_active_story`, `latest_story_at`). Downloading live 24-hour stories is on the
roadmap below.

**What about private accounts?**
Only public content is supported. A private profile returns its profile row with `is_private: true` and no
highlight items.

**How long are stored files kept?**
Files live in your Apify storage and follow your plan's data-retention period. Download them or copy them
to your own storage for long-term archiving. Instagram's own `video_url` / `image_url` links expire after
a few days.

**Can I monitor accounts on a schedule?**
Yes. Create a task with your profiles and schedule it. Each run's profile rows show which accounts have a
live story at that moment.

**Why did a highlight return fewer items than I see on Instagram?**
Check `maxItems` and `maxHighlightsPerProfile`. Instagram can also hide items that are age-restricted or
region-locked from public viewers.

## 🗺️ Coming soon

- **24-hour stories**: download live stories (photos, videos, stickers) from public profiles
- **Only-new mode**: on scheduled runs, return only items not delivered before
- **Story URL input**: download a single live story from its link

Have a feature request? Email [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com).

## 🔗 Related Actors

- [Instagram Reel Comment Scraper](https://apify.com/dz_omar/instagram-comment-scraper?fpr=smcx63): comments from public Reels and posts
- [Universal File Downloader](https://apify.com/dz_omar/universal-downloader?fpr=smcx63): store any file from a URL

## Support

- 🌐 **Website:** [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email:** [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 💬 **GitHub:** [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn:** [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X (Twitter):** [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook:** [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok:** [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

- **Public data only** — processes publicly available data.
- **Rate limiting** — respects source-service limits and terms of use.
- **Data protection** — no storage of personal information or unauthorized data collection.
- **Commercial use** — suitable for business intelligence and research.
- No affiliation with or endorsement by Instagram or Meta is implied.

---

*Instagram Story Downloader — by FlowExtract API. Turn any website into structured data.*
