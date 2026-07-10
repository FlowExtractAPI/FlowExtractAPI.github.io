# 🏠 realestate.com.au Scraper  Property Listings, Fast or Fully Detailed

**[realestate.com.au Scraper](https://apify.com/dz_omar/realestate-com-au-scraper?fpr=smcx63)** turns any realestate.com.au search URL  buy, rent, or sold  into structured property data: price, address, beds/baths/parking, land size, agent contacts, and photos. Paste a search URL and get a whole result set, or paste a single property link and get one fully detailed record.

Perfect for **property investors** tracking new listings, **agencies** monitoring competitor stock, and **market researchers** building price/location datasets  without manually copying data off the site.

---

## Why scrape realestate.com.au?

realestate.com.au is Australia's largest property portal, covering homes for sale, for rent, and recently sold across every state. It's the primary public source for current asking prices, rental rates, and sold history at national scale.

Common use cases:

- **Investment research**  pull every listing matching a price/size/location filter to compare deals across suburbs.
- **Competitor monitoring**  agencies tracking what's newly listed or price-changed in their patch.
- **Market analysis**  build a dataset of sold prices and current asking prices for a region over time.
- **Lead generation**  collect agent and agency contact details attached to active listings.
- **Rental market tracking**  monitor rental listings and pricing in a specific area or drawn map region.

---

## What data can realestate.com.au Scraper extract?

### 🏠 Identity
- Listing ID, property type, title, description, listing URL

### 💰 Price & Location
- Display price, street address, suburb, state, postcode, latitude/longitude

### 🛏️ Features
- Bedrooms, bathrooms, parking spaces, land size, construction status (established / new)

### 👤 Agent & Agency
- Agency name, and every listed agent's name, phone, email, and job title

### 🖼️ Media
- Main image, full photo gallery

### 🔎 Full-detail fields (with "Fetch Full Property Details" on, or from a single-property URL)
- Complete indoor/outdoor feature list, statement of information, inspection and auction times, full agency listing ID

---

## ⚙️ How to use realestate.com.au Scraper

### Start URLs (Array)

Paste realestate.com.au URLs straight from your browser  no editing needed. Two kinds are supported:

| Input value | What it extracts |
|---|---|
| A search/listing URL (`/buy/…`, `/rent/…`, `/sold/…`, including map-drawn searches) | Up to **Max Results** listings matching that search |
| An individual property URL | That one property, always with full details |

```json
{
    "startUrls": [
        { "url": "https://www.realestate.com.au/buy/property-townhouse-size-200-5000-between-50000-15000000-in-adelaide+-+greater+region,+sa;+adelaide+hills,+sa;+adelaide,+sa+5000/list-1" },
        { "url": "https://www.realestate.com.au/property-acreage+semi-rural-nsw-blackmans+point-149898944" }
    ]
}
```

Filters already applied on the site  location, property type, price, land size, bedrooms, sort order, map-drawn areas, and inspection/auction dates  carry through automatically.

### `maxResults` (Integer)
- **Default**: `25`
- Maximum listings to scrape per search URL. Set to `0` for unlimited (all pages, bounded only by your configured budget). Doesn't affect individual property URLs  those always return exactly one result.

### `fetchPropertyDetails` (Boolean)
- **Default**: `false`
- **Off**: fast, cheap  just the data returned by the search itself.
- **On**: for every listing, also fetches the full detail-page data (complete feature list, inspection/auction times, statement of information, full agency contacts)  one extra request per listing, billed at a higher rate (see Pricing). Individual property URLs always return full detail regardless of this setting.

```json
{
    "startUrls": [{ "url": "https://www.realestate.com.au/buy/property-house-in-brisbane,+qld+4000/list-1" }],
    "maxResults": 50,
    "fetchPropertyDetails": true
}
```

---

## 💰 Pricing

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Property listing (`push-success-result`) | $0.0010 | $0.0007 | $0.00065 | $0.0005 |
| Full detail add-on (`push-detailed-result`, on top of the listing) | +$0.0025 | +$0.0010 | +$0.0009 | +$0.0008 |

A detailed listing costs the base price **plus** the add-on. A plain listing costs the base price alone.

**Cost estimate examples:**
- **1,000 listings**, details off, GOLD plan: ~$0.50
- **1,000 listings**, details on, GOLD plan: ~$1.30

> 💡 Tip: set `maxResults` to `10` and leave `fetchPropertyDetails` off for your first test run before scaling up.

---

## 📊 Sample Output

```json
{
    "listingId": "151702616",
    "url": "https://www.realestate.com.au/property-townhouse-sa-park+holme-151702616",
    "channel": "buy",
    "propertyType": "townhouse",
    "title": "Spacious Family Living with Flexible Dual-Level Design",
    "price": "Best Offers By 27/7 (USP)",
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
    "constructionStatus": "established",
    "agencyName": "Ray White City Living",
    "agents": [
        { "name": "Mason Lucks", "phone": "0449882882", "email": "mason@example.com", "jobTitle": "Property Advisor" }
    ],
    "mainImage": "https://i3.au.reastatic.net/.../main.jpg",
    "images": ["https://i3.au.reastatic.net/.../image1.jpg"],
    "hasDetailData": false,
    "source_url": "https://www.realestate.com.au/buy/property-townhouse-...",
    "scrapedAt": "2026-07-10T09:00:00.000Z"
}
```

With `fetchPropertyDetails: true`, each item additionally carries `propertyFeatures`, `statementOfInformation`, `inspectionsAndAuctions`, and full `agency` contact details.

---

## ❓ Frequently Asked Questions

**Do I need a realestate.com.au account to use this actor?**
No. Both search and individual property URLs work without logging in.

**How many listings can I extract for free?**
With Apify's free monthly credit, you can extract several thousand plain listings, or a smaller number with full details enabled (see Pricing above for exact per-listing cost).

**Can I scrape multiple search URLs or properties in one run?**
Yes  add as many URLs as you like to `startUrls`; each is processed independently, and you can freely mix search URLs and individual property URLs in the same run.

**Does it support map-drawn area searches?**
Yes  paste a URL from a hand-drawn or pinned map search on the site and it's handled the same as any other search URL.

**What happens if the run crashes or gets interrupted mid-way?**
The actor checkpoints progress as it goes and resumes exactly where it left off on the next attempt  already-scraped listings aren't re-charged.

**Does it work for rent and sold listings, not just buy?**
Yes  buy, rent, and sold are all supported, including sold-specific sorting (e.g. by sale date or sale price).

---

## ⚖️ Legal & Ethical Use

This actor extracts **publicly visible listing data** from realestate.com.au  the same information any visitor can see in their browser without logging in.

**Please use this tool responsibly:**
- Only extract data you are authorized to access and use.
- Comply with realestate.com.au's Terms of Service and applicable data protection regulations (GDPR, Australian Privacy Act, etc.).
- Do not use extracted contact details for spam, harassment, or unsolicited bulk outreach.
- Respect reasonable request volumes  this actor is built for research and analysis, not for overwhelming the source site.

---

## 🔄 Resumability

The actor checkpoints its progress as it works through each search URL. If the run is interrupted  a crash, a platform migration, or a manual abort  the next attempt resumes from the last completed page instead of starting over, so you don't lose progress or get re-charged for already-delivered listings.

| Trigger | What gets saved |
|---|---|
| After every completed search page | Per-URL progress (page position, listings pushed so far) |
| Platform migration event | Full progress snapshot |
| Manual abort | Full progress snapshot |
| Successful completion | Progress is cleared  nothing lingers for the next run |

---

## 🌐 Proxy Support

| User tier | Proxy used |
|---|---|
| 💎 Paying | Dedicated proxy  faster and more reliable |
| 🆓 Free | Apify Residential Proxy  built-in, automatic |

Proxy selection is automatic based on your Apify account tier  there's no proxy configuration to set up.

---

## 🚫 Error Handling

| Situation | What you see | What to do |
|---|---|---|
| A pasted URL isn't a recognized realestate.com.au URL | An `_error` field on that item explaining why | Copy the URL directly from your browser rather than typing it |
| An individual property URL points to an expired/removed listing | An `_error` item noting the property wasn't found | Confirm the listing is still live on the site |
| No start URLs provided | A single guidance item in the dataset | Add at least one URL to `startUrls` |

---

## 🤝 Support & Resources

- 🙋 **Apify Profile**: [dz_omar](https://apify.com/dz_omar?fpr=smcx63)

---

## 🌟 Related Actors

- **[Idealista API Scraper](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**  Property listings from Idealista (Spain, Portugal, Italy)
