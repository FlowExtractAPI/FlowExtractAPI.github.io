# 🏠 PropertyFinder Scraper

**Extract real estate property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar.**

Scrapes comprehensive property data from any PropertyFinder search URL  prices, locations, agent contacts, amenities, images, and detailed property specifications. Supports both English and Arabic pages, multiple countries in the same run, and optional full-detail enrichment per property.

---

## 🌍 Supported Countries

| Country | Domain | Languages |
|---------|--------|-----------|
| UAE | propertyfinder.ae | English, Arabic |
| Saudi Arabia | propertyfinder.sa | English, Arabic |
| Bahrain | propertyfinder.bh | English, Arabic |
| Egypt | propertyfinder.eg | English, Arabic |
| Qatar | propertyfinder.qa | English, Arabic |

Any search URL from any of these domains works. You can mix countries, languages, and search filters in a single run.

---

## 🚀 Quick Start

### Basic  Listing Data Only

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr" }
  ],
  "maxResults": 50,
  "fetchPropertyDetails": false,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

### Full Details + Images

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.bh/en/search?c=1&fu=0&ob=mr" }
  ],
  "maxResults": 50,
  "fetchPropertyDetails": true,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

### Multi-Country

```json
{
  "startUrls": [
    { "url": "https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr" },
    { "url": "https://www.propertyfinder.sa/en/search?c=4&fu=0&rp=y&ob=mr" },
    { "url": "https://www.propertyfinder.bh/en/search?c=1&fu=0&ob=mr" },
    { "url": "https://www.propertyfinder.eg/ar/search?c=3&fu=0&ob=mr" },
    { "url": "https://www.propertyfinder.qa/en/search?c=2&fu=0&rp=m&ob=mr" }
  ],
  "maxResults": 100,
  "fetchPropertyDetails": true
}
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array |  | Any PropertyFinder search URL(s) from any supported country. Mix countries and languages freely. |
| `maxResults` | integer | 50 | Max properties per URL. Set to `0` for unlimited. |
| `fetchPropertyDetails` | boolean | `true` | Fetch the full detail page for each property. Richer data but slower. |
| `proxyConfiguration` | object | No proxy | Apify proxy settings. Residential proxies recommended. |

---

## 📤 Output

The output shape depends on whether `fetchPropertyDetails` is enabled.

### Listing Mode (`fetchPropertyDetails: false`)

Returns the core data available from the search results page:

```json
{
  "id": "974450",
  "type": "Apartment",
  "title": "Pet Friendly | Bright | Sea View | Navy Approved |",
  "price": {
    "value": 57000,
    "currency": "BHD",
    "period": "sell",
    "is_hidden": false
  },
  "location": {
    "id": "26",
    "name": "Al Juffair",
    "full_name": "Al Juffair, Capital Governorate",
    "coordinates": { "lat": 26.211, "lon": 50.601 }
  },
  "images": [
    {
      "small": "https://static.shared.propertyfinder.bh/.../416x272.jpg",
      "medium": "https://static.shared.propertyfinder.bh/.../668x452.jpg"
    }
  ],
  "agent": {
    "id": "5384",
    "name": "Aileen Camarillo",
    "email": "aileen@newton-properties.com",
    "is_super_agent": true
  },
  "broker": {
    "id": "745",
    "name": "Newton Properties",
    "email": "ehab@newton-properties.com",
    "phone": "+97332009944"
  },
  "bedrooms": "1",
  "bathrooms": "2",
  "size": { "value": 67, "unit": "sqm" },
  "furnished": "YES",
  "amenities": ["Barbecue Area", "Central A/C", "Shared Pool", "..."],
  "details_url": "/en/plp/buy/apartment-for-sale-...-974450.html",
  "listed_date": "2025-11-23T16:14:31Z",
  "contact_options": [
    { "type": "email", "value": "aileen@newton-properties.com" },
    { "type": "phone", "value": "+97332007020" },
    { "type": "whatsapp", "value": "+97316191073" }
  ],
  "description": "Fully Furnished Apartment..."
}
```

### Detail Mode (`fetchPropertyDetails: true`)

Returns everything above plus enriched data from the property detail page:

**Additional fields:**
- `listing_id`  Internal listing identifier
- `reference`  Agent reference code (e.g., "AC-JFR-285-DEC26")
- `price_per_area`  Price per sqm/sqft
- `location_tree`  Full location hierarchy (region → area → sub-area)
- `images`  Full set with index and classification labels
- `community_images`, `tower_images`  Additional image sets
- `amenities`  With code and name (e.g., `{"code": "SP", "name": "Shared Pool"}`)
- `property_details`, `regulatory_details`  Structured property specs
- `is_verified`, `is_featured`, `is_premium`, `is_exclusive`, `is_direct_from_developer`, `is_new_construction`  Status flags
- `completion_status`, `listing_level`, `offering_type`
- `last_refreshed_at`  When the listing was last updated
- `share_url`  Full public URL to the property page
- `payment_method`  Accepted payment methods
- `video_id`, `view_360`, `floor_plans`  Media assets
- `rera`  Regulatory authority data
- **Agent enriched**: `total_properties`, `languages`, `position`, `rating_breakdown`, `avg_whatsapp_response_time`
- **Broker enriched**: `logo`, `address`, `slug`, `total_properties`, `license_number`, `total_agents`

```


