# 🔍 Google Ads Intelligence Scraper

**Uncover competitor advertising strategies and monitor campaigns across every Google surface  pulled straight from Google's own Ads Transparency Center.**

Search by direct URL, or run keyword / advertiser / domain searches across general commercial ads and political & election ads. Get creative previews, delivery regions, and  with one toggle  spend ranges, impression estimates, first/last-shown dates, and (for political ads) demographic targeting.

---

## 🎯 What You Can Extract

### Complete Ad Intelligence
- **Ad Creatives**  preview URLs for video, image, and text ad formats
- **Advertiser Information**  advertiser ID, advertiser name, domain, direct transparency URLs
- **Delivery Data**  regions and countries where each ad ran
- **Performance Ranges**  impression and spend estimates (when Fetch Full Ad Details is on)
- **Timing**  first/last shown dates and total days active
- **Political Ad Targeting**  included/excluded age, gender, and location targeting for election ads

### Two Levels of Detail, Your Choice
Every search  URL, General, or Political  respects one shared switch, **Fetch Full Ad Details**:
- **Off** (default): the fast path  advertiser, creative, format, and preview URLs, one request per ad.
- **On**: the complete picture  everything above, plus spend range, impression range, first/last shown dates, delivery countries, regional breakdowns, and (political ads only) demographic targeting.

---

## 🔎 Three Ways to Search

### 1. Search by URL
Paste any Google Ads Transparency Center link  every filter already baked into that URL (advertiser, region, date range, format) is respected automatically.

```json
{
  "adUrls": [
    { "url": "https://adstransparency.google.com/advertiser/AR04619580580634296321" }
  ],
  "fetchAdDetail": true
}
```

### 2. General Ad Search
Search everyday commercial advertising by advertiser name, advertiser ID, or domain  filtered by platform, format, region, and date range.

```json
{
  "generalAdSearch": [
    {
      "searchTargets": "nike",
      "maxAdvertiserAccounts": 3,
      "targetPlatform": "YOUTUBE",
      "adFormatType": "VIDEO",
      "timeRangePreset": "LAST_30_DAYS"
    }
  ],
  "maxResults": 20
}
```

### 3. Political & Election Ads
A dedicated mode for political advertising, with the spend-range, impression-range, and demographic filters Google's Ads Transparency Center reserves specifically for Restricted Content. A target region is required, since verification and disclosure rules vary by country.

```json
{
  "politicalAdSearch": [
    {
      "searchTargets": "AR17672453691778531329",
      "geoTargetRegion": "United States",
      "impressionsRange": "100K_250K",
      "amountSpentRange": "10K_50K"
    }
  ],
  "fetchAdDetail": true
}
```

All three sections can be combined in a single run  they're processed independently, and results from every section land in the same dataset.

---

## 📥 Input Reference

| Field | Type | Applies to | Description |
|---|---|---|---|
| **📊 maxResults** | `integer` | All searches | Max ads per search  per URL, and per entry in General/Political search. `0` = unlimited. Default: `10`. |
| **🔍 fetchAdDetail** | `boolean` | All searches | Off = fast summary results. On = full detail (spend, impressions, dates, demographics). Default: `false`. |
| **🔗 adUrls** | `array` | Search by URL | One or more full Ads Transparency Center URLs. |
| **🔎 generalAdSearch** | `array` | General search | `searchTargets` (name/ID/domain), plus `maxAdvertiserAccounts`, `maxDomainMatches`, `targetPlatform`, `adFormatType`, `geoTargetRegion`, `timeRangePreset` / `customStartDate` / `customEndDate`. |
| **🗳️ politicalAdSearch** | `array` | Political search | `searchTargets` and `geoTargetRegion` (both required), plus `maxAdvertiserAccounts`, `impressionsRange`, `amountSpentRange`, `targetPlatform`, `adFormatType`, `sortOrder`, date filters. |
| **🍪 cookie** | `string` (secret) | All searches | Optional. Log in with your own Google account to lift the result cap anonymous requests hit. Encrypted and masked by Apify once saved  see the field description in the input editor for the step-by-step setup. |

---

## 🔐 Authentication

Google doesn't require an account to browse the Ads Transparency Center, so this actor works anonymously out of the box. Logging in is optional and only needed to raise the per-advertiser result cap.

| Priority | Method | When to use |
|---|---|---|
| 1 | **None (anonymous)** | Default. Works immediately, no setup  capped at roughly 100–200 ads per advertiser by Google. |
| 2 | **`cookie` field** | When you need more than the anonymous cap. Paste your exported Google session cookie  see that field's description in the input editor for the exact export steps. |

> ⚠️ Authenticating uses your real Google account's live session. We recommend using a secondary account with no important personal or business data on it, rather than your primary account.

---

## 📤 Output Structure

Results land in the default dataset with two views in the Output tab  **Ads Overview** (quick scan) and **Detailed Data** (full picture, populated when Fetch Full Ad Details is on).

