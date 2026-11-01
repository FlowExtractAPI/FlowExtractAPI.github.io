# 🏠 ImmoScout24 Scraper

Fast, reliable property scraper for **immobilienscout24.de** — Germany's largest real-estate marketplace. Paste any search or property URL and get clean, structured, **numeric** listing data back — or turn a search into a **daily change feed** of new listings, price cuts and removed listings.

**Every ImmoScout24 property type — apartments and houses (rent / buy), house sub-types, land, offices, retail, gastronomy, halls, garages, flat-share rooms, furnished stays, investment properties and foreclosure auctions — from region, radius and drawn-area searches, individual property pages and new-build projects.**

> No setup, no login, no proxy to configure. Filter on the ImmoScout24 website, copy the URL from your address bar, paste it in, and run.

---

## 🎯 What This Actor Extracts

### 📋 Core Property Data (every listing)
* **Price as a number** — cold rent per month or purchase price, plus the price exactly as shown and its unit
* **Price per m²** — computed for every listing, or the per-m² rate commercial listings quote
* **Size & rooms** — living / floor space and room count as numbers
* **Address** — street, house number, postcode, city, district, latitude and longitude, plus a flag when the seller hides the street
* **Listing facts** — property type, rent or buy, energy class, publication date, private seller or agency, listing package, new-build project unit, listed only on ImmoScout24
* **Photos** — main photo and gallery, as working image URLs

### 🔎 Full Details (optional add-on)
* **Full rent breakdown** — base rent, total rent, service charge, heating costs, deposit, commission
* **Purchase fees** — broker commission, land transfer tax, notary and land-registry costs with percentages, total purchase cost
* **Regional price comparison** — ImmoScout24's own €/m² range for the area and for similar properties, and where this listing sits in it
* **Every feature** — balcony, cellar, lift, fitted kitchen, garden, guest toilet, barrier-free, pets, parking, rented, assisted living
* **Building & energy** — construction year, condition, interior quality, heating, energy certificate type and consumption
* **Bedrooms, bathrooms, floor, availability date, apartment type**
* **Descriptions** — property, furnishing, location and other texts
* **Documents** — floor plans and PDFs; photos with room captions
* **Agent** — company, contact name, logo, profile link, verified badge and phone numbers
* **Project units** — the other units of the same new-build project

### 🔁 Monitoring & Change Tracking
* **New listings only** — after a baseline run, each run returns only listings that appeared since the last one
* **Price changes** — old price, new price, change in € and %, days on market
* **Removed listings** — sold, let or delisted, with last price and days on market
* **Unchanged listings are never charged**

---

## 🌐 Supported URL Types

### Search URLs
Copy any search from the website — every filter you set is carried over:

* `https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten`
* `https://www.immobilienscout24.de/Suche/de/bayern/muenchen/haus-kaufen?price=300000.0-900000.0&numberofrooms=3.0-6.0`
* `https://www.immobilienscout24.de/Suche/de/berlin/berlin/buero-mieten` (offices, retail, gastronomy, halls…)
* `https://www.immobilienscout24.de/Suche/radius/wohnung-mieten?geocoordinates=52.51051;13.43068;5.0` (radius search)
* `https://www.immobilienscout24.de/Suche/shape/wohnung-kaufen?shape=…` (area drawn on the map)

If ImmoScout24's app does not accept one of your filters, the actor says so in the log and searches without it — your run never fails because of a filter.

### Individual Property URLs
* `https://www.immobilienscout24.de/expose/167767638` — always returns the full detail record

### New-Build (Neubau) Project URLs
* `https://www.immobilienscout24.de/neubau/<developer>/<project>/132302.html`

Mix any combination of URL types in one run.

---

## ✅ Input

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| **startUrls** | array | — | ImmoScout24 search, property or project URLs. |
| **maxResults** | integer | 25 | Max listings per search URL. `0` = every listing of the search. In monitoring mode it caps new listings; use `0` to also detect removed listings. |
| **fetchPropertyDetails** | boolean | false | Also fetch each listing's full detail page (add-on per listing). |
| **excludeProjectUnits** | boolean | false | Skip new-build project units and project cards (not saved, not charged). |
| **monitoringMode** | boolean | false | Return only what changed since the previous run of the same search. |
| **reportPriceChanges** | boolean | true | Monitoring: add a row for every price change. |
| **reportRemovedListings** | boolean | true | Monitoring: add a row for every listing no longer online. |

