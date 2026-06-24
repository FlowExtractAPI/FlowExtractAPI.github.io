# 🏠 Realtor.com Scraper

**Extract real estate property listings from any Realtor.com search URL  pricing, location, agent contacts, photos, tax history, AVM estimates, nearby schools, and full listing history.**

Scrapes comprehensive property data from any Realtor.com search URL. Supports all filter combinations: property type, beds/baths, price range, new construction, 55+ communities, HOA filters, keywords, lot size, square footage, and more.

---

## 🚀 Quick Start

### Basic  Search Results

```json
{
  "startUrls": [
    { "url": "https://www.realtor.com/realestateandhomes-search/Las-Vegas_NV/type-single-family-home/beds-2-3/price-200000-400000" }
  ],
  "maxResults": 50,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"],
    "apifyProxyCountry": "US"
  }
}
```

### Advanced Filters

```json
{
  "startUrls": [
    { "url": "https://www.realtor.com/realestateandhomes-search/35007/show-55-plus/radius-50/keyword-pool,pond/hoa-400,known/sqft-500-10000/age-1+100/lot-sqft-2000-4356000/features-cfwfg2" }
  ],
  "maxResults": 100,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"],
    "apifyProxyCountry": "US"
  }
}
```

### Multi-URL Run

```json
{
  "startUrls": [
    { "url": "https://www.realtor.com/realestateandhomes-search/New-York_NY/type-condo" },
    { "url": "https://www.realtor.com/realestateandhomes-search/Austin_TX/type-single-family-home" },
    { "url": "https://www.realtor.com/realestateandhomes-search/Miami_FL/price-500000-1000000" }
  ],
  "maxResults": 50
}
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array |  | One or more Realtor.com property search URLs. Supports all filter combinations. |
| `maxResults` | integer | 10 | Max properties to scrape per URL. Set to `0` for unlimited. |
| `proxyConfiguration` | object | Apify Residential (US) | Proxy settings. US residential proxies required for reliable access. |

---

## 📤 Output

Each scraped property is saved as a single JSON record with the following fields:

```json
{
  "property_id": "1130129314",
  "listing_id": "2992941114",
  "status": "for_sale",
  "list_price": 223000,
  "price_reduced_amount": null,
  "price_per_sqft": 284,
  "photo_count": 37,
  "list_date": "2026-03-26T05:28:33Z",
  "last_update_date": "2026-03-26T10:07:40Z",
  "last_price_change_date": null,
  "last_price_change_amount": null,
  "location": {
    "address": {
      "line": "2455 W Serene Ave Unit 714",
      "city": "Las Vegas",
      "state_code": "NV",
      "postal_code": "89123",
      "state": "Nevada",
      "coordinate": { "lat": 36.019775, "lon": -115.174453 }
    },
    "street_view_url": "https://maps.googleapis.com/...",
    "neighborhoods": [{ "name": "Boca Raton" }]
  },
  "description": {
    "baths_consolidated": "2",
    "baths": 2,
    "beds": 2,
    "sqft": 784,
    "lot_sqft": null,
    "garage": null,
    "pool": null,
    "styles": null,
    "type": "multi_family",
    "text": "Resort-style luxury...",
    "year_built": 2007
  },
  "flags": {
    "is_contingent": null,
    "is_new_construction": null,
    "is_pending": null,
    "is_foreclosure": null,
    "is_price_reduced": null,
    "is_new_listing": false,
    "is_coming_soon": null
  },
  "primary_photo": {
    "href": "https://ap.rdcpix.com/...jpg"
  },
  "photos": [
    {
      "href": "https://ap.rdcpix.com/...jpg",
      "type": "realtordotcom_mls_listing_image",
      "tags": [{ "label": "living_room", "probability": 0.9997 }]
    }
  ],
  "advertisers": [
    {
      "fulfillment_id": "2720061",
      "name": "Gustavo Lopez",
      "type": "seller",
      "email": "gustavo@glo-homes.vegas",
      "href": "http://www.glo-homes.vegas",
      "state_license": "",
      "phones": [{ "number": "7025768960", "type": "Mobile", "ext": "" }],
      "office": {
        "name": "LPT Realty, LLC",
        "email": "nvbrokers@lptrealty.com",
        "phones": [{ "number": "7025450020", "type": "Office" }],
        "address": { "city": "Las Vegas", "state_code": "NV" }
      },
      "broker": { "name": "First Mutual Realty" },
      "photo": { "href": "https://ap.rdcpix.com/...jpg" }
    }
  ],
  "hoa": { "fee": null },
  "open_houses": null,
  "coming_soon_date": null,
  "virtual_tours": [{ "href": "https://www.propertypanorama.com/..." }],
  "matterport": null,
  "mortgage": {
    "estimate": {
      "loan_amount": 178400,
      "monthly_payment": 1279,
      "down_payment": 44600,
      "average_rate": { "rate": 0.06263, "loan_type": { "term": 30 } },
      "monthly_payment_details": [
        { "type": "principal_and_interest", "amount": 1100 },
        { "type": "property_tax", "amount": 125 }
      ]
    },
    "property_tax_rate": 0.006713,
    "is_listing_price_eligible_for_fha": true
  },
  "estimates": {
    "current_values": [
      { "source": { "type": "corelogic", "name": "Cotality™" }, "estimate": 220300, "isbest_homevalue": true },
      { "source": { "type": "collateral", "name": "Collateral Analytics" }, "estimate": 224000 },
      { "source": { "type": "quantarium", "name": "Quantarium" }, "estimate": 220234 }
    ],
    "historical_values": [ "..." ]
  },
  "tax_history": [
    { "tax": 1496, "year": 2025, "assessment": { "building": 54400, "land": 20580, "total": 74980 } }
  ],
  "property_history": [
    { "date": "2026-03-26", "event_name": "Listed", "price": 223000, "price_change": 0, "source_name": "LasVegas" }
  ],
  "nearby_schools": {
    "schools": [
      { "name": "John R Hummel Elementary School", "rating": 3, "distance_in_miles": 1.1, "funding_type": "public" }
    ]
  },
  "details": [
    { "category": "Appliances", "text": ["Dishwasher", "Dryer", "Refrigerator"] },
    { "category": "Heating and Cooling", "text": ["Heating Features: Central Furnace"] }
  ],
  "local": {
    "noise": { "score": null },
    "flood": { "flood_factor_score": 1, "fema_zone": ["X (unshaded)"] }
  },
  "source": {
    "id": "LVNV",
    "name": "LasVegas",
    "type": "mls",
    "agents": [{ "agent_name": "Gustavo Lopez", "type": "seller" }],
    "disclaimer": { "text": "©2026 Greater Las Vegas Association of REALTORS®." }
  },
  "href": "https://www.realtor.com/realestateandhomes-detail/..."
}
```

---

## 📊 Dataset Views

The scraper includes six pre-configured views in the Apify dataset UI:

| View | Purpose |
|------|---------|
| **Overview** | Quick summary  ID, status, price, $/sqft, location, beds/baths/sqft, photo, dates |
| **Detailed** | Full property data with flags, HOA, open houses, virtual tours, and MLS source |
| **Agents & Advertisers** | Listing agent, office, broker details with phones and emails |
| **Pricing & Estimates** | List price, AVM estimates (Cotality, Collateral Analytics, Quantarium), mortgage, tax history |
| **Locations** | Address, coordinates, neighborhoods, nearby schools, flood and noise scores |
| **Property History** | Full event log  listings, price changes, sales, and removals across all sources |

---

## ⚡ Performance & Reliability

### Speed

- **~2–3 seconds per page** (~40 properties per page)
- **100 properties**  ~10–15 seconds
- **1,000 properties**  ~2–4 minutes

### Crash Recovery

The scraper uses Apify's state persistence to survive crashes, migrations, and timeouts. If a run is interrupted:

- Progress is saved automatically every ~60 seconds
- On restart, scraping resumes from where it stopped
- Already-scraped pages and URLs are not re-processed

### Error Handling

- Exponential backoff with 3 retries on failed requests
- Continues to the next page after 3 consecutive errors on a single page
- Continues to the next URL if a URL fails entirely
- State is preserved on failure for manual resume

### Resource Usage

- **Memory**: 1024 MB max
- **Proxy**: US residential proxies required for consistent access

---

## 📚 URL Parameters Reference

Realtor.com search URLs support a rich set of filter segments in the path:

| Segment | Example | Description |
|---------|---------|-------------|
| `type-*` | `type-single-family-home` | Property type (single-family-home, condo, townhome, multi-family, land) |
| `beds-*` | `beds-2-4` | Bedroom range (min-max) |
| `baths-*` | `baths-2` | Minimum bathrooms |
| `price-*` | `price-200000-500000` | Price range |
| `sqft-*` | `sqft-1000-3000` | Interior square footage range |
| `lot-sqft-*` | `lot-sqft-5000-20000` | Lot size range |
| `age-*` | `age-1+10` | Year built range (years ago) |
| `hoa-*` | `hoa-300,known` | Max HOA fee and known-only filter |
| `show-55-plus` | `show-55-plus` | 55+ communities only |
| `keyword-*` | `keyword-pool,garage` | Keyword filter (comma-separated) |
| `radius-*` | `radius-25` | Search radius in miles |
| `builderpromotion` | `builderpromotion` | New construction with builder promotions |
| `ob-*` | `ob-pd` (price desc) | Sort order |

### Sample URLs

```
Single-family, Las Vegas:  https://www.realtor.com/realestateandhomes-search/Las-Vegas_NV/type-single-family-home
Condos, NYC:               https://www.realtor.com/realestateandhomes-search/New-York_NY/type-condo
55+ communities:           https://www.realtor.com/realestateandhomes-search/35007/show-55-plus/radius-50
Builder promotions:        https://www.realtor.com/realestateandhomes-search/35007/builderpromotion
Price range filter:        https://www.realtor.com/realestateandhomes-search/Miami_FL/price-300000-700000
Beds + baths filter:       https://www.realtor.com/realestateandhomes-search/Austin_TX/beds-3-5/baths-2
```

---

## ⚠️ Important Notes

- Data is extracted as-is from Realtor.com. Prices and availability should be verified directly with listing agents.
- US residential proxies are required  datacenter IPs are blocked by Realtor.com.
- Realtor.com may update their website structure. If the scraper stops working, check for actor updates.
- Users must comply with Realtor.com's Terms of Service and applicable data protection laws.

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

---

## 🌟 Related Actors by FlowExtract API

### 🏠 Real Estate Data

**[PropertyFinder Scraper](https://apify.com/dz_omar/propertyfinder-scraper?fpr=smcx63)**
Extract property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar. Prices, locations, agent contacts, amenities, and more.

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI. Free regex extraction or paid AI-powered dynamic extraction.

### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata. Perfect for content analysis, SEO, and subtitle generation.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete playlist information with all video details from any YouTube playlist. Fast, reliable, and built for scale.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata. Ideal for meeting analysis and documentation.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts. Perfect for training content and video documentation.

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

**Ready to extract Realtor.com data?** [Start using Realtor.com Scraper now!](https://apify.com/dz_omar/realtor-scraper?fpr=smcx63)
