# 🏠 domain.com.au Scraper

**Scrape property listings from domain.com.au with full details, agent contacts, nearby schools, market insights, and high-resolution media  using any search URL directly from the website.**

## 🎬 Video Tutorial

[![Watch the Tutorial](https://img.shields.io/badge/YouTube-Watch%20Tutorial-red?style=for-the-badge&logo=youtube)](https://youtube.com/@FlowExtractAPI)

---

## Key Features

### Two Speeds, One Actor

A single switch (`detailMode`) lets you trade speed for depth:

- **Fast mode (default, `detailMode: false`)**  the quickest way to pull listings at scale. Returns the essentials for every property: ID, listing URL, price, full address, suburb/state/postcode, GPS coordinates, dwelling type, bedrooms, bathrooms, car spaces, and photos. Ideal for building lists, market scans, and feeding downstream pipelines.
- **Detail mode (`detailMode: true`)**  the complete picture. Everything in fast mode **plus** full description, agent & agency contacts, nearby schools, market insights, inspection & auction info, and more. Slower, because each property is looked up individually  but exhaustive.

### Works With Any Search  Including Large Areas

- **Paste any domain.com.au search URL** straight from your browser  every filter you applied is honored automatically.
- **Large searches are fully supported.** Searches that return thousands of listings (e.g. a whole state) are handled end-to-end, so you get well beyond the small page limit a single search normally exposes.
- **Map-view and inspection-times URLs supported**, in addition to standard list searches.
- **No duplicates.** Every property appears once, even across very large result sets.

### What You Get (Detail Mode)

- **Core Listing**  listing ID, canonical URL, headline, full description, price, promo level, listing type, lifecycle status
- **Property Attributes**  dwelling type, bedroom count, bathroom count, car spaces, additional features list
- **Market Timing**  days on market, active-since date, time-on-market formatted strings
- **Location**  full address string, structured address components (suburb, postcode, state, area, region, suburb ID), GPS coordinates
- **Media**  high-resolution images and thumbnails, including floor plans
- **Advertiser**  full agency block  name, address, logo, banner, agent contacts with phone, email, and social URLs
- **Nearby Schools**  name, education level, year range, gender, system (Government/Private), geo coordinates, website URL
- **Inspection & Auction**  appointment-only flag, booking availability, inspection planner metadata, auction availability
- **Market Insights**  suburb price guide, multi-year price trend, price direction, and recent sales data (where available)
- **Tracking Metadata**  sale method, ad type, days listed, core property ID, interactive floorplan flag

### Reliable by Design
- **No results dropped.** If a property's full detail lookup can't be completed in detail mode, the Actor still saves what it has and flags the record with `enrichment_failed: true`  you never silently lose a listing.

---

## Quick Start

### Fast scan (default)  essentials only, maximum speed

```json
{
  "start_urls": [
    { "url": "https://www.domain.com.au/sale/sydney-region-nsw/" }
  ],
  "maxResults": 10,
  "detailMode": false
}
```

### Full detail  everything, including agents, schools & market insights

```json
{
  "start_urls": [
    { "url": "https://www.domain.com.au/sale/sydney-region-nsw/" }
  ],
  "maxResults": 10,
  "detailMode": true
}
```

### Filter by property type, bedrooms, and price

```json
{
  "start_urls": [
    { "url": "https://www.domain.com.au/sale/melbourne-region-vic/house/3-bedrooms/?bathrooms=2-any&price=500000-1500000" }
  ],
  "maxResults": 25
}
```

### Multiple search URLs in one run

```json
{
  "start_urls": [
    { "url": "https://www.domain.com.au/sale/sydney-region-nsw/house/3-bedrooms/" },
    { "url": "https://www.domain.com.au/rent/melbourne-region-vic/?price=300000-800000" }
  ],
  "maxResults": 20
}
```

### Fetch all results for a search (no limit)

```json
{
  "start_urls": [
    { "url": "https://www.domain.com.au/sale/brisbane-region-qld/house/4-bedrooms/" }
  ],
  "maxResults": 0
}
```

---

## 📋 Input Configuration

### Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `start_urls` | array | ✅ |  | One or more domain.com.au search result URLs to scrape |
| `maxResults` | integer | ❌ | 10 | Max listings to scrape **per URL**. `0` = fetch all available results. |
| `detailMode` | boolean | ❌ | `false` | `false` = fast mode (essentials only, fastest). `true` = full detail per property (description, agents, schools, market insights, etc.)  slower. |

### Fast Mode vs Detail Mode

| | Fast mode (`detailMode: false`) | Detail mode (`detailMode: true`) |
|---|---|---|
| Speed | ⚡ Fastest | 🐢 Slower (one lookup per property) |
| ID, URL, price, address, beds/baths/cars | ✅ | ✅ |
| GPS coordinates, photos | ✅ | ✅ |
| Description, features list | — | ✅ |
| Agent & agency contacts | — | ✅ |
| Nearby schools | — | ✅ |
| Market insights | — | ✅ |
| Inspection / auction details | — | ✅ |

Use **fast mode** when you need lots of listings quickly (lead lists, market scans). Use **detail mode** when you need the full record for each property.

### How `maxResults` Works

`maxResults` is a **per-URL limit**, not a global total. If you provide 5 URLs and set `maxResults: 20`, the Actor will attempt to fetch up to 20 listings from each URL independently  up to 100 results total.

Setting `maxResults: 0` removes the per-URL limit and scrapes every listing the search returns, including very large searches that exceed the page limit a single search normally exposes.

### Supported URL Formats

Any search URL you can construct on domain.com.au works as input. Copy it directly from your browser after applying filters.

| Example | URL Pattern |
|---------|-------------|
| State/region sale | `https://www.domain.com.au/sale/sydney-region-nsw/` |
| Rent | `https://www.domain.com.au/rent/?bedrooms=2-any&price=400-800` |
| Bedrooms + bathrooms | `/sale/melbourne-region-vic/house/3-bedrooms/?bathrooms=2-any` |
| Price range | `/sale/brisbane-region-qld/?price=400000-800000` |
| Property type | `/sale/?ptype=town-house,pent-house` |
| Multiple filters | `/sale/?ptype=house&carspaces=2-any&features=gardencourtyard,gas` |
| Map-area search | `/rent/?...&displaymap=1` |
| Inspection times | `/rent/inspection-times/?...&inspectiondate=2026-06-22` |
| Sort order | `/sale/sydney-region-nsw/?sort=price-asc` |
| Exclude under offer | `/sale/sydney-region-nsw/?excludeunderoffer=1` |

All filter combinations domain.com.au supports are honored automatically.

---

## 📤 Output Structure

Each listing produces one record in the dataset. The fields you get depend on the mode.

### Fast Mode Sample (`detailMode: false`)

```json
{
  "id": 2020908421,
  "seo_url": "https://www.domain.com.au/1880-frankston-flinders-road-hastings-vic-3915-2020908421",
  "price": "$3,000,000 - $3,300,000",
  "address": "1880 Frankston-Flinders Road, Hastings VIC 3915",
  "dwelling_type": "House",
  "bedroom_count": 3,
  "bathroom_count": 2,
  "carspace_count": 8,
  "geo_location": {
    "latitude": -38.2898318,
    "longitude": 145.1833328
  },
  "metadata": {
    "address_components": {
      "suburb": "Hastings",
      "state": "VIC",
      "postcode": "3915"
    }
  },
  "thumbnails": [
    { "url": "https://rimh2.domainstatic.com.au/.../2020908421_1_1_...", "type": "photo", "category": "image" }
  ],
  "media": [
    { "media_type": "image", "type": "photo", "image_url": "https://rimh2.domainstatic.com.au/.../2020908421_1_1_..." }
  ],
  "enrichment_failed": true
}
```

> In fast mode, `enrichment_failed: true` simply indicates the record contains search-layer essentials only (no per-property detail lookup was requested). It is **not** an error.

### Detail Mode Sample (`detailMode: true`)

```json
{
  "id": 2020313302,
  "seo_url": "https://www.domain.com.au/67-32-manning-street-manning-point-nsw-2430-2020313302",
  "listing_type": "property",
  "lifecycle_status": "Live",
  "search_mode": "buy",

  "headline": "Cosy Retreat by the Beach & River",
  "description": "Positioned in the much-loved Big 4 Holiday Park, this bright and tidy cabin...",
  "price": "$280,000",
  "promo_level": "Elite",

  "dwelling_type": "House",
  "bedroom_count": 2.0,
  "bathroom_count": 1.0,
  "carspace_count": 1,
  "additional_features": [
    "Air conditioning",
    "Built in wardrobes",
    "Balcony / Deck",
    "Outdoor Entertaining",
    "Shed",
    "Rainwater storage tank"
  ],

  "days_on_market": 227.0,
  "time_on_market_formats": {
    "details_section": "Active since:  02/10/2025"
  },

  "address": "67/32 Manning Street, Manning Point",
  "metadata": {
    "address_components": {
      "area": "Taree - Greater Region",
      "postcode": "2430",
      "region": "Mid North Coast",
      "state_short": "NSW",
      "street": "Manning Street",
      "street_number": "32",
      "unit_number": "67",
      "suburb": "Manning Point",
      "suburb_id": 27262
    }
  },
  "geo_location": {
    "latitude": -31.8974479,
    "longitude": 152.6613378
  },

  "media": [
    {
      "media_type": "image",
      "type": "photo",
      "image_url": "https://rimh2.domain.com.au/.../2020313302_1_1_..."
    },
    {
      "media_type": "image",
      "type": "floor_plan",
      "image_url": "https://rimh2.domain.com.au/.../2020313302_19_3_..."
    }
  ],

  "advertiser": {
    "id": 11789,
    "name": "Lauders Real Estate Old Bar",
    "type": "Agent",
    "address": "52 Old Bar Road\nOld Bar NSW 2430",
    "images": {
      "logo_url": "https://images.domain.com.au/img/Agencys/11789/logo_11789.png",
      "agency_banner_image_url": "https://images.domain.com.au/img/Agencys/11789/banner_11789.png"
    },
    "agency_listing_contacts": [
      {
        "agent_id": "1903069",
        "display_full_name": "Lauders Real Estate - Old Bar",
        "email_address": "agent@example.com",
        "phone_numbers": [
          { "type": "Mobile", "number": "02 6553 7700" }
        ],
        "social_urls": [
          { "type": "facebook", "url": "https://www.facebook.com/laudersoldbar" }
        ]
      }
    ]
  },

  "schools": [
    {
      "name": "Mitchells Island Public School",
      "education_level": "Primary",
      "year_range": "K-6",
      "gender": "Co-ed",
      "system": "Government",
      "address": "Mitchells Island NSW 2430",
      "geo_location": { "latitude": -31.896762, "longitude": 152.614054 },
      "website_url": "https://mitchellsi-p.schools.nsw.gov.au"
    }
  ],

  "inspection_schedule": {
    "is_by_appointment_only": true,
    "is_bookings_enabled": false
  },

  "tracking_metadata": {
    "saleMethod": "privateTreaty",
    "primaryCategory": "Buy",
    "adType": "elite",
    "daysListed": 227,
    "corePropertyID": "HU-7531-AI",
    "hasInteractiveFloorplan": false
  },

  "market_insights": {
    "price_guide": 699000,
    "price_series": [680000, 640000, 627500, 670000, 699000],
    "price_series_years": [2022, 2023, 2024, 2025, 2026],
    "price_direction": "positive",
    "recent_sales_count": 43,
    "recent_sales_price_low": 621500,
    "recent_sales_price_high": 881700,
    "recent_sales_duration": "12 Months",
    "recent_sale_distance": "Ardeer"
  },

  "homepass_enabled": true,
  "phone_enquiry_preference": false,
  "auction_metadata": {
    "header": { "label": "Online auction available" }
  },

  "enrichment_failed": false
}
```

### Field Reference

The **Mode** column shows where each field appears: **Both** = fast and detail; **Detail** = detail mode only.

| Field | Type | Mode | Description |
|-------|------|------|-------------|
| `id` | integer | Both | domain.com.au listing ID |
| `seo_url` | string | Both | Canonical listing URL on domain.com.au |
| `price` | string | Both | Display price string, e.g. `"$280,000"` |
| `address` | string | Both | Full display address |
| `dwelling_type` | string | Both | Property type  `"House"`, `"Townhouse"`, `"Apartment"`, etc. |
| `bedroom_count` | number | Both | Number of bedrooms |
| `bathroom_count` | number | Both | Number of bathrooms |
| `carspace_count` | integer | Both | Number of car spaces |
| `geo_location` | object | Both | `latitude` and `longitude` |
| `metadata` | object | Both | Structured address breakdown. Fast mode: suburb, state, postcode. Detail mode: full breakdown incl. area, region, suburb ID |
| `media` | array | Both | Property images. Detail mode also includes floor plans. Each item has `media_type`, `type`, `image_url` |
| `thumbnails` | array | Fast | Thumbnail image references. Each item has `url`, `type`, `category` |
| `enrichment_failed` | boolean | Both | `false` for full detail records. `true` for fast-mode records, or when a detail lookup couldn't be completed (search data still saved) |
| `listing_type` | string | Detail | Listing type, e.g. `"property"` |
| `lifecycle_status` | string | Detail | Listing status  `"Live"`, `"New Home"`, etc. |
| `search_mode` | string | Detail | Search context  `"buy"`, `"rent"`, `"newdev"` |
| `headline` | string | Detail | Listing title written by the agent |
| `description` | string | Detail | Full property description text |
| `promo_level` | string | Detail | Listing tier  `"Elite"`, `"Standard"`, etc. |
| `additional_features` | array | Detail | Feature list, e.g. `"Air conditioning"`, `"Dishwasher"` |
| `days_on_market` | number\|null | Detail | Days listing has been active. `null` for new developments |
| `time_on_market_formats` | object | Detail | Formatted active-since strings for display |
| `advertiser` | object | Detail | Full agency block  name, address, logo, banner, agent contacts, phone, email, social URLs |
| `schools` | array | Detail | Nearby schools with level, year range, gender, system, geo, website |
| `inspection_schedule` | object | Detail | `is_by_appointment_only`, `is_bookings_enabled` |
| `inspection_metadata` | object | Detail | Inspection planner flag and title |
| `auction_metadata` | object | Detail | Auction availability header |
| `tracking_metadata` | object | Detail | `saleMethod`, `adType`, `daysListed`, `corePropertyID`, `hasInteractiveFloorplan` |
| `market_insights` | object | Detail | Price guide, multi-year series, direction, recent sales data. Present for some listings only |
| `phone_enquiry_preference` | boolean | Detail | Whether the agent prefers phone enquiries |
| `homepass_enabled` | boolean | Detail | Whether Homepass digital key access is enabled |

---


## ⚠️ Important Notes

### Legal Considerations
This Actor extracts publicly available property listing data from domain.com.au. Users must:
- Comply with domain.com.au's Terms of Service
- Follow applicable data protection laws (GDPR, CCPA, Australian Privacy Act, etc.)
- Use extracted data responsibly and ethically

**The Actor creator is not responsible for how users utilize the extracted data.**

---

## 💬 Support & Contact

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

---

## 🌟 Related Actors by FlowExtract API

### 🏠 Real Estate Data

**[domain.com.au Scraper](https://apify.com/dz_omar/domain-scraper?fpr=smcx63)**
Extract Australian property listings from domain.com.au with full enrichment, agent contacts, schools, and market insights.

**[Realtor.com Scraper](https://apify.com/dz_omar/realtor-scraper?fpr=smcx63)**
Extract US property listings from Realtor.com. Pricing, agent contacts, tax history, AVM estimates, nearby schools, flood and noise data, and full listing history.

**[PropertyFinder Scraper](https://apify.com/dz_omar/propertyfinder-scraper?fpr=smcx63)**
Extract property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar.

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista.

**[Leboncoin.fr Scraper](https://apify.com/dz_omar/leboncoin-scraper?fpr=smcx63)**
Extract French classified listings from Leboncoin  real estate, vehicles, jobs, and more.

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI.

### 🍔 Food & Delivery

**[DoorDash Scraper](https://apify.com/dz_omar/doordash-scraper?fpr=smcx63)**
Scrape store listings, full menus, featured items, and customer reviews from DoorDash.

### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete playlist information with all video details from any YouTube playlist.

**[Zoom Scraper | Downloader & Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata.

**[Loom Scraper | Downloader & Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts.

### 🛠️ Developer & Security Tools

**[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)**
Fast, reliable webpage screenshots with customizable options.

**[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**
Advanced screenshot tool with full-page capture, custom viewports, and quality controls.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Scan websites for security vulnerabilities and get comprehensive security reports.

### 📱 Social Media Tools

**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook ads data for competitor analysis and market research.

**[LinkedIn Ad Library Scraper](https://apify.com/dz_omar/linkedin-ads-scraper?fpr=smcx63)**
Extract comprehensive advertising data from LinkedIn's Ad Library.

---

**Ready to extract Australian property data?** [Start using domain.com.au Scraper now!](https://apify.com/dz_omar/domain-scraper?fpr=smcx63)