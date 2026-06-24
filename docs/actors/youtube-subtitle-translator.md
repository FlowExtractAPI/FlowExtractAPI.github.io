# 🎬 YouTube Subtitle Translator

**Transform YouTube videos into multilingual subtitles instantly. Extract transcripts and translate them into 20+ languages with perfect timing preservation. Get professional SRT files ready for upload.**

This powerful Apify actor is designed for YouTube content creators, educators, and businesses who want to reach global audiences. Get professional-quality SRT subtitle files and cleaned translations in minutes.

---
## ⚠️ Important: Execution Model & Costs

This Actor is a **wrapper** that combines YouTube Subtitle Translator scraping with transcript extraction.

When you run the acter **YouTube Subtitle Translator** does **not** extract transcripts directly. Instead:

* It  **executes [YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63) in standby mode** to retrieve transcripts for each video
* Results are merged and returned as a single unified output

### What this means for you

* You may see **two Actors running** for a single execution  this is **expected behavior**
* This Actor does **not start automatically** and only runs when you explicitly trigger it
* The standby transcript extraction **consumes compute units**, just like running the transcript extractor directly

### Billing & Compute Usage

* Costs come from **both** this Actor and the internally triggered transcript extractor

If you prefer direct control over transcript extraction, run the extractor separately:

👉 **[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)**

---
## 🎯 Why Use This Actor?

### ⚡ The Problem

Most creators waste **2-3 hours per video** using manual methods:

```
❌ Old Workflow (2-3 hours):
1. Download video from YouTube
2. Extract transcript manually
3. Copy text to ChatGPT/Claude (token limits!)
4. Translate in multiple chunks
5. Copy back piece by piece
6. Format SRT file manually (time codes break!)
7. Fix timing issues
8. Repeat for each language
```

### ✅ Our Solution (5 minutes)

```
✅ New Workflow (5 minutes):
1. Paste YouTube URL
2. Select target languages (1 or multiple)
3. Click "Run"
4. Download SRT files + clean translations
✅ Upload to YouTube - Done!
```

---

## 🚀 Key Features

### 🎯 Complete Transcript Translation
- **Auto-Language Detection** - Automatically detects source language (English, Arabic, German, French, etc.)
- **Multiple Languages** - Translate to 20+ languages in a single run
- **Title Translation** - Localize video titles for better discoverability
- **Description Translation** - Translate full video descriptions
- **Timestamp Preservation** - Maintains exact timing from original (millisecond accuracy)
- **Batch Processing** - Translate multiple videos at once

### 📁 Multiple Output Formats
- **SRT Files** - Industry-standard SubRip format for YouTube/Vimeo
- **Clean Translations** - Downloadable JSON with formatted title + description
- **Direct Download URLs** - Easy access to all generated files

### ⚡ Performance & Reliability
- **Lightning Fast** - Process videos in 2-5 minutes
- **AI-Powered** - Lingo.dev translation engine for high-quality results
- **Perfect Timing** - Zero drift or synchronization issues
- **Error Handling** - Graceful handling of failed videos (continues with others)
- **Real-time Logging** - See exactly what's happening

---

## 📋 Supported Languages

| Code | Language | Code | Language | Code | Language |
|------|----------|------|----------|------|----------|
| `en` | English | `es` | Spanish | `ar` | Arabic |
| `fr` | French | `de` | German | `ja` | Japanese |
| `pt` | Portuguese | `it` | Italian | `ko` | Korean |
| `ru` | Russian | `pl` | Polish | `tr` | Turkish |
| `nl` | Dutch | `sv` | Swedish | `da` | Danish |
| `fi` | Finnish | `el` | Greek | `zh` | Chinese |
| `hi` | Hindi | `th` | Thai | `vi` | Vietnamese |

**Plus more!** 20+ languages supported.

---

## 🛠️ How It Works

### 3-Step Process

```
Step 1: Extract Transcript
   YouTube URL → YouTube Transcript Extractor
   → Get title, description, timestamps

Step 2: Translate Content
   Original text → Lingo.dev AI Translation
   → Preserves timing, translates text

Step 3: Generate Output
   Translated timestamps → Professional SRT format
   → Clean JSON with download link
```

### Technical Flow

```
User Input:
  - YouTube URLs (1 or multiple)
  - Target Languages (1 or multiple)
  - Lingo.dev API Key
         ↓
Extract Transcripts:
  - Call YouTube Transcript Extractor
  - Get title, description, timestamps
  - Detect source language automatically
         ↓
Translate Each Language:
  - Send entire object to Lingo.dev (ONE API call)
  - Preserve timestamps, translate text
  - Count words for billing
         ↓
Generate Files:
  1. SRT file (ready for YouTube)
  2. Clean translation JSON (with download URL)
  3. Billing info + Summary
         ↓
Output:
  ✅ Dataset with all results
  ✅ Key-value store with downloadable files
```

