# 🎬 YouTube Playlist Extractor & Video Data Scraper

**Extract complete YouTube playlist data with all video details - fast, reliable, and built for scale.**

Get comprehensive video lists, metadata, durations, thumbnails, channel information, playlist descriptions, and update history from any public YouTube playlist. Perfect for content creators, researchers, marketers, and developers who need structured playlist data without API limitations.

[![Apify Actor](https://img.shields.io/badge/Apify-Actor-blue?logo=apify)](https://apify.com/store)
[![Latest Version](https://img.shields.io/badge/version-2.0-brightgreen)]()

---

##  Quick Start

1. **Paste your YouTube playlist URL**
2. **Click "Start"**  
3. **Download results** in JSON, CSV, or Excel

**That's it!** No API keys required, no complex setup, no coding needed.

### Try It Now
```json
{
  "playlistUrls": [
    { "url": "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID" }
  ]
}
```

---

## ✨ Key Features

### 🎯 Complete Data Extraction
- **Full Video Lists** with position numbers, titles, and URLs
- **Playlist Metadata** including title, description, total video count, and total duration
- **Playlist History** with last updated date and view count
- **Owner/Creator Info** with channel name, ID, and URL
- **Video Details** with high-quality thumbnails (multiple resolutions)
- **Channel Information** with names, IDs, and URLs for each video
- **Smart URL Handling** - Works with any YouTube playlist URL format

### ⚡ Performance & Reliability
- **Lightning Fast** - Process 100+ video playlists in seconds
- **Unlimited Videos** - Automatic pagination extracts ALL videos (no 100-video limit!)
- **Smart Metadata Caching** - Playlist descriptions and metadata cached (extracted once, reused forever)
- **Accurate Video Limiting** - `maxVideosPerPlaylist` works correctly during data output
- **Batch Processing** - Handle multiple playlists simultaneously
- **Error Recovery** - Automatic retry logic for failed requests

### 🛠️ Developer-Friendly
- **Clean JSON Output** - Structured data ready for any pipeline
- **Multiple Export Formats** - JSON, CSV, Excel, or direct API access
- **Flexible Configuration** - Control detail levels and processing options
- **RESTful API Access** - Integrate directly into your applications
- **Well-Documented** - Comprehensive examples and clear documentation

---

## 🆚 Why Use This Instead of YouTube Data API?

| Feature | This Actor | YouTube Data API |
|---------|------------|------------------|
| **API Quotas** | ✅ Unlimited | ❌ 10,000 units/day |
| **Video Limit** | ✅ Unlimited (pagination) | ❌ 50 per request |
| **Authentication** | ✅ Not required | ❌ OAuth required |
| **Setup Time** | ✅ Instant | ❌ Complex setup |
| **Batch Processing** | ✅ Multiple playlists | ❌ One at a time |
| **Playlist Description** | ✅ Full text | ⚠️ Limited |
| **Last Updated** | ✅ Included | ❌ Not available |
| **Export Formats** | ✅ JSON, CSV, Excel | ❌ JSON only |
| **Thumbnail URLs** | ✅ All resolutions | ⚠️ Limited |
| **Total Duration** | ✅ Auto-calculated | ❌ Manual calculation |
| **Cost** | ✅ $0.001 per video | ⚠️ Quota limits |

---

## 📥 Input Configuration

### Simple Input Example

```json
{
  "playlistUrls": [
    { "url": "https://www.youtube.com/playlist?list=PLD8nQCAhR3tT3ehpyOpoYeUj3KHDEVK9h" }
  ]
}
```

### Complete Input Example

```json
{
  "playlistUrls": [
    { "url": "https://www.youtube.com/playlist?list=PLAYLIST_ID_1" },
    { "url": "https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID_2&index=5" },
    { "url": "https://www.youtube.com/playlist?list=PLAYLIST_ID_3" }
  ],
  "includeVideoDetails": true,
  "maxVideosPerPlaylist": 100
}
```

### Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `playlistUrls` | `array` | **Required** | List of YouTube playlist URLs to extract |
| `includeVideoDetails` | `boolean` | `true` | Include detailed video info (thumbnails, channels, etc.) |
| `maxVideosPerPlaylist` | `integer` | `null` | Limit videos per playlist (useful for testing). Leave empty for unlimited |

### Supported URL Formats

This actor works with **any** YouTube URL containing a playlist:

- ✅ `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- ✅ `https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID`
- ✅ `https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID&index=10`
- ✅ `https://youtube.com/playlist?list=PLAYLIST_ID`

---

## 📤 Output Structure

### Flattened Data Format

Each video becomes a **separate dataset item** with complete playlist info attached. Perfect for CSV exports and database imports!

```json
{
  "position": 1,
  "videoId": "lNtw4yxEydM",
  "videoUrl": "https://www.youtube.com/watch?v=lNtw4yxEydM",
  "title": "Advanced WordPress Theme Development | Introduction",
  "duration": "5:25",
  "durationLabel": "5 minutes, 25 seconds",
  "isPlayable": true,
  "thumbnail": {
    "url": "https://i.ytimg.com/vi/lNtw4yxEydM/hqdefault.jpg",
    "width": 336,
    "height": 188,
    "allThumbnails": [...]
  },
  "channel": {
    "name": "Imran Sayed - Codeytek Academy",
    "id": "UC0SDxbLAqoKLACyEPz2wXAg",
    "url": "https://www.youtube.com/@Codeytek"
  },
  "videoInfo": "1.2M views • 3 years ago",
  "playlistInfo": {
    "playlistId": "PLD8nQCAhR3tT3ehpyOpoYeUj3KHDEVK9h",
    "playlistUrl": "https://www.youtube.com/playlist?list=PLD8nQCAhR3tT3ehpyOpoYeUj3KHDEVK9h",
    "playlistTitle": "Advanced WordPress Theme Development Course",
    "playlistDescription": "Complete course covering advanced WordPress theme development techniques...",
    "lastUpdated": "Dec 28, 2023",
    "owner": {
      "name": "Codeytek Academy",
      "id": "UC0SDxbLAqoKLACyEPz2wXAg",
      "url": "https://www.youtube.com/@Codeytek"
    },
    "viewCount": "12,310,699 views",
    "videoCount": 118,
    "totalVideosInPlaylist": 118,
    "totalDuration": "20 hours 42 minutes",
    "totalDurationMinutes": 1242
  },
  "extractedAt": "2025-10-12T12:00:00.000Z"
}
```

### Output Fields Explained

#### Video Information
- `position` - Video position in the playlist (1, 2, 3...)
- `videoId` - Unique 11-character YouTube video identifier
- `videoUrl` - Direct link to the video
- `title` - Complete video title
- `duration` - Video duration in MM:SS or HH:MM:SS format
- `durationLabel` - Human-readable duration description
- `isPlayable` - Whether the video is currently available
- `thumbnail` - Thumbnail URLs in multiple resolutions (168px to 336px)
- `videoInfo` - Views and upload date (e.g., "1.4M views • 7 years ago")

#### Channel Information
- `channel.name` - Channel display name
- `channel.id` - Unique channel identifier
- `channel.url` - Direct link to the channel

#### Playlist Context (Attached to Each Video) 🆕
- `playlistInfo.playlistId` - Unique playlist identifier
- `playlistInfo.playlistUrl` - Direct link to the playlist
- `playlistInfo.playlistTitle` - Full playlist title
- `playlistInfo.playlistDescription` - **NEW** Complete playlist description
- `playlistInfo.lastUpdated` - **NEW** Last update date (e.g., "Dec 28, 2023")
- `playlistInfo.owner` - **NEW** Playlist creator/channel info
- `playlistInfo.viewCount` - **NEW** Total playlist views
- `playlistInfo.videoCount` - Number of videos extracted
- `playlistInfo.totalVideosInPlaylist` - Actual total in playlist
- `playlistInfo.totalDuration` - Human-readable total duration
- `playlistInfo.totalDurationMinutes` - Total duration in minutes (for calculations)

#### Metadata
- `extractedAt` - ISO 8601 timestamp of when data was extracted

---

## 📊 Pre-Configured Data Views

The actor provides **three optimized views** for different use cases:

### 1. 🎬 All Videos with Playlist Info
Complete dataset with all fields - perfect for comprehensive analysis and archival.

**Best for:** Data analysis, archiving, complete records

### 2. 📋 Simple Video List
Flattened essential fields only - ideal for quick reference and spreadsheets.

**Fields:** Position, Title, Video URL, Duration, Channel Name, Playlist Title  
**Best for:** Content planning, quick scanning, sharing with teams

### 3. 🖼️ Videos with Thumbnails  
Focus on visual content with thumbnail images displayed.

**Best for:** Content curation, visual browsing, presentation materials

---

## 💡 Use Cases & Applications

### Education & Research
- **Course Planning** - Analyze educational playlists for curriculum design
- **Content Curation** - Build comprehensive learning resource libraries
- **Academic Research** - Study content organization and video structures
- **Duration Estimation** - Calculate total learning time for courses
- **Historical Tracking** - Monitor playlist updates and changes over time

### Content Creation & Marketing
- **Competitor Analysis** - Study competitor playlist strategies and organization
- **Content Gap Analysis** - Identify missing topics in your content library
- **Series Planning** - Plan video series and optimal playlist structures
- **SEO Research** - Analyze successful playlist titles and descriptions
- **Thumbnail Analysis** - Study thumbnail patterns for engagement optimization
- **Update Monitoring** - Track when competitors update their playlists

### Automation & Development
- **Database Building** - Create searchable video content databases
- **Playlist Monitoring** - Track changes in playlists over time
- **API Integration** - Feed structured data into applications and tools
- **Automated Reporting** - Generate playlist analytics and insights reports
- **Content Aggregation** - Build curated video collections from multiple sources

### Business Intelligence
- **Market Research** - Analyze industry playlists and content trends
- **Channel Analysis** - Understand how successful creators organize content
- **Engagement Patterns** - Identify optimal playlist lengths and structures
- **Content Strategy** - Make data-driven decisions about video organization
- **View Analytics** - Track total views and popularity metrics

---

## Practical Examples

### Example 1: Building a Video Course Database with Metadata

Extract educational playlists with complete metadata:

```javascript
const ApifyClient = require('apify-client');
const client = new ApifyClient({ token: 'YOUR_TOKEN' });

const run = await client.actor('dz_omar/youtube-playlist-extractor').call({
  playlistUrls: [
    { url: 'https://www.youtube.com/playlist?list=COURSE_PLAYLIST_ID' }
  ]
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

// Each item includes complete playlist metadata
items.forEach(video => {
  console.log(`Lesson ${video.position}: ${video.title}`);
  console.log(`Duration: ${video.duration}`);
  console.log(`Course: ${video.playlistInfo.playlistTitle}`);
  console.log(`Description: ${video.playlistInfo.playlistDescription}`);
  console.log(`Last Updated: ${video.playlistInfo.lastUpdated}`);
  console.log(`Total course length: ${video.playlistInfo.totalDuration}`);
  console.log(`Total views: ${video.playlistInfo.viewCount}`);
});
```

### Example 2: Tracking Playlist Updates

Monitor when playlists are updated:

```javascript
// Group by playlist and check last updated dates
const playlistUpdates = {};

items.forEach(video => {
  const playlistId = video.playlistInfo.playlistId;
  
  if (!playlistUpdates[playlistId]) {
    playlistUpdates[playlistId] = {
      title: video.playlistInfo.playlistTitle,
      lastUpdated: video.playlistInfo.lastUpdated,
      owner: video.playlistInfo.owner.name,
      videoCount: video.playlistInfo.totalVideosInPlaylist,
      views: video.playlistInfo.viewCount
    };
  }
});

// Display update summary
Object.entries(playlistUpdates).forEach(([id, data]) => {
  console.log(`\nPlaylist: ${data.title}`);
  console.log(`Last Updated: ${data.lastUpdated}`);
  console.log(`Owner: ${data.owner}`);
  console.log(`Videos: ${data.videoCount}`);
  console.log(`Total Views: ${data.views}`);
});
```

### Example 3: Sampling Large Playlists

Test extraction with a limited number of videos:

```javascript
const run = await client.actor('dz_omar/youtube-playlist-extractor').call({
  playlistUrls: [
    { url: 'https://www.youtube.com/playlist?list=LARGE_PLAYLIST' }
  ],
  maxVideosPerPlaylist: 20  // Only extract first 20 videos
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();

console.log(`Extracted ${items.length} sample videos`);
console.log(`Total in playlist: ${items[0].playlistInfo.totalVideosInPlaylist}`);
```

### Example 4: Export with Complete Metadata to CSV

```javascript
// The actor automatically supports CSV export
// Just download the dataset as CSV from Apify Console

// CSV will include all new fields:
// - playlistInfo.playlistDescription
// - playlistInfo.lastUpdated
// - playlistInfo.owner.name
// - playlistInfo.viewCount
// Perfect for Excel analysis and reporting!
```

---

## 📊 Output Format Examples

### JSON Export (Default)
Perfect for API integration and programmatic access:

```json
[
  {
    "position": 1,
    "videoId": "abc123",
    "title": "Introduction",
    "playlistInfo": {
      "playlistTitle": "Complete Course",
      "playlistDescription": "Learn everything about...",
      "lastUpdated": "Dec 28, 2023",
      "owner": {
        "name": "Creator Name",
        "id": "UC...",
        "url": "https://youtube.com/@creator"
      },
      "viewCount": "12,310,699 views",
      "videoCount": 50,
      "totalVideosInPlaylist": 50
    }
  }
]
```

### CSV Export  
Ideal for Excel, Google Sheets, and data analysis:

```csv
position,title,videoUrl,duration,channel.name,playlistInfo.playlistTitle,playlistInfo.lastUpdated,playlistInfo.viewCount
1,"Introduction","https://youtube.com/watch?v=abc123","5:25","Creator Name","Complete Course","Dec 28, 2023","12.3M views"
2,"Setup","https://youtube.com/watch?v=def456","8:15","Creator Name","Complete Course","Dec 28, 2023","12.3M views"
```

### Excel Export
Organized sheets with proper formatting and data types - perfect for business reporting.

---

## 📈 Performance Metrics

### Speed Benchmarks

| Playlist Size | Processing Time | Videos/Second |
|---------------|-----------------|---------------|
| 10-20 videos | 2-4 seconds | ~5-10 |
| 50-100 videos | 8-15 seconds | ~6-7 |
| 100-200 videos | 15-30 seconds | ~6-7 |
| 200-500 videos | 30-90 seconds | ~5-6 |
| 500+ videos | 2-3 minutes | ~4-5 |

**Note:** Times include data extraction, pagination, and processing. Network speed may affect results.

### Resource Usage

- **Memory:** 128-512 MB depending on playlist size
- **Compute:** 0.002-0.01 compute units per run (varies by playlist size)
- **Storage:** Minimal - Results stored in Apify dataset
- **Cache:** Metadata cached for faster subsequent runs

### Accuracy

- **Extraction Success Rate:** 99.9% for public playlists
- **Data Accuracy:** 100% (direct from YouTube's official data)
- **Metadata Completeness:** 100% for available fields
- **Pagination Reliability:** 100% (all videos extracted)

---

## ⚙️ Processing Modes

### Free Mode
- Standard processing speed
- Suitable for small to medium batches
- No additional costs
- Reliable and stable performance

### Paid Mode (Faster Results)
- Dedicated infrastructure for accelerated processing
- Optimized for high-volume batch operations
- Faster extraction of large video collections
- Automatic fallback to free mode if needed

Both modes extract identical, high-quality data. Paid mode is ideal when you need faster throughput for large batches.

---

## 💰 Pricing & Cost Estimation

### Pricing Model

This actor uses a **pay-per-video** pricing model:

- **Actor Start:** $0.001 (one-time per run)
- **Video Extracted:** $0.001 per video

### Cost Examples

| Scenario | Videos | Total Cost |
|----------|--------|------------|
| Small playlist | 20 | $0.021 |
| Medium playlist | 100 | $0.101 |
| Large playlist | 314 | $0.315 |
| Large playlist (500 videos) | 500 | $0.501 |
| Educational course | 150 | $0.151 |
| Batch (5 playlists, 250 videos) | 250 | $0.251 |
| Enterprise (20 playlists, 2000 videos) | 2000 | $2.001 |

### Apify Store Discounts

Subscribers get automatic discounts:

- **Bronze:** 10% off
- **Silver:** 20% off
- **Gold:** 30% off

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### ❌ "Playlist data not found"

**Causes:**
- Playlist is private or deleted
- Invalid playlist URL format
- Temporary YouTube server issue

**Solutions:**
- ✅ Verify playlist is public
- ✅ Use full YouTube URL with `list=` parameter
- ✅ Try again after a few minutes

#### ⚠️ Video Limit Not Working Correctly

**Fixed in Version 2.0!**
- ✅ `maxVideosPerPlaylist` now correctly limits videos during data push
- ✅ You get exactly the number you specify

#### ⚠️ Missing Playlist Description or Metadata

**Causes:**
- First-time extraction in progress
- Cache not yet populated

**Solutions:**
- ✅ Metadata is cached after first extraction
- ✅ Subsequent runs will reuse cached metadata

#### ⏱️ Slow Processing

**Causes:**
- Large playlists (200+ videos)
- Network latency
- Detailed video information extraction

**Solutions:**
- ✅ Set `includeVideoDetails: false` for 40-50% speed boost
- ✅ Use `maxVideosPerPlaylist` for testing
- ✅ Metadata caching speeds up subsequent runs

---

## ⚙️ Configuration Best Practices

### For Testing
```json
{
  "playlistUrls": [{"url": "..."}],
  "maxVideosPerPlaylist": 20,
  "includeVideoDetails": true
}
```

### For Production
```json
{
  "playlistUrls": [{"url": "..."}],
  "includeVideoDetails": true
}
```

### For Speed
```json
{
  "playlistUrls": [{"url": "..."}],
  "includeVideoDetails": false
}
```

### For Complete Data
```json
{
  "playlistUrls": [{"url": "..."}],
  "includeVideoDetails": true
}
```

---

## 🛡️ Legal & Compliance

### What This Actor Does

This actor extracts **publicly available** playlist and video metadata from YouTube. All data extracted is information that YouTube makes accessible through normal web browsing.

### Important Compliance Notes

**You are responsible for ensuring your use complies with:**

- ✅ YouTube's Terms of Service
- ✅ Applicable copyright laws
- ✅ Data protection regulations (GDPR, CCPA, etc.)
- ✅ Your local jurisdiction's laws

### Best Practices

- ✅ Only extract public playlists
- ✅ Respect content creators' rights
- ✅ Don't use data for illegal purposes
- ✅ Follow YouTube's Terms of Service
- ✅ Respect rate limits and don't abuse the service

---

## 📞 Support & Resources

### Need Help?

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

### Useful Links

- 📚 [Apify Documentation](https://docs.apify.com)
- 💬 [Apify Discord Community](https://discord.com/invite/jyEM2PRvMU)

### Report Issues

Found a bug or have a feature request?

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include example URLs and error messages
4. We typically respond within 24-48 hours

---
## 🌟 Related Actors by [DZ_OMAR](https://apify.com/dz_omar)


### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor)**  
Extract complete video transcripts with timestamps and comprehensive metadata. Perfect for content analysis, SEO, and subtitle generation.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro)**  
The ultimate YouTube data extraction tool. Get complete channel data, all playlists, shorts, live streams, and more in one powerful actor.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper)**  
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper)**  
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

### 🏠 Real Estate Data

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api)**  
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper)**  
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

### 🛠️ Developer & Security Tools

**[Screenshot](https://apify.com/dz_omar/screenshot)**  
Fast, reliable webpage screenshots with customizable options. Essential for monitoring and documentation.

**[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot)**  
Advanced screenshot tool with full-page capture, custom viewports, and quality controls.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner)**  
Scan websites for security vulnerabilities and get comprehensive security reports.

### 📱 Social Media Tools

**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro)**  
Extract Facebook ads data for competitor analysis and market research. Track ad campaigns and strategies.

---