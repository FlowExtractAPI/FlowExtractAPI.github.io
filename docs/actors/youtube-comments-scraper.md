# 💬 YouTube Comments Scraper

**Extract comments from any YouTube video with author information, likes, timestamps, and nested replies - fast, reliable, and built for scale.**

This powerful Apify actor provides professional-grade extraction of YouTube comments including author details, engagement metrics, timestamps, and nested replies. Perfect for sentiment analysis, market research, content analysis, and social listening.

---

## -- Key Features --

### 💬 Complete Comment Extraction
- **Top-level Comments** with full text content
- **Author Information** including name, channel ID, avatar, and verification status
- **Engagement Metrics** - like counts and reply counts
- **Timestamps** - when comments were posted
- **Nested Replies** - optional extraction of comment replies with pagination support

### ⚡ Performance & Reliability
- **Fast Extraction** - Optimized for speed and efficiency with parallel processing
- **Batch Operations** - Smart buffering reduces API calls by up to 3x
- **Pagination Support** - Extract unlimited comments per video
- **Sort Options** - Get top comments or newest first
- **Smart Token Handling** - Automatic extraction of sort-specific continuation tokens
- **Session Management** - Advanced proxy rotation with health tracking
- **Error Handling** - Graceful handling of disabled comments or unavailable videos

### 🛠️ Developer-Friendly
- **Clean JSON Output** - Ready for any data pipeline or API integration
- **Flexible Configuration** - Control comment count, sorting, and reply depth
- **Structured Data** - Each comment includes parent/child relationships
- **Performance Metrics** - Real-time statistics on request rates and success
- **Well-Documented** - Clear examples and comprehensive documentation

---

##  Quick Start

### Simple Example (Top Comments, No Replies)

```json
{
  "youtubeUrls": [
    {
      "url": "https://www.youtube.com/watch?v=kOO31qFmi9A"
    }
  ],
  "maxComments": 100,
  "sortBy": "top",
  "maxRepliesPerComment": 0
}
```

### Extract Newest Comments

```json
{
  "youtubeUrls": [
    {
      "url": "https://www.youtube.com/watch?v=kOO31qFmi9A"
    }
  ],
  "maxComments": 100,
  "sortBy": "newest",
  "maxRepliesPerComment": 0
}
```

### With Nested Replies

```json
{
  "youtubeUrls": [
    {
      "url": "https://www.youtube.com/watch?v=kOO31qFmi9A"
    }
  ],
  "maxComments": 50,
  "sortBy": "top",
  "maxRepliesPerComment": 10
}
```

### Multiple Videos with Maximum Replies

```json
{
  "youtubeUrls": [
    {
      "url": "https://www.youtube.com/watch?v=VIDEO_ID_1"
    },
    {
      "url": "https://www.youtube.com/watch?v=VIDEO_ID_2"
    },
    {
      "url": "https://youtu.be/VIDEO_ID_3"
    }
  ],
  "maxComments": 200,
  "sortBy": "newest",
  "maxRepliesPerComment": 50
}
```

---

## 📥 Input Configuration

### Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `youtubeUrls` | `array` | **Required** | Array of YouTube video URLs to extract comments from |
| `maxComments` | `integer` | `10` | Maximum number of top-level comments to extract per video (10-100,000) |
| `sortBy` | `string` | `top` | Sort method: `top` (most relevant) or `newest` (most recent) |
| `maxRepliesPerComment` | `integer` | `0` | Max replies per comment. Set to `0` to disable replies, or any number `> 0` to enable (1-500) |

### ⚡ NEW: Simplified Reply Configuration

**The `includeReplies` parameter has been removed!** Now it's simpler:

- **`maxRepliesPerComment: 0`** → Replies are disabled (faster extraction)
- **`maxRepliesPerComment: 10`** → Extract up to 10 replies per comment
- **`maxRepliesPerComment: 100`** → Extract up to 100 replies per comment

This makes configuration more intuitive - you just set how many replies you want, or `0` for none!

### Supported URL Formats
- ✅ `https://www.youtube.com/watch?v=VIDEO_ID`
- ✅ `https://youtu.be/VIDEO_ID`
- ✅ `https://www.youtube.com/shorts/VIDEO_ID`
- ✅ `https://www.youtube.com/live/VIDEO_ID`
- ✅ Direct video ID: `VIDEO_ID`

### Sort Options Explained

**Top Comments** (`sortBy: "top"`)
- Sorted by YouTube's relevance algorithm
- Includes most liked and engaging comments
- Best for understanding popular opinion
- Default YouTube sorting method

