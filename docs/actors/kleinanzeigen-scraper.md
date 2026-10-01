# 🏷️ Kleinanzeigen.de Scraper

**Free Kleinanzeigen scraper.** Paste any kleinanzeigen.de search link — with every filter you set on the site — or just type keywords and a city. Get clean, structured listings: price, location with coordinates, photos, category details (make, mileage, rooms, size, condition…) and, optionally, the seller's name, rating, member-since date, view count and — for businesses — phone number and imprint.

- ✅ **Every category and every filter**: cars, real estate, electronics, furniture, jobs, pets… Whatever you filter on the website is applied exactly.
- ✅ **Two ways to start**: paste links, or search by keyword + category + location + radius + price and more.
- ✅ **No 10,000 limit**: large searches (all iPhones, all used cars…) are collected completely — exact totals, no duplicates.
- ✅ **Fast**: 100 listings per page, hundreds of listings in seconds.
- ✅ **Seller & contact data** on request, including business phone numbers.
- ✅ **Free** — you only pay Apify platform usage (typically a few cents per thousand listings).

---

## 🚀 Quick start

### 1. Paste a search link (Option A)

Open [kleinanzeigen.de](https://www.kleinanzeigen.de), search, set any filters, and copy the link from the address bar.

```json
{
  "startUrls": ["https://www.kleinanzeigen.de/s-berlin/iphone/k0l3331"],
  "maxResultsPerSearch": 200
}
```

### 2. Cars with all filters

Make, model, mileage, first registration, fuel, gearbox, equipment — all taken from the link.

```json
{
  "startUrls": [
    "https://www.kleinanzeigen.de/s-autos/bmw/c216+autos.ez_i:2015,2022+autos.km_i:10000,150000+autos.marke_s:bmw+autos.shift_s:automatik"
  ],
  "includeDetails": true,
  "maxResultsPerSearch": 100
}
```

### 3. Keyword search without building a link (Option B)

```json
{
  "searchQueries": ["ebike", "rennrad"],
  "location": "Hamburg",
  "radiusKm": "20",
  "maxPrice": 1500,
  "sellerType": "private",
  "maxResultsPerSearch": 100
}
```

More keyword filters — category, offers only, shipping, "Direkt kaufen", photos only:

```json
{
  "searchQueries": ["iphone"],
  "category": "173",
  "offerType": "offered",
  "shipping": "shippable",
  "buyNowOnly": true,
  "photosOnly": true,
  "maxResultsPerSearch": 200
}
```

### 4. A complete large search (more than 10,000 listings)

Kleinanzeigen itself shows at most 10,000 listings per search. Set a higher limit and the Actor collects the full result set automatically — in our test, all 13,856 listings for "iphone 15 pro" (the website shows 13,856), with no duplicates.

```json
{
  "startUrls": ["https://www.kleinanzeigen.de/s-iphone-15-pro/k0"],
  "maxResultsPerSearch": 1000000
}
```

### 5. One listing, or everything a seller offers

```json
{
  "startUrls": [
    "https://www.kleinanzeigen.de/s-anzeige/nachlaesse-haushaltsaufloesung-ankauf-entruempelung-idar-oberstein/1779907820-239-22090",
    "https://www.kleinanzeigen.de/s-bestandsliste.html?userId=41664409"
  ]
}
```

---

## 📋 Input

| Field | Section | What it does |
|---|---|---|
| `startUrls` | 🔗 Option A | Search result links (any category, any filters), single listing links, or a seller's "all listings" link. |
| `searchQueries` | 🔎 Option B | Keywords — each one runs as its own search. |
| `location` | 🔎 Option B | City, district or zip code. Not found → Germany-wide (the log says so). |
| `radiusKm` | 🔎 Option B | +5 … +500 km around the location. |
| `minPrice` / `maxPrice` | 🔎 Option B | Price range in €. |
| `sortBy` | 🔎 Option B | Newest, lowest price, highest price, nearest, recommended. |
| `sellerType` | 🔎 Option B | Private, commercial, or both. |
| `category` | 🔎 Option B | Any of the 161 categories (main categories include their subcategories). |
| `offerType` | 🔎 Option B | Offers, requests ("Gesuche"), or both. |
| `shipping` | 🔎 Option B | Any, shipping possible, or pickup only. |
| `buyNowOnly` | 🔎 Option B | Only listings with "Direkt kaufen". |
| `photosOnly` | 🔎 Option B | Only listings with pictures. |
| `includeDetails` | ⚙️ Both | Full description + seller info + seller's active listings + view count + business phone/imprint. |
| `maxResultsPerSearch` | ⚙️ Both | Listings per link/keyword (default 100). Above 10,000 the full search is collected automatically. |
| `maxResults` | ⚙️ Both | Cap for the whole run (0 = no limit). |

Option A and Option B can be combined in one run. Option B's filters apply to keywords only — links always keep their own filters.

---

## 📤 Output

One record per listing. Example with `includeDetails: true` (values anonymized and shortened):

```json
{
  "id": "3512345678",
  "url": "https://www.kleinanzeigen.de/s-anzeige/bmw-116d-automatik/3512345678-216-2091",
  "title": "BMW 116d Automatik | Navi | PDC Sitzheizung | TÜV 11/2027 | Euro 6",
  "description": "UNFALLFREI – BMW 116d Automatik – gepflegt\nZum Verkauf steht mein …",
  "price": 8650,
  "priceType": "PLEASE_CONTACT",
  "originalPrice": 10500,
  "currency": "EUR",
  "adType": "OFFERED",
  "sellerType": "PRIVATE",
  "categoryId": "216",
  "categoryName": "Autos",
  "zipCode": "40227",
  "city": "Oberbilk",
  "region": "Nordrhein-Westfalen",
  "latitude": 51.2105,
  "longitude": 6.8054,
  "locationRadiusKm": 1.7,
  "postedAt": "2026-09-12T16:00:22.000+0200",
  "editedAt": "2026-09-12T16:00:21.000+0200",
  "status": "ACTIVE",
  "buyNow": false,
  "isTopAd": false,
  "attributes": {
    "Marke": "BMW", "Modell": "116", "Kilometerstand": "148.300", "Erstzulassungsjahr": "2015",
    "Kraftstoffart": "Diesel", "Getriebe": "Automatik"
  },
  "imageUrl": "https://img.kleinanzeigen.de/api/v1/prod-ads/images/58/5855ab87-….?rule=$_59.JPG",
  "images": ["https://img.kleinanzeigen.de/api/v1/prod-ads/images/58/5855ab87-….?rule=$_59.JPG"],
  "imageCount": 12,
  "sellerId": "123456789",
  "sellerName": "Max",
  "sellerAccountType": "PRIVATE",
  "sellerSince": "2019-03-02T10:11:00.000+0100",
  "sellerRating": 1,
  "sellerBadges": [{ "name": "rating", "level": 2 }, { "name": "friendliness", "level": 1 }],
  "sellerActiveAds": 4,
  "phone": null,
  "imprint": null,
  "viewCount": 681,
  "scrapedAt": "2026-09-30T21:59:00.740Z",
  "_source": "kleinanzeigen_scraper",
  "source_url": "https://www.kleinanzeigen.de/s-autos/bmw/c216+autos.marke_s:bmw"
}
```

| Field group | Always | With `includeDetails` |
|---|---|---|
| ID, link, title, price, price type, reduction, category | ✅ | ✅ |
| Zip, city, coordinates, distance from your search location | ✅ | ✅ + street (when published), federal state |
| Category details (`attributes`), photos, posted/edited date | ✅ | ✅ |
| Description | short excerpt | **full text** |
| Seller name, ID, rating, badges, member since | — | ✅ |
| Seller's listings online now (`sellerActiveAds`) | — | ✅ |
| View count | — | ✅ |
| Phone number & imprint | — | ✅ commercial sellers who publish them |

**Price types:** `SPECIFIED_AMOUNT` = fixed price, `PLEASE_CONTACT` = negotiable ("VB"), `FREE` = to give away.
**Locations of private sellers** are approximate by design — `locationRadiusKm` tells you how approximate.

### 📊 Dataset views

- **Overview** — photo, title, price, city, category, seller type, posted date, link.
- **Sellers & contact** — seller name, type, phone, rating, member since, active listings, street, views (use with `includeDetails`).

Export as JSON, CSV, Excel, XML or HTML, or pull it through the Apify API, webhooks, Make, Zapier or n8n.

---

## 💡 Use cases

- **Car dealers & traders** — monitor prices by make, model, mileage and year across all of Germany.
- **Real estate** — collect rental and sale offers with rooms, size and price per m².
- **Resellers & price research** — track used-market prices for phones, bikes, furniture, electronics.
- **Lead generation** — find commercial sellers in a category with phone number and imprint.
- **Market research** — supply, pricing and regional distribution for any product.

---

## 💰 Cost

The Actor itself is **free**. You pay only Apify platform usage, measured in our test runs:

| Run | Listings | Time | Platform cost |
|---|---|---|---|
| 2 searches, no details | 170 | 4 s | ≈ $0.001 |
| 3 links + 1 keyword, with details | 91 | 9 s | ≈ $0.001 |
| 1 search, with details (busy period) | 120 | 17 s | ≈ $0.016 |
| 1 large search, complete | 13,856 | 4 min | ≈ $0.06 |

The Apify free plan's monthly credit covers tens of thousands of listings.

---

## ⚡ Limits & good to know

- **Large searches are collected completely.** Kleinanzeigen shows at most 10,000 listings per search; when you ask for more, the Actor collects the full result set in parts and reports the exact total in the log (e.g. "13,856 listing(s) found"). Very large searches (hundreds of thousands of listings) take a while — use `maxResultsPerSearch` to cap them.
- **Exact totals**: the log shows the real number of matching listings, not just "10,000+".
- **Page numbers in links are ignored** — collection always starts from the first result, so you get the whole search.
- **Duplicates are removed** within a run, even across overlapping searches.
- **Filters are checked**: if a pasted link contains something that could not be applied, the log names it.

---

## 🚫 Error handling

| Situation | What happens |
|---|---|
| No input | Run **succeeds** with one dataset item explaining what to enter. |
| Link that isn't a search, listing or seller page | Skipped with a clear reason; if nothing usable is left, a guidance item explains it. |
| Location not found | Warning, then the keyword search runs across all of Germany. |
| A listing was deleted | Skipped with a note. |
| Temporary network problems | Retried automatically. |

---

## ❓ FAQ

**Do I need a Kleinanzeigen account or cookies?** No. Only public listings are collected.

**Can I get phone numbers?** Yes, for commercial sellers who publish them — enable `includeDetails`. Private sellers' numbers are not public.

**Which categories work?** All of them. Any filter the website offers for a category is supported through the link — including colour, condition and material.

**Can I get more than 10,000 results?** Yes — set `maxResultsPerSearch` above 10,000 and the whole search is collected.

**Can I monitor new listings?** Sort by newest (the default) and schedule the Actor on Apify — each run returns the latest listings first.

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

- Extracts **public data only** — no login, no private or gated content.
- Respects the source site's rate limits and terms.
- **No personal information is stored** by this Actor; data goes only to your own dataset. You are responsible for handling any personal data (such as seller names or business phone numbers) in line with GDPR/DSGVO.
- Suitable for commercial use.
- **No affiliation with or endorsement by kleinanzeigen.de is implied.**

---

## 🌟 Related Actors by FlowExtract API

**[Leboncoin.fr Scraper](https://apify.com/dz_omar/leboncoin-scraper?fpr=smcx63)**
The French counterpart: listings from any leboncoin.fr search — price, location, seller, photos and category details.

**[ImmoScout24 Scraper](https://apify.com/dz_omar/immobilienscout24-scraper?fpr=smcx63)**
German real estate listings from ImmoScout24.

**[Idealista Scraper](https://apify.com/dz_omar/idealista-scraper?fpr=smcx63)**
Spanish, Italian and Portuguese property listings from Idealista.

**[Zillow Scraper](https://apify.com/dz_omar/zillow-scraper?fpr=smcx63)**
US property listings, prices and agent details from Zillow.

---

**Ready to extract kleinanzeigen.de data?** [Start using Kleinanzeigen.de Scraper now!](https://apify.com/dz_omar/kleinanzeigen-scraper?fpr=smcx63)

---

*Kleinanzeigen.de Scraper — by FlowExtract API. Turn any website into structured data.*
