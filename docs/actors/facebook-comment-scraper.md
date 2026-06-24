# 💬 Facebook Comment Scraper  Extract Comments from Any Facebook Post

**[Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63)** extracts comments and threaded replies from any public Facebook content  reels, videos, photos, text posts, group posts, and page posts. Just provide your URLs and run. No setup, no login, no browser extensions needed for public content.

For private or restricted posts, you can optionally provide browser cookies to access content that requires authentication.

Perfect for **social media researchers**, **community managers**, and **marketers** who need Facebook comment data without manually scrolling through thousands of posts.

<!-- Paste your raw YouTube demo URL here  Apify auto-renders it as an embedded player -->
https://www.youtube.com/watch?v=YOUR_VIDEO_ID

---

## Supported Facebook content types

| Content type | Example URL | Status |
|---|---|---|
| **Reels** | `https://www.facebook.com/reel/123456789` | ✅ Supported |
| **Videos** | `https://www.facebook.com/watch/?v=123456789` | ✅ Supported |
| **Photos** | `https://www.facebook.com/photo?fbid=123456789` | ✅ Supported |
| **Photo albums** | `https://www.facebook.com/photo/?fbid=123&set=a.456` | ✅ Supported |
| **Page posts** | `https://www.facebook.com/page/posts/pfbid0Bb...` | ✅ Supported |
| **Group posts** | `https://www.facebook.com/groups/.../posts/123456789` | ✅ Supported |
| **Permalink posts** | `https://www.facebook.com/permalink.php?story_fbid=123` | ✅ Supported |
| **Share links** | `https://www.facebook.com/share/...` | ✅ Supported |

---

## Why scrape Facebook comments?

Facebook is one of the largest social networks in the world, with billions of posts generating millions of comments daily. Whether you're tracking brand sentiment, researching audience reactions, or building moderation tools, comment data is invaluable  but Facebook provides no official API for bulk comment extraction.

Common use cases:

- **Sentiment analysis**  feed comments into NLP models to measure reactions to a product, campaign, or event.
- **Content moderation**  identify toxic, spammy, or policy-violating comments at scale across multiple posts.
- **Competitive research**  monitor comments on competitor posts to understand audience pain points and opportunities.
- **Community management**  export all comments from your brand's posts, reels, photos, or videos for reporting and response tracking.
- **Academic research**  study public discourse, language patterns, or viral content dynamics on Facebook.
- **Lead generation**  identify engaged users in niche communities who comment on relevant posts.

---

## What data does it extract?

### 💬 Comment Data
- Comment ID  Facebook's unique identifier
- Comment text  full body of the comment
- Created at  ISO 8601 timestamp
- Comment URL  direct link to the comment on Facebook
- Parent ID  ID of the parent comment (for replies; `null` for top-level comments)
- Total reactions  combined count across all reaction types
- Reactions breakdown  per-type counts (Like, Love, Haha, Wow, Sad, Angry, Care)
- Reply count  number of direct replies
- Attachments  photos, stickers, or media attached to the comment
- Badges  special badges on the commenter's profile (e.g. "Top fan", "Rising fan")

### 👤 Author Data
- Author ID, name, profile URL, and profile picture URL
- Gender, verification status, and work info (when available)

### 🔗 Source Metadata
- Source URL  the full URL of the scraped content
- Source ID  Facebook content identifier
- Source type  `reel`, `video`, `photo`, `post`, or `unknown`

### 🌐 Language & Run Metadata
- Source language  detected language of the comment (e.g. `en_XX`)
- Translation type  whether the text is original or auto-translated
- Scraped at  ISO 8601 timestamp of when the record was collected

---

## ⚙️ How to use Facebook Comment Scraper

### Input Options

#### `urls` (Array  required)

List of Facebook URLs to scrape comments from. You can mix different content types in the same run.

```json
{
    "urls":[
        {
            "url": "https://www.facebook.com/photo?fbid=1450353236655661"
        },
        {
            "url": "https://www.facebook.com/humansofnewyork/posts/pfbid0BbKbkisExKGSKuhee9a7i86RwRuMKFC8NSkKStB7CsM3uXJuAAfZLrkcJMXxhH4Yl"
        },
        {
            "url": "https://www.facebook.com/reel/1312736054237897"
        },
        {
            "url": "https://www.facebook.com/watch?v=1673231300789929"
        }
    ]
}
```

#### `commentsIntentToken` (String  optional)

Controls how Facebook orders the comments returned. Mirrors the sort options in the Facebook UI.

| Value | Label | Description |
|---|---|---|
| `RANKED_FILTERED_INTENT_V1` | ⭐ Most Relevant *(default)* | Friends' comments and most-engaged comments first |
| `REVERSE_CHRONOLOGICAL_UNFILTERED_INTENT_V1` | 🕒 Newest | All comments sorted chronologically, newest first |
| `RANKED_UNFILTERED_CHRONOLOGICAL_REPLIES_INTENT_V1` | 💬 All Comments | All comments including lower-engagement ones |

> 💡 **Tip:** Use **Most Relevant** for engagement analysis. Use **Newest** for real-time monitoring. Use **All Comments** for the most complete dataset with no filtering.

