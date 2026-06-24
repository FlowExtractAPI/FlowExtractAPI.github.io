# 🔍 Facebook Ads Scraper Pro - Ad Library Intelligence

**Extract comprehensive data from Facebook's Ad Library** with real-time streaming, advanced filtering, and standby mode support.

> **Search Keywords & Advertisers & URLs → Stream Real-Time Ad Data → Get Complete Analytics**

---

## 🎬 Video Tutorial

<!-- TODO: Replace with actual YouTube video link once published -->
[![Watch the Tutorial](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?style=for-the-badge&logo=youtube)](https://youtube.com/@FlowExtractAPI)

https://www.youtube.com/watch?v=yNSIhZcDlNY

---

## 💎 Pricing Tiers - Choose Your Plan

### **FREE TIER** ✅ 
Get started with no upfront cost

**Included:**
- ✅ Full access to Facebook Ad Library data
- ✅ Multi-language & multi-country filtering
- ✅ Real-time batch pushing (results appear as they're collected)
- ✅ Complete media asset extraction (images & videos)
- ✅ All filtering options (date ranges, platforms, categories)

**Trade-offs:**
- ⚠️ Shared proxy infrastructure
- ⚠️ Occasional connection interruptions
- ⚠️ Best for small to medium projects (< 500 ads)

---

### **PAID TIER** ⭐ *RECOMMENDED FOR PRODUCTION*
Upgrade for **enterprise-grade reliability**

**All Free Tier features PLUS:**
- 🚀 **Dedicated premium proxy** - Your own reliable connection
- 🚀 **No rate limiting** - Unlimited continuous scraping
- 🚀 **100% success rate** - Stable, uninterrupted operations
- 🚀 **Extract ∞+ ads per query** - No slowdowns or blocks
- 🚀 **Perfect for production use** - Enterprise-ready infrastructure
- 🚀 **Consistent performance** - No random connection errors

**Why upgrade?**
- **Avoid interruptions**: Your dedicated proxy won't hit Facebook's rate limits
- **Reliability**: No HTTP errors or temporary blocks
- **Scale effortlessly**: Handle large datasets with perfect stability
- **Best for agencies**: Reliable results for client reports and production systems
- **Zero downtime**: 24/7 stable scraping without worries

---

## 🚀 Quick Start

### Option 1: Run as Batch Job (One-Time Execution)

Perfect for: One-off scraping tasks, scheduled runs, offline processing

```bash
apify call dz-omar/facebook-ads-scraper-pro --input input.json
```

**Input format (input.json):**
```json
{
  "searchQueries": ["nike", "adidas"],
  "searchAdvertisers": ["15087023444"],
  "maxResultsPerQuery": 50,
  "countries": ["US"],
  "activeStatus": "ACTIVE",
  "mediaType": "IMAGE"
}
```

**Process Flow:**
1. Actor starts
2. Processes your request
3. Returns results
4. Actor stops

---

### Option 2: Run with Ad Library URLs (New in v0.2) 🔗

Perfect for: Copying searches directly from Facebook's Ad Library website, or fetching a specific ad by ID

```json
{
  "URLAds": [
    {
      "url": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=nike&media_type=video"
    },
    {
      "url": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=adidas"
    }
  ],
  "maxResultsPerQuery": 50
}
```

**How URL Mode works:**
1. Go to [Facebook Ad Library](https://www.facebook.com/ads/library/) and set up your search
2. Copy the URL from your browser
3. Paste it into the `URLAds` field
4. All filters from the URL (country, language, date range, media type, platforms, sort order) are extracted automatically
5. The actor parses each URL and runs the search for you

**📌 Single ad links supported:**
URLs with `?id=` fetch that specific ad directly  no search query needed:
```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?id=907653308384731" }
  ],
  "enrichWithAdDetails": true
}
```

**Combining URL Mode with Manual Search:**

You can provide URLs alongside keyword and advertiser searches  all run sequentially:

```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=pokemon&media_type=video" }
  ],
  "searchQueries": ["apify"],
  "searchAdvertisers": ["Nike", "15087023444"],
  "maxResultsPerQuery": 50,
  "activeStatus": "ALL",
  "adType": "ALL"
}
```

**Execution order:**
1. 🔗 All `URLAds` are processed first (each URL uses its own filters from the URL)
2. 🏢 Then `searchAdvertisers` are resolved and scraped (using the input schema filters)
3. 🔍 Then `searchQueries` are run as keyword searches (using the input schema filters)

`maxResultsPerQuery` controls the maximum ads collected per URL, per advertiser page, and per keyword query.

---

### Option 3: Run in Standby Mode (Recommended) ⭐

Perfect for: Real-time applications, multiple requests, APIs, instant responses

```bash
# Actor automatically runs in standby mode
# Access via: https://dz-omar--facebook-ads-scraper-pro.apify.actor
```

**Standby Mode Advantages:**

| Feature | Batch Mode | Standby Mode |
|---------|-----------|--------------| 
| **Cold Start** | 8-15 seconds | 0 seconds ⚡ |
| **Response Time** | Slow (start overhead) | Instant |
| **Best For** | Scheduled tasks | Real-time apps |
| **Concurrent Requests** | Sequential | Parallel ∞ |
| **Always Running** | No | Yes (pre-warmed) |
| **Cost** | Lower | Higher (always on) |
| **Ideal Use** | Nightly scrapes | Live dashboards |

**Real-World Comparison:**

| Scenario | Batch Mode | Standby Mode |
|----------|-----------|--------------| 
| Track competitor ads daily | ✅ Good | ⭐ Excellent |
| Build a SaaS dashboard | ⚠️ Too slow | ✅ Perfect |
| One-time research project | ✅ Best | Overkill |
| API for other apps | ❌ Not viable | ✅ Ideal |
| Monitor 50 keywords live | ❌ No | ✅ Yes |

**Example: Why Standby Mode is Better for Real-Time Dashboards**

Imagine you're building a competitor monitoring dashboard that updates live:

**Without Standby (Batch Mode):**
```
User clicks "Refresh"
  ↓
Wait 10 seconds for cold start
  ↓
Wait 30 seconds for results
  ↓
40 seconds total ❌ (User closes browser)
```

**With Standby Mode:**
```
User clicks "Refresh"
  ↓
Results instantly (pre-warmed)
  ↓
2 seconds total ✅ (User stays engaged)
```
---

## 📡 API Endpoints

### POST / - Custom Scraping with Real-Time Streaming

Send search parameters and receive ad data in real-time NDJSON stream.

**Full Example:**
```bash
curl -X POST https://dz-omar--facebook-ads-scraper-pro.apify.actor \
  -H "Content-Type: application/json" \
  -d '{
    "searchQueries": ["nike", "adidas"],
    "searchAdvertisers": ["Nike Football", "15087023444"],
    "maxResultsPerQuery": 100,
    "countries": ["US"],
    "contentLanguages": ["en"],
    "activeStatus": "ACTIVE",
    "adType": "ALL",
    "mediaType": "IMAGE",
    "publisherPlatforms": ["FACEBOOK", "INSTAGRAM"],
    "sortBy": "SORT_BY_TOTAL_IMPRESSIONS",
    "startDate": "2024-01-01",
    "endDate": "2025-01-31"
  }'
```

**Minimal Example:**
```bash
curl -X POST https://dz-omar--facebook-ads-scraper-pro.apify.actor \
  -H "Content-Type: application/json" \
  -d '{"searchQueries": ["nike"]}'
```

**Advertiser-Only Search:**
```bash
curl -X POST https://dz-omar--facebook-ads-scraper-pro.apify.actor \
  -H "Content-Type: application/json" \
  -d '{"searchAdvertisers": ["Nike"], "maxResultsPerQuery": 200}'
```

**Save Results to File:**
```bash
curl -X POST https://dz-omar--facebook-ads-scraper-pro.apify.actor \
  -H "Content-Type: application/json" \
  -d '{"searchQueries": ["nike"]}' \
  > results.ndjson
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `URLAds` | array | `[]` | Facebook Ad Library URLs to scrape directly (new in v0.2) |
| `searchQueries` | array | `[]` | Keywords to search (e.g., `["nike", "adidas"]`) |
| `searchAdvertisers` | array | `[]` | Advertiser names or page IDs |
| `maxResultsPerQuery` | integer | `10` | Max ads per URL / per query / per advertiser page |
| `batchSize` | integer | `30` | Ads per batch request |
| `countries` | array/string | `["ALL"]` | Country codes (e.g., `["US", "GB", "FR"]`) |
| `contentLanguages` | array | `[]` | Language codes (e.g., `["en", "es", "fr"]`) |
| `activeStatus` | string | `"ALL"` | `"ALL"`, `"ACTIVE"`, `"INACTIVE"` |
| `adType` | string | `"ALL"` | Ad category filter |
| `mediaType` | string | `"ALL"` | Media type filter |
| `publisherPlatforms` | array | `[]` | Platforms to search |
| `sortBy` | string | `"SORT_BY_TOTAL_IMPRESSIONS"` | Sort method |
| `startDate` | string | `null` | Start date (YYYY-MM-DD) |
| `endDate` | string | `null` | End date (YYYY-MM-DD) |
| `enrichWithAdDetails` | boolean | `false` | Fetch full ad details per result (advertiser info, targeting, payer/beneficiary, violations) |

### ⚠️ Important: Input Requirements

**At least one of these MUST be provided:**
- `URLAds` - Contains Facebook Ad Library URLs
- `searchQueries` - Contains search keywords
- `searchAdvertisers` - Contains advertiser names/page IDs

You can provide any combination  all are processed sequentially.

**Invalid Input Examples (Will Fail):**

```json
{
  "maxResultsPerQuery": 50
}
```
❌ Error: "No input provided. Supply either URLAds, searchQueries, or searchAdvertisers"

```json
{
  "searchQueries": [],
  "searchAdvertisers": []
}
```
❌ Error: "Both arrays are empty - no search criteria provided"

**Valid Input Examples:**

```json
{
  "URLAds": [{ "url": "https://www.facebook.com/ads/library/?q=nike&country=US" }]
}
```
✅ Valid - Parses the URL and runs the search

```json
{
  "searchQueries": ["nike"]
}
```
✅ Valid - Uses all defaults, searches for "nike"

```json
{
  "searchAdvertisers": ["15087023444"]
}
```
✅ Valid - Searches all ads from page ID

```json
{
  "URLAds": [{ "url": "https://www.facebook.com/ads/library/?q=pokemon&media_type=video" }],
  "searchQueries": ["marketing"],
  "searchAdvertisers": ["Nike", "Apple"],
  "maxResultsPerQuery": 100,
  "countries": ["US"]
}
```
✅ Valid - Runs URL first, then advertisers, then keywords

### 🔍 Enriching Results with Ad Details

By default, each result contains the core ad data. Enable `enrichWithAdDetails` to fetch a richer detail page per ad:

```json
{
  "searchQueries": ["nike"],
  "maxResultsPerQuery": 50,
  "enrichWithAdDetails": true
}
```

**Extra data included when enabled:**
-  **Advertiser info**: page about text, category, likes, profile photo, cover photo, verification status
- **Instagram**: username, followers, verification status
- **Targeting (EU)**: location audience, age/gender breakdown, total EU reach
- **Payer/Beneficiary**: who paid for and benefits from the ad
- **Violations**: any policy violation types flagged by Facebook

> **⚠️ Performance note:** Each ad requires one extra API request. Scraping will be slower.

---

### Valid Values Reference

**Ad Types:**
- `ALL` - All ad types
- `POLITICAL_AND_ISSUE_ADS` - Political/election ads
- `HOUSING_ADS` - Real estate & housing
- `EMPLOYMENT_ADS` - Job postings
- `CREDIT_ADS` - Financial products

**Media Types:**
- `ALL` - All media types
- `IMAGE` - Static images only
- `VIDEO` - Video ads only
- `MEME` - Text-heavy images
- `IMAGE_AND_MEME` - Both image types
- `NONE` - Text-only ads

**Publisher Platforms:**
- `FACEBOOK` - Main Facebook feed
- `INSTAGRAM` - Instagram feed & stories
- `MESSENGER` - Facebook Messenger
- `WHATSAPP` - WhatsApp Business
- `THREADS` - Threads social platform
- `AUDIENCE_NETWORK` - Third-party apps/sites

**Sort Methods:**
- `SORT_BY_TOTAL_IMPRESSIONS` - Most viewed first (default)
- `SORT_BY_RELEVANCY_MONTHLY_GROUPED` - Most recent first

---

## 📤 Response Format (NDJSON Stream)

Each line is a JSON object representing real-time data. Process line-by-line as they arrive:

### Log Messages
```json
{"type":"log","level":"info","message":"🔍 Processing 2 keyword queries","timestamp":"2026-01-25T23:14:09Z"}
{"type":"log","level":"success","message":"📤 Sent batch: 30 ads for \"nike\"","timestamp":"2026-01-25T23:14:15Z"}
{"type":"log","level":"error","message":"❌ Query failed: No ads found","timestamp":"2026-01-25T23:14:20Z"}
```

### Ad Batches (Real-Time)
```json
{
  "type":"batch",
  "source":"keyword_query",
  "query":"nike",
  "batchSize":30,
  "ads":[{ad_object}, {ad_object}, ...],
  "timestamp":"2026-01-25T23:14:15Z"
}
```

### Completion Events
```json
{"type":"query_complete","query":"nike","totalAds":100,"timestamp":"2026-01-25T23:14:30Z"}
{"type":"advertiser_complete","advertiser":"Nike","totalAds":50,"timestamp":"2026-01-25T23:14:35Z"}
```

### Error Events
```json
{"type":"query_error","query":"test","error":"No ads found","timestamp":"2026-01-25T23:14:25Z"}
{"type":"advertiser_error","advertiser":"invalid","error":"Could not resolve advertiser","timestamp":"2026-01-25T23:14:40Z"}
```

### Summary Statistics
```json
{
  "type":"summary",
  "stats":{
    "queries":{
      "total":2,
      "success":2,
      "failed":0,
      "ads":150
    },
    "advertisers":{
      "total":1,
      "success":1,
      "failed":0,
      "ads":50
    }
  },
  "timestamp":"2026-01-25T23:14:40Z"
}
```

### Completion
```json
{"type":"complete","timestamp":"2026-01-25T23:14:45Z"}
```

---

## 📊 Ad Data Structure

Each ad object contains:

```json
{
  "id": "606497791453836",
  "page_id": "15087023444",
  "page_name": "Nike",
  "page_url": "https://facebook.com/Nike",
  "page_profile_picture_url": "https://...",
  "page_likes": 5000000,
  "page_category": "Brand",
  
  "text": "Just Do It campaign",
  "title": "Ad Title",
  "caption": "Visit our store",
  "link_url": "https://nike.com",
  "cta_text": "Learn More",
  
  "media": {
    "type": "image|video",
    "primary_thumbnail": "https://...",
    "images": ["..."],
    "videos": ["..."]
  },
  
  "additional_assets": {
    "images": ["..."],
    "links": ["..."],
    "texts": ["..."],
    "videos": ["..."]
  },
  
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "is_active": true,
  
  "platforms": ["FACEBOOK", "INSTAGRAM"],
  "countries": ["US", "GB", "CA"],
  "ad_category": "MARKETING",
  
  "contains_sensitive_content": false,
  "scraped_at": "2026-01-25T23:14:50Z",

  // Only present when enrichWithAdDetails: true
  "ad_details": {
    "advertiser": {
      "page": { "id": "15087023444", "about": { "text": "https://nike.com" } },
      "ad_library_page_info": {
        "page_info": {
          "ig_username": "nike",
          "ig_followers": 306000000,
          "ig_verification": true,
          "page_verification": "BLUE_VERIFIED",
          "page_cover_photo": "https://...",
          "entity_type": "BRAND"
        },
        "page_spend": { "is_political_page": false }
      }
    },
    "aaa_info": {
      "targets_eu": true,
      "gender_audience": "All",
      "age_audience": { "min": 18, "max": 65 },
      "eu_total_reach": 500000,
      "location_audience": [{ "name": "France", "type": "countries" }, "..."],
      "age_country_gender_reach_breakdown": ["..."],
      "payer_beneficiary_data": [{ "payer": "Nike Inc.", "beneficiary": "Nike" }],
      "has_violating_payer_beneficiary": false,
      "is_ad_taken_down": false
    },
    "violation_types": [],
    "verified_voice_context": {
      "types": ["UNCATEGORIZED"],
      "ad_library_all_geo_fin_serv_info": { "finserv_data": [] }
    }
  }
}
```

---

## 🎯 Search Modes Explained

### 1. URL Mode (New in v0.2) 🔗
Paste Ad Library URLs directly  all filters are extracted automatically:
```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=nike&media_type=video" }
  ],
  "maxResultsPerQuery": 100
}
```

**Use Case:** You've already set up the perfect search on Facebook's Ad Library website  just copy the URL and let the actor handle it.

**📌 Single ad links also supported:**

URLs containing `?id=` fetch that one specific ad directly  no search, no pagination:
```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?id=907653308384731" }
  ]
}
```

Pair it with `enrichWithAdDetails: true` to get the full advertiser, targeting, and payer/beneficiary data for that ad:
```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?id=907653308384731" }
  ],
  "enrichWithAdDetails": true
}
```

### 2. Keyword Search
Search for ads by keywords or brand names:
```json
{
  "searchQueries": ["nike", "adidas"],
  "maxResultsPerQuery": 100
}
```

**Use Case:** Find all ads mentioning your keywords across all advertisers

> **⚠️ Important  Keyword Search is Broad by Design**
>
> When using `searchQueries`, Facebook Ads Scraper Pro performs a **keyword search across all advertisers**. This means it matches any ad whose text, title, or page name contains your keyword  not just the brand you may have in mind.
>
> For example:
> ```json
> {
>   "searchQueries": ["SHEIN"]
> }
> ```
> This will return ads from **SHEIN Brasil**, **SHEIN KIDS**, **SHEIN Mexico**, and any other page or ad copy containing the word "SHEIN". The impression-based ranking may also surface different ads than you'd expect when targeting a specific page.
>
> **If you want precise, targeted results for a specific advertiser, use one of these instead:**
> - 🏢 **`searchAdvertisers`**  resolves the brand name to its exact Facebook page(s) and fetches only their ads:
>   ```json
>   { "searchAdvertisers": ["SHEIN"] }
>   ```
> - 🔗 **`URLAds`**  copy the URL directly from Facebook's Ad Library after setting up your exact search filters:
>   ```json
>   { "URLAds": [{ "url": "https://www.facebook.com/ads/library/?q=SHEIN&country=ALL" }] }
>   ```

### 3. Advertiser Search
Search ads from specific Facebook pages:
```json
{
  "searchAdvertisers": ["Nike", "15087023444"],
  "maxResultsPerQuery": 100
}
```

**Use Case:** Monitor what a specific brand/company is advertising. Names are resolved via Facebook's typeahead API  all exact-match pages are scraped.

### 4. Combined Search
URLs, keywords, and advertisers all in one run:
```json
{
  "URLAds": [
    { "url": "https://www.facebook.com/ads/library/?q=pokemon&country=ALL&media_type=video" }
  ],
  "searchQueries": ["marketing"],
  "searchAdvertisers": ["Nike", "Apple"],
  "maxResultsPerQuery": 50
}
```

**Use Case:** Run a comprehensive competitive analysis in a single actor run. URLs are processed first with their own filters, then advertisers and keywords run with the input schema filters.

---

## 🌍 Supported Countries & Languages

### Countries (200+)
`ALL`, `US`, `GB`, `CA`, `AU`, `DE`, `FR`, `ES`, `IT`, `BR`, `IN`, `JP`, `DZ`, and 190+ more ISO 2-letter codes

### Languages (100+)
`en`, `es`, `fr`, `de`, `it`, `pt`, `ja`, `ko`, `zh`, `ar`, and 90+ more ISO 2-letter codes

---

## 🔄 Standby Mode Deep Dive

### What is Standby Mode?

Standby Mode keeps the actor running 24/7 as an HTTP API server, ready to handle requests instantly without startup delays.

**Traditional Batch Mode:**
```
Request → Start Actor (8-15s) → Process → Stop Actor
```

**Standby Mode:**
```
Request → Instant Response (pre-warmed instance)
```

### Why Choose Standby Mode?

| Use Case | Batch Mode | Standby Mode |
|----------|-----------|--------------| 
| **Nightly automated scrape** | ✅ Best choice | Overkill |
| **Live competitor dashboard** | ❌ Too slow | ✅ Essential |
| **API for external apps** | ❌ Not viable | ✅ Perfect |
| **Real-time alerts** | ❌ No | ✅ Yes |
| **Webhook integrations** | ❌ Doesn't work | ✅ Works great |
| **Mobile app backend** | ❌ No | ✅ Great |
| **Research project** | ✅ Good | Expensive |

### Technical Advantages

**Cold Start Elimination:**
- Batch: 10-15 seconds to start
- Standby: 0 seconds (instant)
- Difference: **10-15 seconds per request** saved

**Scalability:**
- Batch: One request at a time
- Standby: Handle 100+ concurrent requests
- Difference: **100x throughput**

**User Experience:**
- Batch: User waits for response
- Standby: Instant results
- Difference: **User stays engaged**

### Example: Competitor Monitoring Dashboard

**Scenario:** Build a live dashboard monitoring Nike, Adidas, and Puma ads

**With Batch Mode:**

```
Dashboard loads
  ↓
