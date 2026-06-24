# 🏠 Zimmo Scraper

**Extract Belgian property listings from zimmo.be.**

Paste any zimmo.be search URL directly from your browser. The scraper fetches full property detail for each listing and stores the raw API response, giving you every field zimmo.be exposes: price, EPC certificates, flooding status, planning information, cadastral income, agency contacts, images, documents, and more.

---

## 🌍 Supported

| Platform | Domain | Languages |
|----------|--------|-----------|
| Zimmo Belgium | zimmo.be | Dutch (`/nl/zoeken/`), French (`/fr/rechercher/`) |

> ⚠️ **International URLs** (`/international/...`) are not yet supported. They will be skipped and noted in the dataset with an explanatory record.

---

## 🚀 Quick Start

### Basic run 10 results from a single search

```json
{
  "startUrls": [
    { "url": "https://www.zimmo.be/nl/zoeken/?search=eyJmaWx0ZXIiOnsic3RhdHVzIjp7ImluIjpbIkZPUl9TQUxFIl19LCJwbGFjZUlkIjp7ImluIjpbMTExOF19fX0=" }
  ],
  "maxResults": 10
}
```

### Multiple URLs different regions or filter sets

```json
{
  "startUrls": [
    { "url": "https://www.zimmo.be/nl/zoeken/?search=eyJmaWhhx0...." },
    { "url": "https://www.zimmo.be/fr/rechercher/?search=eyJmaW2g4..." }
  ],
  "maxResults": 50,
  "proxyConfiguration": {
    "useApifyProxy": true
  }
}
```

### Unlimited results (bounded by budget if set)