---

#### `fetchReplies` (Boolean  optional)

Controls whether the actor fetches threaded replies for each comment.

- **Default**: `false`  only top-level comments are collected
- **`true`**  fetches direct replies and nested sub-replies for every comment, including full pagination through all reply pages

```json
{
    "urls": [{ "url": "https://www.facebook.com/photo?fbid=1450353236655661" }],
    "fetchReplies": true
}
```

> 💡 **How limits interact with replies:** `maxCommentsPerUrl` controls how many **top-level comments** are collected. Replies are always fetched for all collected top-level comments regardless of that limit. For example, `maxCommentsPerUrl: 10` with `fetchReplies: true` gives you 10 top-level comments plus all their replies and sub-replies.

> ⚠️ Enabling reply fetching significantly increases request count and run time, especially on posts with deep reply threads.

---

#### `maxCommentsPerUrl` (Integer  optional)

- **Default**: `10`
- Set to `0` or ` ` for unlimited  fetches all available top-level comments
- This limit applies to **top-level comments only**. Replies are fetched separately when `fetchReplies` is enabled and are not counted toward this limit.
- The actor stops paginating for new top-level comments as soon as this limit is reached.

```json
{
    "urls": [{ "url": "https://www.facebook.com/photo?fbid=1450353236655661" }],
    "maxCommentsPerUrl": 500,
    "fetchReplies": true
}
```

---

#### `customCookies` (Array  optional)

**Not required for public content.** The actor handles public posts, reels, photos, and videos without any cookies.

If you need to scrape comments from **private groups** or **login-restricted content**, provide a JSON array of browser cookie objects exported from your Facebook session.

```json
{
    "customCookies": [
        { "name": "c_user", "value": "100073931291073" },
        { "name": "xs",     "value": "29%3AKUx..." },
        { "name": "datr",   "value": "abc123xyz" }
    ]
}
```

#### How to export cookies (only needed for private content)

