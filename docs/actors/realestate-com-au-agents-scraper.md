# 🧑‍💼 realestate.com.au Agents & Agencies Scraper

**[realestate.com.au Agents & Agencies Scraper](https://apify.com/dz_omar/realestate-com-au-agents-scraper?fpr=smcx63)** turns a suburb, a postcode, or any realestate.com.au search URL into a clean, structured directory of **real estate agents and agencies** — with the contact details and performance signals you need for lead lists and market research.

Every agent record carries their **email and phone**, the agency they work for, how many properties they currently have for sale and for rent, how many they've recently sold, their **median sold price**, and the suburbs they're active in. Every agency record carries its contacts, its team roster, and its listing counts.

Perfect for **real estate CRMs and lead generation**, **recruiters** shortlisting top producers, **proptech and portals** building agent databases, and **market researchers** mapping who is active where.

---

## Why scrape realestate.com.au agents?

realestate.com.au is Australia's largest property portal. Behind every listing is the agent and agency marketing it — which makes it the most complete public picture of who is actively selling and leasing in any suburb, right now.

Common use cases:

- **Lead generation** — build a contact list of agents actively listing in your target suburbs, with email and phone on every row.
- **Recruitment & talent scouting** — rank agents by properties sold, median sold price, and days on market, then reach out.
- **CRM enrichment** — match agents and agencies to their current activity and contact details.
- **Agency intelligence** — pull a whole agency's team roster and its for-sale / for-rent / sold counts.
- **Market mapping** — see which agents and agencies dominate a suburb or region.

---

## What data does it extract?

### 🧑‍💼 Agent records

| Field | Description |
|---|---|
| `name`, `jobTitle` | Agent name and role |
| `email`, `emails` | Primary email plus every published email address |
| `phone`, `mobile`, `officePhone` | Contact numbers |
| `agency` | The agent's agency: name, phone, email, website, address, profile link, logo |
| `stats.listingsForSale` / `listingsForRent` / `recentlySold` | Current and recent activity counts |
| `stats.medianSoldPrice` | Median of the agent's recent sold prices (AUD) |
| `stats.lastSoldDate` | Date of their most recent sale |
| `stats.activeSuburbs` | Suburbs the agent is currently active in |
| `stats.propertyTypes` | Property types they handle |
| `profileUrl`, `photo` | realestate.com.au profile link and headshot |
| `sampleListings` | A few of the agent's current/recent listings for context |

### 🏢 Agency records (optional)

Name, email(s), phone, website, office address, suburb/state/postcode, profile link, logo, the **full team roster** of agents seen, an `agentCount`, and listing counts (for sale / for rent / sold) with a median sold price.

---

## ⚙️ How to use

### Mode: **By location**

List one or more areas as `Suburb, STATE, Postcode` (postcode optional):

```json
{
  "mode": "location",
  "locations": ["Sydney, NSW, 2000", "Richmond, VIC, 3121"],
  "channels": ["buy", "rent", "sold"],
  "includeAgencies": true,
  "maxAgents": 50
}
```

### Mode: **By search URL**

Paste realestate.com.au search URLs straight from your browser — every agent and agency in those results is returned:

```json
{
  "mode": "url",
  "startUrls": [
    { "url": "https://www.realestate.com.au/buy/in-sydney,+nsw+2000/list-1" }
  ],
  "maxAgents": 100
}
```

### Input options

| Option | Description |
|---|---|
| **Mode** | `location` (list suburbs) or `url` (paste search URLs). Fields for the other mode are ignored. |
| **Locations** | location mode — areas as `Suburb, STATE, Postcode`. |
| **Listing types to search** | location mode — `buy`, `rent`, `sold` (default all). `sold` adds real sold-price stats. |
| **Include surrounding suburbs** | location mode — also include neighbouring suburbs. |
| **Search URLs** | url mode — realestate.com.au search URLs. |
| **Also return agencies** | Emit one record per agency, with its team roster and counts. |
| **Max agents** | Stop after this many agents (`0` = all found). Agencies are returned in addition. |
| **Max pages per search** | How deep to scan each search while discovering agents (more = more agents and better stats in big suburbs). |

---

## How agents and their stats are built

The actor walks the live listings for your locations (or URLs) across the buy, rent, and sold channels, and assembles one record per agent and per agency from the people marketing those properties. An agent's counts, median sold price, and active suburbs are computed from the listings scanned in that run — so scanning more pages (higher **Max pages per search**) yields richer stats in large suburbs. Each agent and each agency is returned, and charged, only once per run, even when they appear on many listings.

realestate.com.au serves at most 2,000 results per search; for very large areas, split them by suburb or add more specific URLs.

---

## 💵 Pricing

This Actor uses **pay-per-event** pricing:

- **Agent record** — charged once per agent returned.
- **Agency record** — charged once per agency returned (only when *Also return agencies* is on).

You can see current per-tier rates on the Actor's **Pricing** tab, and cap any run with the **maximum cost per run** setting.

---

## 📤 Output example

```json
{
  "recordType": "agent",
  "agentId": "2884534",
  "name": "Sample Agent",
  "jobTitle": "Director/Sales Agent",
  "email": "agent@example-realty.com.au",
  "emails": ["agent@example-realty.com.au", "capture@example-realty.agentboxmail.com.au"],
  "phone": "0400000000",
  "mobile": "0400000000",
  "officePhone": "03 0000 0000",
  "agency": {
    "id": "AAA000",
    "name": "Example Realty",
    "phone": "03 0000 0000",
    "email": "office@example-realty.com.au",
    "website": "https://www.example-realty.com.au",
    "address": "1 High Street, Sampletown, VIC 3000",
    "profileUrl": "https://www.realestate.com.au/agency/example-realty-AAA000",
    "logo": "https://.../logo.jpg"
  },
  "stats": {
    "listingsForSale": 21,
    "listingsForRent": 0,
    "recentlySold": 30,
    "totalListings": 51,
    "medianSoldPrice": 675000,
    "lastSoldDate": "2026-09-16",
    "activeSuburbs": ["Sampletown"],
    "propertyTypes": ["house", "unit"]
  },
  "profileUrl": "https://www.realestate.com.au/agent/2884534",
  "source": "realestate.com.au",
  "scrapedAt": "2026-01-01T00:00:00.000Z"
}
```

Values above are illustrative placeholders, not a real record.

---

## 🧭 Tips & limits

| Situation | What you see | What to do |
|---|---|---|
| A pasted URL isn't a recognized realestate.com.au URL | It's skipped with a note in the run log | Copy the URL directly from your browser |
| A location entry can't be read | It's skipped with a note in the run log | Use the `Suburb, STATE, Postcode` form |
| A suburb has fewer agents than `Max agents` | You get all the agents found | Add more suburbs/URLs, or raise *Max pages per search* |
| Nothing usable in the input | A single guidance item in the dataset | Add a location or a search URL |

---

## 🌟 Related Actors

- **[realestate.com.au Scraper](https://apify.com/dz_omar/realestate-com-au-scraper?fpr=smcx63)** — the property listings behind these agents (buy, rent, sold) with full details
- **[domain.com.au Scraper](https://apify.com/dz_omar/domain-scraper?fpr=smcx63)** — Australia's #2 property portal: listings, agents and contacts

---

## Support

- 🙋 **Apify Profile**: [FlowExtract API](https://apify.com/dz_omar?fpr=smcx63)
- 🌐 **Website**: [flowextractapi.com](https://flowextractapi.com)
- 📧 **Email**: flowextractapi@outlook.com
- 💬 **GitHub**: [FlowExtractAPI](https://github.com/FlowExtractAPI)
- 💼 **LinkedIn**: [flowextract-api](https://www.linkedin.com/in/flowextract-api/)
- 🐦 **X**: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 📱 **Facebook**: [flowextractapi](https://www.facebook.com/flowextractapi)
- 🎵 **TikTok**: [@flowextractapi](https://www.tiktok.com/@flowextractapi)

---

## Legal & compliance

- Extracts **publicly available agent and agency data only** — the same information any visitor sees without logging in.
- Respects the source site's rate limits and terms; built for research and analysis, not for overwhelming the site.
- No storage of personal information by the actor beyond your own run's dataset.
- Suitable for commercial use. You are responsible for using extracted contact details lawfully (e.g. the Australian Privacy Act and Spam Act) — no spam or unsolicited bulk outreach.
- No affiliation with or endorsement by realestate.com.au or REA Group is implied.

---

*realestate.com.au Agents & Agencies Scraper — by FlowExtract API. Turn any website into structured data.*