---

## 📥 Input Configuration

### Simple Example

```json
{
  "youtubeUrl": [
    {"url": "https://www.youtube.com/watch?v=abc123"},
    {"url": "https://youtu.be/xyz789"}
  ],
  "targetLanguages": ["ar", "es", "fr"],
  "Lingo_api_key": "sk-lingo-..."
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `youtubeUrl` | `array` | ✅ Yes | YouTube video URLs (watch, youtu.be, or live format) |
| `targetLanguages` | `array` | ✅ Yes | ISO language codes for translation targets |
| `Lingo_api_key` | `string` | ✅ Yes | Your Lingo.dev API key (get free at https://lingo.dev) |

---

## 📤 Output Structure

### Dataset Results

Each translation produces a comprehensive result:

```json
{
  "videoId": "dQw4w9WgXcQ",
  "videoUrl": "https://youtu.be/dQw4w9WgXcQ",
  "original": {
    "title": "Never Gonna Give You Up",
    "description": "Official music video for 'Never Gonna Give You Up'...",
    "language": "en",
    "timestampCount": 145,
    "metadata": {
      "thumbnail": "https://i.ytimg.com/vi/...",
      "channel": {
        "name": "Rick Astley",
        "id": "UCID...",
        "url": "https://www.youtube.com/channel/...",
        "subscribers": "5M",
        "verified": true
      },
      "views": "1.2B views",
      "publishedDate": "Oct 25, 2009"
    }
  },
  "translated": {
    "title": "Nunca Te Voy A Renunciar",
    "description": "Video musical oficial de 'Nunca Te Voy A Renunciar'...",
    "language": "es",
    "timestampCount": 141,
    "cleanTextFile": {
      "url": "https://api.apify.com/v2/key-value-stores/.../dQw4w9WgXcQ_es_CLEAN.txt",
      "format": "TXT",
      "encoding": "UTF-8"
    }
  },
  "subtitleFile": {
    "downloadUrl": "https://api.apify.com/v2/key-value-stores/.../records/dQw4w9WgXcQ_es.srt",
    "language": "es",
    "format": "SRT"
  }
}
```

### Clean Translation JSON

```json
{
  "title": "Nunca Te Voy A Renunciar",
  "description": "Video musical oficial de 'Nunca Te Voy A Renunciar'...",
  "downloadUrl": "https://api.apify.com/v2/key-value-stores/.../records/dQw4w9WgXcQ_es_CLEAN.txt",
  "language": "es",
  "timestampCount": 145
}
```

### Clean Translation Text File

```
TITLE:
Nunca Te Voy A Renunciar