### Example  Fetch Full Ad Details: Off
```json
{
  "advertiserId": "AR04619580580634296321",
  "creativeId": "CR14567271621866815489",
  "advertiserName": "Nike",
  "domain": "nike.com",
  "format": "VIDEO",
  "adTransparencyUrl": "https://adstransparency.google.com/advertiser/AR04619580580634296321/creative/CR14567271621866815489?region=anywhere",
  "previewUrls": [
    "https://displayads-formats.googleusercontent.com/ads/preview/content.js?client=ads-integrity..."
  ],
  "source_url": "https://adstransparency.google.com/advertiser/AR04619580580634296321",
  "_source": "google_ads_scraper"
}
```

### Example  Fetch Full Ad Details: On
```json
{
  "advertiserId": "AR04619580580634296321",
  "creativeId": "CR14567271621866815489",
  "advertiserName": "Nike",
  "domain": "nike.com",
  "format": "VIDEO",
  "adTransparencyUrl": "https://adstransparency.google.com/advertiser/AR04619580580634296321/creative/CR14567271621866815489?region=anywhere",
  "previewUrls": ["https://displayads-formats.googleusercontent.com/ads/preview/content.js?..."],
  "creativeRegions": ["United States", "Canada", "United Kingdom"],
  "countries": ["US", "CA", "GB"],
  "firstShown": "2026-06-01T09:12:00-07:00",
  "lastShown": "2026-06-25T07:53:00-07:00",
  "daysRan": 24,
  "totalImpressions": { "lowerBound": 100000, "upperBound": 250000 },
  "totalAmountSpent": [{ "currency": "USD", "lowerBound": 10000, "upperBound": 50000 }],
  "demographics": null,
  "regionStats": [
    {
      "regionCode": "US",
      "regionName": "United States",
      "impressions": { "lowerBound": 80000, "upperBound": 200000 },
      "platformStats": [
        { "surfaceName": "YouTube", "impressions": { "lowerBound": 60000, "upperBound": 150000 } }
      ]
    }
  ],
  "source_url": "https://adstransparency.google.com/advertiser/AR04619580580634296321",
  "_source": "google_ads_scraper"
}
```

`demographics` is populated for political/election ads with targeting configured, and looks like:
```json
"demographics": {
  "age": { "included": ["25 to 34", "35 to 44"], "excluded": [] },
  "gender": { "included": ["Female"], "excluded": [] },
  "location": { "included": ["California", "Texas"], "excluded": ["New York"] }
}
```

---

## ❓ Frequently Asked Questions

**Do I need a Google account to use this actor?**
No. It works anonymously out of the box. A Google account (via the optional `cookie` field) is only needed if you want to lift the ~100–200 result cap Google applies to anonymous requests.

**How many ads can I extract for free?**
Apify's $5/month free usage credit covers roughly 500 ad creatives on the FREE pricing tier (at $0.01 each)  see Pricing below.

**Can I search multiple advertisers or URLs in one run?**
Yes  `adUrls`, `generalAdSearch`, and `politicalAdSearch` all accept arrays, and all three can be combined in a single run.

**Can I search political and election ads specifically?**
Yes  use `politicalAdSearch`. It exposes the spend-range, impression-range, and demographic-targeting filters specific to Google's Restricted Content (political) ad transparency reporting.

**What happens if one of my search values is invalid or unsupported?**
The run doesn't stop. The invalid value is skipped, logged, and recorded as an error item in your results  every other search target in the same run still completes.

**Does this actor need a proxy set up manually?**
No  Apify Proxy is used automatically for every run. See Proxy Support below for how paid vs. free runs are routed.

---

## 🛡️ Built for Reliability

- **Automatic proxy routing**  paying users are routed through a dedicated proxy network for faster, more consistent runs, with automatic fallback so a run never stalls on a single bad connection.
- **Never fails on one bad input**  invalid or unsupported search values are logged and skipped, with an error record added to your results, instead of stopping the whole run.
- **Optional authenticated access**  the `cookie` field lets you log in with your own Google account to retrieve significantly more ads per advertiser than an anonymous run.
- **Verified against the real thing**  every output field, including political-ad demographic targeting, was checked against real advertiser creatives and cross-referenced directly against Google's own Ads Transparency Center pages.

---

## 🎯 Professional Use Cases

### Competitive Intelligence
Track competitor advertising strategies, study successful creative formats and messaging, and gauge spend based on impression data.

### Market & Political Research
Analyze advertising patterns in your industry, or track political/election ad spend, reach, and demographic targeting by region.

### Media & Campaign Planning
Data-driven decisions on platform selection (YouTube vs. Search vs. Shopping), geographic targeting, and creative direction based on what's already running.

### Business Intelligence
Brand monitoring, partnership discovery, and market-entry research based on real, current advertising activity.