### Example — scrape a search with full details
```json
{
  "startUrls": [
    { "url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen" },
    { "url": "https://www.immobilienscout24.de/expose/167767638" }
  ],
  "maxResults": 100,
  "fetchPropertyDetails": true
}
```

### Example — daily change feed for a district
Schedule this to run every day:
```json
{
  "startUrls": [
    { "url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten" }
  ],
  "maxResults": 0,
  "monitoringMode": true
}
```
The first run saves every listing as a baseline. Each run after that returns only `new`, `price_changed` and `removed` rows. The history is kept per search URL in your Apify account, so keep the same Start URL between runs.

---

## 📤 Sample Output

### Search row — `fetchPropertyDetails: false`
```json
{
  "type": "property",
  "listingId": "168052908",
  "url": "https://www.immobilienscout24.de/expose/168052908",
  "title": "Living in harmony with nature in a compact 2-room garden apartment",
  "realEstateType": "apartmentrent",
  "transactionType": "rent",
  "price": 362,
  "priceText": "€362",
  "priceUnit": "per_month",
  "currency": "EUR",
  "pricePerSqm": 6.96,
  "livingSpace": 52,
  "numberOfRooms": 2,
  "energyEfficiencyClass": "B",
  "address": {
    "full": "Hellersdorfer Straße 91, 12619 Berlin, Kaulsdorf (Hellersdorf)",
    "street": "Hellersdorfer Straße",
    "houseNumber": "91",
    "postcode": "12619",
    "city": "Berlin",
    "district": "Kaulsdorf (Hellersdorf)",
    "latitude": 52.52485,
    "longitude": 13.58695,
    "isHidden": false
  },
  "publishedText": "23 days ago",
  "publishedDaysAgo": 23,
  "publishedDate": "2026-10-07",
  "listingType": "XL",
  "isPrivate": false,
  "isProjectUnit": false,
  "exclusiveToImmoScout": false,
  "mainImage": "https://pictures.immobilienscout24.de/listings/7059e813-…/ORIG/resize/800x600>/format/webp/quality/80",
  "images": ["https://pictures.immobilienscout24.de/listings/7059e813-…/ORIG/legacy_thumbnail/1280x960/format/webp/quality/80"],
  "hasDetailData": false,
  "source_url": "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten",
  "scrapedAt": "2026-10-30T05:28:08.983Z"
}
```

### Full details — `fetchPropertyDetails: true` (excerpt of `details`)
```json
{
  "listingId": "168812533",
  "price": 649000,
  "priceUnit": "purchase",
  "pricePerSqm": 8057,
  "details": {
    "purchasePrice": 649000,
    "livingSpace": 80.55,
    "usableArea": 85,
    "numberOfRooms": 4,
    "bedrooms": 3,
    "bathrooms": 3,
    "floor": 2,
    "numberOfFloors": 6,
    "availableFrom": "2028",
    "yearConstructed": 2026,
    "energyEfficiencyClass": "A",
    "commission": "3,57 % inkl. 19 % MwSt.",
    "financeCosts": {
      "purchasePrice": 649000,
      "additionalCosts": 75089,
      "totalCosts": 724089,
      "brokerCommission": { "value": 23169, "percentage": "3.57 %" },
      "landTransferTax": { "value": 38940, "percentage": "6 %" },
      "notaryCosts": { "value": 9735, "percentage": "1.5 %" },
      "landRegistryEntry": { "value": 3245, "percentage": "0.5 %" }
    },
    "priceComparison": {
      "regionMinPerSqm": 4200,
      "regionMaxPerSqm": 17000,
      "similarMinPerSqm": 5950,
      "similarMaxPerSqm": 11950,
      "thisListingPerSqm": 8058,
      "positionInRange": 0.3
    },
    "features": { "balcony": true, "lift": true, "cellar": false, "fittedKitchen": false, "newlyBuilt": true },
    "descriptions": { "Property Description": "…", "Furnishing": "…", "Location": "…" },
    "agent": { "company": "Progenea GmbH & Co. Liegenschaften KG", "verified": true, "profileUrl": "https://www.immobilienscout24.de/anbieter/…" },
    "phoneNumbers": ["+49 30 …"],
    "images": [{ "url": "https://pictures.immobilienscout24.de/listings/…/resize/1500x1000/format/webp/quality/80", "caption": "Visualisierungen" }]
  }
}
```

