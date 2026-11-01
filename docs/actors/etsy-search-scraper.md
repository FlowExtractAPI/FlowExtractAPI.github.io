**[Etsy Search Scraper](https://apify.com/dz_omar/etsy-search-scraper?fpr=smcx63)** turns any Etsy keyword search into structured **Etsy product data**: type a keyword, optionally narrow it by category, price, shipping or sort order, and get every matching listing with its price, sale price, shop, ratings, badges, shipping times and images. No listing URLs needed — just search terms.

Perfect for **e-commerce sellers**, **market researchers** and **dropshipping and product-research teams** who need to see what is selling on Etsy without copying results by hand.

## What does Etsy Search Scraper do?

You give it one or more search terms. For each term it returns the listings Etsy shows for that search, as clean records you can download as JSON, CSV or Excel.

- **Keyword search** — search several terms in one run; each term is collected separately and every record says which term found it.
- **The same filters as the Etsy app** — sort (relevance, most recent, lowest price, highest price), top-level category, price range, free shipping, on sale, vintage only, ready-to-ship time and ship-to country with local currency.
- **Beyond Etsy's search limit** — Etsy stops a single search after roughly 1,000 results however many match. Turn on **Split large searches** and the Actor divides a big search by category and price range, then merges the results without duplicates, so you can collect thousands.
- **Optional full listing details** — add each listing's complete product record (description, variations, shipping, policies, shop) to its result.
- **No duplicates, no double charges** — a listing appears once per search term, even when Etsy shows it more than once or in several price ranges.

### What data can you extract from Etsy search results?

| Category | Fields |
|---|---|
| Listing | `listing_id`, `title`, `url`, `image`, `listing_images`, `video`, `quantity`, `state` |
| Price | `price`, `discounted_price_unformatted`, `discount_description_unescaped`, `currency_code`, `price_formatted_short` |
| Shop | `shop_name`, `shop_url`, `shop_average_rating`, `shop_total_rating_count`, `seller_sales`, `seller_since` |
| Badges & signals | `is_bestseller`, `is_top_rated`, `has_star_seller_signal`, `is_handmade`, `is_vintage`, `in_cart_count`, `last_sale_date` |
| Shipping | `free_shipping_countries`, `ships_to_regions`, `min_processing_days`, `max_processing_days`, `are_returns_accepted` |
| Options | `has_variations`, `is_personalizable`, `is_customizable`, `is_made_to_order`, `color_swatches`, `material_swatches` |
| Search context | `search_term`, `result_position`, `is_sponsored`, `search_page` |

Every field Etsy returns for a result is kept — the table lists the most useful ones.

### Why use Etsy Search Scraper on Apify?

Running it on Apify gives you **API access**, **scheduling**, **monitoring**, **integrations** (Make, Zapier, n8n, webhooks) and **proxy rotation** without managing any infrastructure. Results stream into the dataset while the run is still working, so you can start using them straight away.

## How to scrape Etsy search results

1. Open Etsy Search Scraper in Apify Console.
2. Enter one or more keywords in **Search terms**.
3. Set **Max results per search term** — start small, for example `20`.
4. Optionally choose a sort order, category, price range or shipping filter.
5. Click **Start** and wait for the run to finish.
6. Download the results as JSON, CSV or Excel, or fetch them over the API.

## How much does it cost to scrape Etsy?

Etsy Search Scraper is **pay per result**: you pay for each unique listing delivered to your dataset, and nothing for duplicates, empty runs or listings it could not deliver. Turning on **Add full listing details** adds a second, separately priced charge for each listing that was enriched. The price per result falls as your Apify plan tier rises.

| Event | FREE | BRONZE | SILVER | GOLD and above |
|---|---|---|---|---|
| Search result (per listing) | $0.0020 | $0.0015 | $0.0012 | $0.0009 |
| Full listing details (per enriched listing) | $0.0050 | $0.0040 | $0.0035 | $0.0030 |

- **1,000 search results** cost **$2.00** on the FREE tier and **$0.90** on GOLD and above.
- **1,000 results with full listing details** cost **$7.00** on FREE and **$3.90** on GOLD and above.
- Test with `maxResults: 10` first to see exactly what a run returns.
- Set a **maximum cost per run** in Apify's run options to cap spend; the Actor stops cleanly at the limit and keeps everything it delivered.

## Input and output examples

### Input

```json
{
    "searchTerms": ["leather wallet"],
    "maxResults": 100,
    "sort": "Lowest price",
    "category": "132",
    "minPrice": 20,
    "maxPrice": 60,
    "freeShipping": true,
    "shipTo": "US",
    "splitLargeSearches": true,
    "enrichWithDetails": false
}
```

| Input | What it does |
|---|---|
| `searchTerms` | The keywords to search, one search per term |
| `maxResults` | Listings to collect per term; `0` collects everything available |
| `sort` | Relevance, Most recent, Lowest price or Highest price |
| `category` | A top-level Etsy category, or all categories |
| `minPrice` / `maxPrice` | Price range in whole units of the ship-to currency |
| `freeShipping`, `onSale`, `itemType`, `readyToShip` | The Etsy shipping, discount and item-type filters |
| `shipTo` | Destination country; also sets the currency prices are shown in |
| `includeSponsored` | Keep or drop promoted listings (they are always flagged) |
| `splitLargeSearches` | Go past Etsy's per-search limit by splitting big searches |
| `enrichWithDetails` | Add each listing's full product record to its result |

### Output

One record per unique listing — here two real results for the search `leather wallet`:

```json
[
    {
        "_type": "search_result",
        "search_term": "leather wallet",
        "result_position": 2,
        "scraped_listing_id": 1241528786,
        "title": "Personalized Leather RFID Wallet, Engraved Genuine Leather C…",
        "price": "70.00",
        "discounted_price_unformatted": "28.00",
        "discount_description_unescaped": "(60% off)",
        "currency_code": "USD",
        "shop_name": "PremiumEngrave",
        "shop_average_rating": "4.94",
        "shop_total_rating_count": "12451",
        "quantity": 1618,
        "is_bestseller": true,
        "is_top_rated": true,
        "is_sponsored": false,
        "free_shipping_countries": ["US"],
        "min_processing_days": 1,
        "max_processing_days": 3,
        "url": "https://www.etsy.com/listing/1241528786/personalized-leather-rfid-wallet"
    },
    {
        "_type": "search_result",
        "search_term": "leather wallet",
        "result_position": 3,
        "scraped_listing_id": 4303632778,
        "title": "Leather Cash Wallet, Slim Card & Cash Holder, Handmade Minim…",
        "price": "74.50",
        "discounted_price_unformatted": "59.60",
        "discount_description_unescaped": "(20% off)",
        "currency_code": "USD",
        "shop_name": "LeatherLabStudioCo",
        "shop_average_rating": "4.91",
        "shop_total_rating_count": "962",
        "quantity": 551,
        "is_bestseller": true,
        "is_top_rated": true,
        "is_sponsored": false,
        "free_shipping_countries": ["US"],
        "min_processing_days": 1,
        "max_processing_days": 2,
        "url": "https://www.etsy.com/listing/4303632778/leather-cash-wallet-slim-card-cash"
    }
]
```

Records are abridged here; the dataset carries every field. With **Add full listing details** on, each record also carries a `listing_details` object and a `details_status`.

## Other Actors you might need

| Actor | What it adds |
|---|---|
| **[Etsy Product & Reviews Scraper](https://apify.com/dz_omar/etsy-product-reviews-scraper?fpr=smcx63)** | Full details and buyer reviews for any single Etsy listing — ideal for the listings you find here |
| **[Etsy Shop Scraper](https://apify.com/dz_omar/etsy-shop-scraper?fpr=smcx63)** | A whole Etsy shop — its profile, policies and complete listing catalog |

## Frequently asked questions

### Is it legal to scrape Etsy search results?

Etsy Search Scraper only reads publicly available search results — the same listings anyone sees when searching Etsy. You are responsible for using the data in line with Etsy's terms and applicable laws such as GDPR and CCPA. This is not legal advice.

### Do I need an Etsy account or login?

No. Public search results work with search terms alone. There is nothing to log in to and no cookies to provide.

### Why did my run return fewer results than I asked for?

| Situation | What you see | What to do |
|---|---|---|
| Etsy limits a single search to roughly 1,000 results | Fewer results than `maxResults` | Keep **Split large searches** on so big searches are divided and merged |
| Very narrow filters | Few matches in total | Loosen the price range or category |
| Sponsored listings turned off | Slightly fewer records | Turn **Include sponsored listings** back on |
| Run stopped at your maximum cost per run | Run ends early, cleanly | Raise the limit and run again |

### How does the price filter work?

Etsy filters on whole currency units, so `20.5` counts as `20`, and a maximum below `1` is ignored. Prices are matched against what a shopper pays after any sale discount. The price filter is exact in US dollars; in other currencies Etsy converts your range with its own exchange rates, so results right at the edge of the range can be slightly off.

### Can I search in other countries and currencies?

Yes. Choose a **Ships to** country (United States, United Kingdom, Canada, Australia, Germany, France, Netherlands, Spain or Italy) to see results, shipping eligibility and prices for that market.

### Can I use Etsy Search Scraper in Make, Zapier, n8n or my own code?

Yes. Every Apify Actor has an API and client libraries, plus ready integrations for Make, Zapier, n8n and webhooks. Start a run, wait for it to finish and read the dataset.

### What happens if a run is interrupted?

The Actor saves its progress as it goes. If a run is stopped or moved to another server, it picks up where it left off — it does not re-deliver listings or charge for them twice.

### What does "Add full listing details" do?

It fetches each listing's complete product record and attaches it to the search result as `listing_details`. Use it when you need descriptions, variations or policies, not just search-level data. It makes the run slower and is billed per enriched listing on top of the search result.

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
- No affiliation with or endorsement by Etsy is implied.

---

*Etsy Search Scraper — by FlowExtract API. Turn any website into structured data.*
