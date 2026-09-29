# 🏠 realestate.com.au Scraper — Buy, Rent & Sold Listings with Full Details

**[realestate.com.au Scraper](https://apify.com/dz_omar/realestate-com-au-scraper?fpr=smcx63)** turns any realestate.com.au search URL — buy, rent, or sold — into clean, structured property data. Every listing comes back **fully detailed**: price (as text *and* as numbers), status, address with coordinates, beds/baths/parking, land size, full feature list, inspection and auction times, statement of information, agent and agency contacts, and full-size photos. Paste a search URL and get the whole result set, or paste a single property link and get that one property.

Perfect for **property investors** tracking new listings, **agencies** monitoring competitor stock, and **market researchers** building price and rent datasets — without copying anything off the site by hand.

---

## Why scrape realestate.com.au?

realestate.com.au is Australia's largest property portal, covering homes for sale, for rent, and recently sold across every state. It's the primary public source for current asking prices, rental rates, and sold results at national scale.

Common use cases:

- **Investment research** — pull every listing matching a price/size/location filter and compare deals across suburbs using numeric prices.
- **Sold-price analysis** — collect recent sales with their sold date and sold price for a suburb or region.
- **Rental market tracking** — weekly rents, bond amounts, and availability dates for any area or hand-drawn map region.
- **Competitor monitoring** — agencies tracking what's new, under offer, or sold in their patch.
- **Lead generation** — agent and agency contact details, profile links, and photos attached to active listings.

---

## What data can realestate.com.au Scraper extract?

Every listing includes all of the following — there is no separate "detail mode" to switch on.

### 🏠 Identity & status
- Listing ID, listing URL, channel (buy / rent / sold), property type, title, plain-text description
- Status (e.g. *New*, *Under Offer*, *Sold*), construction status (established / new)

### 💰 Price
- Display price exactly as shown on the site (e.g. `$645,000 - $675,000`, `Contact Agent`)
- Numeric `priceFrom` / `priceTo` in AUD whenever the price is an unambiguous amount or range (`$1.4m-$1.48m` → 1,400,000 – 1,480,000); weekly rents are marked `pricePeriod: "week"`
- **Sold listings:** sold date · **Rentals:** bond and date available

### 📍 Location
- Street address, suburb, state, postcode, latitude/longitude

### 🛏️ Property features
- Bedrooms, bathrooms, parking spaces, land size (text and numeric value + unit)
- Full indoor/outdoor feature list, statement of information (Victoria), inspection and auction times

### 👤 Agents & agency
- Every listed agent: name, job title, phone, email, profile URL, photo
- Agency: name, phone, email, website, office address, profile URL, logo, agency listing ID

### 🖼️ Media
- Main image and the full photo gallery, as full-size image URLs

---

## ⚙️ How to use realestate.com.au Scraper

### Start URLs (Array)

Paste realestate.com.au URLs straight from your browser — no editing needed. Two kinds are supported:

| Input value | What it extracts |
|---|---|
| A search/listing URL (`/buy/…`, `/rent/…`, `/sold/…`, including map-drawn and inspection-day searches) | Up to **Max Results** listings matching that search |
| An individual property URL | That one property |

```json
{
    "startUrls": [
        { "url": "https://www.realestate.com.au/buy/property-townhouse-size-200-5000-between-50000-15000000-in-adelaide+-+greater+region,+sa;+adelaide+hills,+sa;+adelaide,+sa+5000/list-1" },
        { "url": "https://www.realestate.com.au/property-acreage+semi-rural-nsw-blackmans+point-149898944" }
    ]
}
```

Filters already applied on the site — location, property type, price, land size, bedrooms, sort order, map-drawn areas, and inspection dates — carry through automatically.

A listing that shows up in more than one of your searches is returned (and charged) **only once**.

### `maxResults` (Integer)
- **Default**: `25`
- Maximum listings to scrape per search URL. Set to `0` for all available results. Doesn't affect individual property URLs — those always return exactly one result.

> ℹ️ realestate.com.au serves at most **2,000 results for any single search**. If your search matches more, the run log tells you so — split it into narrower searches (by suburb, price range, or property type) and add each URL to collect everything.

```json
{
    "startUrls": [{ "url": "https://www.realestate.com.au/sold/in-richmond,+vic+3121/list-1?activeSort=solddate" }],
    "maxResults": 500
}
```

---

## 💰 Pricing

| Event | FREE | BRONZE | SILVER | GOLD+ |
|---|---|---|---|---|
| Property listing (`push-success-result`) — any listing from a search URL, **full details included** | $0.0010 | $0.0007 | $0.00065 | $0.0005 |
| Individual property URL add-on (`push-detailed-result`, on top of the listing) | +$0.0025 | +$0.0010 | +$0.0009 | +$0.0008 |

Listings from search URLs cost the base price only — with every field included. The add-on applies only to individual property URLs, which each need their own lookup.

**Cost estimate examples:**
- **1,000 listings** from search URLs, GOLD plan: ~$0.50
- **1,000 listings** from search URLs, FREE plan: ~$1.00
- **100 individual property URLs**, GOLD plan: ~$0.13

> 💡 Tip: set `maxResults` to `10` for your first test run before scaling up.

---

## 📊 Sample Output

```json
{
    "listingId": "151702616",
    "url": "https://www.realestate.com.au/property-townhouse-sa-park+holme-151702616",
    "channel": "buy",
    "propertyType": "townhouse",
    "status": "New",
    "title": "Spacious Family Living with Flexible Dual-Level Design",
    "description": "Built in 2020, this dual-level townhouse offers ...\n\nFeatures include ...",
    "price": "$780,000 - $850,000",
    "priceFrom": 780000,
    "priceTo": 850000,
    "pricePeriod": null,
    "dateSold": null,
    "dateAvailable": null,
    "bond": null,
    "address": {
        "streetAddress": "108 Margaret Street",
        "suburb": "Park Holme",
        "state": "SA",
        "postcode": "5043",
        "latitude": -34.99495767,
        "longitude": 138.55091839
    },
    "bedrooms": 4,
    "bathrooms": 2,
    "parkingSpaces": 1,
    "landSize": "241 m²",
    "landSizeValue": 241,
    "landSizeUnit": "m2",
    "constructionStatus": "established",
    "agencyName": "Example Realty",
    "agencyListingId": "1P14362",
    "agency": {
        "id": "ASKDFU",
        "name": "Example Realty",
        "phone": "08 8100 0000",
        "email": "info@example.com.au",
        "website": "http://example.com.au",
        "address": "Level 1, 67 Anzac Highway, Ashford, SA 5035",
        "profileUrl": "https://www.realestate.com.au/agency/example-realty-ASKDFU",
        "logo": "https://i3.au.reastatic.net/170x32/.../logo.jpg"
    },
    "agents": [
        {
            "id": "3178288",
            "name": "Alex Example",
            "jobTitle": "Property Advisor",
            "phone": "0400000000",
            "email": "alex@example.com.au",
            "emails": ["alex@example.com.au"],
            "profileUrl": "https://www.realestate.com.au/agent/3178288",
            "photo": "https://i3.au.reastatic.net/original/.../main"
        }
    ],
    "mainImage": "https://i3.au.reastatic.net/original/.../image.jpg",
    "images": ["https://i3.au.reastatic.net/original/.../image.jpg"],
    "propertyFeatures": [{ "section": "outdoor", "label": "Outdoor Features", "features": ["Garage spaces: 1"] }],
    "statementOfInformation": null,
    "inspectionsAndAuctions": [{ "dateDisplay": "Inspection Sat 3 Oct", "startTime": "2026-10-03T11:45:00", "endTime": "2026-10-03T12:10:00", "auction": false }],
    "inspectionSlot": null,
    "hasDetailData": true,
    "source_url": "https://www.realestate.com.au/buy/property-townhouse-...",
    "scrapedAt": "2026-09-29T09:00:00.000Z"
}
```

---

## ❓ Frequently Asked Questions

**Do I need a realestate.com.au account to use this actor?**
No. Both search and individual property URLs work without logging in.

**Do I need to turn on a "details" option to get features, inspections, and agency contacts?**
No. Every listing already includes the complete record. (The old "Fetch Full Property Details" option is no longer needed and has no effect.)

**How many listings can I get from one search?**
Up to 2,000 — that's the most realestate.com.au serves for any single search. For bigger areas, add several narrower search URLs; duplicates between them are removed automatically.

**Can I scrape multiple search URLs or properties in one run?**
Yes — add as many URLs as you like to `startUrls`, and freely mix search URLs and individual property URLs in the same run.

**Does it support map-drawn area searches and inspection-day searches?**
Yes — paste the URL from a hand-drawn map search or an "inspection times" search and it's handled like any other search URL. Inspection-day results also carry the matching inspection slot.

**Does it work for rent and sold listings, not just buy?**
Yes — buy, rent, and sold are all supported, including sold-specific sorting (by sale date or sale price), sold dates, and rental bond/availability.

**What happens if the run is interrupted mid-way?**
The actor checkpoints progress as it goes and resumes from the last completed page on the next attempt, skipping listings it already delivered.

---

## 🔄 Resumability

The actor checkpoints its progress as it works through each search URL. If the run is interrupted — a crash, a platform migration, or a manual abort — the next attempt resumes from the last completed page instead of starting over.

| Trigger | What gets saved |
|---|---|
| After every completed search page | Per-URL progress (page position, listings delivered so far) |
| Platform migration event | Full progress snapshot, including which listings were already delivered |
| Manual abort | Full progress snapshot, including which listings were already delivered |
| Successful completion | Progress is cleared — nothing lingers for the next run |

---

## 🌐 Proxy Support

| User tier | Proxy used |
|---|---|
| 💎 Paying | Dedicated proxy — faster and more reliable |
| 🆓 Free | Apify Residential Proxy — built-in, automatic |

Proxy selection is automatic based on your Apify account tier — there's no proxy configuration to set up.

---

## 🚫 Error Handling

| Situation | What you see | What to do |
|---|---|---|
| A pasted URL isn't a recognized realestate.com.au URL | An `_error` field on that item explaining why | Copy the URL directly from your browser rather than typing it |
| An individual property URL points to an expired/removed listing | An `_error` item noting the property wasn't found | Confirm the listing is still live on the site |
| A search matches more than 2,000 listings | A warning in the run log; the first 2,000 are delivered | Split the search into narrower URLs |
| No start URLs provided | A single guidance item in the dataset | Add at least one URL to `startUrls` |

---

## 🌟 Related Actors

- **[Idealista API Scraper](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)** — Property listings from Idealista (Spain, Portugal, Italy)

---

## Support

- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: flowextractapi@outlook.com
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok**: [@flowextractapi](https://www.tiktok.com/@flowextractapi)

---

## Legal & compliance

- Extracts **publicly available listing data only** — the same information any visitor sees without logging in.
- Respects the source site's rate limits and terms; built for research and analysis, not for overwhelming the site.
- No storage of personal information by the actor beyond your own run's dataset.
- Suitable for commercial use. You are responsible for using extracted contact details lawfully (e.g. the Australian Privacy Act and Spam Act) — no spam or unsolicited bulk outreach.
- No affiliation with or endorsement by realestate.com.au or REA Group is implied.

---

*realestate.com.au Scraper — by FlowExtract API. Turn any website into structured data.*
