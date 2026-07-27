# 🏷️ Leboncoin.fr Scraper

**Extract listings from any leboncoin.fr search URL  price, location, seller contact, photos, surface, rooms, energy rating, and all category-specific attributes.**

Scrapes comprehensive ad data from any leboncoin.fr search URL. Supports all filter combinations: category, location, price range, property type, rooms, surface, energy rating, fuel type, gearbox, mileage, and more. Just paste your search URL and go.

---

## 🚀 Quick Start

### Real Estate Search

```json
{
  "startUrls": [
    { "url": "https://www.leboncoin.fr/recherche?category=9&locations=Paris_75001__48.8566_2.3522_10000_10000&real_estate_type=2" }
  ],
  "maxResults": 50
}
```

### Car Search with Keyword

```json
{
  "startUrls": [
    { "url": "https://www.leboncoin.fr/recherche?category=2&text=citroen&kst=k&fuel=2&gearbox=2&price_max=10000" }
  ],
  "maxResults": 100
}
```

### All Pages  Unlimited Results

```json
{
  "startUrls": [
    { "url": "https://www.leboncoin.fr/recherche?category=9&locations=Lorraine_53300__48.34594_-0.56243_5000_5000&real_estate_type=2" }
  ],
  "maxResults": 0
}
```

### Multi-URL Run

```json
{
  "startUrls": [
    { "url": "https://www.leboncoin.fr/recherche?category=9&locations=Lyon_69001__45.7597_4.8422_10000_10000&real_estate_type=1" },
    { "url": "https://www.leboncoin.fr/recherche?category=9&locations=Marseille_13001__43.2965_5.3698_10000_10000&real_estate_type=2" },
    { "url": "https://www.leboncoin.fr/recherche?category=2&text=peugeot&kst=k&price_max=8000" }
  ],
  "maxResults": 50
}
```

---

## 📋 Input Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `startUrls` | array |  | One or more leboncoin.fr search URLs. All filters are parsed automatically from the URL. |
| `maxResults` | integer | 10 | Max ads to scrape per URL. Set to `0` for unlimited (all pages). |
| `fetchAdDetails` | boolean | `false` | Also fetch each ad's full **description** text. See below. |

That's the whole configuration  there is no proxy to set up (see below).

---

## 📄 Full Ad Descriptions (optional)

Leboncoin **does not return ad descriptions in search results**  every search row comes
back with an empty description, no matter which category you search. The only way to get
the description is to open each ad individually.

Turn on `fetchAdDetails` and the actor does exactly that, filling the `body` field:

```json
{
  "startUrls": [{ "url": "https://www.leboncoin.fr/recherche?category=9" }],
  "maxResults": 100,
  "fetchAdDetails": true
}
```

| | Off (default) | On |
|---|---|---|
| Description (`body`) |  empty | ✅ full text |
| Price, location, seller, photos, all attributes | ✅ included | ✅ included |
| Requests | 1 per 35 ads | **1 per ad** |
| Speed | ~2.5 min / 1,000 ads | much slower  budget ~1 hour per 1,000 |
| Price | base rate | base + add-on |

Everything except the description is already included **without** this option. Leave it off
unless you specifically need the description text.

`hasDetailData` on each item tells you whether that ad's description was retrieved. Ads
whose description could not be fetched are still returned  and are **never charged the
add-on**.

---

## 💰 Pricing

You pay per ad saved to the dataset. **No start fee**  runs that return nothing cost nothing.

| Event | Free | Starter | Scale | Business |
|---|---|---|---|---|
| **Ad data extraction** | $1.00 / 1,000 | $0.80 / 1,000 | $0.70 / 1,000 | $0.60 / 1,000 |
| **Full ad description (add-on)** | $3.00 / 1,000 | $1.50 / 1,000 | $1.00 / 1,000 | $0.90 / 1,000 |
| Platform usage | Free | Free | Free | Free |

The add-on applies **only** when `fetchAdDetails` is enabled, and only to ads whose description
was successfully retrieved. It is charged **in addition to** ad data extraction, so on Starter
1,000 ads with descriptions is $0.80 + $1.50 = $2.30.

**Cost examples (Starter):** 100 ads  $0.08 · 1,000 ads  $0.80 · 10,000 ads  $8.00

> 💡 Tip: set `maxResults` to 10 for a first run to check your search URL returns what you expect, then raise it.

---

## 📤 Output

Each scraped ad is saved as a single JSON record. Here is a real example output:

