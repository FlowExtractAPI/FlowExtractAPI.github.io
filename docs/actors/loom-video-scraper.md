# 🎥 Loom Scraper - Videos & Folders

![https://apify.com/dz_omar/loom-video-scraper](https://raw.githubusercontent.com/FlowExtractAPI/loom-scrape-pro/refs/heads/main/Screenshot%20of%20Loom%20interface%20with%20scraper%20workflow%20visualization.png)

Transform your **Loom videos into searchable, downloadable archives** with complete metadata, transcripts, and comments across individual videos and entire folders.

Perfect for **content creators**, **educators**, and **businesses** who need to archive, analyze, or repurpose their Loom content without coding complexity.

---

## 🚀 Key Benefits & Use Cases

### **📚 For Educators & Trainers**
- Archive online courses and tutorial libraries with searchable transcript databases
- Backup training materials before expiration and generate study notes automatically
- Create comprehensive knowledge bases from video content

### **💼 For Business Teams**
- Archive team presentations, meeting recordings, and video communications
- Generate meeting transcripts for documentation and compliance
- Build searchable knowledge databases from organizational video content

### **🎯 For Content Creators**
- Bulk download and organize video libraries with rich metadata
- Create searchable video databases with full transcript capabilities
- Repurpose content across platforms efficiently

---

## 🔍 Complete Data Extraction

### 📹 **Video Intelligence**
- **Metadata**: ID, title, **description**, thumbnails, creation date, duration, quality
- **Engagement**: Views, reactions, comments count and full comment threads
- **Technical**: File format, direct download URLs, sharing links
- **Creator**: Owner information, avatars, profile data

### 📄 **Transcript Processing**
- **Multiple Formats**: SRT, VTT, TXT, XML exports with precise timestamps
- **Clean Text**: Formatted, readable content ready for analysis
- **Search Ready**: Full-text search capabilities across your library
- **Integration**: Compatible with video players and analysis tools

### 📂 **Folder Operations**
- **Bulk Processing**: Handle entire folders automatically with progress tracking
- **Mixed Operations**: Combine individual videos and folders in one request
- **Batch Reports**: Summary statistics and completion status for each folder

---

## ⚠️ Important: Account Videos vs Individual URLs

### **Account Videos Processing** (`includeAccountVideos: true`)
- Processes **all videos from your Loom account**
- Supports date filtering (`startDate`, `endDate`)
- Supports custom sorting (`videoSortOrder`)
- Requires authentication (email/password or cookies)

### **Individual URL Processing** (default behavior)
- Processes **only the specific URLs you provide**
- Date filters and sort order are **ignored**
- Works with or without authentication
- Processes videos in the order you list them

---

## ⚙️ Configuration Options

### 🔗 **Input URLs**
Process individual videos, entire folders, or mixed content:

```json
{
  "url": [
    "https://www.loom.com/share/08163614158646f7aa21e53997cd58e8",
    "https://www.loom.com/share/folder/abc123def456"
  ]
}
```
### ⏱️ Advanced Download Settings

#### `pollMultiplier` (Number)
- **Default**: `0.02`
- **Range**: `0.01` – `1.0`
- **Only applies when**: `downloadVideo: true`

Loom does not return a download URL instantly  it prepares the MP4 file in the background 
first. The scraper keeps re-signaling Loom until the URL is ready. This multiplier controls 
the **maximum time it will wait**, calculated as:

```
max_wait = max(30s, video_duration_seconds × pollMultiplier)  [capped at 600s]
```

| Video Length | Default wait (0.02) |
|---|---|
| Under 25 min | 30s (minimum) |
| 30 min | ~36s |
| 2.5 hours | ~180s |

💡 **If you see timeout errors on long videos**, increase this value (e.g. `0.05` or `0.1`).  
💡 **For short video libraries**, keep the default.

### 📥 **Download Options**

#### 🎞️ `downloadVideo` (Boolean)
- **Default**: `false`
- **Format**: Original MP4 quality preserved
- **Use Case**: Full video archiving and offline access
- **Note**: ✅ **Works even when owner has disabled downloads** in video settings
- **How it works**: When requested, Loom prepares the MP4 asynchronously in the background  
  the scraper automatically re-signals Loom and polls until the URL is ready. 
  Small videos (~2min) may take ~10s, longer videos can take up to 3 minutes or more.
- **OOM handling**: If the download actor runs out of memory, the scraper automatically retries with double memory (up to your plan limit)

#### 🔗 `returnVideoUrl` (Boolean)
- **Default**: `false`
- **Use Case**: Get the direct Loom CDN link without downloading via the Universal Downloader
- **Output**: Adds `cdn_url` to the `video.download` object  a signed MP4 link from Loom's CDN
- **⚠️ Note**: CDN URLs are **signed and temporary**  they expire after a few hours

**How `downloadVideo` and `returnVideoUrl` interact:**

| `downloadVideo` | `returnVideoUrl` | What happens |
|---|---|---|
| `false` | `false` | No download, no URL  skip entirely |
| `false` | `true` | Return CDN URL only (**no** Universal Downloader cost) |
| `true` | `false` | Full download via Universal Downloader |
| `true` | `true` | Full download + CDN URL in output |

#### 📄 `downloadTranscript` (Boolean)
- **Default**: `false`
- **Integration**: Ready for video players and analysis tools

#### 📄 `outputFormat` (String)
- **Default**: `"srt"`
- **Options**: 
  - `"srt"`: Standard subtitle format (most compatible)
  - `"vtt"`: Web-friendly with CSS styling support
  - `"txt"`: Clean text without timestamps
  - `"xml"`: Full metadata structure

### 📅 **Account Videos Options** (Only when `includeAccountVideos` is enabled)

These parameters only work when scraping your own Loom account videos. They have no effect when processing individual video URLs or public folders.

#### 📅 `startDate` (String)
- **Default**: `"2016-01-01"`
- **Format**: `"YYYY-MM-DD"`
- **Purpose**: Filter videos by earliest upload date to include from your account
- **⚠️ Note**: Only applies to your own account videos, not individual URLs

#### 📅 `endDate` (String)
- **Default**: `"2030-12-31"`
- **Format**: `"YYYY-MM-DD"`
- **Purpose**: Filter videos by latest upload date to include from your account
- **⚠️ Note**: Only applies to your own account videos, not individual URLs

#### 📅 `videoSortOrder` (String)
- **Default**: `"ASC"`
- **Options**: 
  - `"ASC"`: Oldest to Newest - Shows the earliest videos first
  - `"DESC"`: Newest to Oldest - Shows the most recently uploaded videos first
- **⚠️ Note**: Only applies when processing your own account videos, not individual URLs or folders

---

## ⚠️ Smart Memory Management for Video Downloads

When `downloadVideo` is enabled, this Actor uses **intelligent resource allocation** powered by our specialized [Universal File Downloader](https://apify.com/dz_omar/universal-file-downloader) to optimize memory usage and prevent failures. The Actor automatically analyzes each video's file size and dynamically allocates the optimal amount of memory needed for successful downloads.

### ✅ **How It Works**

**Tier-Aware Allocation**: The scraper auto-detects your Apify plan (Free vs Paid) at runtime and caps the download actor's memory to stay within your plan limits  no manual configuration needed.

| Plan | Platform Total | Loom Scraper (parent) | Universal Downloader (child) max |
|------|---------------|----------------------|----------------------------------|
| **Free** | 8 GB | 128 MB (minimum) | **4 GB** |
| **Paid** | 32 GB | 128 MB (minimum) | **16 GB** |

**Automatic OOM Retry**: If the download actor runs out of memory (exit code 137), the scraper automatically retries with the next memory tier (doubled)  no user intervention needed. If the retry also fails or the plan limit is already reached, you get a clear error explaining what happened.

| Attempt | What happens |
|---|---|
| **1st try** | Auto-calculated memory based on video file size |
| **OOM detected** | Scraper doubles memory to next tier and retries |
| **2nd try succeeds** | Done  video downloaded |
| **2nd try fails / at plan limit** | Clear error message + upgrade link for Free users |

**Dynamic Resource Calculation**: The Actor examines each video file before downloading and calculates the exact memory requirements based on file size, ensuring efficient resource usage without waste.

**Intelligent Timeout Management**: Download timeouts are calculated based on file size and estimated connection speed, ensuring downloads complete successfully without unnecessary waiting.

**Enterprise-Grade Download Engine**: Powered by our [Universal File Downloader](https://apify.com/dz_omar/universal-file-downloader) Actor, which provides advanced proxy support, retry mechanisms, and streaming technology for reliable downloads of any size.

### 💡 **Benefits for Users**

- **Zero Configuration**: Auto-detects your plan, picks the right memory, retries on failure
- **Prevents Silent Failures**: OOM crashes now show clear error messages instead of silent N/A
- **Cost Efficient**: Starts with the minimum needed, only scales up if necessary
- **Handles Any Size**: From small clips to multi-gigabyte recordings, all processed reliably
- **Batch Processing**: Each video in a folder gets its own optimized resource allocation
- **Skip the Downloader**: Use `returnVideoUrl: true` to get the CDN link directly and handle downloads yourself  no Universal Downloader cost

### 📖 **[Learn more about Apify usage and resources](https://docs.apify.com/platform/actors/running/usage-and-resources)**
---

## 🔐 Authentication & Private Content Access

The Actor supports **scraping your private Loom videos** - perfect for backing up private workspaces or archiving internal content that isn't publicly shared.

### **Authentication Methods** (in priority order):

#### ✅ **Method 1: Email + Password** (Recommended)
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
- Automatic login with fresh session
- Access to all private videos in your account
- Secure credential handling (encrypted and cleared after use)

#### 🍪 **Method 2: Browser Cookies** (Fallback)
```json
{
  "customCookies": [
    {
      "name": "connect.sid",
      "value": "s%3A123abc...",
      "domain": ".loom.com",
      "path": "/",
      "secure": true,
      "httpOnly": true
    }
  ]
}
```


### **Getting Browser Cookies**

1. **Install Extension**:

<table>
  <tr>
    <td align="center">
      <strong>
        <a href="https://cookie-editor.com/" target="_blank" rel="noopener noreferrer">🍪 Cookie-Editor Extension</a>
      </strong>
    </td>
    <td align="center">
      <strong>
        <a href="https://chromewebstore.google.com/detail/copy-cookies/jcbpglbplpblnagieibnemmkiamekcdg" target="_blank" rel="noopener noreferrer">📋 Copy Cookies Extension</a>
      </strong>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/FlowExtractAPI/loom-scrape-pro/refs/heads/main/add_Cookie_Editor.gif" width="100%">
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/FlowExtractAPI/loom-scrape-pro/refs/heads/main/add_Copy_Cookies.gif" width="100%">
    </td>
  </tr>
</table>


2. **Export Process**:
   - Navigate to loom.com and log in
   - Use extension to export cookies as JSON
   - Paste into `customCookies` parameter

3. **Authentication Priority**:
   - **Email + Password** → Fresh login (highest priority)
   - **Custom Cookies** → Fallback method
   - **No Auth** → Public content only

---

## 📊 Sample Output Structure

![Sample Output](https://raw.githubusercontent.com/FlowExtractAPI/loom-scrape-pro/refs/heads/main/Sample_Output.png)

```json
{
  "video": {
    "id": "388fe9c5db854403bceefe52ea85dede",
    "title": "How to Use YouTube Scraper Effectively 🚀",
    "description": "In this tutorial, I'll walk you through the complete process of using the YouTube Scraper effectively. Learn how to extract video metadata, download content, and automate your YouTube data collection workflow.",
    "url": "https://www.loom.com/share/388fe9c5db854403bceefe52ea85dede",
    "thumbnails": "https://cdn.loom.com/sessions/thumbnails/...",
    "created_at": "2025-07-11T09:47:40.065Z",
    "duration_seconds": "38s",
    "views": 0,
    "reactions": 7,
    "comments_count": 6,
    "owner": "TECH FRIDAY",
    "avatars": "https://cdn.loom.com/avatars/...",
    "download": {
      "available": true,
      "url": "https://api.apify.com/v2/key-value-stores/xxx/records/Video_Name?signature=abc",
      "direct_download": "https://api.apify.com/v2/key-value-stores/xxx/records/Video_Name?signature=abc&attachment=true",
      "cdn_url": "https://cdn.loom.com/sessions/transcoded/388fe9c5db854403bceefe52ea85dede.mp4?Policy=...&Signature=...",
      "format": "mp4"
    }
  },
  "transcript": {
    "text": "How to use, uhm, YouTube Scraper. First, we will...",
    "download": {
      "format": "SRT",
      "url": "https://api.apify.com/v2/key-value-stores/.../transcript.srt",
      "available": true
    }
  },
  "comments": [
    {
      "id": "100664080",
      "username": "Mohamad Abdlrahman",
      "content": "tyfgh",
      "created_at": "2025-07-11T10:58:55.610Z"
    }
  ]
}
```

---

## 🎯 Configuration Examples

### **Basic Video Archive**
```json
{
  "url": [
    "https://www.loom.com/share/08163614158646f7aa21e53997cd58e8"
  ],
  "downloadTranscript": true,
  "outputFormat": "srt"
}
```

### **Complete Folder Backup**
```json
{
  "url": [
    "https://www.loom.com/share/folder/abc123def456"
  ],
  "downloadVideo": true,
  "downloadTranscript": true,
  "outputFormat": "srt",
  "email": "your-email@example.com",
  "password": "your-password"
}
```
Set memory in your run configuration: 2 GB or more

### **Account Videos with Date Filter & Sort**
```json
{
  "includeAccountVideos": true,
  "downloadTranscript": true,
  "outputFormat": "srt",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "videoSortOrder": "DESC",
  "email": "your-email@example.com",
  "password": "your-password"
}
```

### **Mixed Content: URLs + Account Videos**
```json
{
  "url": [
    "https://www.loom.com/share/08163614158646f7aa21e53997cd58e8",
    "https://www.loom.com/share/folder/abc123def456"
  ],
  "includeAccountVideos": true,
  "downloadVideo": false,
  "downloadTranscript": true,
  "outputFormat": "vtt",
  "startDate": "2024-06-01",
  "videoSortOrder": "DESC"
}
```

### **Get Direct CDN URLs (no Universal Downloader)**
```json
{
  "url": [
    "https://www.loom.com/share/08163614158646f7aa21e53997cd58e8"
  ],
  "returnVideoUrl": true,
  "downloadVideo": false,
  "downloadTranscript": true,
  "outputFormat": "txt"
}
```
Returns the signed Loom CDN URL in `video.download.cdn_url`  download it yourself in your own app. No Universal Downloader cost, no OOM issues.

---

## 📄 Advanced Features

### **Reliability & Performance**
- **State Management**: Auto-resume from interruption points with progress tracking
- **Error Handling**: Robust recovery with automatic retry mechanisms
- **Storage Optimization**: Efficient file organization with direct download URLs
- **Detailed Logging**: Complete processing history and performance monitoring

### **Content Processing**
- **Platform Updates**: Migration support for Loom platform changes
- **Batch Operations**: Efficient bulk processing with folder progress tracking
- **Multiple Formats**: Structured file naming and organized output

---

## 🛠️ Troubleshooting

### **Authentication Issues**
- **Verify credentials**: Check email/password accuracy
- **Update cookies**: Ensure browser cookies are current
- **Try fallback**: Use alternative authentication method

### **Missing Content**
- **Transcripts**: Must be enabled by video owner (Settings → Audience → Transcript → Toggle ON)
- **Private videos**: Requires valid authentication
- **Permissions**: Verify sharing permissions with content creator

### **Performance Issues**
- **Download URL timeout**: If you see timeout on long videos, increase `pollMultiplier` 
  (e.g. from `0.02` to `0.05`). Loom prepares downloads asynchronously and longer 
  videos need more preparation time.
- **OOM / N/A download URLs**: The scraper now auto-retries with more memory on OOM failures. 
  If it still fails, your video may be too large for your plan. Free plan users can 
  [upgrade their plan](https://console.apify.com/billing/subscription?fpr=smcx63) for more memory, 
  or use `returnVideoUrl: true` to get the CDN link and download it yourself.
- **Large folders**: Split into smaller batches
- **Slow processing**: Check network connection and Loom server status

---

## 🤝 Support & Resources

### **Getting Help**
- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)


---

## 🌟 Related Actors by FlowExtractAPI

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