**Newest First** (`sortBy: "newest"`)
- Sorted by publication time (newest to oldest)
- Perfect for monitoring recent activity
- Track real-time engagement
- Requires an additional API call to extract the correct token

---

## 📤 Output Structure

### Complete Output Example

```json
{
  "videoId": "kOO31qFmi9A",
  "videoUrl": "https://www.youtube.com/watch?v=kOO31qFmi9A",
  "commentsDisabled": false,
  "sortBy": "top",
  "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
  "authorName": "@petertenthije",
  "authorChannelId": "UCjRXzLWPELehRVijzUiX7iQ",
  "authorThumbnail": "https://yt3.ggpht.com/ytc/AIdro_mvTOxNFL9dMAEzBQAvVcn4JgDSYUQHFQTOydPLOY4=s88-c-k-c0x00ffffff-no-rj",
  "text": "30 years later, and nothing has changed:\n\nThe world still uses excel;\nThere is still one guy doing the work;\nThere are still three guys being clueless;\nThere is still one guy pushing to go faster, thinking the project is doomed… and taking the credit when everything works out.",
  "publishedTime": "3 years ago (edited)",
  "likeCount": "28K",
  "replyCount": 229,
  "isVerified": false,
  "isCreator": false,
  "isHearted": false,
  "isPinned": false,
  "replies": [
    {
      "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg.9bBOqHCtsBY9bCzb1v1tt1",
      "authorName": "@arnaboceanatyahoo",
      "authorChannelId": "UCi7-fR2kGX18SCvKI_XV8rQ",
      "authorThumbnail": "https://yt3.ggpht.com/ytc/AIdro_ln6eho2LyWvvi4mCOpvOMntSiPC6DrhVb3fZyb9eY=s88-c-k-c0x00ffffff-no-rj",
      "text": "Hahaha",
      "publishedTime": "3 years ago",
      "likeCount": "78",
      "parentCommentId": "UgxQe-6VK3h-LZaul6x4AaABAg"
    }
  ],
  "scrapedAt": "2025-10-24T18:21:50.350Z"
}
```

### Output Fields Explained

#### Video Information
- `videoId` - YouTube video identifier (11 characters)
- `videoUrl` - Full YouTube video URL
- `commentsDisabled` - Whether comments are disabled (boolean)
- `sortBy` - Sort method used: `top` or `newest`
- `scrapedAt` - ISO 8601 timestamp when data was scraped

#### Top-Level Comment Fields
- `commentId` - Unique comment identifier
- `text` - Full comment text content (preserves line breaks)
- `authorName` - Display name with @ prefix
- `authorChannelId` - YouTube channel ID (starts with UC)
- `authorThumbnail` - URL to author's profile picture (88x88px)
- `publishedTime` - Relative time (e.g., "3 years ago", "2 days ago (edited)")
- `likeCount` - Number of likes as displayed (e.g., "28K", "150")
- `replyCount` - Total number of replies to this comment
- `isVerified` - Whether author has a verified checkmark
- `isCreator` - Whether author is the video creator
- `isHearted` - Whether creator hearted this comment
- `isPinned` - Whether comment is pinned by creator
- `replies` - Array of reply objects (if `maxRepliesPerComment > 0`)

#### Reply Fields
- `commentId` - Unique reply identifier
- `parentCommentId` - ID of the parent comment
- `text` - Reply text content
- `authorName` - Reply author's name
- `authorChannelId` - Reply author's channel ID
- `authorThumbnail` - Reply author's avatar URL
- `publishedTime` - When the reply was posted
- `likeCount` - Number of likes on the reply
- `isCreator` - Whether the reply is from the video creator
- `isHearted` - Whether the reply was hearted by the creator
- `isPinned` - Whether the reply is pinned

---
## 🌐 Actor Standby

**NEW in v3.0:** The actor now supports Standby Mode for real-time comment extraction via HTTP API.

### Overview

Standby Mode keeps the actor running as a persistent web service. Instead of starting a new actor run for each request, you make HTTP requests to a long-running instance. This provides:

- Instant responses without actor startup delays
- Real-time streaming of comments as they're extracted
- Ability to resume interrupted scrapes using continuation tokens
- NDJSON streaming format for progressive data delivery

### How to Use

#### 1. Start the Actor in Standby Mode

Enable Standby Mode when running the actor. The actor will start and provide a web server URL.

#### 2. Get Your API Token

Get your Apify API token from: https://console.apify.com/account/integrations?fpr=smcx63

