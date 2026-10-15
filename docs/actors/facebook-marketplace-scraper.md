# 🛒 Facebook Marketplace Scraper — Listings, Sellers, Vehicles & Rentals

Scrape **Facebook Marketplace** listings by keyword, category, location or link — **no login, no cookies, no Facebook account**. Every listing comes with its title, price, seller, city, photo and link; switch on **full details** to also get the description, condition, every photo, exact coordinates, the listing date, the seller's profile, and clean vehicle and rental fields.

## 🛒 What is Facebook Marketplace Scraper?

Facebook Marketplace Scraper turns Marketplace searches into a clean, flat dataset you can download as JSON, CSV or Excel, or send to Google Sheets, a database or your own app.

- 🔍 **Search by keyword** — `iphone 13`, `sofa`, `honda civic` — exactly as you would on Facebook.
- 📍 **Any city in the world** — type `Austin, TX`, `Toronto`, `Lyon, France` or coordinates. No Facebook location IDs to look up.
- 🗂️ **Browse categories** — vehicles, property rentals, electronics, furniture, free stuff and more.
- 🔗 **Paste Marketplace links** — a search you set up on Facebook keeps all its filters; listing links return the full listing.
- 🎛️ **Every Marketplace filter** — price range, condition, date listed, delivery method, sold listings, exact match, radius, sort order.
- 📏 **Stay inside the radius** — Facebook keeps adding listings from far away when local ones run out; one switch keeps only what is really near you.
- 👤 **Seller on every listing** — name and ID even without details; join date, rating and picture with details.
- 🚗 **Vehicle fields** — year, make, model, trim, mileage, transmission, fuel, colours, owners, title status.
- 🏠 **Rental fields** — bedrooms, bathrooms, unit and building features, availability, postal code, walk/transit/bike scores.
- 📚 **Deep results** — hundreds or thousands of listings per search, not just the first page.

## 📊 What Facebook Marketplace data can I extract?

**Every listing:**

| Field | Description |
|---|---|
| `id`, `url` | Listing ID and link |
| `title` | The listing title |
| `price`, `price_formatted`, `currency` | Price as a number and as shown on Facebook (currency with details) |
| `original_price`, `original_price_formatted` | The struck-through price when the seller lowered it |
| `is_sold`, `is_pending` | Availability |
| `city`, `state`, `location_name` | Where the item is |
| `photo_url`, `has_video` | Main photo; whether the listing has a video |
| `delivery_types` | `IN_PERSON`, `DOOR_PICKUP`, `SHIPPING`, `PUBLIC_MEETUP` |
| `seller_id`, `seller_name` | Who is selling |
| `category_id` | Marketplace category |
| `search`, `search_query`, `search_category`, `search_location`, `position` | Which search found it and at what rank |
| `distance_km` | Approximate distance from your location (with **Stay inside the radius**) |
| `scraped_at`, `source_url` | When the row was collected and the search it came from |

**With "Include full listing details":**

| Field | Description |
|---|---|
| `description` | The seller's full description |
| `condition`, `condition_code`, `attributes` | Condition and every other attribute Facebook shows (size, brand, …) |
| `photos`, `photo_count` | Every photo of the listing in full size |
| `created_at` | When the listing was posted |
| `latitude`, `longitude`, `location_text` | Exact map position of the listing |
| `category_name`, `category_slug` | Category in words |
| `is_shipping_offered`, `shipping_price_formatted`, `listing_inventory_type` | Shipping and stock |
| `seller_joined_at`, `seller_rating`, `seller_rating_count`, `seller_profile_picture`, `is_business_seller` | Seller profile |
| `vehicle_year` … `vehicle_seller_type` | Vehicle facts (vehicle listings) |
| `property_bedrooms` … `property_bike_score` | Rental facts (rental listings) |

## 🎯 Use cases

