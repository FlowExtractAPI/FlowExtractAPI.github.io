# 📚 Skool Scraper Pro

Extract structured data from any **Skool community classroom**  lessons, descriptions, videos, attachments, posts, and polls  organized and ready to use.

Perfect for **educators**, **community owners**, and **researchers** who need to archive, analyze, or repurpose their Skool course content without manual effort.

---

## 🚀 Key Benefits & Use Cases

### **📚 For Educators & Community Owners**
- Archive your full course library with descriptions, videos, and lesson resources
- **Download all Videos Hosted on Skool ** as MP4 files with selectable quality (1080p → 270p)
- Back up post content, attachments, and PDF handouts before they disappear
- Generate a searchable index of every lesson across all your courses

### **💼 For Researchers & Analysts**
- Extract poll results and engagement data (upvotes, comment counts) from course posts
- Build structured databases from community classroom content
- Analyze content distribution across courses and sections

### **🎯 For Content Teams**
- Bulk-export lesson descriptions and resource links for repurposing
- Download all post attachments (images, PDFs) in one automated run
- **Get direct download links** for every video  click to save the MP4 instantly
- Map full course structures with sections, positions, and metadata

---

## 🔍 What Gets Extracted

### 📖 **Lesson Data**
- Title, position, section, course
- Full description (plain text + raw ProseMirror format)
- Created and updated timestamps
- Direct lesson URL

### 🎬 **Video Data**
- Hosted Skool videos: playback URL, duration, thumbnail, aspect ratio
- **When `downloadVideos` is enabled:**
  - `fileSizeHuman`  human-readable file size (e.g. "81.2 MB")
  - `downloadUrl`  direct link to the stored MP4 file
  - `direct_download`  same link with `&attachment=true` for instant browser download

### 🔗 **Resources Panel**
- All links from the lesson resources panel with platform detection (YouTube, Google Drive, etc.)
- Downloadable files (PDFs, images) identified with `fileType` field
- Optional download to Key-Value Store with `kvKey` reference

### 📝 **Post Data** (linked to each lesson)
- Full post content, author, contributors
- All extracted URLs with platform detection
- Poll results (option text + vote counts)
- Upvotes and comment count

### 📎 **Post Attachments**
- Images and documents (PNG, JPEG, PDF, Word, Excel, etc.)
- File name, size, content type, download URL
- Optional download to Key-Value Store with `kvKey` reference

### 🎥 **Post Videos**
- Videos Hosted on Skool videos uploaded directly to posts
- Full playback URL, duration, thumbnail

---

## ⚙️ Input Options

### 🔗 URL Modes  Four ways to scope your extraction

The actor detects what to extract automatically from the URL format:

| URL Format | What it does |
|---|---|
| `skool.com/group/classroom` | Extract **all accessible courses** |
| `skool.com/group/classroom/38fd1c1d` | Extract **one specific course** |
| `skool.com/group/classroom/38fd1c1d?md=lessonId` | Extract **one specific lesson** |
| `skool.com/group/postName` | Extract **one specific post** (post data only) |

You can mix multiple URLs of different types in a single run.

```json
{
  "communityUrl": [
    "https://www.skool.com/my-community/classroom",
    "https://www.skool.com/my-community/01"
  ]
}
```

### 📊 Extraction Limits

#### `lessonsPerCourse` (Integer)
- **Default**: `10`
- Maximum number of lessons to extract from **each** course
- Set to `5` → extracts up to 5 lessons from each course
- Set to `1000` (maximum) to extract all lessons from every course
- Useful for testing before running full extractions on large communities

```json
{
  "communityUrl": ["https://www.skool.com/my-community/classroom"],
  "lessonsPerCourse": 3
}
```


---

### 🔒 Cookie Security & Encryption

Your cookies are sensitive credentials  they grant access to your Skool account. Here's how the Apify platform protects them:

* **Encrypted at rest**
  The `cookies` field is marked as a **secret input**.
  When you save your Actor input, cookie values are automatically encrypted using **AES-256-GCM**, and the encryption key is further protected by a **2048-bit RSA key** unique to your account and this Actor.

* **Decrypted only inside the Actor**
  The encrypted values are only decrypted within the Actor’s execution environment. No other Actor and no other user can access or decrypt your cookies.

* **Never logged or exposed**
  Secret input fields are never written to logs or displayed in the Apify Console UI. If accessed directly from storage, only encrypted ciphertext is visible.

* **Isolated per user and Actor**
  Encryption keys are unique to each user–Actor combination, ensuring complete isolation.

**In short:** once you paste your cookies into the input field, they are encrypted before storage and are only decrypted inside the secure Actor runtime  never accessible to anyone else.

---

### 🔐 Authentication

Some Skool communities require authentication to access classroom content.