---

## 💰 Pricing

This actor charges per **successfully extracted ad creative**  you're only billed for ads actually delivered, not for search attempts.

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Successful ad creative | $0.01 | $0.006 | $0.004 | $0.002 |

**Cost estimate examples:**
- Extracting **1,000 ads** on the FREE plan: ~$10.00
- Extracting **1,000 ads** on the GOLD plan: ~$2.00

> 💡 Tip: Set `maxResults` to a small number like `10` first to confirm your search returns what you expect before running a full extraction.

---

## 🔌 API Integration

#### Python
```python
from apify_client import ApifyClient

client = ApifyClient("YOUR_API_TOKEN")
run = client.actor("dz_omar/google-ads-scraper").call(
    run_input={
        "generalAdSearch": [{"searchTargets": "nike", "maxAdvertiserAccounts": 3}],
        "maxResults": 20
    }
)

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
```

#### JavaScript
```javascript
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: 'YOUR_API_TOKEN' });
const run = await client.actor("dz_omar/google-ads-scraper").call({
    generalAdSearch: [{ searchTargets: "nike", maxAdvertiserAccounts: 3 }],
    maxResults: 20
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

### Existing integrations keep working
If your workflow already sends the older flat input shape (`searchTargets`, `resultsPerQuery`, `politicalAdsMode`), it continues to be accepted  no changes required on your end. New integrations should use `adUrls` / `generalAdSearch` / `politicalAdSearch` above, which offer more filters and clearer structure.

---

## 🛡️ Legal & Compliance

This actor extracts advertising data made **publicly available** by Google's own Ads Transparency Center, in support of Google's advertising transparency initiatives.

- ✅ Anonymous scraping accesses only publicly available data
- ⚠️ The optional `cookie` field authenticates as your own Google account  we recommend a secondary account with no important personal or business data on it, and review Google's Terms of Service for your use case
- ⚠️ Ensure your use complies with applicable data protection laws (GDPR, CCPA, etc.)

**Recommended use:** competitive analysis and market research, academic research on advertising trends, and transparency/accountability journalism.

---

## 🌐 Proxy Support

| User tier | Proxy used |
|---|---|
| 💎 Paying | Dedicated proxy network  faster, more reliable, with automatic fallback |
| 🆓 Free | Apify Proxy  built-in, automatic |

If the dedicated network is ever unavailable, paying runs fall back to Apify Proxy automatically  a run never fails outright because of a proxy issue.

---

## 🚫 Error Handling

| Situation | What you see | What to do |
|---|---|---|
| No results for a valid advertiser/URL | Empty dataset, no error | Try removing region/date filters; confirm the ad exists on Ads Transparency Center manually |
| Political search missing region | Validation error before the run starts | Set `geoTargetRegion`  it's required for `politicalAdSearch` |
| Fewer results than expected | Results stop around 100–200 ads per advertiser | Use the optional `cookie` field to lift Google's anonymous-request cap |
| Unsupported legacy `searchTargets` value | `error: true` item in your dataset, run continues | Migrate that entry to `adUrls` (URL-only)  see the item's `reason` field for detail |
| Proxy-related failures | Rare  handled automatically | No action needed; paying runs fall back to Apify Proxy automatically |

---

## 🌟 Related Actors by [FlowExtractAPI](https://apify.com/dz_omar?fpr=smcx63)

### 📱 Social Media Intelligence
**[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)**
Extract Facebook advertising data for comprehensive cross-platform competitor analysis.

### 🎬 Video & Content Tools
**[YouTube Transcript & Metadata Extractor](https://apify.com/dz_omar/youtube-transcript-extractor?fpr=smcx63)**
Extract video transcripts, metadata, and analytics from YouTube content.

**[YouTube Full Channel Scraper](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)**
Complete channel, playlist, shorts, and live stream data extraction.

**[Zoom Scraper | Video & Transcript](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)**
Download Zoom recordings and extract meeting transcripts.

**[Loom Scraper | Video & Transcript](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)**
Extract Loom videos and transcripts for content analysis.

### 🏠 Real Estate Data
**[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)**
Advanced Spanish property data extraction with API access.

### 🛠️ Developer Tools
**[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)**
Professional webpage screenshots with full customization.

**[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)**
Comprehensive website security vulnerability scanning.

---

## 💬 Support & Feedback

### Need Help?

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub Issues**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **Twitter**: [@FlowExtractAPI](https://x.com/@FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)

### Found a Bug or Have a Feature Request?
Open an issue or contact us directly. We're committed to continuous improvement and responsive support.

### Rate This Actor
If you find this actor valuable, please leave a review! Your feedback helps us improve and helps others discover quality tools.

---

**Built with ❤️ by [FlowExtractAPI](https://apify.com/dz_omar?fpr=smcx63) | Powered by [Apify Platform](https://apify.com?fpr=smcx63)**