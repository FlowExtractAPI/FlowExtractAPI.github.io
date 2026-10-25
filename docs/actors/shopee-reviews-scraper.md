# ⭐ Shopee Reviews Scraper — Ratings, Text, Photos & Videos from Any Shop or Product

**[Shopee Reviews Scraper](https://apify.com/dz_omar/shopee-reviews-scraper?fpr=smcx63)** extracts Shopee product and shop reviews into clean, structured rows: the star rating, the written review, the quality / seller / delivery sub-ratings, every photo and video, the variation the buyer ordered, the reviewer and the seller's reply. Paste a shop URL or a product URL from any of 8 Shopee markets and get every review Shopee shows for it — no Shopee account, no cookies, no setup.

Perfect for **e-commerce sellers**, **brand and market researchers**, and **data teams** who need Shopee review data at scale without copying it by hand.

---

## Why scrape Shopee reviews?

Shopee is the largest online marketplace in Southeast Asia and one of the biggest in Brazil and Taiwan, with millions of buyer reviews written every day. Those reviews are the most honest signal of how a product and a seller actually perform — and they are spread across thousands of product pages.

Here are some of the most common use cases:

- **Competitor monitoring**: track what buyers praise and complain about in a rival shop, week after week.
- **Product research**: read the 1-star and 2-star reviews of a product before you source or stock it.
- **Seller reputation**: measure seller service and delivery sub-ratings across a shop's whole catalogue.
- **Sentiment analysis and AI**: feed thousands of real, labelled reviews (text + stars) into your models.
- **Visual quality checks**: collect buyer photos and videos to see what customers actually received.

---

## 🌏 Supported markets

Each market below was confirmed with a real shop's reviews before this listing was published.

| Market | Storefront | Status |
|---|---|---|
| 🇸🇬 Singapore | shopee.sg | ✅ confirmed |
| 🇲🇾 Malaysia | shopee.com.my | ✅ confirmed |
| 🇮🇩 Indonesia | shopee.co.id | ✅ confirmed |
| 🇵🇭 Philippines | shopee.ph | ✅ confirmed |
| 🇹🇭 Thailand | shopee.co.th | ✅ confirmed |
| 🇻🇳 Vietnam | shopee.vn | ✅ confirmed |
| 🇹🇼 Taiwan | shopee.tw | ✅ confirmed |
| 🇧🇷 Brazil | shopee.com.br | ✅ confirmed |

URLs from Mexico, Colombia, Chile and Argentina are accepted, but those markets are not confirmed yet. You can mix URLs from different markets in one run — the market is read from each URL.

---

## What data can Shopee Reviews Scraper extract?

### ⭐ Rating
- `rating` — the star rating, 1 to 5
- `productQuality`, `sellerService`, `deliveryService` — the three sub-ratings, 1 to 5
- `lowRatingReasons` — the reasons a buyer picked for a low rating (e.g. "Poor quality")
- `reviewTags` — the topic tags a buyer picked (e.g. "Design", "Material")

### 📝 Review
- `text` — the written review (empty for star-only reviews), and `hasText`
- `imageUrls` — full-size URLs of every photo the buyer attached
- `videoUrls` — URLs of every video the buyer attached (MP4)
- `sellerReply`, `sellerReplyAt` — the seller's public reply, when there is one
- `likeCount` — how many shoppers found the review helpful
- `isHidden` — whether Shopee has hidden the review's text

### 🛍️ Product & order
- `productId`, `productName`, `productUrl` — the product the review is about
- `variation` — the variation the buyer ordered (colour, size, …)
- `orderId`, `currency`, `isRepeatPurchase`

### 👤 Reviewer
- `reviewerName` — masked by Shopee when the review is anonymous, and `isAnonymous`
- `reviewerAvatarUrl`
- `buyerRegion`, `isOverseas`

### 🏪 Shop
- `shopId`, `shopUrl`, `country`

### 📅 Time
- `createdAt`, `updatedAt` — ISO 8601, UTC

### 📊 Summary row (one per URL, optional)
- `reviewsCollected`, `reviewsScanned`, `reviewsByStar`, `coverage` — what was read and returned, and whether Shopee's depth limit was reached

---

## ⚙️ How to use Shopee Reviews Scraper

### Input options

#### `startUrls` — Shopee shop or product URLs

| URL you paste | What you get |
|---|---|
| `https://shopee.sg/shop/276679244` | Every review of the shop, across all its products |
| `https://shopee.com.my/Product-Name-i.345524236.26828374105` | The reviews of that one product |
| `https://shopee.com.br/product/316479116/5055406617` | The reviews of that one product (short form) |

Shopee shows reviews per shop, so for a product URL the Actor reads the shop's reviews and keeps that product's. Several products from the same shop are read in one pass, so adding more products from one shop costs no extra time.

A shop link that uses the shop's name instead of its number (for example `shopee.com.br/carrefour`) is not supported yet — open any of the shop's products and paste that product URL, or use the `/shop/<number>` link.

#### `maxReviewsPerShop` (Integer)
- **Default**: `100`
- Most reviews returned for each URL. `0` returns everything Shopee shows.

#### `starRatings` (Array)
- **Default**: empty (every rating, newest first)
- Only return reviews with these star ratings, e.g. `["1", "2"]` for complaints only.
- Shopee shows roughly the 1,000 most recent reviews per shop. Each star rating you select is read separately and reaches about 1,000 deep on its own, so **selecting all five star ratings reaches up to about 5,000 reviews per shop**.

#### `onlyWithText` / `onlyWithMedia` (Boolean)
- **Default**: `false`
- Skip star-only reviews, or reviews without a photo or video.

#### `includeShopSummary` (Boolean)
- **Default**: `true`
- Adds one summary row per URL with what was scanned and collected.

```json
{
    "startUrls": [
        { "url": "https://shopee.sg/shop/276679244" },
        { "url": "https://shopee.com.my/LABER-LEE-Unisex-Leisure-Shoulder-Bag-Multi-Pocket-Messenger-Shoulder-Bag-Large-Capacity-Nylon-Tablet-Netbook-Umbrella-i.345524236.26828374105" }
    ],
    "maxReviewsPerShop": 500,
    "starRatings": ["1", "2", "3"],
    "onlyWithText": true
}
```

### 🔐 Authentication

None. The Actor reads the same reviews any shopper sees on Shopee — you never need a Shopee account, a login or cookies.

---

## 💰 Pricing

How much does it cost to scrape Shopee reviews? You pay per review delivered, plus a small fee per run.

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Review delivered | $0.0030 | $0.0027 | $0.0024 | $0.0021 |
| Run start (per GB of memory) | $0.005 | $0.004 | $0.0035 | $0.003 |

Summary rows and guidance rows are never charged.

**Cost estimate examples:**
- **1,000 reviews** on the FREE plan: ~$3.00 + $0.005 run start
- **1,000 reviews** on the GOLD plan: ~$2.10 + $0.003 run start

> 💡 Tip: set `maxReviewsPerShop` to `10` first to check your URLs before a full run. You can also set a maximum cost per run in the run options — the Actor stops before it goes over.

---

## 📊 Sample output

A real review row (Singapore):

```json
{
    "type": "review",
    "reviewId": "2729298164",
    "country": "SG",
    "shopId": "276679244",
    "shopUrl": "https://shopee.sg/shop/276679244",
    "productId": "3152884068",
    "productName": "Creative Outlier Air Wireless Earbuds (Local Singapore Warranty)",
    "productUrl": "https://shopee.sg/product/276679244/3152884068",
    "variation": "Black",
    "rating": 5,
    "text": "Works well and worth the price, usage as stated for the product",
    "hasText": true,
    "imageUrls": ["https://down-sg.img.susercontent.com/file/25720e19cdfe75d7cb9f615ae08c9925"],
    "videoUrls": [],
    "reviewerName": "mazlinteo",
    "isAnonymous": false,
    "createdAt": "2020-07-23T08:43:28.000Z",
    "sellerReply": null,
    "buyerRegion": "SG",
    "orderId": "47750438544185",
    "currency": "SGD",
    "reviewTags": [],
    "lowRatingReasons": []
}
```

The summary row for a product URL:

```json
{
    "type": "shop-summary",
    "country": "MY",
    "shopId": "345524236",
    "productId": "26828374105",
    "reviewsCollected": 13,
    "reviewsScanned": 1000,
    "reviewsByStar": { "5": 13 },
    "coverage": "Hit Shopee's ~1,000-review limit on the all-stars feed; choose star ratings to reach older reviews.",
    "note": "Product URL: Shopee publishes no per-product feed, so these are the reviews for this product found in the shop-wide feed."
}
```

---

## ❓ Frequently Asked Questions

**Do I need a Shopee account to use this Actor?**
No. It reads the reviews Shopee shows to every visitor. No login, no cookies.

**How much do 1,000 Shopee reviews cost?**
About $3.00 on the FREE plan and $2.10 on GOLD, plus one run-start fee — see the pricing table above. Apify's monthly platform credit covers roughly 1,600 reviews.

**How many reviews can I get per shop?**
Shopee shows about the 1,000 most recent reviews per shop. Select star ratings in `starRatings` to read each star separately — all five together reach up to about 5,000 reviews per shop.

**Can I get the reviews of a single product?**
Yes. Paste the product URL. The summary row tells you how many of the shop's reviews were read to find them.

**Can I scrape several shops or countries in one run?**
Yes. Add as many URLs as you like, from any of the supported markets, in one run.

**Can I get only negative reviews?**
Yes. Set `starRatings` to `["1", "2"]`. Add `onlyWithText: true` to skip star-only ratings.

**Why is a review's text empty?**
Either the buyer left stars only (`hasText: false`), or Shopee has hidden the review (`isHidden: true`).

**What happens with a URL I typed wrong?**
The run does not fail. The URL is skipped, the reason is logged, and the rest of your URLs are still scraped. If no URL is usable, you get one row explaining how to fix the input.

---

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
- No affiliation with or endorsement by Shopee is implied.

---

*Shopee Reviews Scraper — by FlowExtract API. Turn any website into structured data.*
