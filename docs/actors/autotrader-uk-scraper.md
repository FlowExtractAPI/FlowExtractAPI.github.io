**[AutoTrader UK Scraper](https://apify.com/dz_omar/autotrader-uk-scraper?fpr=smcx63)** extracts **AutoTrader UK listings** from any search link you copy from autotrader.co.uk: **cars, vans, motorbikes, motorhomes, caravans, trucks, farm machinery, plant and electric bikes**. Paste the link, choose how many listings you want, and get **AutoTrader's own listing data, complete and unchanged** — price, mileage, specs, registration, every seller phone number and address, vehicle checks and high-resolution photos.

Perfect for **car dealers**, **vehicle traders and auction buyers**, **market analysts** and **lead-generation teams** who need up-to-date UK vehicle stock without copying listings by hand.

## What does AutoTrader UK Scraper do?

- **Any AutoTrader search link** — set your filters on the website (make, model, price, year, mileage, fuel, gearbox, berths, distance…) and paste the address. The same filters apply to the data.
- **Every vehicle type** — cars, vans, bikes, motorhomes, caravans, trucks, farm, plant and electric-bike searches, plus single listing links.
- **Large searches collected in full** — when AutoTrader shows thousands of matches, the scraper still reaches them, not just the first pages.
- **Complete data, as AutoTrader returns it** — every field of the search result and of the full listing, with AutoTrader's own field names and nesting. Nothing dropped, renamed or flattened, so new AutoTrader fields appear in your data automatically.
- **Full listing details** — registration, every seller phone number and website, description, equipment, history check, price rating against the market, running costs and every photo.
- **Working high-resolution photos** — 1280×960 image links that open directly.
- **Duplicates removed** — a listing found by several of your links is delivered and charged once.

### What data can you extract from AutoTrader UK?

Each listing has three parts:

| Part | What it holds |
|---|---|
| `search` | The listing exactly as AutoTrader's search results return it: title, price, mileage, year, make, model, specs, seller name and location, photos, badges. |
| `details` | The full listing exactly as AutoTrader returns it: registration, owners, service history, seller contact (**every phone number**, website), description, equipment, vehicle check, price rating against the market, CO2, tax, insurance group, delivery and reservation options, every photo. |
| `_meta` | What the scraper adds: listing ID and URL, vehicle type, detail status, **all phone numbers in one list**, working 1280×960 photo links, a short summary (title, price, year, mileage, seller, town) for table views, the source URL and the time. |

Field names inside `search` and `details` are AutoTrader's own, so any field AutoTrader adds or renames shows up as AutoTrader sends it.

### Why use AutoTrader UK Scraper on Apify?

Running it on Apify gives you **API access**, **scheduling**, **monitoring**, **integrations** (Make, Zapier, n8n, Google Sheets, webhooks) and **proxy rotation** without managing any infrastructure. A 100-listing run with full details costs about **$0.08**.

## How to scrape AutoTrader UK

1. Open [AutoTrader UK Scraper](https://apify.com/dz_omar/autotrader-uk-scraper?fpr=smcx63) in Apify Console.
2. On autotrader.co.uk, run your search with the filters you want and copy the page address.
3. Paste one or more links into **AutoTrader UK search or listing URLs**.
4. Set **Maximum listings per URL** for search links (start small: `20`).
5. Click **Start**, then download the results as JSON, CSV or Excel, or fetch them over the API.

## How much does it cost to scrape AutoTrader UK?

Pay only for what you get. Prices per event by Apify plan:

| Event | FREE | BRONZE | SILVER | GOLD+ |
|---|---|---|---|---|
| Listing (search-results data) | $0.0005 | $0.00049 | $0.00048 | $0.00047 |
| Listing details add-on | $0.00025 | $0.00024 | $0.00024 | $0.00023 |
| Run start (per GB of memory) | $0.003 | $0.0025 | $0.002 | $0.002 |

- **1,000 listings with full details** cost about **$0.75** on the free plan and **$0.70** on GOLD (+ the run-start fee).
- **1,000 listings without details** cost about **$0.50** (GOLD: $0.47).
- **Include full details** applies to **search links**. A **single-listing link always comes with full details** and is charged the listing event plus the details add-on.
- The details add-on is never charged when details are turned off for a search, not offered for that vehicle type (electric bikes), or could not be read.
- Example: 2 search links + 4 listing links, Maximum listings per URL = 10, details off → up to 20 listing events for the searches, plus 4 listing events and 4 details add-ons for the listing links.

## Input and output examples

### Input

```json
{
    "startUrls": [
        "https://www.autotrader.co.uk/car-search?postcode=SW1A1AA&make=Volkswagen&model=Golf",
        "https://www.autotrader.co.uk/motorhome-search?berth=2&make=Benimar&postcode=SW1A1AA&transmission=Automatic",
        "https://www.autotrader.co.uk/car-details/202610217203885"
    ],
    "maxResults": 100,
    "includeDetails": true
}
```

| Input value | What it extracts |
|---|---|
| Search link (`…/car-search?…`, `…/van-search?…`, `…/electric-bike-search?…`, …) | Up to **Maximum listings per URL** listings matching the link's filters; empty filters such as `make=&model=` mean no filter |
| Listing link (`…/car-details/<number>`, `…/electric-bike-details/<number>`, …) | That one listing, always with full details (electric bikes: search-result data) |
| Link without a postcode | A UK-wide search |

The run collects up to **Maximum listings per URL × number of search links**, plus one listing per listing link: 10 search links with 100 gives up to 1,000 listings.

### Output

### Listing record

A real record from a test run, shortened (`…`) for the page; phone numbers partly masked here — the dataset has every field in full.

```json
[
    {
        "search": null,
        "details": {
            "advertId": "202606283692289",
            "advertiser": {
                "sellerName": "Bunty Car Sales",
                "contact": {
                    "phoneNumberOne": "(07537) ••••••",
                    "protectedNumber": false
                },
                "location": {
                    "town": "Oldham",
                    "postcode": "OL2 6UR",
                    "latLong": "53.5863337,-2.1290391"
                },
                "…": "…"
            },
            "vehicle": {
                "manufacturedYear": 1997,
                "mileage": {
                    "mileage": 64000
                },
                "colour": "White",
                "…": "…"
            },
            "sale": {
                "title": "Ford Escort (1997)",
                "pricing": {
                    "price": 950
                },
                "…": "…"
            },
            "specification": {
                "make": "Ford",
                "model": "Escort",
                "bodyType": "Car Derived Van",
                "fuel": "Diesel",
                "…": "…"
            },
            "…": "every other field AutoTrader returns"
        },
        "_meta": {
            "advert_id": "202606283692289",
            "url": "https://www.autotrader.co.uk/van-details/202606283692289",
            "vehicle_type": "van",
            "detail_status": "ok",
            "phones": [
                "(07537) ••••••"
            ],
            "image_urls": [
                "https://m.atcdn.co.uk/a/media/w1280h960/d95638d102cf47df9bd7c95dbc555920.jpg",
                "https://m.atcdn.co.uk/a/media/w1280h960/69efd93fa41e456ebe06bd491030c193.jpg",
                "…"
            ],
            "title": "Ford Escort (1997)",
            "make": "Ford",
            "model": "Escort",
            "year": 1997,
            "mileage": 64000,
            "price": 950,
            "seller": "Bunty Car Sales",
            "town": "Oldham",
            "main_image": "https://m.atcdn.co.uk/a/media/w1280h960/d95638d102cf47df9bd7c95dbc555920.jpg",
            "source_url": "https://www.autotrader.co.uk/van-details/202606283692289",
            "scraped_at": "2026-10-27T09:28:01.018Z",
            "source": "autotrader_uk_scraper"
        }
    }
]
```

## Other Actors you might need

| Actor | What it adds |
|---|---|
| **[Salvagebid Scraper](https://apify.com/dz_omar/salvagebid-scraper?fpr=smcx63)** | Salvage and damaged-vehicle auction listings — useful alongside AutoTrader prices for trade buyers and repairers. |

## Frequently asked questions

### Is it legal to scrape AutoTrader UK?

The scraper collects publicly available listing data. You are responsible for using it in line with AutoTrader's terms and with UK GDPR, especially for seller contact details. This is not legal advice.

### Do I need an AutoTrader account?

No. Paste public search or listing links — no login, cookies or API key.

### Which AutoTrader links are accepted?

Search links and single listing links for cars, vans, bikes, motorhomes, caravans, trucks, farm, plant and electric bikes. Links copied without `https://` work too, and extra website parameters (`searchId`, `page`, `fromsra`…) are ignored. Other websites and other AutoTrader pages are rejected before the run starts, so nothing is charged.

### Why are some fields empty?

The data is AutoTrader's own, so a field is empty when AutoTrader has nothing for it. Sellers fill in different details, and some fields only come with full details (`details`: registration, phone numbers, description, equipment, vehicle check). AutoTrader offers no full details for electric bikes, so their rows carry the search-result data (`_meta.detail_status: "not_available"`) and are never charged the details add-on.

### Where are the seller's phone numbers?

In `details.advertiser.contact` (`phoneNumberOne`, and `phoneNumberTwo` when the seller has a second number), and all of them together in `_meta.phones`.

### What if AutoTrader changes its data?

`search` and `details` are passed through as AutoTrader returns them, so new or renamed fields appear in your data as AutoTrader names them — nothing silently turns empty.

### Why did my run return fewer listings than I asked for?

The search had fewer matches, a listing was already delivered by another of your links, or your max cost per run was reached. The run's status line and log say which. If more than 1,000 listings share one exact price, the extra ones can't be reached — narrow the search to get them.

### In what order do the listings come back?

In the link's sort order, as long as you ask for up to 1,000 listings per link. Above 1,000, a large search is collected in price bands from cheapest to most expensive, so that every listing can be reached.

### What happens if a link has a filter the scraper can't apply?

The run log names it and the rest of the search runs as normal, so you never get a silently wider search.

### Can I use AutoTrader UK Scraper in Make, Zapier, n8n or my own code?

Yes — through Apify's integrations, the Apify API and the client libraries for JavaScript and Python.

### What happens if a run is interrupted?

It saves progress and resumes where it left off, without delivering or charging the same listing twice.

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
- No affiliation with or endorsement by AutoTrader is implied.

---

*AutoTrader UK Scraper — by FlowExtract API. Turn any website into structured data.*
