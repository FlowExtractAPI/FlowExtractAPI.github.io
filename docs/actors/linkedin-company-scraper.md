# 🏢 LinkedIn Company Scraper — Bulk Company Data, FREE TO USE

**[LinkedIn Company Scraper](https://apify.com/dz_omar/linkedin-company-scraper?fpr=smcx63)** extracts full company profiles from LinkedIn — in bulk, in a single run. Paste a list of company URLs (or just their slugs) and get one clean row per company.

**No login. No cookies. No browser extension. No per-result fee.** This actor is free — you pay only your own Apify platform usage, which works out to a fraction of a cent per company.

Perfect for **sales teams**, **recruiters**, **market researchers**, and **data engineers** who need company data at scale without paying per row.

---

## ✨ Why this one

| | 🏢 This actor | 💸 Typical paid alternatives |
|---|---|---|
| **Companies per run** | ✅ **Unlimited** — pass an array | ❌ One URL per run |
| **Cost per 1,000 companies** | ✅ **~$0.01** in platform usage | ❌ ~$5–7 in result + start fees |
| **Numbers** | ✅ Real integers — `217966` | ❌ Strings — `"217,966"` |
| **Addresses** | ✅ Split into street / city / region / postal / country | ❌ One concatenated string |
| **Specialties** | ✅ Clean list | ❌ Last item mangled to `"and Telephone Support"` |
| **Company posts** | ✅ With post ID + permalink, counts as integers | ❌ Counts as strings, no post ID |
| **Failed companies** | ✅ Delivered as a row with the reason | ❌ Silently missing |
| **Duplicate inputs** | ✅ Collapsed automatically | ❌ Charged twice |

---

## 🔗 Supported LinkedIn URL types

| Input type | Example | Status |
|---|---|---|
| **Bare slug** | `apple` | ✅ Supported |
| **Company page** | `https://www.linkedin.com/company/apple` | ✅ Supported |
| **Showcase page** | `https://www.linkedin.com/showcase/appledeveloper/` | ✅ Supported |
| **School page** | `https://www.linkedin.com/school/mit/` | ✅ Supported |
| **Country subdomain** | `https://de.linkedin.com/company/sap` | ✅ Supported |
| **With tracking params** | `https://www.linkedin.com/company/apple?trk=abc` | ✅ Supported |
| **Sub-tab URL** | `https://www.linkedin.com/company/apple/about/` | ✅ Supported |
| **Personal profile** | `https://www.linkedin.com/in/someone` | ❌ Not a company page |

> 💡 **Tip:** A spreadsheet column of plain slugs (`apple`, `microsoft`, `nvidia`) is the fastest input — no need to build URLs.

---

## 🎯 Why scrape LinkedIn company pages?

LinkedIn is the largest professional dataset in the world, and company pages are the public, structured part of it. But there is no official API for bulk company lookups, and the pages are built for humans, not spreadsheets.

Common use cases:

- **🎯 Lead generation & CRM enrichment** — turn a list of company names into industry, size, HQ, website and headcount.
- **📊 Market & competitor research** — pull a whole industry cohort in one run, then follow `similar_pages` to discover competitors you did not know to ask for.
- **🧑‍💼 Recruiting & talent mapping** — headcount, growth signals, office locations and affiliated brands.
- **💰 Investment & vendor screening** — company type, founding year, footprint and specialties side by side.
- **📣 Social listening** — recent company posts with reaction and comment counts, without touching the feed.
- **🔗 Data pipelines** — a stable `company_id` per company makes it a reliable join key across runs.

---

## 📦 What data does it extract?

### 🏢 Company Profile
- Company name, LinkedIn company ID, and URL slug
- Full "About us" description
- Website (LinkedIn's redirect wrapper already unwrapped)
- Industry and company type (Public Company, Privately Held, Nonprofit…)
- Founding year — as a **number**
- Self-declared specialties, as a clean list

### 📈 Size & Reach
- Employee count — as a **number**, ready to sort and aggregate
- Company size band (e.g. `10,001+ employees`)
- Follower count — as a **number**

### 📍 Locations
- Headquarters line (city, region)
- Structured HQ address — street, city, region, postal code, country code
- **Every** office location LinkedIn lists, with the HQ flagged and a map link

### 🖼️ Media
- Company logo URL
- Cover / banner image URL

### 👥 People & Related Pages
- Employee listing — name, profile URL, photo
- Similar companies — name, LinkedIn URL, industry, location, logo
- Affiliated & showcase pages belonging to the same organization

### 📣 Company Posts
- Post ID and permalink
- Full post text, with paragraph breaks preserved
- Reaction count, reaction types, comment count
- Attached images and a video flag

### 🧾 Run Metadata
- `input_url` — exactly what you supplied, so rows match back to your source list
- `scraped_at` — ISO 8601 timestamp
- `success` / `error_type` / `error_message`

---

## ⚙️ How to use LinkedIn Company Scraper

### Input Options

#### `companyUrls` (Array — **required**)

The companies to scrape. Mix URL formats and bare slugs freely — duplicates are collapsed automatically, so the same company is never fetched twice.

```json
{
    "companyUrls": [
        "https://www.linkedin.com/company/apple",
        "https://www.linkedin.com/company/microsoft",
        "https://de.linkedin.com/company/sap",
        "nvidia"
    ]
}
```

---

#### `concurrency` (Integer — optional)

How many companies to fetch in parallel.

- **Default**: `5`
- **Range**: `1`–`10`
- Higher is faster on long lists; lower is gentler on your proxy budget.

```json
{
    "companyUrls": ["apple", "microsoft", "google"],
    "concurrency": 8
}
```

---

#### `includeEmployees` (Boolean — optional)

Include the employee listing shown on the company page.

- **Default**: `true`

> ℹ️ LinkedIn anonymizes some employees on public company pages. Those rows come back with `is_anonymized: true` and a `null` name — the placeholder text is never passed off as a real person's name.

---

#### `includeSimilarPages` (Boolean — optional)

Include the "similar companies" LinkedIn recommends. Useful for competitor discovery.

- **Default**: `true`

---

#### `includeAffiliatedPages` (Boolean — optional)

Include affiliated / showcase pages belonging to the same organization.

- **Default**: `true`

```json
{
    "companyUrls": ["apple", "microsoft"],
    "includeEmployees": false,
    "includeSimilarPages": false,
    "includeAffiliatedPages": false
}
```

> 💡 Turning these three off gives you a lean, flat, spreadsheet-friendly row per company.

---

## 📊 Sample Output

Each dataset item is one company.

```json
{
    "company_id": "162479",
    "universal_name_id": "apple",
    "company_name": "Apple",
    "description": "We're a diverse collective of thinkers and doers, continually reimagining what's possible…",
    "website": "http://www.apple.com/careers",
    "industry": "Computers and Electronics Manufacturing",
    "company_type": "Public Company",
    "founded_year": 1976,
    "specialties": [
        "Innovative Product Development",
        "World-Class Operations",
        "Retail",
        "Telephone Support"
    ],
    "employee_count": 217966,
    "employee_count_range": "10,001+ employees",
    "followers": 18407827,
    "headquarters": "Cupertino, California",
    "hq_address": {
        "street": "1 Apple Park Way",
        "city": "Cupertino",
        "region": "California",
        "postal_code": "95014",
        "country_code": "US"
    },
    "locations": [
        {
            "address": "1 Apple Park Way Cupertino, California 95014, US",
            "is_primary": true,
            "map_url": "https://www.bing.com/maps?where=1+Apple+Park+Way+Cupertino+95014+California+US"
        }
    ],
    "logo_url": "https://media.licdn.com/dms/image/v2/.../apple_logo",
    "cover_image_url": "https://media.licdn.com/dms/image/v2/.../apple_cover",
    "employees": [
        {
            "name": "Paul King",
            "profile_url": "https://www.linkedin.com/in/pdking",
            "image_url": "https://media.licdn.com/dms/image/v2/...",
            "is_anonymized": false
        }
    ],
    "updates": [],
    "similar_pages": [
        {
            "name": "Google",
            "url": "https://www.linkedin.com/company/google",
            "industry": "Software Development",
            "location": "Mountain View, CA",
            "logo_url": "https://media.licdn.com/dms/image/v2/.../google_logo"
        }
    ],
    "affiliated_pages": [
        {
            "name": "Apple Developer",
            "url": "https://www.linkedin.com/showcase/appledeveloper/",
            "industry": "Software Development",
            "location": null,
            "logo_url": "https://media.licdn.com/dms/image/v2/.../appledeveloper_logo"
        }
    ],
    "url": "https://www.linkedin.com/company/apple",
    "input_url": "apple",
    "scraped_at": "2026-09-07T19:05:24.436Z",
    "success": true,
    "error_type": null,
    "_source": "linkedin-company-scraper",
    "source_url": "https://www.linkedin.com/company/apple"
}
```

### 📣 Company post example

Companies that post publicly return their recent updates in `updates`:

```json
{
    "post_id": "7502733677454512128",
    "activity_urn": "urn:li:activity:7502733677454512128",
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:7502733677454512128/",
    "content": "Tired of choice overload?\n\nSmart Routing takes the guesswork out by automatically matching your tasks to the right model.",
    "posted_ago": "4h",
    "reactions": 188,
    "reaction_types": ["LIKE", "INTEREST", "EMPATHY"],
    "comments": 13,
    "images": ["https://media.licdn.com/dms/image/v2/..."],
    "has_video": false
}
```

### ⚠️ Failed company example

A company that cannot be scraped is still delivered, so nothing disappears silently:

```json
{
    "universal_name_id": "example-that-404s",
    "url": "https://www.linkedin.com/company/example-that-404s",
    "input_url": "example-that-404s",
    "success": false,
    "error_type": "NOT_FOUND",
    "error_message": "Company page not found: example-that-404s",
    "scraped_at": "2026-09-07T19:05:24.436Z"
}
```

---

## ❓ Frequently Asked Questions

**Do I need a LinkedIn account or cookies?**
No. This actor only reads public company pages — no login, no cookies, no session of yours is ever involved, and your LinkedIn account is never put at risk.

**Is it really free?**
Yes. There is no per-result charge and no subscription. You pay only your own Apify platform usage. In our measured runs that came to roughly **$0.01–$0.06 per 1,000 companies**, so Apify's $5 free starting credit goes a very long way.

**How many companies can I scrape in one run?**
As many as you like — pass them all in `companyUrls`. A 40-company run finished in about 20 seconds. Very large lists are capped at 10,000 companies per run; split bigger jobs across runs.

**Why did a well-known company come back as `NOT_FOUND`?**
Its slug is probably different from what you guessed. `intel` is a 404 — the real page is `intel-corporation`; the same is true of `mongodb`, `redis`, `plaid` and others. Copy the URL from LinkedIn rather than guessing, and watch the ⚠️ Failed Companies view for these.

**Why are some employees unnamed?**
LinkedIn itself withholds some identities on public company pages. Those rows carry `is_anonymized: true` with a `null` name and profile URL, so you can tell "LinkedIn hid this" apart from "the scraper missed it". The actor already retries to land on the variant that names them.

**Why is `founded_year` / `specialties` / `cover_image_url` empty for some companies?**
Because the company did not publish it. These are genuinely optional on LinkedIn — roughly a third of company pages omit a founding year, and most have no cover image. Empty means absent at the source, not a scraping failure.

**Can I get employee job titles?**
Not from the public company page — LinkedIn no longer renders them there. You get name, profile URL and photo.

**Can I scrape showcase and school pages?**
Yes. `linkedin.com/showcase/...` and `linkedin.com/school/...` both work and return the same record shape.

**Will duplicates in my list cost me twice?**
No. `apple`, `https://www.linkedin.com/company/apple` and `https://fr.linkedin.com/company/APPLE?trk=x` are recognised as the same company and fetched once.

**What if I paste a personal profile by mistake?**
It is skipped with a clear warning naming the reason, and the rest of the run continues normally.

---

## 📋 Dataset Views

The output ships with five ready-made views, so you can jump straight to the columns you need:

| View | What it shows |
|---|---|
| 🏢 **Company Overview** | Name, industry, type, size, followers, HQ, website |
| 📝 **Full Profile** | Description, specialties, split address, all locations, imagery |
| 📣 **Company Posts** | Recent posts with reactions and comments |
| 🌐 **People & Related Pages** | Employees, similar companies, affiliated pages |
| ⚠️ **Failed Companies** | Anything that could not be scraped, and why |

---

## 🤝 Support & Resources

### Get Help

- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: [flowextractapi@outlook.com](mailto:flowextractapi@outlook.com)
- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)

### Social Media

- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok**: [@flowextractapi](https://www.tiktok.com/@flowextractapi)

---

## 🌟 Related Actors by FlowExtract API

### 📱 Social Media
- **[LinkedIn Ads Scraper](https://apify.com/dz_omar/linkedin-ads-scraper?fpr=smcx63)** — LinkedIn ad library extraction
- **[Facebook Comment Scraper](https://apify.com/dz_omar/facebook-comment-scraper?fpr=smcx63)** — Comments and replies from any public post
- **[Facebook Ads Scraper Pro](https://apify.com/dz_omar/facebook-ads-scraper-pro?fpr=smcx63)** — Extract Facebook ads data
- **[Instagram Comment Scraper](https://apify.com/dz_omar/instagram-comment-scraper?fpr=smcx63)** — Instagram comments, free to use
- **[YouTube Comments Scraper](https://apify.com/dz_omar/youtube-comments-scraper?fpr=smcx63)** — Full comment threads

### 🎬 Video & Media
- **[YouTube Scraper Pro](https://apify.com/dz_omar/Youtube-Scraper-Pro?fpr=smcx63)** — Channels, playlists, Shorts and live
- **[YouTube Transcript Extractor](https://apify.com/dz_omar/youtube-transcript-metadata-extractor?fpr=smcx63)** — Transcripts with timestamps
- **[Zoom Scraper](https://apify.com/dz_omar/zoom-scraper?fpr=smcx63)** — Download recordings and transcripts
- **[Loom Scraper](https://apify.com/dz_omar/loom-video-scraper?fpr=smcx63)** — Loom video and transcript extraction

### 🏠 Real Estate
- **[Zillow Scraper](https://apify.com/dz_omar/zillow-scraper?fpr=smcx63)** — US listings, free to use
- **[Idealista Scraper API](https://apify.com/dz_omar/idealista-scraper-api?fpr=smcx63)** — Spanish property data with API
- **[domain.com.au Scraper](https://apify.com/dz_omar/domain-scraper?fpr=smcx63)** — Australian property listings
- **[ImmoScout24 Scraper](https://apify.com/dz_omar/immobilienscout24-scraper?fpr=smcx63)** — German property listings

### 🛠️ Developer Tools
- **[Ultimate Screenshot](https://apify.com/dz_omar/ultimate-screenshot?fpr=smcx63)** — Advanced screenshot tool
- **[AI Scraper](https://apify.com/dz_omar/ai-lead-extractor?fpr=smcx63)** — AI-powered extraction from any page
- **[Network Security Scanner](https://apify.com/dz_omar/network-security-scanner?fpr=smcx63)** — Security vulnerability scanner

---

### **⚖️ Legal & Compliance**
- **Public Data Access**: Only processes publicly available LinkedIn company pages — no login, no cookies, no account access
- **Rate Limiting**: Respects LinkedIn's service limits and terms of use
- **Data Protection**: No storage of personal information or unauthorized data collection
- **Commercial Use**: Suitable for business intelligence and research applications
- **No affiliation** with or endorsement by LinkedIn is implied

*LinkedIn Company Scraper — by FlowExtract API. Turn any website into structured data.*