#### 3. Make API Requests

Once running, you'll receive a standby URL like:
```
https://dz-omar--youtube-comments-scraper.apify.actor/
```

All requests must include your API token as a query parameter: `?token=apify_api_xxx`

#### 4. Send POST Requests

**Basic Request (Single Video):**

```bash
curl -X POST "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrls": [
      {"url": "https://www.youtube.com/watch?v=kOO31qFmi9A"}
    ],
    "maxComments": 50,
    "sortBy": "top",
    "maxRepliesPerComment": 0
  }'
```

**Multiple Videos:**

```bash
curl -X POST "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrls": [
      {"url": "https://www.youtube.com/watch?v=VIDEO_1"},
      {"url": "https://www.youtube.com/watch?v=VIDEO_2"}
    ],
    "maxComments": 100,
    "sortBy": "newest",
    "maxRepliesPerComment": 10
  }'
```

**Resume from Continuation Token:**

If your request was interrupted, you can resume using the continuation token:

```bash
curl -X POST "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrls": [
      {"url": "https://www.youtube.com/watch?v=kOO31qFmi9A"}
    ],
    "maxComments": 100,
    "sortBy": "top",
    "maxRepliesPerComment": 5,
    "continuationToken": "Eg0SC2h6OXRTdjNDUDZr...",
    "alreadyFetched": 50
  }'
```

#### 5. GET Request (Default Behavior)

You can also make a simple GET request to test the service:

```bash
curl "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx"
```

This will run with default settings and stream results back.

### Response Format

The API returns NDJSON (Newline Delimited JSON) format, where each line is a separate JSON object. This allows you to process data as it arrives.

**Response Types:**

**Log Messages:**
```json
{"type": "log", "message": "Fetching comments...", "timestamp": "2025-11-12T..."}
```

**Comment Batches:**
```json
{
  "type": "batch",
  "sessionId": "vid_kOO31qFmi9A_123456",
  "videoId": "kOO31qFmi9A",
  "videoUrl": "https://www.youtube.com/watch?v=kOO31qFmi9A",
  "batchSize": 10,
  "commentsSentSoFar": 10,
  "totalSent": 10,
  "continuationToken": "Eg0SC2h6OXRTdjNDUDZr...",
  "completed": false,
  "comments": [
    {
      "videoId": "kOO31qFmi9A",
      "commentId": "UgxQe-6VK3h...",
      "authorName": "@username",
      "text": "Great video!",
      "likeCount": "150",
      "replies": []
    }
  ],
  "timestamp": "2025-11-12T..."
}
```

**Video Complete:**
```json
{"type": "video_complete", "videoUrl": "...", "timestamp": "2025-11-12T..."}
```

**All Videos Complete:**
```json
{"type": "complete", "timestamp": "2025-11-12T..."}
```

**Errors:**
```json
{
  "type": "error",
  "videoUrl": "...",
  "error": "Error message",
  "errorType": "RateLimitError",
  "isRetryable": true,
  "statusCode": 429,
  "timestamp": "2025-11-12T..."
}
```

### Resuming Interrupted Requests

If your connection is interrupted or the server migrates, you'll receive:

```json
{
  "type": "migrating",
  "message": "Server is migrating, please reconnect with last token",
  "continuationToken": "Eg0SC2h6OXRTdjNDUDZr...",
  "commentsSentSoFar": 50,
  "timestamp": "2025-11-12T..."
}
```

Use the `continuationToken` and `commentsSentSoFar` values to resume:

```bash
curl -X POST "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrls": [{"url": "https://www.youtube.com/watch?v=kOO31qFmi9A"}],
    "maxComments": 100,
    "continuationToken": "Eg0SC2h6OXRTdjNDUDZr...",
    "alreadyFetched": 50
  }'
```

### Processing NDJSON Responses

**With jq (command line):**
```bash
curl -X POST "https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx" \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrls": [{"url": "..."}], "maxComments": 50}' | \
  jq -c 'select(.type == "batch") | .comments[]'
```

**With Python:**
```python
import requests
import json

response = requests.post(
    'https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx',
    json={
        'youtubeUrls': [{'url': 'https://www.youtube.com/watch?v=kOO31qFmi9A'}],
        'maxComments': 50,
        'sortBy': 'top'
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        data = json.loads(line)
        if data['type'] == 'batch':
            for comment in data['comments']:
                print(f"{comment['authorName']}: {comment['text']}")
```