| Method                             | How to use                       | When to use                              |
| ---------------------------------- | -------------------------------- | ---------------------------------------- |
| **Email + Password** (recommended) | Enter credentials in input       | Easiest and most reliable                |
| **Browser Cookies**                | Export from your browser session | Use if login fails or for advanced cases |
| **None**                           | No authentication                | Public communities only                  |

---

### 🍪 How to export your cookies (optional)

1. **Install the Cookie-Editor extension**
   - [Chrome](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

2. Log in to `skool.com` and open your community
3. Open the extension → click **Export**
4. Copy the JSON and paste it into the `cookies` field

> ⚠️ **Security Notice**
> Your cookies provide access to your account. They are treated as sensitive secrets and are never logged, exposed, or shared. For maximum safety, consider using a dedicated account.

> ⚠️ **Session Expiry**
> Cookies expire over time. If extraction fails (e.g., 403 errors), export fresh cookies and re-run the Actor.

---

### ⬇️ Download Options

#### `downloadAttachments` (Boolean)
- **Default**: `false`
- Downloads images and document files (PDF, Word, Excel, etc.) attached to lesson posts
- Saved to Key-Value Store with keys like `image-{id}.png` / `doc-{id}.pdf`
- Each attachment in the dataset gets a `kvKey` field pointing to its stored file
- ⚠️ Increases run time  large communities may have many attachments

#### `downloadResources` (Boolean)
- **Default**: `false`
- Downloads image and document files from the lesson resources panel
- Web links (YouTube, Chrome extensions, etc.) are automatically skipped  only actual files are downloaded
- Each resource gets a `kvKey` field when downloaded
- ⚠️ Only useful if the community shares PDF guides or image files in lesson resources

#### `downloadVideos` (Boolean)
- **Default**: `false`
- Downloads Videos Hosted on Skool videos from lessons and posts as MP4 files
- Saved to Key-Value Store with keys like `video-lesson-{id}.mp4`
- Each video gets `downloadUrl` and `direct_download` fields in the output
- ⚠️ Increases run time and memory significantly  videos can be several hundred MB each

#### `videoQuality` (Select)
- **Default**: `1080p`
- Preferred video resolution when downloading
- Options: `1080p` (Best), `720p` (Good), `480p` (Medium), `270p` (Low)
- **Automatic fallback**: if the selected quality is not available, the scraper picks the next lower quality
- Example: you select `720p` but the video only has `1080p` and `480p` → the scraper downloads `480p`
- Only applies when `downloadVideos` is enabled

```json
{
  "communityUrl": ["https://www.skool.com/my-community/classroom"],
  "downloadVideos": true,
  "videoQuality": "720p",
  "lessonsPerCourse": 3
}
```

---

## 📊 Sample Output

### Full lesson row with video download (`downloadVideos: true`)
```json
{
  "extractedAt": "2026-02-27T04:25:30.228Z",
  "community": "brendan",
  "communityUrl": "https://www.skool.com/brendan",
  "course": "✅ Start Here",
  "courseShortId": "7ddee36d",
  "section": "",
  "lesson": "Who am I? 🤔",
  "lessonId": "614723a946d645b6bef3145d391ecf24",
  "lessonUrl": "https://www.skool.com/brendan/classroom/7ddee36d?md=614723a946d645b6bef3145d391ecf24",
  "position": 1,
  "descriptionText": "",
  "hostedVideo": {
    "source": "mux",
    "playbackUrl": "https://stream.mux.com/PLAYBACK_ID.m3u8?token=JWT",
    "durationMs": 286668,
    "aspectRatio": "3:2",
    "status": "ready",
    "fileSizeHuman": "81.2 MB",
    "downloadUrl": "https://api.apify.com/v2/key-value-stores/.../records/video-lesson-614723a9.mp4?signature=...",
    "direct_download": "https://api.apify.com/v2/key-value-stores/.../records/video-lesson-614723a9.mp4?signature=...&attachment=true"
  },
  "resources": [],
  "post": null
}
```

### Lesson without video download (`downloadVideos: false` or no hosted video)
```json
{
  "extractedAt": "2026-02-27T04:25:58.132Z",
  "community": "brendan",
  "communityUrl": "https://www.skool.com/brendan",
  "course": "✅ Start Here",
  "courseShortId": "7ddee36d",
  "section": "",
  "lesson": "Community Intro 👋",
  "lessonId": "06e51099aa5443e3bc4bf3663be62f8e",
  "lessonUrl": "https://www.skool.com/brendan/classroom/7ddee36d?md=06e51099aa5443e3bc4bf3663be62f8e",
  "position": 2,
  "descriptionText": "",
  "hostedVideo": null,
  "resources": [],
  "post": null
}
```

### Full lesson with post, attachments, and resources
```json
{
  "extractedAt": "2026-02-22T15:30:38.866Z",
  "community": "my-community",
  "communityUrl": "https://www.skool.com/my-community",
  "course": "Course Title",
  "courseShortId": "38fd1c1d",
  "section": "Section Name",
  "lesson": "Lesson 01",
  "lessonId": "2a25cd8ad2664da78894b8290dd25b43",
  "lessonUrl": "https://www.skool.com/my-community/classroom/38fd1c1d?md=2a25cd8...",
  "position": 12,
  "descriptionText": "Lesson 01 - Introduction\nThis lesson covers...",
  "hostedVideo": {
    "source": "mux",
    "playbackUrl": "https://stream.mux.com/PLAYBACK_ID.m3u8?token=JWT",
    "durationMs": 5143300,
    "thumbnailUrl": "https://assets.skool.com/...",
    "aspectRatio": "16:9",
    "status": "ready",
    "fileSizeHuman": "450.3 MB",
    "downloadUrl": "https://api.apify.com/v2/key-value-stores/.../records/video-lesson-2a25cd8a.mp4?signature=...",
    "direct_download": "https://api.apify.com/v2/key-value-stores/.../records/video-lesson-2a25cd8a.mp4?signature=...&attachment=true"
  },
  "resources": [
    {
      "title": "Lesson on YouTube",
      "url": "https://www.youtube.com/watch?v=...",
      "platform": "youtube",
      "fileType": null,
      "kvKey": null
    },
    {
      "title": "PDF Guide",
      "url": "https://assets.skool.com/.../guide.pdf",
      "platform": "other",
      "fileType": "doc",
      "kvKey": "doc-2a25cd8ad266-r1.pdf"
    }
  ],
  "post": {
    "postId": "5b00705d9cf54ae7ae9273a64cffb9b7",
    "postName": "01",
    "postUrl": "https://www.skool.com/my-community/post/01",
    "title": "Lesson 01 - Introduction",
    "author": { "firstName": "John", "lastName": "Doe", "fullName": "John Doe" },
    "contributors": [],
    "content": "Watch the lesson here:\n[https://youtube.com/...](https://youtube.com/...)",
    "links": [{ "url": "https://youtube.com/...", "platform": "youtube" }],
    "attachments": [
      {
        "id": "6fe0d721...",
        "fileName": "handout.png",
        "contentType": "image/png",
        "url": "https://assets.skool.com/...",
        "fileSizeBytes": 6033806,
        "fileType": "image",
        "kvKey": "image-6fe0d721....png"
      }
    ],
    "videos": [
      {
        "source": "mux",
        "playbackUrl": "https://stream.mux.com/....m3u8?token=JWT",
        "durationMs": 1220880,
        "thumbnailUrl": "https://assets.skool.com/..."
      }
    ],
    "poll": {
      "entries": [
        { "text": "Yes, very clear", "count": 10 },
        { "text": "Somewhat clear", "count": 1 }
      ]
    },
    "upvotes": 15,
    "commentsCount": 7
  }
}
```


---

## 💾 Key-Value Store

When download options are enabled, files are saved to the actor's Key-Value Store organized by type:

| Key prefix | Contents | Trigger |
|---|---|---|
| `image-{id}.{ext}` | JPEG, PNG, GIF, WebP, SVG, BMP, TIFF | `downloadAttachments` or `downloadResources` |
| `doc-{id}.{ext}` | PDF, Word, Excel, CSV, TXT, JSON, XML | `downloadAttachments` or `downloadResources` |

Each downloaded file is referenced by `kvKey` on its parent object in the dataset, so you can always trace a file back to its lesson.


---

## 🤝 Support & Resources

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media
- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

---

## 🌟 Related Actors by FlowExtractAPI

### 📚 Education & Community
- **[Skool Scraper Pro](https://apify.com/dz_omar/skool-scraper-pro?fpr=smcx63)**  Lessons, videos, posts, and attachments from Skool classrooms
- **[Skool Map Scraper](https://apify.com/dz_omar/skool-map-scraper?fpr=smcx63)**  Member locations and profiles from Skool community maps

### 🎬 Video & Media
- **[Loom Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**  Loom video & transcript extraction
- **[YouTube Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**  Complete channel and playlist extraction
- **[Zoom Scraper](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**  Download Zoom recordings and transcripts
- **[TikTok Video Downloader](https://apify.com/dz_omar/tiktok-video-downloader?fpr=smcx63)**  TikTok without watermarks

### 🛠️ Developer Tools
- **[Universal Downloader](https://apify.com/dz_omar/universal-downloader?fpr=smcx63)**  Download any file type with proxy support
- **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**  Advanced website screenshot tool
- **[n8n Workflow Server](https://apify.com/dz_omar/n8n-workflow-server?fpr=smcx63)**  Run n8n automation on Apify

### 📱 Social & Ads
- **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**  Facebook Ad Library extraction
- **[Google Ads Scraper](https://apify.com/dz_omar/google-ads-scraper?fpr=smcx63)**  Google Ads Transparency Center data

---