DESCRIPTION:
Video musical oficial de 'Nunca Te Voy A Renunciar'...
Con subtítulos en español.
```

---

## 💼 Professional Use Cases

### 📚 Content Creators & YouTubers
- **Expand Global Reach** - Reach billions of non-English speakers
- **Boost Watch Time** - Viewers stay longer with native subtitles
- **Improve SEO** - YouTube indexes translated titles/descriptions
- **Monetization** - More languages = more ad revenue

### 🎓 Educational Institutions
- **Online Courses** - Make content accessible to international students
- **Research Videos** - Share findings with global academic community
- **Training Materials** - Translate corporate training for multinational teams
- **Student Resources** - Subtitles in students' native languages

### 💼 Business & Marketing
- **Product Demos** - Localize for each target market
- **Training Videos** - Translate for global workforce
- **Marketing Content** - Adapt campaigns for regional audiences
- **Customer Support** - Help videos in multiple languages

### 🎬 Media & Publishing
- **News Content** - Rapid translation for breaking stories
- **Documentaries** - Subtitle international documentaries
- **Podcast Videos** - Add subtitles for social media clips
- **Interview Content** - Translate expert interviews

---

## 🎬 Two Operation Modes

### Batch Mode (Default)
- Submit multiple videos in one run
- Ideal for bulk content processing
- Results saved to Apify dataset
- Perfect for channel-wide updates

**Use when:**
- Translating entire video libraries
- Scheduled batch workflows
- Content migration projects
- Cost optimization for bulk operations

### Standby Mode (Real-time API)
- Always-running HTTP API endpoint
- Instant translation responses
- No cold-start delays
- Perfect for real-time applications

**Use when:**
- Building automated workflows
- Integrating into CMS/publishing systems
- Creating translation services for clients
- Need instant responses for user requests

---

## 🚀 Getting Started

### Step 1: Get Your Lingo.dev API Key
1. Visit [https://lingo.dev](https://lingo.dev)
2. Sign up for free account (no credit card required for trial)
3. Get your API key from dashboard

### Step 2: Prepare Your Input
```json
{
  "youtubeUrl": [
    {"url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"}
  ],
  "targetLanguages": ["ar", "es", "fr"],
  "Lingo_api_key": "your-api-key-here"
}
```

### Step 3: Run the Actor
1. Open Apify Console
2. Find "YouTube Subtitle Translator" actor
3. Paste your input
4. Click "Run"
5. Wait for completion (typically 2-5 minutes per video)

### Step 4: Download Your Files
1. Check the dataset results
2. Download SRT files for each language
3. Download clean translation JSON with text files
4. Upload SRT files to YouTube (Video Manager → Subtitles)
5. Use cleaned text for descriptions/marketing

---
## ⚙️ Technical Specifications

### System Requirements
- Memory: 256 MB (sufficient for most videos)
- Timeout: 5 minutes per video (adjustable)
- Language: JavaScript/Node.js

### Performance Metrics
- **Speed:** 2-5 minutes per video in batch mode
- **Accuracy:** Professional-grade AI translation
- **Reliability:** 99%+ success rate for videos with transcripts
- **Scalability:** Handle 1-1000+ videos with same quality

### Supported Video Formats
- `youtube.com/watch?v=...` - Standard videos
- `youtu.be/...` - Shortened URLs
- `youtube.com/live/...` - Live stream recordings

---

## 🛡️ Legal & Compliance

This actor translates transcripts from **publicly available YouTube videos** using YouTube's official API.

**Important:** Please ensure your use complies with:
- YouTube Terms of Service
- Video owner's copyright and permissions
- Your data usage rights
- Applicable data protection regulations (GDPR, CCPA, etc.)
- Your specific jurisdiction's laws

**Recommended:** Only translate videos you own or have explicit permission to translate.

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ "No transcript found"
- **Solution:** Video must have captions/auto-generated transcripts enabled
- Check if YouTube shows captions when playing the video
- Videos must be at least 25 seconds long
- Some videos may need 24 hours to generate auto-captions

#### ❌ "Language detection failed"
- **Solution:** Defaulting to English (detected from first 500 words)
- Actor still translates correctly, just with English as source
- If wrong, check that video transcript is actually in detected language

#### ❌ "Payment limit reached"
- **Solution:** Add more credits to your Apify account
- Check pricing table above for cost estimates
- Contact Apify support if issues persist

#### ❌ "Translation took too long"
- **Solution:** Some large videos may take 5-10 minutes
- Actor has automatic retries and timeouts
- Very long videos (3+ hours) may need to be split

---


## Contact
- 🌐 **website:** [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email:** [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🔧 **Apify Profile:** [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 🙋 **GitHub:** [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **Linkedin:** [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter:** [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook:** [flowextractapi](https://www.facebook.com/flowextractapi)

---
## 🌟 Related Actors by [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)

### 🎬 Video & Media Tools

**[🎬 Youtube Playlist Extractor](https://apify.com/dz_omar/youtube-playlist-extractor?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata. Perfect for content analysis, SEO, and subtitle generation.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete 🎬 playlist information with all video details from any YouTube playlist -->⚡Fast, reliable, and built for scale. Get video lists, durations, thumbnails, and channel info.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

### 🏠 Real Estate Data

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

### 🛠️ Developer & Security Tools

**[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)**
Fast, reliable webpage screenshots with customizable options. Essential for monitoring and documentation.

**[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**
Advanced screenshot tool with full-page capture, custom viewports, and quality controls.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Scan websites for security vulnerabilities and get comprehensive security reports.

### 📱 Social Media Tools

**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook ads data for competitor analysis and market research. Track ad campaigns and strategies.

---
## 🏆 Why Lingo.dev?

Unlike Google Translate, ChatGPT, or manual translation:

✅ **Fastest** - 5 minutes vs 3 hours per video
✅ **Best Quality** - Context-aware AI, not word-by-word
✅ **Perfect Timing** - Preserves exact millisecond accuracy
✅ **Scalable** - 1 video or 1000 videos with same efficiency
✅ **No Token Limits** - Handle any video length

---

## 📈 Success Stories

### Case Study: Education Channel
- **Challenge:** 500 educational videos, English only
- **Solution:** Translated to Spanish, French, German in 3 days
- **Result:**
  - 300% increase in international viewership
  - 150% increase in watch time
  - New audience in 15+ countries

### Case Study: Business Training
- **Challenge:** Corporate training videos for global team
- **Solution:** Automated translation to 8 languages
- **Result:**
  - All 200 employees access training in native language
  - 95% completion rate (up from 60%)
  - Training time reduced by 40%

---

## 🙏 Acknowledgments

- **Lingo.dev** - AI-powered translation engine
- **YouTube API** -[ Transcript extraction ](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)
- **Apify** - Actor platform and infrastructure

---

**Ready to reach a global audience?** [Start using YouTube Subtitle Translator now!](https://apify.com/dz_omar/youtube-subtitle-translator)

*Transform your YouTube channel into a global brand. One subtitle file at a time.* 🌍🎬