**With Node.js:**
```javascript
const response = await fetch('https://dz-omar--youtube-comments-scraper.apify.actor/?token=apify_api_xxx', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    youtubeUrls: [{ url: 'https://www.youtube.com/watch?v=kOO31qFmi9A' }],
    maxComments: 50,
    sortBy: 'top'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (line.trim()) {
      const data = JSON.parse(line);
      if (data.type === 'batch') {
        data.comments.forEach(comment => {
          console.log(`${comment.authorName}: ${comment.text}`);
        });
      }
    }
  }
}
```

### Parameters

All standard input parameters work in Standby Mode:

| Parameter | Type | Description |
|-----------|------|-------------|
| `youtubeUrls` | array | YouTube video URLs to scrape |
| `maxComments` | integer | Maximum comments per video (10-100,000) |
| `sortBy` | string | `"top"` or `"newest"` |
| `maxRepliesPerComment` | integer | Max replies per comment (0 to disable) |
| `continuationToken` | string | Resume token from previous request (optional) |
| `alreadyFetched` | integer | Number of comments already fetched (optional) |

### Health Check

Check if the service is running:

```bash
curl "https://dz-omar--youtube-comments-scraper.apify.actor//heartbeat?token=apify_api_xxx"
```

Response:
```json
{
  "status": "alive",
  "activeConnections": 0,
  "timestamp": "2025-11-12T..."
}
```

### Pricing in Standby Mode

When running in Standby Mode, you're charged for:
- Compute time (while the actor is running)
- Per-result pricing (parent comments and replies) as configured

The actor automatically charges for extracted data using the pricing model defined in your actor configuration.

## 🛡️ Legal & Compliance

This actor extracts **publicly available** comment data from YouTube. All data is accessible through normal YouTube viewing.

### Important Legal Considerations

**Compliance Requirements:**
- ✅ YouTube's Terms of Service
- ✅ Applicable copyright laws
- ✅ Data protection regulations (GDPR, CCPA, etc.)
- ✅ Your jurisdiction's specific laws

**Recommended Practices:**
- ✅ Use for research, analysis, or legitimate business purposes
- ✅ Respect user privacy and anonymize data when sharing
- ✅ Do not use for harassment, spam, or malicious purposes
- ✅ Comply with data retention and deletion requirements
- ✅ Provide opt-out mechanisms if republishing data
- ✅ Credit sources appropriately

**Prohibited Uses:**
- ❌ Harassment or targeted attacks on users
- ❌ Building spam or bot networks
- ❌ Circumventing YouTube's security measures
- ❌ Selling or redistributing raw user data
- ❌ Creating deepfakes or manipulated content

### Data Privacy

**Personal Information Handling:**
- Comments include publicly visible usernames and profile pictures
- Channel IDs are public identifiers
- No private or non-public data is extracted
- Consider anonymization before sharing datasets

**GDPR Compliance:**
- Users have the right to request data deletion
- Implement data retention policies
- Document data processing purposes
- Provide transparency about data usage

---

## 🛠️ Troubleshooting

### No Comments Found

**Symptoms:**
- Empty dataset
- Message: "No comments section found or comments are disabled"

**Solutions:**
- ✅ Verify comments are enabled on the video (check YouTube page)
- ✅ Ensure the video URL is correct and complete
- ✅ Try with a different video to confirm actor functionality
- ✅ Check if video is age-restricted or private

---

### Missing or Incomplete Data

**Symptoms:**
- Some fields are `null` or missing
- Truncated comment text

**Solutions:**
- ✅ Normal behavior - not all fields exist for all comments
- ✅ `authorChannelId` may be null for deleted accounts
- ✅ `likeCount` may be null if likes are hidden
- ✅ Check `frameworkUpdates` merging for enhanced data

---

### Slow Performance

**Symptoms:**
- Actor runs longer than expected
- Timeouts or incomplete results

**Solutions:**
- ✅ Reduce `maxComments` for faster runs
- ✅ Set `maxRepliesPerComment: 0` if not needed (major speedup)
- ✅ Lower `maxRepliesPerComment` to reduce reply fetching time
- ✅ Process multiple videos in separate runs
- ✅ Check Apify platform limits and usage

---

### Rate Limiting Errors

**Symptoms:**
- HTTP 429 errors
- "Too many requests" messages
- Sudden failures mid-scrape

**Solutions:**
- ✅ Automatic proxy rotation is enabled by default
- ✅ Reduce request frequency (handled automatically)
- ✅ Split large jobs into multiple smaller runs
- ✅ Add delay between consecutive runs
- ✅ Contact support if persistent issues

