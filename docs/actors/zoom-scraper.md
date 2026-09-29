# 🎥 Zoom Video Downloader & Extractor

![Zoom Video Downloader](https://raw.githubusercontent.com/apifytech/store-assets/master/actors/zoom-video-downloader/zoom-video-downloader-hero.png)

Transform your **Zoom recordings into searchable, downloadable archives** with complete metadata, transcripts, and video files across regular meetings, events, and clips.

Perfect for **educators**, **business teams**, and **content creators** who need to archive, analyze, or repurpose their Zoom content without coding complexity.

---

## 🚀 Key Benefits & Use Cases

### **📚 For Educators & Trainers**
- Archive online classes and webinar libraries with searchable transcript databases
- Backup lecture recordings before expiration and generate study materials automatically
- Create comprehensive knowledge bases from educational video content

### **💼 For Business Teams**
- Archive team meetings, training sessions, and corporate communications
- Generate meeting transcripts for documentation, compliance, and note-taking
- Build searchable knowledge databases from organizational video content

### **🎯 For Content Creators**
- Bulk download and organize webinar libraries with rich metadata
- Create searchable video databases with full transcript capabilities
- Repurpose content across platforms efficiently

---

## 🔎 Complete Data Extraction

### 📹 **Video Intelligence**
- **Metadata**: title, duration (formatted and in seconds), source file size, recorded-at
  timestamp in ISO 8601, recording type
- **Technical**: direct download URL for the stored video file, stored file name and size
- **Status**: an explicit outcome and, when something did not work, a plain-language reason

### 📝 **Transcript Processing**
- **Multiple Formats**: SRT, VTT, TXT and XML, each with correct start *and* end times on
  every cue — subtitle files load in players without editing
- **Speaker Labels**: kept wherever Zoom provides them, across all recording types
- **Clean Text**: formatted, readable content ready for analysis
- **Integration**: compatible with video players, subtitle tools, and NLP pipelines

### 🎯 **Multi-Platform Support**
- **Cloud Recordings**: standard Zoom meeting recordings, on commercial and vanity domains
- **Government Recordings**: `zoomgov.com` tenants used by federal, state, and local
  agencies — courts, city councils, public hearings, agency webinars
- **Zoom Events**: large-scale event and session recordings
- **Zoom Clips**: short video clips, including clips served from the dedicated clips host
- **Smart Detection**: the surface is identified from the link — no mode to choose

---

## ⚡ Smart URL Detection & Redirection

### **🎬 Loom URL Detection**
When you accidentally enter Loom URLs, the actor provides helpful guidance:
- Detects individual Loom videos (`loom.com/share/VIDEO_ID`)
- Identifies Loom folders (`loom.com/share/folder/FOLDER_ID`)
- Redirects to specialized [Loom Video Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63) for better results

### **🎥 Platform Recognition**
- YouTube, Vimeo, and other platform detection
- Clear error messages with platform-specific guidance
- Focus on Zoom-optimized processing

---

## ⚙️ Configuration Options

### 🔗 **Input URLs**
Process individual recordings, events, or clips:

```json
{
  "zoom_urls": [
    { "url": "https://zoom.us/rec/play/example" },
    { "url": "https://events.zoom.us/video/example" },
    { "url": "https://zoom.us/clips/share/example" }
  ]
}
```

### 📥 **Download Options**

#### 🎞️ `download_videos` (Boolean)
- **Default**: `false`
- **Format**: Original MP4 quality preserved
- **Use Case**: Full video archiving and offline access
- **Storage**: Files stored in Apify's key-value store

#### 📝 `downloadTranscript` (Boolean)
- **Default**: `false`
- **Integration**: Ready for video players and analysis tools

#### 📄 `outputFormat` (String)
- **Default**: `"srt"`
- **Options**: 
  - `"srt"`: Standard subtitle format (most compatible)
  - `"vtt"`: Web-friendly with CSS styling support
  - `"txt"`: Clean text without timestamps
  - `"xml"`: Full metadata structure

---

## 📊 Sample Output Structure

Every link you submit produces exactly one row — including links that could not be
read, so a link never disappears without an explanation.

### **Cloud Recording** (`zoom.us` / `zoomgov.com`)
```json
{
  "_source": "zoom-scraper",
  "source_url": "https://usdot.zoomgov.com/rec/play/1BDKMjpmHZvv0u4iOzIJ...",
  "url": "https://usdot.zoomgov.com/rec/play/1BDKMjpmHZvv0u4iOzIJ...",
  "status": "success",
  "title": "FHWA Lighting Handbook Webinar - 12 December 2023",
  "recordingType": "recordings",
  "startTime": "2023-12-13T03:32:47.000Z",
  "duration": "1:54:21",
  "duration_seconds": 6861,
  "source_size_mb": 192,
  "video_downloaded": false,
  "video_url": null,
  "video_size": null,
  "has_transcript": true,
  "transcript_info": {
    "transcript": "1
00:00:27,970 --> 00:00:34,649
Welcome, welcome. We'll take a few more minutes...",
    "segment_count": 472
  },
  "error": null
}
```

### **Zoom Clip**
```json
{
  "_source": "zoom-scraper",
  "url": "https://www.zoom.us/clips/share/JPZkgJFuQnesSFxNMYeLaw",
  "status": "success",
  "title": "2025 Freedom to Read Award Winner Bänoo Zan",
  "recordingType": "clips",
  "startTime": "2025-03-03T22:07:35.777Z",
  "duration": "6:25",
  "duration_seconds": 385,
  "source_size_mb": 72,
  "has_transcript": true,
  "transcript_info": {
    "transcript": "1
00:00:00,000 --> 00:00:08,450
So let's welcome this year's recipient...",
    "segment_count": 42
  }
}
```

### **With Downloads Enabled**
When `download_videos: true` and `downloadTranscript: true`:

```json
{
  "title": "PICO Meeting",
  "recordingType": "recordings",
  "duration": "34:12",
  "video_downloaded": true,
  "video_url": "https://api.apify.com/v2/key-value-stores/q6VQFhKFOBks7LCTT/records/PICO_Meeting.mp4?signature=...",
  "video_name": "PICO_Meeting.mp4",
  "video_size": "206 MB",
  "has_transcript": true,
  "transcript_info": {
    "transcript": "1
00:01:03,300 --> 00:01:05,390
Micah Tseng: Thank you.",
    "transcript_url": "https://api.apify.com/v2/key-value-stores/ySHfyw860qMzC74Zr/records/PICO_Meeting.srt",
    "segment_count": 318
  }
}
```

### **A Link That Could Not Be Read**
Reported, never silently dropped:

```json
{
  "url": "https://zoom.us/j/1234567890",
  "status": "skipped",
  "error": "Not a recognised Zoom recording link. Supported: a cloud recording (/rec/play, /rec/share, /rec/component-page on zoom.us or zoomgov.com), a Zoom Clip (/clips/share, /clips/embed), or a Zoom Events session (events.zoom.us). Meeting join links (/j/, /w/, /my/) are not recordings.",
  "error_code": "INVALID_URL"
}
```

`status` is one of:

| Value | Meaning |
|---|---|
| `success` | Everything requested was extracted |
| `partial_success` | Metadata and transcript came back; the video file did not transfer |
| `failed` | Zoom would not serve this recording (private, passcode-protected, expired, deleted) |
| `skipped` | The link is not a Zoom recording link — nothing was requested from Zoom |

---

## 🎯 Configuration Examples

### **Basic Video Archive**
```json
{
  "zoom_urls": [
    { "url": "https://zoom.us/rec/play/9b9ZhVaccgw7DUO95__XpeBB..." }
  ],
  "download_videos": false,
  "downloadTranscript": true,
  "outputFormat": "srt"
}
```

### **Complete Meeting Backup**
```json
{
  "zoom_urls": [
    { "url": "https://zoom.us/rec/play/example..." },
    { "url": "https://events.zoom.us/video/example..." }
  ],
  "download_videos": true,
  "downloadTranscript": true,
  "outputFormat": "vtt"
}
```

### **Clips Processing**
```json
{
  "zoom_urls": [
    { "url": "https://zoom.us/clips/share/example..." }
  ],
  "download_videos": false,
  "downloadTranscript": true,
  "outputFormat": "txt"
}
```

### **Events Archive**
```json
{
  "zoom_urls": [
    { "url": "https://events.zoom.us/ejl/example..." }
  ],
  "download_videos": true,
  "downloadTranscript": true,
  "outputFormat": "srt"
}
```

---

## 🔄 Advanced Features

### **Reliability & Performance**
- **State Management**: Auto-resume from interruption points with progress tracking
- **Error Handling**: Robust recovery with automatic retry mechanisms
- **Storage Optimization**: Efficient file organization with direct download URLs
- **Detailed Logging**: Complete processing history and performance monitoring

### **Content Processing**
- **Multi-Format Support**: Handles all Zoom recording types seamlessly
- **Batch Operations**: Efficient bulk processing of multiple recordings
- **Memory Optimization**: Smart resource management for large video files

### **Smart Detection**
- **Automatic Type Detection**: Identifies recording type (regular, events, clips)
- **URL Validation**: Comprehensive URL format checking
- **Platform Recognition**: Helpful redirections for non-Zoom URLs

---

## ⚠️ Smart Memory Management for Video Downloads

When `download_videos` is enabled, this Actor uses **intelligent resource allocation** powered by our specialized [Universal File Downloader](https://apify.com/dz_omar/universal-downloader?fpr=smcx63) to optimize memory usage and prevent failures. The Actor automatically analyzes each video's file size and dynamically allocates the optimal amount of memory needed for successful downloads.

### ✅ **How It Works**

**Dynamic Resource Calculation**: The Actor examines each video file before downloading and calculates the exact memory requirements based on file size, ensuring efficient resource usage without waste.

**Automatic Memory Scaling**: Memory allocation automatically scales from 128MB for small videos up to 32GB for very large files, preventing both resource waste and Out-Of-Memory errors.

**Intelligent Timeout Management**: Download timeouts are calculated based on file size and estimated connection speed, ensuring downloads complete successfully without unnecessary waiting.

**Enterprise-Grade Download Engine**: Powered by our [Universal File Downloader](https://apify.com/dz_omar/universal-downloader?fpr=smcx63) Actor, which provides advanced proxy support, retry mechanisms, and streaming technology for reliable downloads of any size.

### 💡 **Benefits for Users**

- **No Manual Configuration**: You don't need to guess or manually set memory requirements
- **Prevents Failures**: Eliminates OOM crashes that could interrupt your downloads
- **Cost Efficient**: Optimizes resource usage to minimize unnecessary costs
- **Handles Any Size**: From short clips to multi-hour recordings, all processed reliably
- **Batch Processing**: Each video gets its own optimized resource allocation
- **Enterprise Reliability**: Advanced error handling and automatic retry mechanisms
- **Proxy Support**: Built-in proxy rotation for improved download success rates

### 📖 **[Learn more about Apify usage and resources](https://docs.apify.com/platform/actors/running/usage-and-resources)**

---

## 📋 Supported URL Formats

### **Cloud Recordings** — commercial and government
```
https://zoom.us/rec/play/[RECORDING_ID]
https://zoom.us/rec/share/[RECORDING_ID]
https://zoom.us/rec/component-page/[RECORDING_ID]
https://us02web.zoom.us/rec/play/[RECORDING_ID]
https://[company].zoom.us/rec/play/[RECORDING_ID]       ← vanity subdomain
https://www.zoomgov.com/rec/play/[RECORDING_ID]         ← US government
https://[agency].zoomgov.com/rec/share/[RECORDING_ID]   ← agency subdomain
```

### **Zoom Events**
```
https://events.zoom.us/video/[VIDEO_ID]
https://events.zoom.us/evj/[EVENT]?videoId=[VIDEO_ID]
https://events.zoom.us/ev/[EVENT_ID]
```

### **Zoom Clips**
```
https://zoom.us/clips/share/[CLIP_ID]
https://zoom.us/clips/embed/[CLIP_ID]
https://www.zoom.us/clips/share/[CLIP_ID]
https://zoomclips.zoom.us/clips/share/[CLIP_ID]
```

### **Not Recordings** (reported as `skipped`)
```
https://zoom.us/j/[MEETING_ID]        ← meeting join link
https://zoom.us/w/[WEBINAR_ID]        ← webinar join link
https://zoom.us/my/[USERNAME]         ← personal meeting room
```

On a replay page that holds several recordings ("Total 2 Recordings"), the link you
paste decides which one is extracted — paste the link for the recording you actually
want and you get that one, not the first on the page.

---

## 🛠️ Troubleshooting

### **Access Issues**
- **Passcode-protected recordings cannot be read.** The actor has no browser session of
  yours, so a recording that asks for a passcode (or a sign-in) when you open it in a
  browser will come back as `failed`. This is a limit of server-side extraction, not a
  bug — most `/rec/` links are protected this way.
- **Expiration**: recordings and their download links expire; check the link still opens
- **Permissions**: verify the recording is reachable without signing in

### **Missing Content**
- **Transcripts**: Must be enabled by meeting host
- **Private recordings**: May require authentication
- **Expired links**: Contact meeting organizer for new links

### **Performance Issues**
- **Memory errors**: Increase memory allocation for video downloads
- **Large files**: Consider processing individually
- **Network issues**: Check internet connection stability

### **URL Format Errors**
- **Invalid URLs**: Ensure URLs are complete and properly formatted
- **Wrong platform**: Use [Loom Video Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63) for Loom URLs
- **Shortened URLs**: Use full Zoom URLs instead of shortened versions

---

## 📊 Dataset Views

The actor provides three specialized dataset views for different use cases:

### **🎬 Overview View**
- One row per link: title, type, date, length, download link, status
- Shows at a glance which links worked and which did not

### **🔍 Detailed View**
- Complete recording information
- Full transcript content inline
- Comprehensive metadata

### **📥 Downloads Only**
- Streamlined view focusing on download links
- File sizes and formats
- Perfect for batch downloading

---

## 🤝 Support & Resources

### **Getting Help**

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

### **Related Actors**
- **🎬 Loom Video Scraper**: [https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)
- **📁 Universal File Downloader**: [https://apify.com/dz_omar/universal-downloader?fpr=smcx63](https://apify.com/dz_omar/universal-downloader?fpr=smcx63)

### **Technical Integration**
This actor leverages our **Universal File Downloader** for enterprise-grade video processing:
- **Advanced Proxy Support**: Automatic proxy rotation for improved success rates
- **Retry Mechanisms**: Intelligent retry logic with exponential backoff
- **Streaming Technology**: Memory-efficient streaming for large file downloads
- **Progress Tracking**: Real-time download progress monitoring
- **Error Recovery**: Automatic resume from failed download points

### **Legal & Compliance**
- **Responsible Usage**: Only processes publicly accessible recordings with proper rate limiting
- **Terms Compliance**: Follows Zoom's terms of service without bypassing security measures
- **Data Protection**: Secure processing with automatic cleanup
- **Privacy Respect**: No unauthorized data collection with transparent usage policies

---

## 🌟 Why Choose This Actor?

- **✅ Every Zoom Surface**: cloud recordings, government tenants, clips, and events
- **✅ Subtitle Files That Work**: correct start and end times on every cue, in four formats
- **✅ The Right Recording**: on multi-recording pages, the link you paste is the one extracted
- **✅ Nothing Disappears**: every link returns a row, with a reason when it could not be read
- **✅ Smart URL Detection**: non-Zoom links are named and pointed at the right actor
- **✅ Memory Optimized**: run resources sized from a measurement of the actual file
- **✅ Batch Processing**: efficient handling of many recordings in one run
- **✅ State Management**: resumes from where it stopped after an interruption

Start archiving your Zoom content today with professional-grade extraction and organization!