### Monitoring rows
```json
{ "changeType": "new", "listingId": "144387379", "price": 697, "firstSeenAt": "2026-10-30T05:31:50.325Z", "…": "all listing fields" }
{ "changeType": "price_changed", "listingId": "110190910", "price": 1440, "previousPrice": 1490, "priceDelta": -50, "priceChangePct": -3.36, "daysOnMarket": 10, "…": "all listing fields" }
{ "changeType": "removed", "listingId": "999999999", "lastPrice": 1234, "firstSeenAt": "2026-10-25T05:31:46.517Z", "lastSeenAt": "2026-10-29T05:31:46.517Z", "daysOnMarket": 5 }
```

Three dataset views are ready in the Console: **Listings**, **Full details** and **Market changes (monitoring)**.

---

## 💰 Pricing

Pay per result, on a sliding scale by Apify plan:

| Event | Base | Starter | Scale | Business+ |
|-------|------|--------|--------|------|
| **Listing** (per listing saved) | $0.0010 | $0.0009 | $0.0008 | $0.0007 |
| **Full-details add-on** (per enriched listing) | $0.0008 | $0.0007 | $0.0006 | $0.0005 |
| **Market change** (monitoring: price change or removed listing) | $0.0005 | $0.00045 | $0.0004 | $0.00035 |
| **Run start** (once per run) | $0.005 | $0.004 | $0.0035 | $0.003 |

* 1,000 search listings ≈ **$1.00** · 1,000 listings with full details ≈ **$1.80**
* Monitoring a 4,500-listing district daily: only new listings and changes are charged — unchanged listings cost nothing.
* Set a run budget in the Console and the actor never fetches beyond what it covers.

---

## 🔐 Proxy

Nothing to configure — every run is routed through a German residential proxy automatically, with automatic failover so a proxy hiccup never interrupts your results.

---

## 🔄 Reliability

* **Rate limits handled** — a blocked or rate-limited request is retried on a fresh connection with growing back-off instead of ending the search.
* **Filter-safe** — a filter the app API does not accept is dropped with a log line; the search carries on.
* **Automatic resume** — after a migration, timeout or restart the run continues from the last completed page.
* **No duplicates** — a listing that appears twice within a run is saved once.
* **Run summary** — every run writes a `RUN_SUMMARY` record (per-URL results, requests, retries) to its key-value store.
* **Clear error rows** — an unreadable URL or a search that could not be completed is reported as an `_error` row and never charged.

---

## 🎯 Perfect For

* 🧑‍💼 **Real-estate agents** watching a market for new stock and price cuts
* 📈 **Investors & analysts** comparing €/m², purchase fees and regional price ranges
* 🏢 **Commercial brokers** tracking offices, retail and halls
* 🤖 **Developers** feeding a CRM, valuation model or market dashboard
* 🗺️ **Researchers** collecting full regional datasets with coordinates

---

## 📞 Support

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

## 🌟 Related Actors by FlowExtract API

### 🏠 Real Estate
- **[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)** — Spanish/Portuguese/Italian property data with API
- **[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)** — Real estate listings extractor

### 🎬 Video & Media
- **[YouTube Transcript Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)** — Transcripts with timestamps
- **[Loom Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)** — Loom video and transcript extraction

### 🛠️ Developer Tools
- **[Screenshot](https://apify.com/dz_omar/screenshot?fpr=smcx63)** — Fast webpage screenshots

---

### ⚖️ Legal & Compliance
- **Public Data Access**: Only processes publicly available data
- **Rate Limiting**: Respects service limits and terms of use
- **Data Protection**: No storage of personal information or unauthorized data collection
- **Commercial Use**: Suitable for business intelligence and research applications
