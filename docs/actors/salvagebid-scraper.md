# 🚗 SalvageBid Scraper

**Extract salvage vehicle auction listings from SalvageBid.com  prices, bids, VIN specs, damage info, auction dates, locations, and images.**

Scrapes any SalvageBid search or category page with full pagination support. Returns clean, structured data for every vehicle on the listing, with optional enrichment from individual vehicle detail pages (live bid data, shipping info, VDP navigation, and more).

---

## 🚀 Quick Start

### Basic  Listing Data Only

```json
{
  "startUrls": [
    { "url": "https://www.salvagebid.com/salvage-suvs-for-sale/toyota" }
  ],
  "maxResults": 50,
  "fetchDetails": false,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": []
  }
}
```

### Full Details per Vehicle

```json
{
  "startUrls": [
    { "url": "https://www.salvagebid.com/salvage-suvs-for-sale/toyota" }
  ],
  "maxResults": 50,
  "fetchDetails": true,
  "proxyConfiguration": {
    "useApifyProxy": true,
    "apifyProxyGroups": []
  }
}
```

### Start from a Specific Page

```json
{
  "startUrls": [
    { "url": "https://www.salvagebid.com/salvage-suvs-for-sale/toyota?page=4" }
  ],
  "maxResults": 100,
  "fetchDetails": false
}
```

### Multiple Search URLs in One Run

