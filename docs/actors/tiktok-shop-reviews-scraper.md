# TikTok Shop Reviews Scraper ⭐ 16 Markets, Photos & Ratings

Extract **buyer reviews from any TikTok Shop product**, in any TikTok Shop market — US, UK,
Indonesia, Malaysia, Philippines, Singapore, Vietnam, Thailand, Mexico, Brazil, Japan and the EU.
Paste product URLs and get every review with the fields that matter for research and monitoring.

No login, no cookies, no API key — just TikTok Shop product URLs.


---

## What you get

Every review row carries:

| Field | Example |
|---|---|
| `rating` | `5` |
| `review_text` | "The sound is better than I expected." |
| `review_time` | `2026-08-22T19:55:31.123Z` |
| `is_verified_purchase` | `true` |
| `is_incentivized_review` | `false` |
| `review_images` | array of photo URLs buyers uploaded |
| `sku_specification` | the exact variant bought (e.g. "Black / IPX7") |
| `review_country` | reviewer's country |
| `reviewer_name` | masked by TikTok (e.g. `T**5`) |
| `reviewer_avatar_url`, `reviewer_id`, `review_id`, `sku_id`, `product_name`, `product_id`, `region` | |

Enable **Include a product summary row** and each product also gets one summary row with its
`total_reviews`, `overall_rating` and the full **rating breakdown** (1–5 star counts).

## Input

| Field | Description |
|---|---|
| 🔗 **Product URLs or IDs** | One per line. Any of: `https://shop.tiktok.com/<market>/pdp/<id>`, `https://www.tiktok.com/shop/pdp/<slug>/<id>`, `https://shop.tiktok.com/view/product/<id>`, or a bare product id. |
| 🌍 **TikTok Shop market** | Pick from the list — no typing. **Auto-detect** (default) reads the market from each link; choosing a market applies it to every product (handy for bare IDs). |
| 🔢 **Max reviews per product** | Upper bound per product (default 100). |
| ↕️ **Sort reviews by** | 👍 Recommended (default) or 🆕 Most recent first. |
| 🔍 **Filter reviews** | 🌟 All (default), one star level (5 ⭐ … 1 ⭐), 📷 with photos or videos, or ✅ verified purchases only — the same filters as on the product page. You pay only for matching reviews. |
| 📊 **Summary row** | One row per product with total reviews, overall rating and the 1–5 ⭐ breakdown (default on). |

### Example input

```json
{
  "productUrls": [
    "https://shop.tiktok.com/us/pdp/cat-nail-clipper/1731578642912612516",
    "https://shop.tiktok.com/ph/pdp/1737556955253146886"
  ],
  "market": "AUTO",
  "maxReviewsPerProduct": 200,
  "reviewsSort": "recent",
  "reviewsFilter": "1_star",
  "includeProductSummary": true
}
```

## Markets

🇺🇸 United States · 🇬🇧 United Kingdom · 🇮🇪 Ireland · 🇩🇪 Germany · 🇫🇷 France · 🇮🇹 Italy · 🇪🇸 Spain ·
🇲🇽 Mexico · 🇧🇷 Brazil · 🇯🇵 Japan · 🇮🇩 Indonesia · 🇲🇾 Malaysia · 🇹🇭 Thailand · 🇻🇳 Vietnam ·
🇵🇭 Philippines · 🇸🇬 Singapore — every TikTok Shop market with a web storefront.

TikTok applies stronger bot protection to some markets than others. When a market presents a
verification step, the actor retries on a fresh residential connection; a product it still cannot
reach is skipped and **not charged**.

## Pricing (pay per event)

Prices drop as your Apify plan goes up.

| Event | Free | Bronze | Silver | Gold+ |
|---|---|---|---|---|
| Actor start (per run, 1 GB) | $0.005 | $0.005 | $0.005 | $0.005 |
| Product processed | $0.020 | $0.018 | $0.016 | $0.014 |
| Review scraped | $0.0025 | $0.0022 | $0.0019 | $0.0016 |

A product that returns no reviews is not charged the per-product fee. Example — **1,000 reviews
across 10 products**: Free $2.71 · Bronze $2.39 · Silver $2.07 · Gold+ $1.75.

## Output sample

```json
{
  "type": "review",
  "region": "US",
  "product_id": "1731578642912612516",
  "product_name": "Potaroma Universal Cat Paw Trimmer (Blue)",
  "rating": 5,
  "review_text": "Easy to use and our cat has no problem having his nails trimmed with this.",
  "review_time": "2026-09-14T00:00:00.000Z",
  "is_verified_purchase": true,
  "is_incentivized_review": false,
  "sku_specification": "Default",
  "review_country": "US",
  "review_images": ["https://p16-oec-general-useast5.ttcdn-us.com/..."],
  "reviewer_name": "s**a",
  "review_id": "7694368423740131093"
}
```

---

## Support

Questions, a market that isn't returning data, or a field you need added? Email
**[flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)** — we read every message.

## Legal & compliance

This actor collects **publicly available** TikTok Shop product review data. It does not log in,
does not bypass access controls, and collects no private or personal account data beyond what
TikTok already shows publicly on a product page (reviewer display names are masked by TikTok). You
are responsible for using the output in line with TikTok's terms and applicable laws (including
data-protection rules such as GDPR/CCPA where relevant). Use it for market research, product and
review monitoring, and competitive analysis.

---

*Built and maintained by FlowExtract API.*
