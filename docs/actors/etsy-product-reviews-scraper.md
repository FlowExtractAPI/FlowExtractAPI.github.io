# 🛍️ Etsy Product & Reviews Scraper  Full Listing Data + Buyer Reviews

**[Etsy Product & Reviews Scraper](https://apify.com/dz_omar/etsy-product-reviews-scraper?fpr=smcx63)** extracts complete **Etsy listing/product data** from any listing URL  product info, shop, pricing, variations, shipping, policies, ratings and media  and, optionally, the listing's **buyer reviews** with the same filters you have in the Etsy app. Paste a URL, run, and get clean, structured JSON.

Perfect for **e-commerce sellers**, **market researchers**, and **developers** who need full Etsy product and review data without maintaining a scraper or reverse-engineering Etsy's app API.

---

## Why scrape Etsy?

Etsy hosts millions of handmade, vintage, and custom listings, and every listing page carries a rich, structured payload  pricing, variations, shipping, shop reputation, and buyer reviews. That data powers competitor analysis, pricing strategy, product research, and review-sentiment work.

Common use cases:

- **Competitor & pricing research**  track prices, variations, quantities, and shop ratings across listings.
- **Product sourcing & trends**  analyze what's selling, how it's made, and how it's priced.
- **Review analysis**  pull buyer reviews (with sub-ratings and seller responses) for sentiment and quality insights.
- **Catalog enrichment**  hydrate your own product database with full Etsy listing details.
- **Shop monitoring**  watch a competitor's listings, ratings, and review trends over time.

---

## What data can the Etsy Product & Reviews Scraper extract?

Every input URL always returns one **listing-details** record (the full product payload). When **Include reviews** is on, you also get one **review** record per review.

### 🏷️ Product / Listing
- Listing ID, title, full description, listing URL
- Price and currency, quantity available, when-made / made-to-order
- Category, tags, personalization options, "how it's made"

### 🎨 Variations & Offerings
- Variation options (size, color, style, …) and per-variation pricing
- Offerings, inventory, and images by variation

### 🏪 Shop & Seller
- Shop name, shop rating and review counts, shop policies
- Seller details, production partners, manufacturers, FAQs

### 🚚 Shipping & Policies
- Shipping options and costs, free-shipping info
- Structured return and shop policies

### ⭐ Ratings & Reviews (optional)
- Overall listing rating, star breakdown, photo/video review counts
- Per review: `rating`, `review` text, `date`, buyer name/login, `language`
- `subratings` (item quality, shipping, customer service), seller `response`, `is_recommended`, `upvotes_count`
- Order references: `transaction_id`, `receipt_id`

### 🖼️ Media
- Listing images and video, review images/videos, buyer avatars

> **Data preservation:** the full Etsy response is preserved on each `listing_details` record  nothing is stripped  so even fields not listed above are available.

---

## ⚙️ How to use the Etsy Product & Reviews Scraper

### Input options

#### 🔗 Etsy listing URLs (`startUrls`, array  required)

One or more Etsy listing URLs. Any locale prefix or query string is fine.

| Input value | What it does |
|---|---|
| `https://www.etsy.com/listing/1667678858/...` | Fetches that listing's full details (+ reviews if enabled) |
| `https://www.etsy.com/ca/listing/1861242992/...` | Locale prefixes work too |

```json
{
  "startUrls": [
    { "url": "https://www.etsy.com/listing/1667678858/personalised-engraved-groomsmen-groom" },
    { "url": "https://www.etsy.com/listing/1861242992/embroidered-crown-for-kids-and-childrens" }
  ],
  "includeReviews": true,
  "maxReviews": 100
}
```

#### 💬 `includeReviews` (boolean)  default `true`
Listing details are **always** fetched. When `true`, reviews are fetched too. When `false`, only the listing-details record is returned and **no** review requests are made.

#### 🔢 `maxReviews` (integer)  default `10`
Maximum reviews to collect **per listing** (each URL independently  not a global total). `0` = all matching reviews. Ignored when `includeReviews` is off. It never limits listing-details records  there is always exactly one per URL.

#### ↕️ `sort`  `Suggested` · `Most recent` · `Highest rated` · `Lowest rated`
#### ⭐ `rating`  only reviews with a chosen star rating (1–5), or all
#### 📷 `reviewMedia`  `Any review` · `With photos` · `With videos` (mutually exclusive, as in the Etsy app)

```json
{
  "startUrls": [{ "url": "https://www.etsy.com/listing/1667678858/x" }],
  "includeReviews": true,
  "maxReviews": 500,
  "sort": "Most recent",
  "rating": "5",
  "reviewMedia": "With photos"
}
```

**How the limit works:** with two URLs and `maxReviews: 1000`, you get **2 listing-details records + up to 1,000 reviews for each listing** (2,002 records total). With `includeReviews: false` and one URL, you get exactly **1** record regardless of `maxReviews`.

### 🔐 Authentication
None. No Etsy account or login is required  the actor reads public listing and review data.

---

## 💰 Pricing

How much does it cost to scrape Etsy? This actor uses **pay-per-event** pricing, so you pay only for the data you receive  no actor-start fee, no hidden costs, just results.

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Listing details (per record) | $0.005 | $0.004 | $0.0035 | $0.003 |
| Reviews (per 1,000) | $2.00 | $0.80 | $0.60 | $0.40 |

**Cost estimate examples** (1 listing + 1,000 reviews):
- **GOLD plan**: ~$0.003 details + $0.40 reviews ≈ **$0.40**
- **FREE plan**: ~$0.005 details + $2.00 reviews ≈ **$2.01**

> 💡 Tip: set `maxReviews: 10` first to test your setup before running a full extraction. Turn `includeReviews` off when you only need product data  it's cheaper and faster.

---

## 📊 Sample output

### Listing details (`_type: "listing_details"`, one per URL  abridged; full payload is preserved)
```json
{
  "_type": "listing_details",
  "scraped_listing_id": 1667678858,
  "includeReviews": true,
  "listing": {
    "listing_id": 1667678858,
    "title": "Personalised Engraved Groomsmen Groom Best man Cufflinks",
    "price": "31.10",
    "currency_code": "USD",
    "quantity": 556,
    "when_made": "made_to_order",
    "url": "https://www.etsy.com/listing/1667678858/personalised-engraved-groomsmen-groom"
  },
  "shop": { "shop_name": "MarHappiness" },
  "variations": [ "…" ],
  "shipping": { "…": "…" },
  "listing_rating": { "…": "…" },
  "source_url": "https://www.etsy.com/listing/1667678858",
  "_source": "etsy-product-reviews-scraper"
}
```

### Review (`_type: "review"`, one per review)
```json
{
  "_type": "review",
  "scraped_listing_id": 1667678858,
  "rating": 5,
  "review": "Great cufflinks. Looked just as described",
  "date": 1786608327,
  "buyer_real_name": "Beth Belger",
  "buyer_login_name": "bethbelger",
  "language": "en",
  "is_recommended": true,
  "upvotes_count": 0,
  "subratings": { "item_quality": 5, "shipping": 5, "seller_customer_service": 5 },
  "response": null,
  "transaction_id": 5099392452,
  "receipt_id": 4087440613,
  "source_url": "https://www.etsy.com/listing/1667678858",
  "_source": "etsy-product-reviews-scraper"
}
```

Use the **Listing details** and **Reviews** dataset views, or filter on `_type`, to separate the two.

### Listings that no longer exist
If a URL points to a listing that has been removed or never existed, you get a clear, self-describing record instead of a failure — and the rest of your URLs keep processing:
```json
{
  "_type": "listing_details",
  "_status": "not_found",
  "scraped_listing_id": 18336688391,
  "includeReviews": true,
  "error": "Etsy listing 18336688391 does not exist or is no longer available.",
  "etsy_error": "ListingMap with PK listing_id = 18336688391 does not exist",
  "source_url": "https://www.etsy.com/listing/18336688391"
}
```

---

## ❓ Frequently Asked Questions

**Do I need an Etsy account to use this actor?**
No. It only reads publicly available listing and review data.

**How many reviews can I extract for free?**
On the FREE plan reviews are $2.00 / 1,000, so Apify's $5 free monthly credit covers roughly 2,500 reviews (plus a few cents per listing). Higher plans go much further.

**Can I get product details without reviews?**
Yes  set `includeReviews: false`. You get one listing-details record per URL and no review charges.

**Can I scrape multiple listings in one run?**
Yes. Add multiple URLs to `startUrls`; `maxReviews` applies to each listing independently.

**Does `maxReviews` limit the product data?**
No. There is always exactly one listing-details record per URL. `maxReviews` only caps reviews per listing.

**What happens if the run crashes or is aborted mid-way?**
It resumes exactly where it left off  see Resumability below  without re-delivering completed work.

---

## 🔄 Resumability

The actor delivers results progressively and checkpoints its progress continuously. If it crashes, is migrated, or is aborted, a resurrected run resumes from the last safe point  details and reviews are tracked as independent phases per listing, so completed work is never repeated.

| Trigger | What gets saved |
|---|---|
| After each delivered review page | Listing offset + delivered count (encrypted) |
| After listing details delivered | Details-done marker per listing |
| Apify `aborting` event | Full state snapshot |

---

## 🌐 Proxy support

Proxy is automatic  no setup required.

| User tier | Proxy used |
|---|---|
| 💎 Paying | Premium dedicated proxy with automatic failover to Apify Proxy |
| 🆓 Free | Apify datacenter proxy  built-in, automatic |

---

## 🚫 Error handling

| Situation | What you see | What to do |
|---|---|---|
| URL isn't an Etsy listing | Skipped with a warning | Provide a valid `/listing/<id>/…` URL |
| Listing not found / removed | `listing not found  skipping` | Verify the listing still exists |
| No reviews on a listing | `no public reviews for this listing` | Expected for new/low-volume listings |

---

## ⚖️ Legal & ethical use

This actor extracts **publicly visible data** from Etsy  the same product and review information any visitor sees in their browser.

**Please use this tool responsibly:**
- Only extract data you are authorized to access.
- Comply with [Etsy's Terms of Use](https://www.etsy.com/legal/terms-of-use) and applicable data-protection regulations (GDPR, CCPA, etc.).
- Do not use extracted data for spam, harassment, or unsolicited outreach.
- Respect rate limits and do not overload the source.

---

## 🤝 Support & Resources

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### 🌟 Related Actors by FlowExtract API
- **[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**  Property data across Spain, Portugal, and Italy
- **[YouTube Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**  Channel and playlist extraction
- **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**  Facebook ad-library data
