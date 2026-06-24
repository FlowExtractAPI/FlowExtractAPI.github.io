# Zillow Scraper

Scrape property listings from [Zillow](https://www.zillow.com) search pages. Extracts structured data for every property on any search result — for sale, for rent, recently sold — across any US city, ZIP code, or custom map region.

## How it works

This actor calls Zillow's internal search API (the same JSON endpoint the browser uses) rather than parsing HTML. This means:

- **Up to 500 results per page** in a single request
- **Structured data** — no brittle HTML parsing
- **Full pagination** — automatically follows all pages until `maxResults` is reached or the search is exhausted

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `startUrls` | array | ✅ | One or more Zillow search URLs |
| `maxResults` | integer | ❌ | Max properties to scrape in total (0 = unlimited) |
| `proxyConfiguration` | object | ❌ | Apify proxy settings (strongly recommended) |

### Getting the right start URL

1. Go to [zillow.com](https://www.zillow.com)
2. Search for a location and apply any filters you want (price, beds, home type, etc.)
3. Copy the full URL from your browser's address bar and paste it as a start URL

Both URL formats work:
- **Filter URL** — `https://www.zillow.com/new-braunfels-tx/?searchQueryState=...` (recommended — preserves all filters)
- **Path URL** — `https://www.zillow.com/homes/for_sale/` (uses Zillow's defaults)

You can provide **multiple start URLs** in one run (e.g. several cities, or for-sale + for-rent for the same area).

### Proxy

Zillow uses PerimeterX bot detection. Without a proxy, requests from datacenter IPs will be blocked almost immediately. **Apify Residential proxies** are strongly recommended for reliable results.

```json
{
  "useApifyProxy": true,
  "apifyProxyGroups": ["RESIDENTIAL"]
}
```

## Output

Each property is saved as one row in the **Dataset**. Fields:

| Field | Type | Description |
|-------|------|-------------|
| `zpid` | string | Zillow Property ID (unique per listing) |
| `address` | string | Full address |
| `streetAddress` | string | Street address only |
| `city` | string | City |
| `state` | string | State abbreviation (e.g. `TX`) |
| `zipcode` | string | ZIP code |
| `latitude` | number | Latitude |
| `longitude` | number | Longitude |
| `statusType` | string | `FOR_SALE`, `FOR_RENT`, `RECENTLY_SOLD` |
| `statusText` | string | Human-readable status (e.g. `Active`) |
| `marketingStatus` | string | e.g. `For Sale by Agent` |
| `priceRaw` | number | List price as a number |
| `priceDisplay` | string | Formatted price (e.g. `$245,000`) |
| `priceLabel` | string | Short label (e.g. `$245K`) |
| `zestimate` | number | Zillow's automated home value estimate |
| `rentZestimate` | number | Zillow's estimated monthly rental value |
| `taxAssessedValue` | number | Tax-assessed value |
| `homeType` | string | `SINGLE_FAMILY`, `CONDO`, `TOWNHOUSE`, etc. |
| `bedrooms` | number | Number of bedrooms |
| `bathrooms` | number | Number of bathrooms |
| `livingArea` | number | Living area in sq ft |
| `lotAreaValue` | number | Lot area |
| `lotAreaUnit` | string | `sqft` or `acres` |
| `daysOnZillow` | number | Days on Zillow (`-1` = unknown) |
| `listingSubType` | string | e.g. `FSBA`, `FSBO`, `NEW_HOME` |
| `brokerName` | string | Listing brokerage |
| `agentName` | string | Agent name + license string |
| `imgSrc` | string | Primary photo URL |
| `has3DModel` | boolean | 3D tour available |
| `detailUrl` | string | Full URL to the Zillow detail page |

A summary is also saved to the **Key-Value Store** under the `OUTPUT` key.

## Pricing

This actor uses **Pay-per-result** pricing — you are only charged for properties that are successfully scraped and saved to the dataset.

| Tier | Price per property |
|------|--------------------|
| Default | $0.004 |

You will never be charged more than your configured budget. The budget guard runs before scraping starts and caps `maxResults` to what your budget can afford.

## Resume / fault tolerance

If the actor is interrupted (crash, migration, manual abort), it saves its progress to the Key-Value Store. Re-running or resurrecting the actor will **automatically resume from where it left off** — already-completed URLs are skipped and in-progress URLs continue from the last saved page.

## Limitations

- Zillow's API returns a **maximum of 500 results per page** and **up to ~20 pages** for most searches (≈ 10,000 results). For larger areas, narrow your search with filters or split into multiple smaller region URLs.
- **Detail page data** (full description, school info, price history) is not fetched — the actor uses the search API only. This keeps it fast and low-cost.
- Zillow's bot detection is aggressive. Without residential proxies, you will encounter `403` errors.

## Debug logging

Set the `APIFY_LOG_LEVEL` environment variable to `DEBUG` to see full request/response details, proxy URLs, and pagination internals. At `INFO` (the default), only user-facing progress is logged.