```json
{
  "list_id": 3126745351,
  "url": "https://www.leboncoin.fr/ad/ventes_immobilieres/3126745351",
  "source_url": "https://www.leboncoin.fr/recherche?category=9&locations=Lorraine_53300__48.34594_-0.56243_5000_5000&real_estate_type=2",
  "status": "active",
  "category_id": "9",
  "category_name": "Ventes immobilières",
  "subject": "Appartement 3 pièces 70 m²",
  "body": null,
  "price": 84500,
  "price_cents": 8450000,
  "first_publication_date": "2026-03-09 13:27:23",
  "index_date": "2026-05-01 21:01:13",
  "city": "Mayenne",
  "zipcode": "53100",
  "department_id": "53",
  "region_id": "18",
  "lat": 48.28813,
  "lng": -0.6071946,
  "poster_type": "pro",
  "seller_name": "Audrey Mainfray - IAD France",
  "seller_store_id": "67523483",
  "seller_user_id": "9a6bf162-1ee6-4372-96d4-8162d720ce3f",
  "image_count": 10,
  "images": [
    "https://img.leboncoin.fr/api/v1/lbcpb1/images/fa/57/dc/fa57dc...jpg?rule=ad-large",
    "..."
  ],
  "thumb_url": "https://img.leboncoin.fr/api/v1/lbcpb1/images/fa/57/dc/fa57dc...jpg?rule=ad-thumb",
  "attributes": {
    "real_estate_type": "Appartement",
    "square": "70 m²",
    "rooms": "3",
    "bedrooms": "2 ch.",
    "energy_rate": "D",
    "ges": "D",
    "heating_type": "Individuel",
    "heating_mode": "Gaz",
    "floor_number": "1",
    "nb_floors_building": "4",
    "building_year": "1950",
    "global_condition": "Bon état",
    "elevator": "Non",
    "annual_charges": "178 €",
    "price_per_square_meter": "1207",
    "estimated_notary_fees": "6760 €",
    "estimated_total_property_price": "91260 €",
    "annual_energy_budget_min": "1300 €",
    "annual_energy_budget_max": "1800 €",
    "mandate_type": "exclusive",
    "store_name": "Audrey Mainfray - IAD France",
    "immo_sell_type": "old"
  },
  "hasDetailData": false,
  "raw": { "...": "leboncoin's complete original response for this ad" },
  "_source": "leboncoin_scraper"
}
```

### 🧩 The `raw` field  nothing is thrown away

The fields above are a **convenience view**: flattened and renamed for easy use in
spreadsheets and the dataset views. They are deliberately simplified.

**`raw` holds leboncoin's response exactly as the site returned it**, with nothing
renamed or removed  so anything the convenience view simplifies is still available:

| In `raw`, not in the flat view | Example |
|---|---|
| `raw.owner.siren` | Company registration number of a professional seller |
| `raw.owner.activity_sector`, `pro_rates_link`, `no_salesmen` | Full seller record |
| `raw.location.district`, `city_label`, `region_name`, `department_name` | Complete location record (17 fields, not 6) |
| `raw.images.urls`, `urls_thumb`, `small_url` | All image size variants, not just large |
| `raw.attributes[]` | Full objects `{key, value, values[], value_label, generic}`  the flat map keeps only the label, so `raw` is where the machine-readable `value` codes live |
| `raw.has_phone`, `brand`, `ad_type`, `options`, `attributes_listing`, `is_boosted`, `similar`, `counters` | Fields with no flat equivalent |

When `fetchAdDetails` is on, `raw` is the full ad payload (including the description);
otherwise it is the search payload. Use the flat fields for convenience, `raw` when you
need something specific  you never have to choose.

---

## 📊 Dataset Views

The scraper includes six pre-configured views in the Apify dataset UI:

| View | Purpose |
|------|---------|
| **Overview** | Quick summary  photo, title, price, city, ZIP, category, seller, dates |
| **Detailed** | Full ad data  body text, coordinates, price in cents, seller IDs, source URL |
| **Real Estate Attributes** | Property-specific  surface, rooms, energy rating (DPE/GES), floor, heating, charges, notary fees |
| **Seller & Contact** | Seller name, type (pro/private), store ID, agency, mandate type, rates link |
| **Location & Map** | City, ZIP, department, region, and GPS coordinates for all ads |
| **Photos** | Thumbnail + full image array per ad |

---

## ⚡ Performance & Reliability

### Speed

Measured on a full 1,000-ad extraction (35 ads per page):

| Ads | Paying plans | Free plan |
|---|---|---|
| 100 | ~20 seconds | ~45 seconds |
| 1,000 | **~2.5 minutes** | ~7 minutes |
| 5,000 | ~13 minutes | ~34 minutes |

Paying plans run on a faster dedicated network, which is why they finish sooner.
Real-world timing varies with how busy leboncoin.fr is.

### Reliability

- Every ad is charged once  duplicates that appear across pages or overlapping
  search URLs are detected and skipped, never billed twice
- Failed requests are retried automatically; a URL that cannot be finished is
  reported and the run continues with the next one
- The budget cap is applied *before* scraping starts, so a run never over-fetches
- Interrupted runs (migration, timeout, abort) **resume from the last completed
  page** instead of starting over and re-charging you

### Resource Usage

- **Memory**: 512 MB max

---

## 🔗 URL Parameters Reference