```json
{
  "startUrls": [
    { "url": "https://www.zimmo.be/nl/zoeken/?search=eyJmaWx0ZXIiOnsic3Rh....." }
  ],
  "maxResults": 0
}
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array | | One or more zimmo.be search URLs. Copy directly from your browser after applying filters. |
| `maxResults` | integer | `10` | Maximum properties to scrape **per URL**. Set to `0` for unlimited. |
| `proxyConfiguration` | object | No proxy | Apify proxy settings. Recommended for large runs to avoid rate limits. |

### How to get a start URL

1. Go to [zimmo.be](https://www.zimmo.be) and apply your filters (type, location, price, EPC, etc.)
2. Copy the full URL from your browser
3. Paste it into `startUrls`


---

## 📤 Output

Each dataset item is the **raw detail API response** for one property, with two fields appended:

| Field | Description |
|-------|-------------|
| `sourceUrl` | The search URL this property was found in |
| `scrapedAt` | ISO timestamp of when it was scraped |

### Example output record (condensed)

```json
{
  "id": "e36e00c9-907d-4f3c-b666-6d9e21793a96",
  "createdAt": "2026-04-11T07:29:47Z",
  "extra": {
    "zimmoCode": "LN4EA",
    "code": "LN4EA"
  },
  "estate": {
    "type": "HOUSE",
    "subType": "ONE_FAMILY_HOUSE",
    "status": "FOR_SALE",
    "soldBy": "BROKER",
    "condition": "RENEWED",
    "constructionType": "HALF_OPEN",
    "constructionYear": 1957,
    "renovationYear": 2020,
    "price": { "unit": "EUR", "value": 375000 },
    "cadastralIncome": { "unit": "EUR", "value": 448 },
    "floorspaceSurface": { "unit": "m²", "value": 102 },
    "plot": {
      "plotSurface": { "unit": "m²", "value": 168 },
      "orientation": "N"
    },
    "certificate": {
      "epcCertificate": {
        "energyLabel": "B",
        "epcValue": { "unit": "kWh/m²", "value": 147 }
      }
    },
    "flooding": { "floodingValues": [...] },
    "planning": [...],
    "location": {
      "street": "Duiventorenstraat",
      "streetNumber": "10",
      "postalCode": "8310",
      "locality": { "nl": "Assebroek" },
      "coordinates": { "latitude": 51.187863, "longitude": 3.24166 }
    }
  },
  "enriched": {
    "bedrooms": 2,
    "bathrooms": 1,
    "detailPageUrl": {
      "nl": "https://www.zimmo.be/nl/assebroek-8310/te-koop/huis/LN4EA/",
      "fr": "https://www.zimmo.be/fr/assebroek-8310/a-vendre/maison/LN4EA/"
    },
    "mainImageUrl": "https://files.zimmo.be/main-image/e36e00c9-...",
    "description": { "nl": "..." }
  },
  "dealer": {
    "name": "Waeyler",
    "email": "contact-api+...@zimmo.be",
    "phoneNumber": "050373137",
    "mobilePhoneNumber": "0477465311",
    "website": "https://www.waeyler.be",
    "category": "broker"
  },
  "files": {
    "images": [...],
    "documents": [...]
  },
  "sourceUrl": "https://www.zimmo.be/nl/zoeken/?search=...",
  "scrapedAt": "2026-04-13T23:37:57.746Z"
}
```

---

## 📊 Dataset Views

Five pre-configured views are available in the Apify dataset UI:

| View | Purpose |
|------|---------|
| **Overview** | Quick summary ID, type, price, condition, beds/baths, area, location, image |
| **Detailed** | Full property data certificates, planning, flooding, layout, agency contacts |
| **Contacts** | Agency name, email, phone, mobile, website, and location per listing |
| **Pricing** | Price, cadastral income, surfaces, sold-by, availability date for market analysis |
| **Energy & Legal** | EPC certificate, electricity certificate, flooding values, planning status, P/G-scores |

---

## 💰 Pricing

Charged per property result successfully saved to the dataset.

| Tier | Price per result |
|------|-----------------|
| FREE | $0.008 |
| BRONZE | $0.004 |
| SILVER | $0.0035 |
| GOLD | $0.003 |

If you configure a **budget**, the scraper automatically calculates how many results it can afford before starting and caps `maxResults` accordingly no wasted API calls.

---

## ⚡ Performance

- **~200ms delay** between detail fetches per listing (polite crawling)
- **~500ms delay** between search pages
- **100 properties** ≈ 1–2 minutes depending on network and proxy
- Results are pushed and charged in batches of 10

### Large runs

For runs exceeding a few hundred results, enabling Apify proxy is strongly recommended to avoid rate limiting:

```json
"proxyConfiguration": {
  "useApifyProxy": true
}
```

---

## ⚠️ Important Notes

- Only Belgian listings are supported. International URLs (`/international/...`) are automatically detected and skipped with an explanatory notice in the dataset.
- Users must comply with zimmo.be's Terms of Service and applicable data protection laws (GDPR).

**The actor creator is not responsible for how users utilise the extracted data.**

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
Extract property listings from PropertyFinder across UAE, Saudi Arabia, Bahrain, Egypt, and Qatar.

**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Idealista property data extraction with API access.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Extract Spanish real estate listings from Idealista.

### 🎬 Video & Media Tools

**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-metadata?fpr=smcx63)**
Extract complete video transcripts with timestamps and comprehensive metadata.

**[YouTube Full Channel, Playlists, Shorts, Live](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Extract complete playlist and channel information from YouTube.

**[Zoom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Extract Zoom meeting recordings, transcripts, and metadata.

**[Loom Scraper | 🎥 Downloader & 📄 Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Download Loom videos and extract transcripts.

### 🛠️ Developer & Security Tools

**[AI Contact Intelligence Extractor](https://apify.com/dz_omar/ai-contact-intelligence?fpr=smcx63)**
Extract emails, phones, contacts & custom data using AI.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Scan websites for security vulnerabilities and get comprehensive security reports.

**[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)** / **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**
Fast, reliable webpage screenshots with customizable options.

### 📱 Social Media Tools

**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook ads data for competitor analysis and market research.

---

**Ready to extract zimmo.be data?** [Start using Zimmo Scraper now!](https://apify.com/dz_omar/zimmo-scraper?fpr=smcx63)
