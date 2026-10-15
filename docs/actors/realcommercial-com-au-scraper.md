# realcommercial.com.au Scraper 🏢 Sold, Leased & Agent Phones

Scrape **Australian commercial property listings** from realcommercial.com.au — **for sale, for lease, sold and leased** — from any search link or just by typing a suburb, postcode or state. Every listing comes back complete: price, address with GPS, floor and land area, zoning, NABERS rating, photos, floor plans, **brochure PDFs**, and the **agency and agent phone numbers**.

- 🔗 **Paste any search link** — suburb, postcode, region or state, with or without a property type. Single listing links work too.
- 📍 **Or skip the link** — choose *for sale / for lease / sold / leased* and type places like `Sydney, NSW 2000`, `3000` or `VIC`.
- 🆕 **Newest first** — listings published today are included.
- 📞 **Agent & agency phones** on every listing, plus agency address and logo.
- 📄 **Documents** — information memorandums and brochures as direct PDF links.
- 🔎 **Filters** — property type, keywords, tenure (vacant / tenanted), price, floor area, land area, car spaces.
- 🚫 **No login, no cookies.**

## 🚀 Quick start

### 1. Paste a search link (Option A)

Open a search on [realcommercial.com.au](https://www.realcommercial.com.au), pick the location and property type, and copy the link from the address bar:

```json
{
  "startUrls": [
    "https://www.realcommercial.com.au/for-sale/sydney-nsw-2000/offices/",
    "https://www.realcommercial.com.au/for-lease/toowoomba-greater-region-qld/",
    "https://www.realcommercial.com.au/sold/vic/industrial-warehouse/"
  ],
  "maxResultsPerSearch": 100
}
```

### 2. Type locations instead (Option B)

```json
{
  "channel": "leased",
  "locations": ["Parramatta, NSW 2150", "3000", "Fortitude Valley QLD"],
  "maxResultsPerSearch": 200
}
```

A suburb name alone (`"Parramatta"`) matches every suburb of that name across Australia.

### 3. Narrow it down with filters (Option C — works with A and B)

```json
{
  "channel": "for-sale",
  "locations": ["NSW"],
  "propertyTypes": ["industrial-warehouse"],
  "tenure": "tenanted",
  "minLandArea": 2000,
  "maxPrice": 5000000,
  "keywords": "freehold"
}
```

### 4. One listing

```json
{ "startUrls": ["https://www.realcommercial.com.au/for-sale/property-level-6-250-queen-street-melbourne-vic-3000-505236472"] }
```

## 📋 Input

| Field | Type | What it does |
|---|---|---|
| `startUrls` | list of links | Search pages (for sale / for lease / sold / leased; suburb, postcode, region or state; optional property type) or single listing pages |
| `channel` | select | For sale, For lease, Sold or Leased — used with `locations` |
| `locations` | list | `Suburb, STATE postcode`, `Suburb STATE`, a postcode, or a state code |
| `propertyTypes` | multi-select | Offices, Retail, Industrial / Warehouse, Showrooms / Bulky Goods, Land / Development, Hotel / Leisure, Medical / Consulting, Commercial Farming, Other |
| `keywords` | text | Keep listings whose title, description or highlights contain **all** these words |
| `tenure` | select | Any, Vacant possession, Tenanted investment |
| `minPrice` / `maxPrice` | AUD | Uses the first dollar amount of the advertised price; hidden prices are left out when set |
| `minFloorArea` / `maxFloorArea` | m² | Floor area range |
| `minLandArea` / `maxLandArea` | m² | Land area range (hectares are converted) |
| `minCarSpaces` | number | Minimum car spaces |
| `maxResultsPerSearch` | number | Stop each search after this many listings (0 = no limit) |
| `maxResults` | number | Stop the whole run after this many listings (0 = no limit) |

## 📤 Output

One item per listing. Real example (agent phone masked here):

```json
{
  "id": "505086060",
  "url": "https://www.realcommercial.com.au/sold/property-laidley-hotel-112-patrick-street-laidley-qld-4341-505086060",
  "channel": "sold",
  "title": "SOLD BY SCOOTY @ SGW Hotel Broker",
  "propertyTypes": ["Hotel/Leisure"],
  "tenureType": "vacant",
  "priceText": "$950,000",
  "price": 950000,
  "fullAddress": "LAIDLEY HOTEL, 112 Patrick Street, Laidley, QLD 4341",
  "suburb": "Laidley",
  "state": "QLD",
  "postcode": "4341",
  "latitude": -27.63132504,
  "longitude": 152.39415877,
  "floorAreaSqm": 931,
  "landAreaSqm": 933,
  "soldDate": "2026-08-04",
  "daysOnSite": 202,
  "highlights": ["COMMERCIAL HOTEL LICENSE+ ACCOMMODATION", "CREATE FOR THE FUTURE - FRANCHISE OPTION"],
  "attributes": {
    "Zoning": "Commercial",
    "Municipality": "Lockyer Valley Regional Council",
    "NABERS": "4.0",
    "Tenure type": "Vacant Possession"
  },
  "agencyName": "SGW Hotel Broker",
  "agentName": "SCOTT WILLIAMS",
  "agentPhone": "04xx xxx xxx",
  "agencies": [
    {
      "id": "SFRJVD",
      "name": "SGW Hotel Broker",
      "address": "18 MARY STREET, MOUNT LOFTY, QLD 4350",
      "agents": [{ "id": "3248328", "name": "SCOTT WILLIAMS", "phone": "04xx xxx xxx" }]
    }
  ],
  "imageUrl": "https://i1.au.reastatic.net/1200x900-quality=60,progressive/f158ff1b…/image0.jpg",
  "imageCount": 20,
  "floorPlans": ["https://i1.au.reastatic.net/1200x900-quality=60,progressive/452f8e0d…/floorplan0.jpg"],
  "documents": [
    { "name": "Liquor licence premises details report as at 1 April 2025.pdf", "url": "https://i1.au.reastatic.net/d074cc36…/document0.pdf" }
  ],
  "websites": ["http://www.sgwhotelbroker.com.au"],
  "scrapedAt": "2026-10-02T23:53:41.000Z"
}
```

Every item also carries `status` (e.g. *Under Contract*), `isPriceHidden`, `streetAddress`, `carSpaces`, `leasedDate`, `lastUpdatedAt`, the full `description`, all `images`, `virtualTours`, `listingTier` and `multipleProperties`.

### 📊 Dataset views

- **Overview** — photo, title, type, price, property type, floor and land area, location, agency, agent phone, link.
- **Agents & contacts** — agency and agent names and phone numbers with the address, ready for outreach lists.

## 💡 Use cases

- **Commercial agents & brokers** — track new listings and recent sales in your patch every morning.
- **Investors** — screen tenanted investments by price, land size and zoning across a whole state.
- **Valuers & analysts** — build sold and leased comparables with dates, areas and prices.
- **Lead generation** — agency and agent phone numbers by suburb and property type.
- **Developers** — find land / development sites above a minimum land area.

## ⚡ Limits & good to know

- Results come **newest listing first**; `maxResultsPerSearch` keeps the newest ones.
- Prices on commercial listings are often hidden (*Contact Agent*). `priceText` always keeps what the listing shows; `price` is filled only when a dollar amount is advertised.
- A page number in a pasted link is ignored — collection always starts at the newest listing.
- Sold and leased history is large; set a location or a property type to keep runs short.

## 🚫 Error handling

- A link that isn't a realcommercial.com.au search or listing page is skipped with a message in the log.
- With no usable input, the run finishes with one dataset item explaining what to add.
- A listing that can't be loaded after several attempts is skipped and counted in the log; the run continues.

## ❓ FAQ

**Do I need an account or cookies?** No — only public listing pages are used.

**Can I get listings from a whole state?** Yes — paste a state link (`/for-sale/nsw/`) or type `NSW` in Locations.

**Does it include listings added today?** Yes.

**Why is `price` empty when `priceText` says "Contact Agent"?** The agent hasn't published a price; there is no number to extract.

**Can I schedule it?** Yes — create a task with your input and add a schedule in Apify; each run returns the newest listings first.

## Support

- 🌐 **Website:** [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email:** [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 💬 **GitHub:** [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn:** [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X (Twitter):** [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook:** [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok:** [@flowextractapi](https://www.tiktok.com/@flowextractapi)

## Legal & compliance

- **Public data only** — processes publicly available data.
- **Rate limiting** — respects source-service limits and terms of use.
- **Data protection** — no storage of personal information or unauthorized data collection.
- **Commercial use** — suitable for business intelligence and research.
- No affiliation with or endorsement by realcommercial.com.au or REA Group is implied.

## 🌟 Related Actors by FlowExtract API

- 🏠 [realestate.com.au Scraper](https://apify.com/dz_omar/realestate-com-au-scraper?fpr=smcx63) — residential buy, rent and sold listings.
- 👥 [realestate.com.au Agents & Agencies Scraper](https://apify.com/dz_omar/realestate-com-au-agents-scraper?fpr=smcx63) — agents and agencies with emails, phones and listing stats.

---

*realcommercial.com.au Scraper — by FlowExtract API. Turn any website into structured data.*