- **Resellers and flippers** — track underpriced items in your area the moment they're listed (sort by newest, last 24 hours).
- **Car dealers and buyers** — collect private-seller vehicles with year, make, model, mileage and price for a whole metro area.
- **Price research** — build a price history for any product in any city, with condition and date listed.
- **Rental market analysis** — rents with bedrooms, bathrooms, amenities and postal codes, city by city.
- **Lead generation** — find active local sellers in a niche (furniture, appliances, equipment).
- **Market coverage** — compare supply and prices across cities and countries with one dataset.

## 🚀 How do I use Facebook Marketplace Scraper?

1. Type one or more **keywords** and a **location** (or pick **categories**, or paste **Marketplace links**).
2. Set any **filters** and the **max listings per search**.
3. Turn on **Include full listing details** if you need descriptions, all photos and seller profiles.
4. Click **Start** and download your data as JSON, CSV, Excel or HTML.

## ➡️ Input

| Field | What it does | Default |
|---|---|---|
| 🔍 **Keywords** | One search per keyword. | `iphone 13` (example) |
| 📍 **Location** | Any city, written like on a map (`Austin, TX`, `Manchester, UK`) or `lat,lng`. Used for keywords and categories. | — |
| 📏 **Search radius (km)** | How far from the location to look. | Facebook's default (65 km) |
| **Stay inside the radius** | Drop listings from cities beyond the radius and stop when only far-away results are left. | Off |
| 🗂️ **Categories** | With keywords: search inside each category. Without: browse the category near the location. | — |
| 🔗 **Marketplace links** | Search, category or listing links from Facebook. Links keep their own filters and location. | — |
| ↕️ **Sort by** | Best match, newest, price low→high / high→low, distance. | Best match |
| 💲 **Min / max price** | In the location's currency. | — |
| 🕒 **Date listed** | Last 24 hours, 7 days or 30 days. | Any time |
| 🏷️ **Condition** | New, used – like new, good, fair. | Any |
| 🚚 **Delivery method** | Local pickup or shipping. | All |
| **Include sold listings** | Also return listings marked as sold. | Off |
| **Exact keyword match only** | Titles containing the keyword exactly. | Off |
| 🔢 **Max listings per search** | Per keyword, category or link. `0` = everything. | 100 |
| 🔢 **Max listings in total** | Across the whole run. | No limit |
| 📄 **Include full listing details** | Description, condition, all photos, exact location, date, seller profile, vehicle and rental fields. | Off |

Example input:

```json
{
    "searchQueries": ["iphone 13", "macbook"],
    "location": "Chicago, IL",
    "radiusKm": 40,
    "maxPrice": 800,
    "sortBy": "creation_time_descend",
    "daysSinceListed": "7",
    "maxResultsPerSearch": 200,
    "includeDetails": true
}
```

> Facebook does not combine a **price** sort with a **Date listed** filter (it returns nothing). When you set both, the date filter is kept and results come newest first — the run log says so.

## ⬅️ Output

Results appear in the **Listings** and **Listings with details** tables and can be exported in any format.

### 📘 Example of extracted Facebook Marketplace data

A vehicle listing with full details (seller anonymised):

```json
{
    "id": "1634836218426989",
    "url": "https://www.facebook.com/marketplace/item/1634836218426989/",
    "title": "2012 Infiniti G37 · X",
    "price": 3500,
    "price_formatted": "$3,500",
    "currency": "USD",
    "is_sold": false,
    "city": "Miami",
    "state": "FL",
    "location_name": "Miami, Florida",
    "photo_url": "https://scontent.xx.fbcdn.net/…",
    "has_video": true,
    "delivery_types": ["IN_PERSON"],
    "seller_id": "pfbid02AbCdEf…",
    "seller_name": "Alex M.",
    "search": "Vehicles",
    "search_location": "Miami, Florida, United States",
    "description": "El vehículo no tiene ningún problema mecánico funciona al 100…",
    "created_at": "2026-10-13T15:20:48.000Z",
    "latitude": 25.776672,
    "longitude": -80.194702,
    "photos": ["https://scontent.xx.fbcdn.net/…", "https://scontent.xx.fbcdn.net/…", "…"],
    "photo_count": 9,
    "seller_joined_at": "2025-03-15T20:18:43.000Z",
    "seller_rating": 5,
    "seller_rating_count": 1,
    "vehicle_year": 2012,
    "vehicle_make": "Infiniti",
    "vehicle_model": "g37",
    "vehicle_trim": "X",
    "vehicle_mileage": 129000,
    "vehicle_mileage_unit": "MILES",
    "vehicle_transmission": "AUTOMATIC",
    "vehicle_fuel_type": "GASOLINE",
    "vehicle_exterior_color": "black",
    "vehicle_owners": "TWO",
    "vehicle_is_paid_off": "IS_PAID_OFF",
    "vehicle_seller_type": "PRIVATE_SELLER",
    "details_fetched": true
}
```