1. Install the [Copy Cookies](https://chromewebstore.google.com/detail/copy-cookies/jcbpglbplpblnagieiknmmkiamekcdg) Chrome extension
2. Log in to `facebook.com` in your browser
3. Click the extension icon → **Copy as JSON**
4. Paste the result into the `customCookies` field

Alternatively, use [Cookie-Editor](https://cookie-editor.com/): open it on `facebook.com`, click **Export → Export as JSON**, and paste the result.

### 🔒 Cookie Security & Encryption

If you do provide cookies, they are protected by the Apify platform:

- **Encrypted at rest** using AES-256-GCM with a 2048-bit RSA key unique to your user and this Actor
- **Decrypted only inside the Actor**  no other Actor or user can access them
- **Never logged** or exposed in the Apify Console UI
- **Isolated per user and Actor** for complete separation

> ⚠️ **Security**: Cookies from a logged-in session grant access to your Facebook account. Use a dedicated account for scraping if you are concerned about account security.

---

## 📊 Sample Output

Each dataset item represents a single comment or reply. Replies are distinguished by a non-null `parent_id` field.

```json
{
    "source": {
        "id": "4364570517119853",
        "url": "https://www.facebook.com/reel/4364570517119853",
        "type": "reel"
    },
    "comment": {
        "id": "892296663703975",
        "parent_id": null,
        "author": {
            "id": "100004647828036",
            "name": "Sadeer Ayad",
            "profile_picture": "https://scontent.ftlm1-1.fna.fbcdn.net/v/...",
            "url": "https://www.facebook.com/sadeer.ayad.553481",
            "gender": "FEMALE",
            "is_verified": null,
            "work_info": null
        },
        "text": "Don't you dare to move when you hear the music 😂",
        "created_at": "2026-03-11T00:57:18.000Z",
        "created_time_unix": 1773190638,
        "url": "https://www.facebook.com/reel/4364570517119853/?comment_id=892296663703975",
        "total_reactions": 1600,
        "reactions": {
            "Like": 1105,
            "Haha": 553,
            "Love": 4,
            "Sad": 1
        },
        "like_count": 1600,
        "reply_count": 4,
        "attachments": [],
        "badges": [],
        "source_language": "en_XX",
        "translation_type": "ORIGINAL"
    },
    "scraped_at": "2026-03-14T10:42:52.848Z"
}
```

### Reply example

Replies have a non-null `parent_id` pointing to their parent comment:

```json
{
    "source": {
        "id": "4364570517119853",
        "url": "https://www.facebook.com/reel/4364570517119853",
        "type": "reel"
    },
    "comment": {
        "id": "942208778497508",
        "parent_id": "892296663703975",
        "author": {
            "id": "61580896441183",
            "name": "James W. Mohan",
            "profile_picture": "https://scontent.ftlm1-1.fna.fbcdn.net/v/...",
            "url": "https://www.facebook.com/profile.php?id=61580896441183",
            "gender": "MALE",
            "is_verified": null,
            "work_info": null
        },
        "text": "Sadeer Ayad or breathe",
        "created_at": "2026-03-11T01:11:04.000Z",
        "created_time_unix": 1773191464,
        "url": "https://www.facebook.com/reel/4364570517119853/?comment_id=892296663703975&reply_comment_id=942208778497508",
        "total_reactions": 51,
        "reactions": {
            "Haha": 41,
            "Like": 10
        },
        "like_count": 51,
        "reply_count": 3,
        "source_language": "en_XX",
        "translation_type": "ORIGINAL"
    },
    "scraped_at": "2026-03-14T10:42:57.056Z"
}
```

---

## ❓ Frequently Asked Questions

**Do I need a Facebook account to use this actor?**
No  not for public content. Just provide your URLs and run. For private group posts or login-restricted content, you'll need to provide browser cookies from a logged-in session.

**What types of Facebook content can I scrape comments from?**
Got it — just the updated paragraph text, no file editing needed:

---

**What types of Facebook content can I scrape comments from?**

Reels, videos, photos, photo albums, page posts (including `pfbid` URLs), group posts, permalink posts, and share links (`/share/p/`, `/share/v/`, `/share/r/`) — basically any Facebook content that has a comment section.

If your URL format isn't working, [open an issue on the actor page](https://console.apify.com/actors/K5EXlxalV2BCYfgKM/issues) and we'll look into adding support for it.

**How many comments can I extract for free?**
Apify gives new users $5 in free credit. Based on typical compute usage, you can expect to extract roughly 10,000–200,000 comments within that budget, depending on post size and number of URLs.

**Can I scrape multiple URLs in one run?**
Yes  add as many URLs as you need to the `urls` array, and you can mix different content types (reels, photos, posts, etc.) in the same run. The actor processes them sequentially, saving state after each URL.

**Does the actor fetch replies to comments?**
Yes, when `fetchReplies` is set to `true`. It fetches direct replies and nested sub-replies with full pagination through all reply pages. Each reply is returned as a separate dataset item with a `parent_id` referencing its parent comment.

**How does `maxCommentsPerUrl` interact with replies?**
`maxCommentsPerUrl` limits **top-level comments only**. When `fetchReplies` is enabled, all replies for the collected top-level comments are fetched regardless of the limit. For example, setting `maxCommentsPerUrl: 10` with `fetchReplies: true` gives you 10 top-level comments plus all their replies.

**What happens if the run crashes mid-way?**
The actor saves its progress after every successfully scraped URL. If it's interrupted (crash, migration, abort), it resumes from the next unprocessed URL when re-run  no duplicate data.

**Why am I getting empty results?**
Make sure the post is public. If the content is private, provide browser cookies from an account that can access it. If the problem persists, try running again  or opening an **[Issue](https://console.apify.com/actors/K5EXlxalV2BCYfgKM/issues)**

**What is the difference between the sort modes?**
`Most Relevant` (default) mirrors Facebook's default feed  it prioritises friends' comments and highly-reacted comments. `Newest` returns all comments in reverse chronological order, ideal for monitoring fresh reactions. `All Comments` includes lower-engagement comments that Facebook normally filters out, giving the most complete dataset.

**Can I use this for private groups?**
Yes, but you must provide cookies from an account that is a member of that group via the `customCookies` input field.

---

## 🔄 Resumability

The actor saves state after every successfully processed URL. If it crashes, gets migrated, or is manually aborted, it resumes exactly where it left off on the next run  no duplicate pushes, no lost progress.

| Trigger | What gets saved |
|---|---|
| After each URL completes | `processedIds` list + `currentIndex` |
| Apify `migrating` event | Full state snapshot |
| End of run | State cleared (clean slate for next run) |

---

## 🚫 Error Handling

| Situation | What you see in logs | What to do |
|---|---|---|
| No session established | `No valid session` | Try running again; if it persists, provide cookies manually |
| Facebook returns empty response | `Could not parse comments from root query response` | Check the post is public; try again in a few minutes |
| Post has 0 comments | `Total comments reported by Facebook: 0` | Expected  no data to collect |
| Private content without cookies | `Could not extract feedbackId` | Provide cookies from an account that can access the content |

---

## 🤝 Support & Resources

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

---

## 🌟 Related Actors by FlowExtract API

### 🎬 Video & Media
- **[YouTube Transcript Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)** - Extract transcripts with timestamps
- **[YouTube Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)** - Complete channel and playlist extraction
- **[Zoom Scraper](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)** - Download recordings and transcripts
- **[Loom Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)** - Loom video and transcript extraction

### 🏠 Real Estate
- **[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)** - Spanish property data with API
- **[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)** - Real estate listings extractor

### 🛠️ Developer Tools
- **[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)** - Fast webpage screenshots
- **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)** - Advanced screenshot tool
- **[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)** - Security vulnerability scanner

### 📱 Social Media
- **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)** - Extract Facebook ads data

---

### **⚖️ Legal & Compliance**
- **Public Data Access**: Only processes publicly available Facebook data
- **Rate Limiting**: Respects Facebook's service limits and terms of use
- **Data Protection**: No storage of personal information or unauthorized data collection
- **Commercial Use**: Suitable for business intelligence and research applications