```json
{
  "startUrls": [
    { "url": "https://www.salvagebid.com/salvage-suvs-for-sale/toyota" },
    { "url": "https://www.salvagebid.com/salvage-sedans-for-sale/honda" },
    { "url": "https://www.salvagebid.com/salvage-trucks-for-sale/ford" }
  ],
  "maxResults": 100,
  "fetchDetails": true
}
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array |  | One or more SalvageBid search/category URLs. Supports `?page=N` to start from a specific page. |
| `maxResults` | integer | `10` | Max vehicles to scrape **per URL**. Set to `0` for unlimited (all pages). |
| `fetchDetails` | boolean | `false` | Fetch the full detail page for each vehicle. Adds live bid data, shipping info, and more. Slower but richer. |
| `proxyConfiguration` | object | No proxy | Apify proxy settings. Recommended to avoid blocks. |

---

## 📤 Output

### Listing Mode (`fetchDetails: false`)

Returns the core data available from the search results page:

```json
{
  "id": 321624186,
  "stock_number": 43906790,
  "vin": "JTMRFREV3JJ204172",
  "vehicle_name": "2018 TOYOTA RAV4 XLE",
  "year": 2018,
  "make": "TOYOTA",
  "model": "RAV4",
  "trim": "XLE",
  "vehicle_type": "CAR",
  "body_style": "SPORT UTILITY",
  "color": "Blue",
  "interior_color": "",
  "odometer_value": 90123,
  "odometer_type": "mi",
  "odometer_status": "ACTUAL",
  "damage": "FRONT & REAR",
  "primary_damage": "Front & Rear",
  "secondary_damage": "Mechanical",
  "start_code": "Run & Drive",
  "auction_verification": "Run & Drive Verified",
  "key_status": "Y",
  "airbags": "INTACT",
  "loss_type": "Collision",
  "title_name": "SALVAGE",
  "title_state": "VT",
  "title_state_name": "Vermont",
  "doc_type": "VT SALVAGE",
  "current_bid_value": 0,
  "retail_value": 19526,
  "acv": 19526,
  "buy_it_now": null,
  "repair_cost": 19526,
  "currency": "USD",
  "auction_type_str": "Preliminary Bidding",
  "sale_date": {
    "date": "2026-04-09 06:30:00.000000",
    "timezone": "America/Los_Angeles",
    "date_iso": "2026-04-09T06:30:00-07:00",
    "formatted": "Thu, Apr 9, 06:30am (PDT)",
    "seconds_left_to_start": 50584
  },
  "location_city": "ESSEX JUNCTION",
  "location_state": "VT",
  "location_zip": "05452",
  "location_address": "304 COLCHESTER ROAD",
  "selling_branch": "Burlington, VT",
  "auction_location": {
    "id": 645,
    "name": "Burlington",
    "slug": "burlington",
    "address": "304 Colchester Road",
    "city": "Essex Junction",
    "state": "VT",
    "zip": "05452",
    "phone": "802-872-7838"
  },
  "vin_engine": "2.5L I-4 DOHC, VVT, 176HP",
  "vin_fuel_type": "Gasoline",
  "vin_cylinder": "4 Cyl",
  "vin_transmission": "Automatic",
  "vin_drive_line_type": "All Wheel Drive",
  "images": [
    "https://s3-us-west-1.amazonaws.com/vehimg/27390/43906790-1L.jpg",
    "https://s3-us-west-1.amazonaws.com/vehimg/27390/43906790-2L.jpg"
  ],
  "images_thumbs": [
    "https://s3-us-west-1.amazonaws.com/vehimg/27390/43906790-1T.jpg"
  ],
  "image_360_url": "https://vis.iaai.com/Home/ThreeSixtyView?keys=...",
  "videos": [
    {
      "url": "https://mediaretriever.iaai.com/api/EngineVideoRetriever?...",
      "title": "Engine Video"
    }
  ],
  "additional_info": {
    "Navigation": "PRESENT",
    "KeyFob": "PRESENT",
    "Stored": "Offsite"
  },
  "details_url": "https://www.salvagebid.com/vehicle/43906790-2018-toyota-rav4",
  "download_all_pictures_url": "https://www.salvagebid.com/rest-api/v2/lots/43906790/download-all-auction-pictures"
}
```

### Detail Mode (`fetchDetails: true`)

Returns everything above plus enriched data fetched from the individual vehicle page:

| Additional Field | Description |
|-----------------|-------------|
| `bids.current_bid` | Current highest bid value |
| `bids.next_bid` | Minimum next bid required |
| `bids.bid_status` | Your bid status (`have_not_bid`, `winning`, etc.) |
| `bids.highest_bid` | Highest bid placed so far |
| `bids.next_bid_default` | Suggested default next bid |
| `sale_location` | Full formatted sale location string |
| `preliminary_bidding_closed` | Whether preliminary bidding has ended |
| `sold` | Whether the vehicle has been sold |
| `vdp_navigation.lots_total` | Total vehicles in the same search context |
| `vdp_navigation.lot_index` | Position of this vehicle in results |
| `vdp_navigation.next_url` | URL of the next vehicle in the list |
| `vdp_navigation.prev_url` | URL of the previous vehicle in the list |
| `lsa_info.branch_id` | Branch ID for live sale info |
| `lsa_info.lane` | Auction lane |
| `lsa_info.run_name` | Run/item number in the lane |
| `shipping_info.lot` | Stock number for shipping lookup |
| `shipping_info.origin_location_id` | Shipping origin branch ID |
| `shipping_info.location_zip` | Pickup ZIP code |
| `purchase_steps` | Step-by-step purchase instructions (if available) |

---

## 📊 Dataset Views

Five pre-configured views are available in the Apify dataset UI:

| View | Purpose |
|------|---------|
| **Overview** | Quick summary  ID, stock #, vehicle name, year, make, model, color, current bid, retail value, sale date, location |
| **Detailed** | Full vehicle data  VIN, damage, condition flags, title/doc info, auction status, branch |
| **VIN & Specs** | Decoded VIN specs  engine, fuel type, cylinders, transmission, drivetrain, restraint system |
| **Pricing** | Price data for market analysis  current bid, retail value, ACV, buy-it-now, repair cost |
| **Locations** | Auction location data  city, state, ZIP, address, branch name, lane, item number |

---

## ⚡ Performance & Reliability

### Speed

- **Listing mode**  ~2–3 seconds per page (~24 vehicles per page)
- **Detail mode**  5 concurrent detail fetches per batch
- **100 vehicles (listing only)**  ~15–20 seconds
- **100 vehicles (with details)**  ~1–2 minutes

### Crash Recovery

The scraper uses Apify's state persistence to survive crashes, migrations, and timeouts. If a run is interrupted:

- Progress is saved automatically every ~60 seconds
- On restart or resurrection, scraping resumes from the last completed page
- Already-completed URLs are skipped automatically
- Already-scraped pages within a URL are not re-processed

### Error Handling

- Exponential backoff with 3 retries per failed request
- Continues to the next page after 3 consecutive errors on a single page
- Continues to the next URL if one URL fails entirely
- State is preserved on failure for manual resume

### Resource Usage

- **Memory**: 512 MB max
- **Proxy**: Apify Proxy recommended to avoid Cloudflare blocks

---

## 🔗 URL Format Reference

SalvageBid search URLs follow this structure:

```
https://www.salvagebid.com/{category}/{make}?page={N}
```

### Category Examples

| URL Path | Description |
|----------|-------------|
| `/salvage-suvs-for-sale/toyota` | Toyota SUVs |
| `/salvage-sedans-for-sale/honda` | Honda sedans |
| `/salvage-trucks-for-sale/ford` | Ford trucks |
| `/salvage-cars-for-sale` | All makes, all types |
| `/salvage-cars-for-sale/bmw` | BMW (all types) |

You can paste any search results page URL directly from the SalvageBid website  including filtered searches, specific makes, and paginated pages. The scraper will automatically paginate forward from whatever page you provide.

---

## ⚠️ Important Notes

- Data is extracted as-is from SalvageBid. Prices, availability, and auction outcomes should be verified directly on the site.
- Built-in random delays and rotating browser fingerprints via `got-scraping` minimize detection risk.
- SalvageBid is served behind Cloudflare  using Apify Proxy is strongly recommended.
- `additional_info` is returned as a parsed JSON object (not a raw string) for easy access to fields like `Navigation`, `KeyFob`, and `Stored`.
- The `details_url` and `download_all_pictures_url` fields are always returned as full absolute URLs.

**The actor creator is not responsible for how users utilize the extracted data. Users must comply with SalvageBid's Terms of Service and applicable data protection laws.**

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
Extract property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar. Prices, locations, agent contacts, amenities, and full property details.

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access. Get listings, prices, and detailed property information.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista. Perfect for market analysis and property research.

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

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI. Free regex extraction or paid AI-powered dynamic extraction.

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

**Ready to extract SalvageBid data?** [Start using SalvageBid Scraper now!](https://apify.com/dz_omar/salvagebid-scraper?fpr=smcx63)