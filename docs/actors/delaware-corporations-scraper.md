## What is Delaware Business Search?

**[Delaware Business Search](https://apify.com/dz_omar/delaware-corporations-scraper?fpr=smcx63)** looks up companies in the **official Delaware Division of Corporations registry** — the state where most large US companies are incorporated — and returns each entity as clean, structured data. Paste in company names, Delaware file numbers, or both, and get back every match with its **formation date, entity type and registered agent** (name, street address, county, ZIP code and phone).

It is built for **KYB and compliance teams**, **lead generation and sales research**, **legal and service-of-process work**, and **data teams** who need Delaware company records in bulk instead of one search at a time on the state website.

- 🔎 **Bulk lookup** — any number of names and file numbers in one run, in one list
- 🏛️ **Registered agent details** — agent name, full address, county and phone for every entity
- 📅 **Formation data** — incorporation or formation date (also as an ISO date), entity kind, type, residency and state of formation
- 🎯 **Exact or prefix matching** — find every company starting with a name, or exactly one entity
- ✅ **Complete rows** — each record says whether its details were included, so nothing is silently missing

Because it runs on Apify, you also get **API access**, **scheduling** (re-check a watchlist every week), **integrations** with Make, Zapier, Google Sheets, Slack and webhooks, and exports to **JSON, CSV and Excel**. A single file-number lookup with details costs well under one cent.

### What data can you extract from the Delaware registry?

| Group | Fields |
|---|---|
| 🆔 Identity | file number, entity name |
| 📅 Formation | formation date (as shown and as ISO `YYYY-MM-DD`), entity kind (Corporation, Limited Liability Company, Limited Partnership…), entity type (General, Close, Non-Profit…), residency (Domestic / Foreign), state of formation |
| 🏛️ Registered agent | name, street address, city, county, state, ZIP code, phone |
| 🧭 Context | the search term that found the entity, search type, whether the registry's 50-match limit was reached, detail status, source page, time of extraction |

The registry sells an entity's **current status, franchise tax and filing history** separately (from $10 per entity on the state website), so those fields are not part of the public record this Actor returns.

## How to search Delaware business entities

1. Click **Try** to open the Actor in Apify Console (or add it to your account).
2. In **Entity names or file numbers**, enter one search per line:
   - a company name such as `Acme Aero` — finds every entity whose name **starts with** it;
   - a name in quotes such as `"Acme Aero LLC"` — finds that exact entity only;
   - a Delaware file number such as `7053653` — returns that one entity.
3. *(Optional)* Turn on **Exact name match** to treat every name as an exact name.
4. *(Optional)* Turn off **Include entity details** if you only need file numbers and names — faster and cheaper.
5. Set **Maximum entities** to cap the run (0 = no limit), then click **Start**.
6. Download the results from the **Output** tab as JSON, CSV or Excel, or fetch them over the API.

> 💡 The registry shows at most **50 matches per name search**. When a name hits that limit, the rows carry `registry_limit_reached: true` and the run log says so — use a longer name, quotes, or file numbers to reach the rest.

## How much does it cost to search Delaware companies?

This Actor uses **pay-per-event** pricing: you pay for searches and entities delivered, not for compute time.

| Event | FREE | BRONZE | SILVER | GOLD |
|---|---|---|---|---|
| Run start (per GB of memory; the default counts as one) | $0.003 | $0.0025 | $0.002 | $0.002 |
| Search completed (per name or file number) | $0.001 | $0.0009 | $0.0008 | $0.0007 |
| Entity found (file number + name) | $0.0005 | $0.00045 | $0.0004 | $0.00035 |
| Entity details add-on (formation + registered agent) | $0.0015 | $0.00135 | $0.0012 | $0.00105 |

**Example costs on the FREE plan:**

- One file-number lookup with details: $0.003 + $0.001 + $0.002 = **$0.006**
- 100 entities with details from 2 name searches: $0.003 + $0.002 + 100 × $0.002 = **$0.205**
- 1,000 entities with details from 50 searches: about **$2.05**
- 1,000 entities without details: about **$0.55**

Details are only charged when they were actually read. Set **Max cost per run** in the run options and the Actor stops cleanly at that budget.

## Input and output examples

### Input

```json
{
    "searchTerms": ["Acme Aero", "\"Acme Anvils, LLC\"", "4578811"],
    "exactMatch": false,
    "includeDetails": true,
    "maxResults": 50
}
```

### Output

One record per entity (real output):

```json
{
    "file_number": "4578811",
    "entity_name": "ACME123SPORTS INC.",
    "incorporation_date": "7/23/2008",
    "incorporation_date_iso": "2008-07-23",
    "entity_kind": "Corporation",
    "entity_type": "General",
    "residency": "Domestic",
    "state_of_formation": "Delaware",
    "registered_agent_name": "CORPORATION SERVICE COMPANY",
    "registered_agent_address": "251 LITTLE FALLS DRIVE",
    "registered_agent_city": "WILMINGTON",
    "registered_agent_county": "New Castle",
    "registered_agent_state": "DE",
    "registered_agent_postal_code": "19808",
    "registered_agent_phone": "302-636-5401",
    "detail_status": "ok",
    "search_term": "acme",
    "search_type": "name",
    "registry_limit_reached": true,
    "source_url": "https://icis.corp.delaware.gov/ecorp/entitysearch/NameSearch.aspx",
    "scraped_at": "2026-10-21T20:02:56.078Z"
}
```

A search that matches nothing adds one `{"type": "not_found", "search_term": "…"}` row, so every term you entered is accounted for. The Output tab has three views: **Entities**, **Registered agents** and **All fields**.

## Other business registry Actors

- **[California Business & UCC Lien Search](https://apify.com/dz_omar/california-bizfile-scraper?fpr=smcx63)** — the California Secretary of State registers: entity status, standing and registered agent, plus UCC liens and tax liens, with type, status and date filters.

## FAQ

### Do I need a Delaware account or API key?

No. The Actor reads the public registry search. You only need an Apify account.

### Does it return company status or good standing?

No. Delaware sells status ($10) and status with franchise tax and filing history ($20) per entity on its own website; they are not part of the public record. The Actor returns everything the public record shows: formation date, entity kind and type, residency, state of formation and the registered agent.

### Why do I get only 50 results for a name?

The registry itself shows at most 50 matches per name search. Records from such a search are marked `registry_limit_reached: true`. Narrow the name (for example `Acme Aero` instead of `Acme`), put an exact name in quotes, or search by file number.

### How does name matching work?

A name matches every entity whose name **starts with** it, ignoring spaces and punctuation — `Acme Aero` finds ACME AERO LLC, ACME AEROPLANE INC. and ACME AEROSPACE, INC. Put the name in quotes, or turn on **Exact name match**, to get one exact entity.

### Can I mix company names and file numbers in one run?

Yes. Any line made only of digits is treated as a Delaware file number; everything else is a name. Duplicates across lines are delivered once.

### What does `detail_status` mean?

`ok` — details included. `not_requested` — you turned details off. `restricted` — the registry does not show this entity's details online. `unavailable` — the details could not be read during this run (the entity is still delivered with its file number and name, and the details add-on is not charged).

### Can I use it through the API or on a schedule?

Yes. Start runs from the Apify API, any Apify client, Make, Zapier or n8n, and schedule them in Apify Console — for example a weekly re-check of a list of file numbers.

### What happens if a run stops part-way?

Every entity is saved the moment it is read, and the run status message says what happened. If the platform restarts a run, already-delivered entities are not delivered or charged again.

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
- No affiliation with or endorsement by the Delaware Division of Corporations is implied.

---

*Delaware Business Search — by FlowExtract API. Turn any website into structured data.*
