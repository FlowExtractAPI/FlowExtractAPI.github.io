# 🔗 Facebook Ads URL Parser

**Copy any Facebook Ad Library URL and get instant ad data** - No configuration needed.

> **Copy URL → Get Results → Done**

---

## 🚀 Quick Start

### Step 1: Copy URL from Facebook

Open [Facebook Ad Library](https://www.facebook.com/ads/library/), use any filters you want, then copy the URL from your browser address bar.

Example URL:
```
https://www.facebook.com/ads/library/?q=nike&country=US&active_status=active&...
```

### Step 2: Create Input

Save your URL to `input.json`:

```json
{
  "URLAds": [
    {
      "url": "https://www.facebook.com/ads/library/?q=nike&country=US&..."
    }
  ],
  "maxResultsPerURL": 200
}
```

### Step 3: Run Actor

```bash
apify call dz_omar/facebook-ads-url --input input.json
```

### Step 4: Get Results

Results appear in your dataset - same format as - **[facebook-ads-scraper-pro!](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**

---


---

## ⚠️ Important: This Actor Runs Facebook Ads Scraper Pro — and You Are Charged for It

This Actor is a **URL-based wrapper**. It does **not scrape ads itself**.

When you run **[Facebook Ads URL Parser](https://apify.com/dz_omar/facebook-ads-url?fpr=smcx63)**:

1. It starts **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)** **in your own Apify account**, passing it your URLs
2. Facebook Ads Scraper Pro reads the filters from each URL and scrapes the ads
3. Every ad is copied into this Actor's dataset **as soon as it is scraped** — you don't have to wait for the run to finish

### 💳 Billing — please read

* **Facebook Ads Scraper Pro is a paid, pay-per-event Actor.** Every run of this Actor starts a Facebook Ads Scraper Pro run, and **you are charged Facebook Ads Scraper Pro's prices** (a small start fee plus a fee per ad scraped) — exactly as if you had run it yourself
* See the current prices on the **[Facebook Ads Scraper Pro pricing tab](https://apify.com/dz_omar/facebook-ads-scraper-pro/pricing?fpr=smcx63)**
* This Actor adds **no extra fee** of its own — you only pay for the ads Facebook Ads Scraper Pro collects, plus the usual platform usage of both runs
* `maxResultsPerURL` controls how many ads (and so how many charges) each URL can produce
* Apify free-plan accounts get a **sample of up to 200 results per run** (a Facebook Ads Scraper Pro limit)

### What you will see in your account

* **Two runs** for each execution: this one, and the Facebook Ads Scraper Pro run it started. This is expected
* The log of this run links to the Facebook Ads Scraper Pro run so you can watch it live
* **Aborting this run also aborts the Facebook Ads Scraper Pro run**, so charges stop
* Nothing runs automatically — Facebook Ads Scraper Pro only starts when you start this Actor

If you prefer full control over parameters (keywords, advertisers, ad-detail enrichment), run the scraper directly:

👉 **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**

---

## When to Use This Actor

Use **Facebook Ads URL Parser** if you want to:

* Re-run saved Facebook Ad Library URLs
* Automate competitor monitoring using copied URLs
* Avoid manually configuring search parameters

Use **Facebook Ads Scraper Pro** if you want:

* Direct parameter-based control
* Clear visibility into compute usage per run
* Advanced scraping options

---

### ✅ Transparency Notice

This Actor intentionally runs **Facebook Ads Scraper Pro** in your account to ensure consistent output and feature parity with the main scraper, and that run is **billed to you at Facebook Ads Scraper Pro's prices**. This behavior is by design and not an automatic or hidden trigger.

---

## 📋 Input Format

That's it. Just two fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `URLAds` | array | ✅ Yes | Array of Facebook Ad Library URLs |
| `maxResultsPerURL` | integer | ❌ No | Max ads per URL (default: 10, range: 10-∞) |

### Example

**Multiple URLs:**
```json
{
  "URLAds": [
    {"url": "https://www.facebook.com/ads/library/?q=nike&..."},
    {"url": "https://www.facebook.com/ads/library/?q=adidas&..."},
    {"url": "https://www.facebook.com/ads/library/?search_type=page&view_all_page_id=12345&..."}
  ],
  "maxResultsPerURL": 10
}
```

**With Custom Limit:**
```json
{
  "URLAds": [
    {"url": "https://www.facebook.com/ads/library/?..."}
  ],
  "maxResultsPerURL": 500
}
```

---

## 📤 Output

You get the exact same ad data as the main scraper:

```json
{
  "id": "1234567890",
  "page_name": "Nike",
  "page_likes": 5000000,
  "text": "Just Do It",
  "title": "Campaign Title",
  "start_date": "2024-01-15",
  "is_active": true,
  "media": {
    "type": "image",
    "primary_thumbnail": "https://..."
  },
  ...
}
```

Each ad is one item in your dataset.

---

## 💡 Common Scenarios

### Monitor Competitor Ads
Copy the URL after searching for your competitor:
```json
{
  "URLAds": [
    {"url": "https://www.facebook.com/ads/library/?q=competitor_brand&..."}
  ]
}
```

### Track Specific Brand
Copy the URL after selecting a page:
```json
{
  "URLAds": [
    {"url": "https://www.facebook.com/ads/library/?search_type=page&view_all_page_id=15087023444&..."}
  ]
}
```

### Analyze Multiple Regions
Copy URLs from different countries:
```json
{
  "URLAds": [
    {"url": "https://www.facebook.com/ads/library/?q=nike&country=US&..."},
    {"url": "https://www.facebook.com/ads/library/?q=nike&country=GB&..."},
    {"url": "https://www.facebook.com/ads/library/?q=nike&country=DE&..."}
  ],
  "maxResultsPerURL": 100
}
```

---

## ✅ Supported URLs

- ✅ Keyword search URLs
- ✅ Advertiser/page search URLs
- ✅ Date-filtered URLs
- ✅ Country/language-filtered URLs
- ✅ Platform-filtered URLs
- ✅ Single ad links (`https://www.facebook.com/ads/library/?id=...`)
- ✅ Any Facebook Ad Library URL

---

## 🔗 Related Actors

- **[facebook-ads-scraper-pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)** - Direct search using parameters (advanced)

---

## 🤝 Support & Resources

## 📞 Support

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
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