A rental listing adds fields like these:

```json
{
    "title": "5 Beds 4 Baths - House",
    "price_formatted": "$4,500",
    "property_bedrooms": 5,
    "property_bathrooms": 4,
    "property_unit_details": ["House", "5 beds · 4 baths", "Central heating", "Laundry available", "Parking available", "1 Year Lease", "Dishwasher"],
    "property_building_details": ["Pet park", "Roof deck"],
    "property_availability": "Listed 4 hours ago · Available 2026/10/14",
    "property_postal_code": "98001-1203",
    "property_walk_score": 5,
    "property_transit_score": 11,
    "property_bike_score": 9
}
```

## 💰 How much does it cost to scrape Facebook Marketplace?

You pay only for what you get, per listing delivered. The lower your Apify plan, the more each listing costs:

| Apify plan | Free | Bronze | Silver | Gold | Platinum | Diamond |
|---|---|---|---|---|---|---|
| Per 1,000 listings | $0.80 | $0.70 | $0.60 | $0.50 | $0.50 | $0.50 |
| + full details, per 1,000 | $1.00 | $0.90 | $0.80 | $0.70 | $0.70 | $0.70 |

Plus **$0.001 per search** (keyword, category or link) that returns at least one listing. Example: 1,000 listings with full details on the Free plan ≈ **$1.80**.

Set **Max cost per run** in the run options and the run stops exactly at your budget — you are never charged for listings you don't receive.

## 🧰 More Facebook tools

| Actor | What it does |
|---|---|
| 📝 [Facebook Posts Scraper](https://apify.com/dz_omar/facebook-posts-scraper?fpr=smcx63) | Posts from public pages, profiles and groups — no login |
| 💬 [Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63) | Comments and replies from posts, reels, photos and videos |
| 📢 [Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63) | Ads from the Meta Ad Library: creatives, copy, dates and advertisers |

## ❓ FAQ

**Do I need a Facebook account or cookies?**
No. The Actor reads public Marketplace listings exactly as a visitor who isn't logged in sees them. Nothing to export, no account at risk.

**Which countries and cities work?**
Any place where Facebook Marketplace is available. Prices come in the local currency (USD, GBP, EUR, AUD, …).

**How many listings can I get per search?**
As many as Facebook returns for that search — often thousands for broad searches in big cities. Set **Max listings per search** to `0` for everything.

**Why do some results come from far outside my city?**
When local listings run out, Facebook keeps going with listings from further away. Turn on **Stay inside the radius** to keep only nearby ones.

**Why is a field empty?**
Sellers fill in different things: not every listing has a description, condition or video, and vehicle and rental fields only exist on those listings. Fields marked "with details" need **Include full listing details**.

**Can I get listings that are already sold?**
Yes — tick **Include sold listings**.

**Can I scrape one specific listing?**
Paste its link (`https://www.facebook.com/marketplace/item/…`) into **Marketplace links**; it is always returned with full details.

## 🔗 Integrations

Connect the results to Google Sheets, Slack, Zapier, Make, n8n, webhooks or your own code through the [Apify API](https://docs.apify.com/api/v2). Schedule runs to monitor new listings every hour or every day.

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
- No affiliation with or endorsement by Facebook or Meta is implied.

---

*Facebook Marketplace Scraper — by FlowExtract API. Turn any website into structured data.*
