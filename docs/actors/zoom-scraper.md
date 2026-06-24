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
- **Metadata**: ID, title, duration, file size, start time, recording type
- **Technical**: MP4 format, direct download URLs, quality information
- **Recording Details**: Host information, meeting details, timestamps

### 📝 **Transcript Processing**
- **Multiple Formats**: SRT, VTT, TXT, XML exports with precise timestamps
- **Clean Text**: Formatted, readable content ready for analysis
- **Search Ready**: Full-text search capabilities across your library
- **Integration**: Compatible with video players and analysis tools

### 🎯 **Multi-Platform Support**
- **Regular Recordings**: Standard Zoom meeting recordings (zoom.us/rec/)
- **Zoom Events**: Large-scale event recordings (events.zoom.us)
- **Zoom Clips**: Short video clips (zoom.us/clips/)
- **Smart Detection**: Automatic platform identification and processing

---

## ⚡ Smart URL Detection & Redirection

### **🎬 Loom URL Detection**
When you accidentally enter Loom URLs, the actor provides helpful guidance:
- Detects individual Loom videos (`loom.com/share/VIDEO_ID`)
- Identifies Loom folders (`loom.com/share/folder/FOLDER_ID`)
- Redirects to specialized [Loom Video Scraper](https://apify.com/dz_omar/loom-video-scraper) for better results

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

### **Regular Zoom Recording**
```json
{
  "url": "https://zoom.us/rec/play/9b9ZhVaccgw7DUO95__XpeBBAxB1_CjT6aLG54MqHZ_hWfTtZDKLudAu9esfQZSslb9zTknRvaHgcS51...",
  "Title": "PICO Meeting",
  "startTime": "2022-09-23T14:28:59.000Z",
  "transcript_info": {
    "transcript": "1\n00:01:03,300 --> 00:01:05,390\nWe\n\n2\n00:01:07,950 --> 00:01:08,470\nMicah Tseng: Thank you."
  },
  "recordingType": "recordings"
}
```

### **Zoom Events Recording**
```json
{
  "url": "https://events.zoom.us/ejl/Aj2xj4JZJL-4Xyrm5GMDX1OuCKVWyr5Eh4_w7wGGROLGXLIgJQRG...",
  "Title": "2 Day Generative AI Mastermind | Day-1",
  "startTime": "2025-07-26T04:30:00.000Z",
  "transcript_info": {
    "transcript": "1\n00:00:01,610 --> 00:00:02,610\nPhani Krishna - Outskill: Welcome everyone..."
  },
  "recordingType": "events"
}
```

### **Zoom Clips**
```json
{
  "url": "https://zoom.us/clips/share/fCRF3_4rHSwIWeTsbCC8liNDNJiBgAatqliI3jtK8g0H69WU19Hx41N4WWQ0rs0n...",
  "Title": "John Hay PTSA Sep/Oct Membership Meeting",
  "startTime": "2024-09-17T21:50:00.000Z",
  "transcript_info": {
    "transcript": "1\n00:00:00,170 --> 00:00:01,170\nThank you.\n\n2\n00:00:04,070 --> 00:00:10,070\nI think we all really need to advocate for John..."
  },
  "recordingType": "clips"
}
```

### **With Downloads Enabled**
When `download_videos: true` and `downloadTranscript: true`:

```json
{
  "url": "https://zoom.us/rec/play/example...",
  "Title": "PICO Meeting",
  "startTime": "2022-09-23T14:28:59.000Z",
  "video_url": "https://api.apify.com/v2/key-value-stores/q6VQFhKFOBks7LCTT/records/PICO_Meeting.mp4?signature=MBL7s5lCwsydbDaE707E",
  "video_size": "206 MB",
  "transcript_info": {
    "transcript": "1\n00:01:03,300 --> 00:01:05,390\nWe\n\n2\n00:01:07,950 --> 00:01:08,470\nMicah Tseng: Thank you.",
    "transcript_url": "https://api.apify.com/v2/key-value-stores/ySHfyw860qMzC74Zr/records/PICO_Meeting_transcript.srt"
  },
  "recordingType": "recordings"
}
```

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

When `download_videos` is enabled, this Actor uses **intelligent resource allocation** powered by our specialized [Universal File Downloader](https://apify.com/dz_omar/universal-file-downloader) to optimize memory usage and prevent failures. The Actor automatically analyzes each video's file size and dynamically allocates the optimal amount of memory needed for successful downloads.

### ✅ **How It Works**

**Dynamic Resource Calculation**: The Actor examines each video file before downloading and calculates the exact memory requirements based on file size, ensuring efficient resource usage without waste.

**Automatic Memory Scaling**: Memory allocation automatically scales from 128MB for small videos up to 32GB for very large files, preventing both resource waste and Out-Of-Memory errors.

**Intelligent Timeout Management**: Download timeouts are calculated based on file size and estimated connection speed, ensuring downloads complete successfully without unnecessary waiting.

**Enterprise-Grade Download Engine**: Powered by our [Universal File Downloader](https://apify.com/dz_omar/universal-file-downloader) Actor, which provides advanced proxy support, retry mechanisms, and streaming technology for reliable downloads of any size.

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

### **Regular Zoom Recordings**
```
https://zoom.us/rec/play/[RECORDING_ID]
https://zoom.us/rec/share/[RECORDING_ID]
https://www.zoom.us/rec/play/[RECORDING_ID]
```

### **Zoom Events**
```
https://events.zoom.us/ejl/[EVENT_ID]
https://events.zoom.us/video/[VIDEO_ID]
```

### **Zoom Clips**
```
https://zoom.us/clips/share/[CLIP_ID]
https://zoom.us/clips/embed/[CLIP_ID]
https://www.zoom.us/clips/share/[CLIP_ID]
```

---

## 🛠️ Troubleshooting

### **Access Issues**
- **Password Protection**: Some recordings may require passwords
- **Expiration**: Check if recording links have expired
- **Permissions**: Verify you have access to the recording

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
- **Wrong platform**: Use [Loom Video Scraper](https://apify.com/dz_omar/loom-video-scraper) for Loom URLs
- **Shortened URLs**: Use full Zoom URLs instead of shortened versions

---

## 📊 Dataset Views

The actor provides three specialized dataset views for different use cases:

### **🎥 Overview View**
- Quick summary with essential information
- Download links for videos and transcripts
- Recording metadata and timestamps

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
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

### **Related Actors**
- **🎬 Loom Video Scraper**: [https://apify.com/dz_omar/loom-video-scraper](https://apify.com/dz_omar/loom-video-scraper)
- **📁 Universal File Downloader**: [https://apify.com/dz_omar/universal-file-downloader](https://apify.com/dz_omar/universal-file-downloader)

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

- **✅ Multi-Platform Support**: Handles all Zoom recording types seamlessly
- **✅ Smart URL Detection**: Automatically redirects non-Zoom URLs to appropriate actors
- **✅ Comprehensive Output**: Rich metadata, transcripts, and video files
- **✅ Memory Optimized**: Intelligent resource management for reliable downloads
- **✅ Transcript Formats**: Multiple export formats for different use cases
- **✅ Batch Processing**: Efficient handling of multiple recordings
- **✅ Error Recovery**: Robust error handling and automatic retries
- **✅ State Management**: Resume processing from interruption points

Start archiving your Zoom content today with professional-grade extraction and organization!