---

##  Best Practices

### For Optimal Performance

1. **Start Small, Scale Up**
   - Test with 50-100 comments first
   - Verify output format meets your needs
   - Then scale to larger extractions

2. **Choose Appropriate Settings**
   - Use `sortBy: "top"` for popular opinion
   - Use `sortBy: "newest"` for real-time monitoring
   - Set `maxRepliesPerComment: 0` when replies aren't needed (10x faster!)
   - Enable replies only when needed (significant performance impact)

3. **Monitor Resource Usage**
   - Check Apify platform usage regularly
   - Optimize `maxComments` and `maxRepliesPerComment`
   - Balance speed vs. completeness

4. **Batch Processing**
   - Process videos in groups of 5-10
   - Use separate runs for very large videos
   - Schedule regular runs for ongoing monitoring

### For Data Quality

1. **Validate Input URLs**
   - Test URLs in browser first
   - Ensure videos have comments enabled
   - Check video is public and accessible

2. **Handle Missing Data**
   - Implement null checks in your code
   - Some fields may legitimately be empty
   - Don't assume all fields always exist

3. **Verify Sort Order**
   - Compare first few results with YouTube
   - Check console logs for sort token extraction
   - Newest sort requires extra API call

4. **Clean and Process Data**
   - Remove duplicates (rare but possible)
   - Parse `likeCount` strings to numbers if needed
   - Convert relative timestamps to dates if required

### For Compliance

1. **Respect User Privacy**
   - Anonymize data when sharing publicly
   - Remove personally identifiable information
   - Don't republish offensive or harmful content

2. **Document Usage**
   - Keep records of data sources
   - Document purpose of data collection
   - Maintain data processing logs

3. **Implement Retention Policies**
   - Delete old data per your policy
   - Honor user deletion requests
   - Don't hoard unnecessary data

4. **Stay Updated**
   - Review YouTube's ToS regularly
   - Monitor changes in data structure
   - Update actor when API changes

---

## 📊 Output Examples

### Example 1: Single Comment (No Replies)

```json
{
  "videoId": "kOO31qFmi9A",
  "videoUrl": "https://www.youtube.com/watch?v=kOO31qFmi9A",
  "commentsDisabled": false,
  "sortBy": "top",
  "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
  "authorName": "@petertenthije",
  "authorChannelId": "UCjRXzLWPELehRVijzUiX7iQ",
  "authorThumbnail": "https://yt3.ggpht.com/ytc/AIdro_mvTOxNFL9dMAEzBQAvVcn4JgDSYUQHFQTOydPLOY4=s88-c-k-c0x00ffffff-no-rj",
  "text": "30 years later, and nothing has changed",
  "publishedTime": "3 years ago (edited)",
  "likeCount": "28K",
  "replyCount": 229,
  "isVerified": false,
  "isCreator": false,
  "isHearted": false,
  "isPinned": false,
  "replies": [],
  "scrapedAt": "2025-10-24T18:21:50.350Z"
}
```

### Example 2: Comment with Replies (maxRepliesPerComment: 2)

```json
{
  "videoId": "kOO31qFmi9A",
  "videoUrl": "https://www.youtube.com/watch?v=kOO31qFmi9A",
  "commentsDisabled": false,
  "sortBy": "top",
  "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
  "authorName": "@petertenthije",
  "text": "Great video!",
  "replyCount": 3,
  "replies": [
    {
      "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg.9bBOqHCtsBY9bCzb1v1tt1",
      "parentCommentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
      "authorName": "@user1",
      "text": "I agree!",
      "likeCount": "78"
    },
    {
      "commentId": "UgxQe-6VK3h-LZaul6x4AaABAg.9bBOqHCtsBY9bDP_Iw25XS",
      "parentCommentId": "UgxQe-6VK3h-LZaul6x4AaABAg",
      "authorName": "@user2",
      "text": "Thanks for sharing!",
      "likeCount": "520"
    }
  ],
  "scrapedAt": "2025-10-24T18:21:50.350Z"
}
```

### Example 3: Comments Disabled

```json
{
  "videoId": "ABC123",
  "videoUrl": "https://www.youtube.com/watch?v=ABC123",
  "commentsDisabled": true,
  "totalCommentsFetched": 0,
  "scrapedAt": "2025-10-24T18:21:50.350Z"
}
```

---

## 🤝 Support & Resources

### **Getting Help**
- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)


---

## 🌟 Related Actors by DZ_OMAR

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