Paste any leboncoin.fr search URL directly  all query parameters are parsed automatically:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `category` | `category=9` | Category ID. See table below. |
| `text` + `kst=k` | `text=citroen&kst=k` | Keyword search |
| `locations` | `locations=Paris_75001__48.86_2.35_10000_10000` | City + GPS + radius. Format: `CityName_zipcode__lat_lng_defaultRadius_radius` |
| `real_estate_type` | `real_estate_type=2` | Property type filter (see below) |
| `price_min` / `price_max` | `price_min=50000&price_max=200000` | Price range in € |
| `rooms` | `rooms=3` | Minimum number of rooms |
| `rooms_min` / `rooms_max` | `rooms_min=2&rooms_max=4` | Room range |
| `square` | `square=50` | Minimum surface in m² |
| `square_min` / `square_max` | `square_min=40&square_max=120` | Surface range |
| `fuel` | `fuel=2` | Fuel type for cars |
| `gearbox` | `gearbox=2` | Gearbox for cars |
| `mileage_min` / `mileage_max` | `mileage_max=100000` | Mileage range for cars |
| `regdate_min` / `regdate_max` | `regdate_min=2015` | Registration year for cars |
| `owner_type` | `owner_type=pro` | `pro` / `private` / `all` |
| `sort` | `sort=price_asc` | `relevance` / `time` / `price_asc` / `price_desc` |
| `page` | `page=3` | Start from page N |


### Sample URLs

```
Apartments in Paris:     https://www.leboncoin.fr/recherche?category=9&locations=Paris_75001__48.8566_2.3522_10000_10000&real_estate_type=2
Houses for sale in Lyon: https://www.leboncoin.fr/recherche?category=11&locations=Lyon_69001__45.7597_4.8422_10000_10000&real_estate_type=1
Citroën cars:            https://www.leboncoin.fr/recherche?category=2&text=citroen&kst=k
Diesel autos < 100k km:  https://www.leboncoin.fr/recherche?category=2&fuel=2&mileage_max=100000&price_max=15000
Pro sellers only:        https://www.leboncoin.fr/recherche?category=9&owner_type=pro&price_min=100000
Cheap rentals in Nantes: https://www.leboncoin.fr/recherche?category=10&locations=Nantes_44000__47.2184_-1.5536_10000_10000&price_max=700
```

---

## 🌐 Proxy Support

| Your plan | Network used |
|---|---|
| 💎 Paying | Dedicated network  faster, fewer retries |
| 🆓 Free | Apify Residential Proxy  built in, automatic |

Proxy selection is automatic based on your Apify account plan. **There is nothing to
configure and no proxy of your own to supply.** If the dedicated network is ever
unavailable, the run switches over automatically and finishes rather than failing.

---

## 🚫 Error Handling

| Situation | What you see | What to do |
|---|---|---|
| A pasted URL isn't a recognised leboncoin.fr search URL | An `_error` field on that item explaining why | Copy the URL straight from your browser address bar |
| No start URLs provided | A single guidance item in the dataset | Add at least one URL to `startUrls` |
| The run's max charge is below the price of one ad | A guidance item explaining the minimum | Raise the run's maximum total charge |
| A search page can't be fetched after all retries | A log entry; the run moves to the next URL | Re-run later, or narrow the search |
| An ad's description can't be fetched | The ad is still saved with `hasDetailData: false` and no add-on charge | Nothing  re-run if you need that specific description |

---

## ⚠️ Important Notes

- Data is extracted as-is from leboncoin.fr. Prices and availability should be verified directly with sellers.
- Leboncoin omits ad descriptions from search results. Enable `fetchAdDetails` to
  retrieve them; everything else is included either way.
- If the site changes, check for actor updates.
- Users must comply with leboncoin.fr's Terms of Service and applicable data protection laws (GDPR).

**The actor creator is not responsible for how users utilize the extracted data.**

---

## Support

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok**: [@flowextractapi](https://www.tiktok.com/@flowextractapi)

---

## Legal & compliance

- Extracts **public data only**  no login, no private or gated content.
- Respects the source site's rate limits and terms.
- **No personal information is stored** by this Actor; data goes only to your own dataset.
- Suitable for commercial use.
- **No affiliation with or endorsement by leboncoin.fr is implied.**

---

## 🌟 Related Actors by FlowExtract API

### 🏠 Real Estate Data

**[Realtor.com Scraper](https://apify.com/dz_omar/realtor-scraper?fpr=smcx63)**
Extract US property listings from Realtor.com. Pricing, agent contacts, tax history, AVM estimates, nearby schools, flood and noise data, and full listing history.

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

**Ready to extract leboncoin.fr data?** [Start using Leboncoin.fr Scraper now!](https://apify.com/dz_omar/leboncoin-scraper?fpr=smcx63)

---

*Leboncoin.fr Scraper — by FlowExtract API. Turn any website into structured data.*
