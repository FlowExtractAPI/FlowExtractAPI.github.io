# 📷 Instagram Reel Comment Scraper — Extract Comments from Public Instagram Reels

**Instagram Reel Comment Scraper** extracts top-level comments from any public Instagram Reel — author, text, timestamp, likes. No login, no cookies, no Instagram account required.

Perfect for **social media analysts**, **brand monitoring teams**, and **researchers** who need Instagram Reel comment data without manually scrolling and copy-pasting.

---

## Why scrape Instagram Reel comments?

Instagram Reel comments are a direct read on audience sentiment, engagement quality, and what people actually say about a video — signal that likes and view counts don't capture. Common use cases:

- **Sentiment analysis**: pull comments on a product launch or campaign reel and run them through a sentiment model.
- **Competitor monitoring**: see what audiences are saying on a competitor's reels.
- **Influencer vetting**: check whether an influencer's comment section looks like real engagement.
- **Research datasets**: build a labeled dataset of public comment text for NLP work.
- **Community management**: export comments for review outside the Instagram app.

---

## What data can Instagram Reel Comment Scraper extract?

### 💬 Comment content
- `text` — the comment body
- `created_at` — Unix timestamp the comment was posted
- `like_count` — likes on the comment

### 👤 Author
- `user.username`, `user.id`, `user.is_verified`, `user.profile_pic_url`

### 🆔 Identifiers
- `id` / `pk` — the comment's unique Instagram ID
- `child_comment_count` — number of replies (replies themselves aren't fetched yet — see Limitations)

### 🔗 Source metadata
- `source_url` — the input URL this comment came from

---

## ⚙️ How to use Instagram Reel Comment Scraper

### `urls` (Array, required)

One or more public Instagram Reel URLs. Instagram links to the same reel using several different URL shapes — all of them work here.

| Input value | What it extracts |
|---|---|
| `https://www.instagram.com/reels/<shortcode>/` or `/reel/<shortcode>/` | Comments on that reel |
| `https://www.instagram.com/p/<shortcode>/` | Also works — Instagram often serves reels under `/p/` links too |
| `https://www.instagram.com/<username>/reel/<shortcode>/` | Same, with a username prefix |

```json
{
    "urls": [
        { "url": "https://www.instagram.com/reels/DTvy2W3ErPl/" }
    ]
}
```

### `maxCommentsPerUrl` (Integer)
- **Default**: `100`
- Maximum comments to collect per URL. Set to `0` to collect every available comment. The actor stops fetching as soon as this limit is reached — it never over-fetches then discards.

```json
{
    "urls": [{ "url": "https://www.instagram.com/reels/DTvy2W3ErPl/" }],
    "maxCommentsPerUrl": 0
}
```

### 🔐 Authentication

None required. Works on public reels without an Instagram login.

---

## 💰 Pricing

This actor is **free to run** — every result is priced at $0. You only pay Apify's standard platform compute cost for the run itself.

---

## 📊 Sample Output

```json
{
    "id": "18416918653194028",
    "pk": "18416918653194028",
    "text": "كفو عليك يا بطل 😍",
    "created_at": 1783110883,
    "like_count": 0,
    "child_comment_count": null,
    "parent_comment_id": null,
    "user": {
        "id": "1448110168",
        "username": "_b97j",
        "is_verified": false,
        "profile_pic_url": "https://scontent.cdninstagram.com/..."
    },
    "source_url": "https://www.instagram.com/osama.azm5/reel/DaQSQ5hR7lv/",
    "_source": "instagram_comment_scraper"
}
```

---

## ❓ Frequently Asked Questions

**Do I need an Instagram account to use this actor?**
No — only public reels are supported, and no login is required.

**Can I scrape private reels?**
No — only publicly visible reels are supported.

**Can I scrape Instagram posts, not just reels?**
This actor is built and tested for Reels — `/reel/`, `/reels/`, and `/p/` links all work, since Instagram uses all three interchangeably for reels. Comment extraction isn't restricted by content type, so a link to a non-reel post will often work too, but Reels are the only officially supported and tested case.

**Can I scrape multiple reels in one run?**
Yes — add multiple entries to `urls`. Each is processed independently; if one fails (deleted, private, invalid URL) the others still run.

**Does this fetch comment replies?**
Not yet — only top-level comments are extracted in this version.

**What happens if a URL is invalid or the reel is gone?**
That URL is skipped with a logged error; the run continues with the remaining URLs.

**How many comments can I extract for free?**
As many as you configure via `maxCommentsPerUrl` — every result is $0. Apify's own compute cost for the run still applies.

---

## ⚠️ Limitations

- **Only Reels are supported.** Posts, photos, and other Instagram content types are out of scope.
- **Replies are not extracted.** Only top-level comments are returned; `child_comment_count` tells you how many replies exist, but they aren't fetched in this version.
- **Total comment counts** are best-effort — Instagram reports a total for most reels, but it isn't guaranteed present on every run.
- **Instagram changes over time.** If a run unexpectedly starts returning zero comments, it likely means Instagram changed something on their end — please report it.

---

## ⚖️ Legal & Ethical Use

This actor extracts **publicly visible data** from Instagram — the same comments any visitor can see without logging in.

**Please use this tool responsibly:**
- Only extract data from reels you are authorized to analyze.
- Comply with [Instagram's Terms of Use](https://help.instagram.com/581066165581870) and applicable data protection regulations (GDPR, CCPA, etc.).
- Do not use extracted data for spam, harassment, or unsolicited outreach.

---

## 🌐 Proxy Support

| User tier | Proxy used |
|---|---|
| 💎 Paying (dedicated proxy configured) | Dedicated residential proxy, with automatic fallback to Apify Proxy |
| 🆓 Free | Apify Proxy (residential) |

---

## 🚫 Error Handling

| Situation | What you see | What to do |
|---|---|---|
| URL isn't a valid instagram.com media URL | Rejected before the run starts, logged as a warning | Use a `/reel/`, `/reels/`, or `/p/` URL |
| Reel is deleted, private, or geo-blocked | `URL X/Y could not be loaded — skipping` | Confirm the reel is public and still exists |
| Instagram changed something on their end | `comments could not be retrieved` | Report the issue so the actor can be updated |

---

## 🌟 Related Actors

- **[Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63)** — the same approach applied to Facebook reels, posts, photos, and videos.
