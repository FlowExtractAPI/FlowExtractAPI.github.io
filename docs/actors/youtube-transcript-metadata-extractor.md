# 🎬 YouTube Transcript & Metadata Extractor

**Extract YouTube transcripts, subtitles, and complete video metadata in seconds - no manual work, no copy-paste, just pure automated data extraction.**

[![🧾 YouTube Extractor (Transcripts + Metadata)](https://apify.com/actor-badge?actor=dz_omar/youtube-transcript-metadata-extractor)](https://apify.com/dz_omar/youtube-transcript-metadata-extractor)

[ 📺Watch Demo](https://www.youtube.com/watch?v=JXLpqucII8k)


---

## Extract transcripts from any YouTube video in 3 clicks

Paste URL → Click Start → Download data. **That's it.**

---

## Why 1,000+ marketers, researchers, and developers choose this tool

| What You Get | Why It Matters |
|-------------|----------------|
| ⚡ **5-second extraction** | Process 100 videos while your coffee brews |
| 🎯 **100% accurate transcripts** | Official YouTube data, not AI guesses |
| 📊 **Complete metadata** | Views, likes, channel info, thumbnails - everything |
| 💰 **Free tier available** | Test with 10 videos before paying anything |
| 🔄 **Never extract twice** | Smart caching saves time and money |
| 📥 **Export anywhere** | JSON, CSV, Excel, or direct API integration |

---

## How It Works

### Step 1: Paste Your URLs
```json
{
  "youtubeUrl": [
    { "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ]
}
```

### Step 2: Configure (Optional)
- **Clean transcript**: Remove "um", "uh", filler words
- **Include timestamps**: Get second-by-second text timing
- **Extract comments**: Pull top comments with replies (NEW!)

### Step 3: Get Your Data
```json
{
  "videoId": "dQw4w9WgXcQ",
  "Video_title": "Rick Astley - Never Gonna Give You Up",
  "Views": "1,234,567,890 views",
  "transcriptText": "We're no strangers to love...",
  "channel": {
    "name": "Rick Astley",
    "subscribers": "3.2M subscribers"
  }
}
```

## What You Can Do With This Data

### 📝 Content Creators & Marketers
- **Repurpose videos into blogs** - Extract transcript, feed to AI, generate 5 articles
- **Create social media posts** - Pull key quotes and timestamps
- **Generate SEO-optimized content** - Turn video content into searchable text
- **Subtitle generation** - Export timestamps for perfect captions

**Real example:** Marketing agency extracts 100 competitor videos weekly, identifies trending topics, creates counter-content. **Result:** 40% traffic increase in 3 months.

### 🔬 Researchers & Academics
- **Analyze lecture content at scale** - Process entire course catalogs
- **Study speaking patterns** - Extract timestamps for linguistic analysis
- **Sentiment analysis** - Feed transcripts into NLP models
- **Citation extraction** - Find and verify sources mentioned in videos

**Real example:** PhD student analyzed 500 TED Talks in 2 days instead of 6 months, discovered key patterns in successful presentations.

### 🤖 Developers & AI Teams
- **Train chatbots** - Use video transcripts as training data
- **Build recommendation engines** - Analyze content similarity
- **Automated workflows** - Trigger actions based on new videos
- **Knowledge base creation** - Convert video libraries into searchable databases

**Real example:** SaaS company built AI support bot using 1,000 tutorial video transcripts. **Result:** 60% reduction in support tickets.

### 📊 Business Intelligence
- **Competitor monitoring** - Track what competitors are saying
- **Brand sentiment tracking** - Analyze mentions across video content
- **Market research** - Extract insights from industry thought leaders
- **Product feedback analysis** - Process customer testimonial videos

**Real example:** E-commerce brand analyzes 200 review videos monthly, identifies pain points, improves product design. **Result:** 25% reduction in returns.

---

## Complete Feature List

### Core Extraction
- ✅ Full video transcripts with cleaned text
- ✅ Precise second-by-second timestamps
- ✅ Video metadata (title, views, likes, date)
- ✅ Channel information (name, subscribers, verification)
- ✅ Thumbnail URLs (multiple resolutions)
- ✅ Video descriptions and tags
- ✅ Duration and word count analytics

### Smart Processing
- ✅ **3 cleaning levels**: None (raw), Mild (remove "um"/"uh"), Aggressive (conversational cleanup)
- ✅ **Automatic deduplication**: Never process the same video twice
- ✅ **Batch processing**: Handle 1 to 1000+ videos
- ✅ **Error recovery**: Auto-retry on temporary failures
- ✅ **Multiple formats**: All YouTube URL types (standard, shorts, live, youtu.be)

### NEW: Comment Extraction
- ✅ Top comments with like counts
- ✅ Comment replies (configurable depth)
- ✅ Sort by "top" or "newest"
- ✅ Real-time streaming extraction
- ✅ Automatic resumption if interrupted

### Export & Integration
- ✅ JSON, CSV, Excel download
- ✅ Direct API access
- ✅ Webhook integration
- ✅ Pre-configured data views
- ✅ Apify platform integration

---

## Input Configuration

### Basic Example (Just Transcripts)
```json
{
  "youtubeUrl": [
    { "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
  ],
  "transcriptOnly": true,
  "cleaningLevel": "mild"
}
```

### Advanced Example (With Comments)
```json
{
  "youtubeUrl": [
    { "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
  ],
  "cleaningLevel": "aggressive",
  "includeTimestamps": true,
  "extractcomments": true,
  "sortBy": "top",
  "maxComments": 50,
  "maxRepliesPerComment": 5
}
```

### All Parameters

**Extraction**

| Parameter | Type | Default | What It Does |
|-----------|------|---------|-------------|
| `youtubeUrl` | array | **Required** | List of YouTube video URLs (any format) |
| `transcriptOnly` | boolean | `false` | Skip metadata and return only the transcript. Faster and cheaper when you just need the words |
| `cleaningLevel` | string | `"mild"` | `"none"` (verbatim), `"mild"` (remove uh/um), `"aggressive"` (also remove conversational fluff) |
| `includeTimestamps` | boolean | `true` | Include the per-segment timestamp array. Turn off for a smaller result — word count and duration are still returned |

**Comments** (optional)

| Parameter | Type | Default | What It Does |
|-----------|------|---------|-------------|
| `extractcomments` | boolean | `false` | Enable comment extraction (adds 10-40s per video) |
| `sortBy` | string | `"top"` | Comment sort: `"top"` (most relevant) or `"newest"` (chronological) |
| `maxComments` | integer | `10` | Max top-level comments (10-100,000) |
| `maxRepliesPerComment` | integer | `0` | Max replies per comment. `0` = no replies (10x faster) |

**Run control**

| Parameter | Type | Default | What It Does |
|-----------|------|---------|-------------|
| `useCache` | boolean | `true` | Remember delivered videos so a restarted run resumes instead of re-processing — and re-charging — them |
| `maxConcurrency` | integer | `10` | How many videos to process in parallel. Lower it if you hit rate limits |
| `batchPushSize` | integer | `10` | How many videos are processed before results are delivered. Smaller batches surface results sooner |

**💡 Pro tip:** Start with `maxRepliesPerComment: 0` for 10x faster extraction if you don't need reply threads.

---

## Output Structure

### What You Get for Every Video

```json
{
  "videoId": "kOO31qFmi9A",
  "VideoURL": "https://youtu.be/kOO31qFmi9A",
  "embedUrl": "https://www.youtube.com/embed/kOO31qFmi9A",
  "Video_title": "Introduction to Microsoft Excel 1990 with Jan Brehm",
  "published_Date": "Mar 29, 2013",
  "Views": "9,838,429 views",
  "likes": "180K",

  "channel": {
    "name": "Jan Brehm",
    "id": "UC_i2UaK1pico7jU0pqZR8fg",
    "url": "https://www.youtube.com/channel/UC_i2UaK1pico7jU0pqZR8fg",
    "subscribers": "9.12K subscribers",
    "verified": false
  },

  "thumbnail": "https://i.ytimg.com/vi/kOO31qFmi9A/default.jpg",
  "Description": "Microsoft Excel Video with Jan Brehm...",

  "hasTranscript": true,
  "transcriptAvailability": { "available": true, "reason": "Available" },
  "transcriptText": "Hey. Hey, Craig buddy. I just saw Wilson. You're showing her the projections for the new vacation package...",

  "timestamps": [
    { "time": "0:01", "text": "[Music]" },
    { "time": "0:04", "text": "Hey. Hey, Craig buddy. I just saw" },
    { "time": "0:07", "text": "Wilson. You're showing her the" }
  ],

  "transcriptWordCount": 481,
  "transcriptDuration": "3:49",

  "charged": true,
  "_source": "youtube_transcript_metadata_extractor",
  "source_url": "https://youtu.be/kOO31qFmi9A"
}
```

**A few fields worth knowing:**

| Field | Why it's there |
|-------|----------------|
| `transcriptAvailability.reason` | When a video has no transcript you get the reason — captions disabled, video unavailable, and so on — instead of an empty field with no explanation |
| `transcriptWordCount` / `transcriptDuration` | Always returned, even with `includeTimestamps: false` |
| `charged` | Whether this row was billed. **Videos without a transcript are delivered free** — you still get the full metadata, at no cost, with `chargeSkipReason` explaining why |
| `_source` / `source_url` | Provenance, so rows stay traceable after you merge datasets |

In `transcriptOnly` mode you get `videoId`, `VideoURL`, `hasTranscript`, `transcriptAvailability`, `transcriptText`, `timestamps` and the two transcript stats — the metadata fields are skipped.

### With Comments Enabled

```json
{
  "videoId": "dQw4w9WgXcQ",
  "Video_title": "Never Gonna Give You Up",
  "transcriptText": "We're no strangers to love...",
  
  "commentsExtracted": true,
  "commentCount": 50,
  "comments": [
    {
      "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
      "authorName": "@musiclover2024",
      "text": "Still the best song after all these years!",
      "likeCount": "1,543",
      "replyCount": 12,
      "publishedTime": "2 days ago",
      "replies": [
        {
          "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg.9kF7...",
          "authorName": "@throwback90s",
          "text": "Facts! Never gets old.",
          "likeCount": "234",
          "publishedTime": "1 day ago"
        }
      ]
    }
  ]
}
```

## Pricing & Performance

### What You Pay

Two events, and **you only pay for videos that come back with a transcript**:

| Event | Free | Bronze | Silver | Gold |
|-------|------|--------|--------|------|
| **Video with transcript** (per video) | $0.015 | $0.010 | $0.009 | $0.008 |
| **Actor start** (once per run) | $0.009 | $0.0005 | $0.0005 | $0.0005 |

**Example — 100 videos on Bronze:** $0.0005 start + 100 × $0.010 = **$1.0005**

A video whose captions are disabled still returns its full metadata, and is **not charged**.

### Speed

| | Typical |
|---|---------|
| Transcript only | 3-6 seconds per video |
| Full metadata + transcript | 5-12 seconds per video |
| Videos in parallel | 10 by default, tunable via `maxConcurrency` |

Runs are resumable: if a run is interrupted and restarted, `useCache` skips videos already delivered so you are never charged twice for the same video.

### Comment Extraction (Optional Add-on)
Comments are gathered through [YouTube Comments Scraper](https://apify.com/dz_omar/youtube-comments-scraper?fpr=smcx63), which bills separately for parent comments and replies at its own published rates.

**Speed impact:**
- Without replies: +5-10 seconds per video
- With replies (10 per comment): +20-40 seconds per video

💡 **Cost optimization tip:** Set `maxRepliesPerComment: 0` if you don't need reply threads - you'll get 10x faster extraction and cut comment costs sharply.

---

## Supported YouTube URL Formats

We handle ALL YouTube URL types:

✅ `https://www.youtube.com/watch?v=VIDEO_ID`  
✅ `https://youtu.be/VIDEO_ID`  
✅ `https://www.youtube.com/shorts/VIDEO_ID`  
✅ `https://www.youtube.com/live/VIDEO_ID`  
✅ `https://youtube.com/watch?v=VIDEO_ID` (no www)  
✅ `https://m.youtube.com/watch?v=VIDEO_ID` (mobile)

Just paste any YouTube link - we'll figure it out.

---

## Pre-Configured Data Views

Save time with our built-in export templates:

### 1. 📊 Full Video Metadata, Transcripts & Comments
**Everything** - Complete metadata, transcripts, timestamps, comments  
**Use for:** Comprehensive analysis, data warehousing

### 2. 🎤 Pure Transcript Results
**Focus:** Transcript text, timestamps, word count, duration, availability reason  
**Use for:** Content repurposing, subtitle generation

### 3. 💬 Comments Only
**Focus:** Comment threads, counts, and any per-video comment error  
**Use for:** Audience sentiment, community research

### 4. 📺 Channels Overview
**Focus:** Channel name, ID, URL, subscribers, verification  
**Use for:** Influencer research, competitor analysis

---

## Quick Start Examples

### Use Case 1: Content Repurposing
**Goal:** Turn video into blog post

```javascript
// 1. Extract transcript
const input = {
  youtubeUrl: [{ url: "YOUR_VIDEO_URL" }],
  cleaningLevel: "aggressive",
  includeTimestamps: false
};

// 2. Run actor
// 3. Get output: feed transcriptText to ChatGPT/Claude
// 4. Generate 5 blog posts in 2 minutes
```

### Use Case 2: Competitor Analysis
**Goal:** Analyze 100 competitor videos

```javascript
const input = {
  youtubeUrl: [
    { url: "competitor_video_1" },
    { url: "competitor_video_2" },
    // ... paste 100 URLs
  ],
  cleaningLevel: "mild",
  extractcomments: true,
  maxComments: 20
};

// Export to Excel → Analyze trends → Find content gaps
```

### Use Case 3: AI Training Data
**Goal:** Build chatbot training dataset

```javascript
const input = {
  youtubeUrl: YOUR_PLAYLIST_URLS, // from our Playlist Extractor
  cleaningLevel: "none", // keep raw data for AI
  includeTimestamps: true
};

// Process 1000 videos → Clean dataset → Train model
```

---

## Integration Examples

### JavaScript/Node.js
```javascript
const ApifyClient = require('apify-client');

const client = new ApifyClient({ token: 'YOUR_API_TOKEN' });

const input = {
  youtubeUrl: [
    { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
  ],
  cleaningLevel: "mild"
};

const run = await client.actor("dz_omar/youtube-transcript-metadata-extractor").call(input);
const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(items[0].transcriptText);
```

### Python
```python
from apify_client import ApifyClient

client = ApifyClient('YOUR_API_TOKEN')

run_input = {
    "youtubeUrl": [
        { "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ],
    "cleaningLevel": "mild"
}

run = client.actor("dz_omar/youtube-transcript-metadata-extractor").call(run_input=run_input)

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item['transcriptText'])
```

### cURL (Direct API)
```bash
curl -X POST https://api.apify.com/v2/acts/dz_omar~youtube-transcript-metadata-extractor/runs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "youtubeUrl": [
      { "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
    ]
  }'
```

[**→ View full API documentation**](https://docs.apify.com/api/v2)

---

## Frequently Asked Questions

<details>
<summary><b>❓ What if a video doesn't have a transcript?</b></summary>

The actor will return `"hasTranscript": false` and still provide all other metadata (title, views, channel info, etc.). YouTube auto-generates transcripts for most videos, but some may not have them available.

</details>

<details>
<summary><b>❓ Can I extract from private or age-restricted videos?</b></summary>

No. This actor only works with publicly available videos. Private, members-only, or age-restricted content cannot be accessed.

</details>

<details>
<summary><b>❓ How accurate are the transcripts?</b></summary>

We extract the **official transcripts** provided by YouTube. Accuracy depends on whether the creator uploaded manual captions (99% accurate) or YouTube auto-generated them (85-95% accurate). We don't modify or AI-generate transcripts - you get exactly what YouTube provides.

</details>

<details>
<summary><b>❓ Can I process entire playlists or channels?</b></summary>

This actor processes individual videos. For bulk extraction, use our [YouTube Playlist Extractor](https://apify.com/dz_omar/youtube-playlist-extractor) to get all video URLs, then feed them to this actor.

</details>

<details>
<summary><b>❓ What's the difference between cleaning levels?</b></summary>

- **None**: Raw transcript as YouTube provides it
- **Mild**: Removes filler words ("um", "uh", "you know")
- **Aggressive**: Removes filler words + conversational redundancy ("so basically", "I mean", etc.)

Most users choose "mild" for the best balance.

</details>

<details>
<summary><b>❓ Do I need comments? Should I enable replies?</b></summary>

**Enable comments if:** You need engagement insights, sentiment analysis, or customer feedback.

**Enable replies if:** You need full conversation threads. Warning: Replies significantly increase runtime and cost.

**Fastest option:** `extractcomments: false` - just transcripts in 5-10 seconds.

</details>

<details>
<summary><b>❓ Is this legal? Will I get in trouble?</b></summary>

This actor extracts **publicly available data** that anyone can see on YouTube. It's equivalent to manually copying text. However:

- ✅ Extracting public transcripts: Generally okay
- ✅ Using for research, analysis, personal use: Generally okay
- ⚠️ Republishing copyrighted content: Check copyright laws
- ⚠️ Commercial use at scale: Review YouTube's Terms of Service

**We are not lawyers.** Consult legal counsel for your specific use case.

</details>

<details>
<summary><b>❓ Why did my run fail?</b></summary>

Common reasons:
- Video is private, deleted, or age-restricted
- Video has no transcript available
- Invalid URL format
- Temporary YouTube API issues (auto-retry handles this)

Check the run log for specific error messages.

</details>

<details>
<summary><b>❓ How many videos can I process at once?</b></summary>

**Technical limit:** 10,000 URLs per run  
**Recommended:** Start with 10-50 to test, then scale up  
**Performance:** Free mode handles 100 videos in ~10 minutes. Paid mode is 2x faster.

</details>

---

## Technical Details

<details>
<summary><b>🔧 For Developers: Architecture & Performance</b></summary>

### Tech Stack
- **Crawler:** CheerioCrawler (optimized for speed)
- **Language:** Node.js 20
- **Memory:** 128MB-512MB (auto-scales)
- **Storage:** Persistent caching with key-value store
- **API Format:** RESTful JSON endpoint

### Performance Specs
- **Throughput:** 500-1000 videos/hour (paid mode)
- **Latency:** 5-10s per video (free), 3-5s (paid)
- **Concurrency:** 10 parallel requests
- **Retry Logic:** 3 attempts with exponential backoff
- **Cache Hit Rate:** ~40% (typical usage)

### Comment Integration
- **Method:** Standby Mode API call to [YouTube Comments Scraper](https://apify.com/dz_omar/youtube-comments-scraper)
- **Protocol:** NDJSON streaming over HTTP
- **Resumption:** Automatic from last successful comment
- **Timeout:** 5 minutes per video (configurable)

### Data Processing
- **Transcript cleaning:** Regex + NLP tokenization
- **Timestamp parsing:** ISO 8601 → human-readable
- **Deduplication:** SHA-256 hash of video ID
- **Output format:** Minified JSON (reduce bandwidth)

### Rate Limiting
- **YouTube API:** Respects official rate limits
- **Apify Platform:** Auto-throttles to prevent blocking
- **Proxy support:** Automatic rotation (paid tier)

### Error Handling
```javascript
// Auto-retry logic
const MAX_RETRIES = 3;
const BACKOFF_MS = [1000, 3000, 9000];

try {
  await extractTranscript(videoId);
} catch (error) {
  if (retries < MAX_RETRIES) {
    await sleep(BACKOFF_MS[retries]);
    // retry...
  }
}
```

### Security
- ✅ No authentication required (public data only)
- ✅ HTTPS-only API calls
- ✅ Input sanitization (XSS prevention)
- ✅ No data retention beyond run duration

</details>

---

## Comparison: Why Choose This Actor?

| Feature | This Actor | Manual Copy-Paste | Other Tools |
|---------|------------|-------------------|-------------|
| **Speed** | 5-10 sec/video | 5-10 min/video | 30-60 sec/video |
| **Accuracy** | 100% (official data) | 100% | 70-90% (AI guessing) |
| **Batch processing** | ✅ 1000+ videos | ❌ One at a time | ⚠️ Limited (10-50) |
| **Timestamps** | ✅ Second-precise | ❌ Manual work | ⚠️ Minute-level only |
| **Metadata** | ✅ Everything | ❌ Manual scraping | ⚠️ Basic only |
| **Comments** | ✅ With replies | ❌ Screenshot only | ❌ Not available |
| **API access** | ✅ Full REST API | ❌ None | ⚠️ Limited |
| **Cost** | $0.001-0.006/video | $5-10/video (labor) | $0.10-0.50/video |
| **Setup time** | 1 minutes | N/A | 30-60 minutes |

---

## Trust & Reliability

### Platform Performance
- ✅ **Actor running smoothly** - 100% success rate
- ✅ **Regular updates** - Maintained actively

---

## Legal & Compliance

### What You Should Know

✅ **What's allowed:**
- Extracting public transcripts for personal use
- Research and academic analysis
- Business intelligence and market research
- Content repurposing with proper attribution

⚠️ **What requires caution:**
- Large-scale commercial redistribution
- Republishing copyrighted video content
- Using data in ways that violate YouTube's ToS
- Scraping private or restricted content

🔒 **Privacy & Data:**
- We only extract publicly visible data
- No authentication or login required
- No data stored beyond your run duration
- GDPR compliant (EU users)

**Disclaimer:** This tool extracts publicly available data. Users are responsible for ensuring their usage complies with YouTube's Terms of Service, copyright laws, and applicable regulations. We are not lawyers - consult legal counsel for commercial use cases.

---

## Related Tools from FlowExtract API

Build your complete YouTube data pipeline with our specialized actors:

### 🎬 Video & Content Tools

**[YouTube Playlist Extractor](https://apify.com/dz_omar/youtube-playlist-extractor?fpr=smcx63)**  
Extract all videos from playlists in seconds. Get video URLs, titles, durations. Perfect for feeding into this transcript extractor.  
→ *Use together: Playlist → Transcript Extractor = Full channel analysis*

**[YouTube Channel Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**  
Complete channel extraction: videos, shorts, live streams, playlists. Comprehensive creator analytics.  
→ *Use together: Channel Scraper → Transcript Extractor = Creator deep-dive*

**[YouTube Comments Scraper](https://apify.com/dz_omar/youtube-comments-scraper?fpr=smcx63)**  
Standalone comment extraction with advanced filtering. Perfect for sentiment analysis.  
→ *Integrated in this actor - enable with `extractcomments: true`*

### 📹 Video Platform Tools

**[Zoom Scraper | Downloader & Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**  
Extract Zoom meeting recordings and transcripts. Perfect for meeting analysis.

**[Loom Scraper | Downloader & Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**  
Download Loom videos and extract transcripts. Ideal for training content.

### 🏠 Real Estate Data

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**  
Spanish real estate listings with API access. Property data at scale.

### 🛠️ Developer Tools

**[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)** | **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**  
Webpage screenshots with custom options. Perfect for monitoring and documentation.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**  
Website security vulnerability scanning. Comprehensive security reports.

[**→ View all FlowExtract API tools**](https://apify.com/dz_omar?fpr=smcx63)

---

## Get Started Now

### Free Trial Available
No credit card required. Test with 5$ to see the quality yourself.

 [**💬 Get Support**](mailto:flowextractapi@outlook.com)

### Need Help?

**📧 Email:** [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)  
**🌐 Website:** [flowextractapi.com](https://flowextractapi.com)  
**🐦 Twitter:** [@FlowExtractAPI](https://x.com/@FlowExtractAPI)  
**💼 LinkedIn:** [flowextract-api](https://www.linkedin.com/in/flowextract-api/)

**Response time:** Within 24 hours (usually much faster)


</div>