## 📊 Dataset Views

The scraper includes five pre-configured views in the Apify dataset UI:

| View | Purpose |
|------|---------|
| **Overview** | Quick summary  ID, type, title, price, location, beds, baths, size |
| **Detailed** | Full property data with description, amenities, status flags, dates |
| **Contacts** | Agent and broker details with all contact options |
| **Pricing** | Price data for market analysis  price, price/sqm, payment methods |
| **Locations** | Geographic data with coordinates and location hierarchy |

---

## ⚡ Performance & Reliability

### Speed

- **Listing mode**  ~2–3 seconds per page (25 properties)
- **Detail mode**  5 concurrent detail fetches per batch
- **100 properties (listing only)**  ~15–20 seconds
- **100 properties (with details)**  ~1–2 minutes

### Crash Recovery

The scraper uses Apify's state persistence to survive crashes, migrations, and timeouts. If a run is interrupted:

- Progress is saved automatically every ~60 seconds
- On restart or resurrection, scraping resumes from where it stopped
- Already-completed URLs are skipped
- Already-scraped pages within a URL are not re-processed

### Error Handling

- Exponential backoff with 3 retries on failed requests
- Continues to the next page after 3 consecutive errors on a single page
- Continues to the next URL if a URL fails entirely
- State is preserved on failure for manual resume

### Resource Usage

- **Memory**: 1024 MB max
- **Proxy**: Residential proxies recommended for stability.

---

## 📚 URL Parameters Reference

These are the common PropertyFinder search URL parameters:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `c` | 1=buy, 2=rent, 3=commercial, 4=both | Property purpose |
| `fu` | 0=any, 1=yes, 2=no | Furnished filter |
| `rp` | y=yearly, m=monthly, w=weekly, d=daily | Rental period |
| `ob` | mr=most recent, pa=price asc, pd=price desc | Sort order |
| `l` | numeric ID | Location filter |

### Sample URLs

```
UAE:          https://www.propertyfinder.ae/en/search?c=2&fu=0&rp=y&ob=mr
Saudi Arabia: https://www.propertyfinder.sa/en/search?c=4&fu=0&rp=y&ob=mr
Bahrain:      https://www.propertyfinder.bh/en/search?c=1&fu=0&ob=mr
Egypt:        https://www.propertyfinder.eg/ar/search?c=3&fu=0&ob=mr
Qatar:        https://www.propertyfinder.qa/en/search?c=2&fu=0&rp=m&ob=mr
```

---

## ⚠️ Important Notes

- Data is extracted as-is from PropertyFinder. Prices and availability should be verified with agents.
- Built-in delays and rotating browser fingerprints minimize detection risk.
- PropertyFinder may update their website structure. If the scraper stops working, check for updates.
- Users must comply with PropertyFinder's Terms of Service and applicable data protection laws.

**The actor creator is not responsible for how users utilize the extracted data.**

---

## 💬 Support & Contact

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

## 🌟 Related Actors by FlowExtract API

### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata. Perfect for content analysis, SEO, and subtitle generation.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete playlist information with all video details from any YouTube playlist. Fast, reliable, and built for scale.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

### 🏠 Real Estate Data

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI. Free regex extraction or paid AI-powered dynamic extraction.

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

**Ready to extract PropertyFinder data?** [Start using PropertyFinder Scraper now!](https://apify.com/dz_omar/propertyfinder-scraper?fpr=smcx63)