User clicks "Nike" tab
  ↓
API call to scraper
  ↓
Wait 10 seconds (cold start) ❌
  ↓
Wait 20 seconds (scraping) ❌
  ↓
Display results
  ↓
Total time: 30 seconds (user frustrated)
```

**With Standby Mode:**

```
Dashboard loads (scraper pre-warmed)
  ↓
User clicks "Nike" tab
  ↓
API call to scraper
  ↓
Results instantly ✅
  ↓
Display results
  ↓
Total time: 2 seconds (user delighted)
```

### How to Access Standby Mode

**Automatic Access:**
Simply use the actor URL directly:
```
https://dz-omar--facebook-ads-scraper-pro.apify.actor
```

**No Configuration Needed:**
- Instance is always running
- Ready 24/7
- No startup delay
- Just send HTTP requests

**Direct Integration Example:**

Your application can make direct API calls:
```
POST https://dz-omar--facebook-ads-scraper-pro.apify.actor
Content-Type: application/json

{
  "searchQueries": ["nike"],
  "maxResultsPerQuery": 50
}
```

### Standby Mode Pricing

- **Higher Cost:** Actor runs continuously
- **Break-even Point:** ~3-4 requests per day
- **Best For:** High-frequency usage patterns
- **Not Ideal For:** Low-frequency, scheduled tasks

**Cost Comparison (Example):**
```
100 daily requests
- Batch mode: 100 starts × 30 sec = 50 min/day = $$
- Standby mode: Always on = $ (often cheaper!)
```

### Standby Mode Limitations

- Maximum continuous run: ~30 minutes idle timeout
- Reconnect is automatic if disconnected
- Not suitable for very low-frequency usage
- Higher base cost even if no requests

### Standby Mode Best Practices

1. **Keep Connections Alive:** Send heartbeat requests periodically
2. **Handle Reconnections:** Implement retry logic on client side
3. **Batch Related Requests:** Send multiple queries in one request when possible
4. **Monitor Performance:** Track response times and errors
5. **Set Reasonable Limits:** Don't request 10,000 ads if you need 100

---

| Aspect | Details |
|--------|---------|
| **Requests** | No hard limit, respects Facebook's rate limits |
| **Batch Size** | Default 30 ads, configurable 10-100 |
| **Results per Query** | 1-10,000 ads per query |
| **Concurrent Requests** | Unlimited (standby mode scales automatically) |
| **Response Time** | Real-time streaming - results as they arrive |
| **Memory Usage** | No limits - stream handles 1000s of ads |

---

## 🛡️ Error Handling & Migration

### Automatic Retry Logic
- Failed queries are retried up to 3 times
- Exponential backoff prevents rate limiting
- Failed queries are logged but don't stop the job

### Migration Handling
Server automatically handles Apify platform migrations:
```json
{"type":"migrating","message":"Server is migrating to new instance","timestamp":"..."}
```

**Connection behavior:**
- Connection closes gracefully
- Reconnect to resume if interrupted
- No data loss - state is preserved

---
## 🛠️ Troubleshooting

### **URL Mode Issues**
- **URL not recognized**: Make sure you're copying from `https://www.facebook.com/ads/library/...`
- **Filters not applied**: Check that the URL contains the expected query parameters
- **Wrong result count**: Use `maxResultsPerQuery` to control how many ads are fetched per URL

