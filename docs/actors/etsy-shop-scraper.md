**[Etsy Shop Scraper](https://apify.com/dz_omar/etsy-shop-scraper?fpr=smcx63)** extracts complete **Etsy shop data** from a shop URL, shop name or shop ID — the full shop profile, policies, about story, FAQ, ratings and trust signals — plus the shop's **entire listing catalog** with prices, stock, images and shipping times. Add one or many shops, run, and get clean, structured JSON.

Perfect for **e-commerce sellers**, **market researchers** and **developers** who need full Etsy shop and catalog data without maintaining a scraper.

## What does Etsy Shop Scraper do?

Every shop you add returns one **shop profile** record, and — when the catalog is on — one **listing** record for each of its listings.

- **Full shop profile** — sales, ratings, location, owner, open date, badges, policies, about story, FAQ and trust signals.
- **Complete catalog** — every listing in the shop, in the shop owner's own order, with a `catalog_position` on each record.
- **Any shop reference** — a shop URL (any locale prefix), a shop name, or a numeric shop ID, in any combination in one run.
- **Cap per shop** — collect the first 50 listings of each shop by default, or the whole catalog with `0`.
- **Nothing stripped** — every field Etsy returns for a shop or listing is kept, including nested objects.

### What data can you extract from Etsy shops?

| Category | Fields |
|---|---|
| Identity | `shop_id`, `shop_name`, `url`, `seller_name`, `create_date`, `open_date`, `status`, `is_open`, `is_vacation` |
| Reputation | `sold_count`, `average_rating`, `total_rating_count`, `favorites_count`, `star_seller`, `shop_highlight`, `signals` (orders shipped on time, message response rate) |
| Location & settings | `country_code`, `currency_code`, `shop_languages`, `ships_to_country_ids` |
| Owner | `owner` (follower count, avatar, display name, member-since) |
| Policies & content | `policies`, `structured_policies`, `return_policies`, `shop_about` (story, images, videos, members), `faq` |
| Merchandising | `sections` (with listing IDs), `featured_listings`, `best_sellers`, `display_listings` |
| Shop reviews | `reviews` (total count and the recent reviews on the shop home), `review_filters` |
| Listing (per record) | `listing_id`, `title`, `price`, `currency_code`, `quantity`, `is_sold_out`, `discounted_price`, `listing_images`, `video`, `free_shipping_countries`, `min_processing_days`, `max_processing_days`, `is_bestseller`, `is_personalizable`, `variations_data`, `seller_sales` |

### Why use Etsy Shop Scraper on Apify?

Running it on Apify gives you **API access**, **scheduling**, **monitoring**, **integrations** (Make, Zapier, n8n, webhooks) and **proxy rotation** without managing infrastructure. A single shop with its first 50 listings costs a few cents.

## How to scrape an Etsy shop

1. Open Etsy Shop Scraper in Apify Console.
2. Paste one or more shop URLs, names or IDs into **Etsy shops**.
3. Set **Max listings per shop** (start small: `50`; use `0` for the whole catalog).
4. Click **Start** and wait for the run to finish.
5. Download the results as JSON, CSV or Excel, or fetch them over the API.

## How much does it cost to scrape Etsy shops?

You pay per result delivered — one shop profile per shop and one listing per catalog listing. There is no charge for shops that don't exist.

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Shop profile (per shop) | $0.02 | $0.016 | $0.014 | $0.012 |
| Listing (per 1,000) | $3.00 | $2.40 | $2.00 | $1.60 |

- **1 shop + 100 listings** costs about **$0.32** at the highest tier price and **$0.17** on GOLD.
- **1,000 listings** cost about **$3.00** at the highest tier price and **$1.60** on GOLD (plus the per-shop profile).
- Test with `maxListings: 10` first, or turn **Include listing catalog** off to pay for the shop profile only.

## Input and output examples

### Input

```json
{
    "shops": [
        "https://www.etsy.com/shop/PremiumEngrave",
        "MarHappiness",
        "35016605"
    ],
    "includeListings": true,
    "maxListings": 50
}
```

| Input value | What it extracts |
|---|---|
| `https://www.etsy.com/shop/PremiumEngrave` | The shop profile and its listings (locale prefixes and query strings are fine) |
| `MarHappiness` | The same, from the shop name |
| `35016605` | The same, from the numeric shop ID |

### Output

Use the **Shop profiles** and **Listings** dataset views, or filter on `_type`, to separate the two record types.

### Shop profile record (`_type: "shop_profile"`, one per shop — abridged)

```json
{
    "_type": "shop_profile",
    "scraped_shop_id": 35016605,
    "shop": {
        "shop_id": 35016605,
        "shop_name": "PremiumEngrave",
        "url": "https://www.etsy.com/shop/PremiumEngrave",
        "seller_name": "Erik",
        "sold_count": 41506,
        "active_listing_count": 149,
        "favorites_count": 3377,
        "average_rating": 4.94,
        "total_rating_count": 12451,
        "country_code": "US",
        "currency_code": "USD",
        "is_open": true
    },
    "listing_count": "149",
    "listing_sort_order": "custom",
    "policies": { "…": "…" },
    "shop_about": { "…": "…" },
    "signals": { "…": "…" },
    "sections": [ { "title": "+ Bifold Leather Wallet", "active_listing_count": 65, "listing_ids": [ "…" ] } ],
    "source_url": "https://www.etsy.com/shop/PremiumEngrave",
    "_source": "etsy-shop-scraper"
}
```

### Listing record (`_type: "listing"`, one per catalog listing — abridged)

```json
{
    "_type": "listing",
    "scraped_shop_id": 35016605,
    "catalog_position": 1,
    "listing_id": 1800869178,
    "shop_name": "PremiumEngrave",
    "title": "Custom Initial Leather Trifold Wallet, Gift for Anniversary, Graduation, Boyfriend, Husband, Father, Handwriting Engraved Mens Wallet Custom",
    "price": "68.00",
    "discounted_price_unformatted": "27.20",
    "currency_code": "USD",
    "quantity": 739,
    "is_sold_out": false,
    "free_shipping_countries": ["US"],
    "min_processing_days": 1,
    "max_processing_days": 3,
    "url": "https://www.etsy.com/listing/1800869178/custom-initial-leather-trifold-wallet",
    "source_url": "https://www.etsy.com/shop/PremiumEngrave",
    "_source": "etsy-shop-scraper"
}
```

### Shops that don't exist

A shop that is closed or never existed returns a clear record instead of a failure, and the rest of your shops keep processing. It isn't charged.

```json
{
    "_type": "shop_profile",
    "_status": "not_found",
    "scraped_shop_ref": "zzqxnotarealshop123456",
    "error": "Etsy shop 'zzqxnotarealshop123456' does not exist or is closed.",
    "etsy_error": "{\"error\":\"This shop appears to be closed.\"}",
    "source_url": "zzqxnotarealshop123456"
}
```

## Other Actors you might need

| Actor | What it adds |
|---|---|
| **[Etsy Product & Reviews Scraper](https://apify.com/dz_omar/etsy-product-reviews-scraper?fpr=smcx63)** | Full details for any single Etsy listing, plus its buyer reviews with rating, media and sort filters |
| **[Etsy Search Scraper](https://apify.com/dz_omar/etsy-search-scraper?fpr=smcx63)** | Search Etsy by keyword and collect matching listings with prices, shops and ratings — a way to discover the shops worth scraping here |

## Frequently asked questions

### Is it legal to scrape Etsy shops?

The Actor reads publicly visible shop and listing data — the same information any visitor sees. Use it in line with Etsy's terms of use and applicable data-protection rules (GDPR, CCPA). This is not legal advice.

### Do I need an Etsy account?

No. Shop URLs, names or IDs are all you need; no login or cookies are required.

### What is the difference between this and the Etsy Product & Reviews Scraper?

This Actor starts from a **shop** and returns the shop profile and its whole catalog. The [Etsy Product & Reviews Scraper](https://apify.com/dz_omar/etsy-product-reviews-scraper?fpr=smcx63) starts from a **listing** and returns that listing's full details and buyer reviews. Use both together: this one to discover a shop's listings, the other to go deep on any of them.

### Can I use Etsy Shop Scraper in Make, Zapier, n8n or my own code?

Yes. Every run is available through the Apify API and client libraries, and works with Make, Zapier, n8n and webhooks.

### Does Max listings per shop limit the shop profile?

No. There is always exactly one shop profile per shop. The limit only caps the listing records of each shop separately.

### In what order are listings returned?

In the shop owner's own order, the same order buyers see in the shop. Each record carries a `catalog_position` so you can restore the order after sorting your data. When the whole catalog is requested, the Actor checks it against the shop's own listing count and automatically recovers any listing it missed; those recovered listings come last and have an empty `catalog_position`.

### Does it return the complete catalog?

Yes. With **Max listings per shop** set to `0`, each shop's catalog is verified against the number of listings the shop reports, and anything missing is recovered before the shop is finished. If the count still can't be reached, the run log says so.

### What happens if a run is interrupted?

The Actor delivers results progressively and saves its progress as it goes. If a run is interrupted, a resumed run continues from the last saved point — completed shops are not repeated.

### Why did my run return fewer results than I asked for?

| Situation | What you see | What to do |
|---|---|---|
| Input isn't a shop (for example a listing URL) | Skipped with a warning | Provide a shop URL, name or ID |
| Shop closed or not found | A `not_found` record | Check the shop still exists |
| Shop couldn't be retrieved in this run | An `unavailable` record (not charged) | Run it again — nothing is lost |
| Shop has fewer listings than the limit | Fewer listing records | Expected — you get the whole catalog |

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

*Etsy Shop Scraper — by FlowExtract API. Turn any website into structured data.*