### **Search Issues**
- **No results**: Try broader keywords or check spelling
- **Limited data**: Increase `maxResultsPerQuery` or expand date ranges
- **Missing recent ads**: Facebook may have indexing delays

### **Connection Issues (Free Tier)**
- **Intermittent failures**: Consider upgrading to Paid tier for stability
- **Slow performance**: Reduce batch size or split into multiple smaller runs
- **Rate limiting errors**: Wait a few minutes before retrying, or upgrade to Paid

### **Geographic Filtering**
- **Empty countries String**: Use `"ALL"` for global targeting
- **Wrong country codes**: Use ISO 2-letter codes (US, not USA)
- **Missing regional ads**: Some ads may not be available in all regions

### **Media Access**
- **Missing media URLs**: Some ads may have expired media
- **Broken links**: Media URLs may expire after extended periods
- **Empty arrays**: Check if media type matches your filter

### **Performance Optimization**
- **Large datasets**: Use date ranges to limit scope
- **Free tier limits**: Consider Paid tier for 1000+ ads per query
- **Better results**: Upgrade to Paid tier for enterprise-grade stability

---

## 📈 Business Intelligence Applications

### **🎯 Competitive Intelligence**
- **Ad Strategy Analysis**: Track competitor creative strategies
- **Platform Presence**: Monitor competitor activity across platforms
- **Campaign Duration**: Analyze campaign lengths and timing

### **🚀 Campaign Optimization**
- **Creative Inspiration**: Download high-quality assets
- **CTA Analysis**: Study effective call-to-action strategies
- **Performance Benchmarking**: Compare page engagement metrics

### **📊 Market Research**
- **Industry Trends**: Filter by category for sector analysis
- **Geographic Patterns**: Analyze regional strategies
- **Content Evolution**: Track messaging changes over time

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
- **Public Data Access**: Only processes publicly available Facebook Ad Library data
- **Rate Limiting**: Respects Facebook's service limits and terms of use
- **Data Protection**: No storage of personal information or unauthorized data collection
- **Commercial Use**: Suitable for business intelligence and research applications

---