# Product Hunt Pro — Launches, Makers, Reviews & Emails

Scrape Product Hunt launches into clean, structured data: daily/weekly/monthly/yearly leaderboards, upvotes and ranks, the real company website, makers and hunters with their LinkedIn and X profiles, full review text with star ratings, launch comments, media, topics and pricing.

**Free to use — no per-result charge.**

## What makes this one different

- **The real website, every time.** The product's own website URL comes straight from Product Hunt — never guessed from a search engine, so you never get a directory or app-mirror page instead of the company.
- **Reviews done properly.** Full review text, star rating, review date and the reviewer's profile — not just a rating number.
- **Founder contact data built in.** Every maker and hunter arrives with their headline, follower count, LinkedIn and X profile. Optional email discovery reads the product's own site.
- **Fast and free.** No browser, no page rendering — so runs finish quickly and cost you nothing beyond normal Apify platform usage.
- **Built to not break.** One stable data source and automatic retries. A mistake in your input never fails the run: it finishes normally and tells you what was missing.
- **Makers, not just products.** Paste a `/@username` link to get everything a maker has launched, plus their followers and the people they follow — one row each, streamed as they are found.
- **All four search tabs.** Search launches, products, people or discussions, exactly like Product Hunt's own search page.

## Use cases

- **Lead generation** — build outreach lists of newly launched startups with founder profiles and contact details.
- **Market and competitor research** — track what launches in your category, how it ranks, and how people rate it.
- **Launch monitoring** — schedule a daily run and get every new product the moment it goes live.
- **Review and sentiment analysis** — pull real user reviews with ratings and text for any product.
- **Content and newsletters** — source the top products of any day, week, month or year.
- **AI agents and RAG pipelines** — use the "Just the essentials" output for compact, token-friendly records.

## Input

**Pick "What do you want to scrape?" first** — it decides which settings section is used. Each choice has its own section; anything belonging to the other choices is ignored, and the run log tells you so.

| Your choice | The section you fill in |
|---|---|
| 🔥 Today's launches | nothing — it just runs |
| 🏆 Leaderboard for a date | 🏆 Leaderboard settings |
| 🏷️ A topic | 🏷️ Topic settings |
| 🔍 Search by keyword | 🔎 Search settings |
| 🔗 Specific links | 🔗 Link settings |

**📦 What to include** applies to every mode.

| Field | What it does | Default |
|---|---|---|
| **What do you want to scrape?** | `Today's launches`, `Leaderboard for a date`, `A topic`, `Search by keyword`, or `Specific Product Hunt links` | Today's launches |
| **Leaderboard period** | Daily, weekly, monthly or yearly. Leaderboard mode only. | Daily |
| **Date** | A date picker, `YYYY-MM-DD`. Its meaning follows the period: exact day / that Mon–Sun week / that month / that year. | Most recent |
| **Topic** | Pick from a dropdown of all 433 Product Hunt topics. Topic mode only. | Productivity |
| **Topic time range** | All-time, today, this week or this year. Topic mode only. | All-time |
| **Search keyword** | Any words, e.g. `AI writing`. Search mode only. | — |
| **Search in** | Which of Product Hunt's four search tabs: Launches, Products, People or Discussions. | Launches |
| **Product Hunt links** | Any Product Hunt link — launch, product, topic, maker profile, search, or a daily/weekly/monthly/yearly leaderboard. Links from other sites are rejected before the run starts. | — |
| **For maker profile links, get** | Their own launches, or the products they upvoted. | Their launches |
| **Include followers / following** | Save a maker's network as one extra row per profile, with each person's headline and social links. | Off |
| **How many followers / following** | Fetched 50 at a time. | 100 each |
| **How many products?** | Maximum products to save. In Links mode this is **per link**, so five links can return five times this many. | 50 |
| **Include reviews and ratings** | Reviews with star rating, full text and reviewer profile | On |
| **How many reviews per product?** | Fetched 20 at a time; popular products have thousands | 10 |
| **Include launch comments** | The launch discussion, with full text and authors | Off |
| **How many comments per product?** | Fetched 20 at a time | 10 |
| **Find company emails** | Reads each product's website for public contact emails | Off |
| **How much detail per product?** | `Everything` or `Just the essentials` | Everything |

### Example input

```json
{
  "mode": "leaderboard",
  "leaderboardPeriod": "monthly",
  "date": "2026-08",
  "maxItems": 200,
  "includeReviews": true,
  "includeComments": false
}
```

## Output

One record per product. Fields are `null` when Product Hunt does not publish them.

### Example output

```json
{
  "recordType": "product",
  "name": "Switch",
  "tagline": "Bring any AI agent into Slack, Teams & Discord",
  "websiteUrl": "https://www.flintai.dev/products/switch",
  "productHuntUrl": "https://www.producthunt.com/posts/switch-14",
  "pricingType": "free",
  "leaderboardRank": 1,
  "dailyRank": 1,
  "upvotes": 521,
  "commentsCount": 90,
  "reviewsCount": 3,
  "reviewsRating": 5,
  "followersCount": 1189,
  "launchDate": "2026-09-08",
  "topics": ["Open Source", "Developer Tools", "Artificial Intelligence"],
  "githubUrl": "https://github.com/sandbox-quantum/switch",
  "twitterUrl": "https://x.com/flint_ai_",
  "hunter": {
    "name": "fmerian",
    "username": "fmerian",
    "headline": "hunting devtools - kilo.ai, mastra.ai",
    "profileUrl": "https://www.producthunt.com/@fmerian"
  },
  "makers": [
    {
      "name": "Safi Amin",
      "username": "safi_amin",
      "headline": "PM at SandboxAQ, building Flint AI",
      "linkedinUrl": "https://www.linkedin.com/in/safiamin",
      "followersCount": 12
    }
  ],
  "reviews": [
    {
      "rating": 5,
      "text": "We run a pretty fast moving team and one thing that kept slowing us down…",
      "createdAt": "2026-09-09T04:11:00-07:00",
      "reviewer": { "username": "artstavenka1", "headline": "Founder" }
    }
  ],
  "comments": [
    { "text": "Hey Product Hunt! Safi here from the team…", "votesCount": 12, "author": { "username": "safi_amin" } }
  ],
  "emails": ["hello@flintai.dev"],
  "scrapedAt": "2026-09-13T11:20:00.000Z"
}
```

### Example output — maker profile row

Produced by a `/@username` link when followers or following are switched on.

```json
{
  "recordType": "maker_profile",
  "name": "Eric Simons",
  "username": "ericsimons40",
  "headline": "CEO @StackBlitz",
  "profileUrl": "https://www.producthunt.com/@ericsimons40",
  "followersTotalOnProductHunt": 1906,
  "followingTotalOnProductHunt": 2,
  "launchesMade": 8,
  "productsUpvoted": 29,
  "karma": { "kind": "BRONZE", "score": 487 },
  "joinedAt": "2014-01-31T00:00:00-08:00",
  "followers": [
    { "name": "Julien", "username": "julien", "headline": "Serial Entrepreneur", "followersCount": 1592 }
  ],
  "following": [
    { "name": "Matt Green", "username": "mattgreen" }
  ]
}
```

### Field reference

**Identity** — `id`, `name`, `tagline`, `description`, `slug`, `productHuntUrl`, `websiteUrl`, `pricingType`, `thumbnailUrl`, `logoUrl`, `productId`, `productSlug`

**Ranking & engagement** — `leaderboardRank`, `leaderboardPeriod`, `dailyRank`, `upvotes`, `commentsCount`, `reviewsCount`, `reviewsRating`, `followersCount`, `subscribersCount`, `launchesCount`, `totalVotesCount`

**Dates** — `launchDate`, `featuredAt`, `createdAt`, `updatedAt`, `scrapedAt`

**Classification** — `topics[]`, `platforms[]`

**Media** — `imageUrls[]`, `videoUrls[]`

**Links** — `links[]` (`platform`, `websiteName`, `url`) plus flat `githubUrl`, `twitterUrl`, `linkedinUrl`, `facebookUrl`, `instagramUrl`, `appStoreUrl`, `playStoreUrl`

**People** — `hunter` and `makers[]`, each with `name`, `username`, `headline`, `about`, `profileUrl`, `avatarUrl`, `followersCount`, `twitterUrl`, `linkedinUrl`, `websiteUrl`, `links[]`

**Depth** — `reviews[]` (`rating`, `text`, `createdAt`, `votesCount`, `reviewer`), `comments[]` (`text`, `createdAt`, `votesCount`, `author`), `launchHistory[]` (previous launches of the same product)

**Enrichment** — `emails[]` (only when "Find company emails" is enabled)

**Record type** — every row carries `recordType`, so mixed results stay easy to filter:

| `recordType` | What it is | Produced by |
|---|---|---|
| `product` | A launch, with all the fields above | every mode |
| `product_hub` | A product page with its overall rating and subscriber count | Search → Products |
| `person` | A maker profile matching your keyword | Search → People |
| `discussion` | A forum thread with its category, upvotes and author | Search → Discussions |
| `maker_profile` | One `/@username` profile: totals, karma, streak, join date | a `/@username` link |
| `follower` / `following` | **One row per person** in that maker's network, with `ofUsername` pointing back at the maker | followers/following enabled |

Followers and following are written as individual rows rather than as arrays on the profile: they stream into the dataset a page at a time while the run is still going, and each person stays filterable and exports cleanly to CSV.

## Pricing

**This Actor is free.** You only pay Apify's normal platform usage for the run itself — there is no per-result charge.

Reviews, comments, makers, hunter, media and email discovery are all included.

## Tips

- Run with a small **How many products?** value first to check the shape of the results, then scale up. 400 products takes about 25 seconds without reviews.
- Reviews and comments are fetched 20 at a time, so raising their limits is the main thing that slows a run down. Leave them at 10 unless you need depth.
- For outreach lists, turn on **Find company emails** and use the **Leads** view in the dataset tab.
- Leaderboard dates follow Product Hunt's own day, which runs on US Pacific time.
- Schedule a daily run in **Today's launches** mode to monitor new products automatically.
- Use **Just the essentials** when feeding results to an LLM or a spreadsheet.
- Fields that do not apply to the mode you chose are listed in the run log, so you can see at a glance if something you filled in was ignored.
- Follower and following limits are separate from **How many products?** — a run can return 3 launches and 200 followers.
- Paste as many links as you like: each one gets its own **How many products?** allowance, so a leaderboard link cannot starve the links after it.
- In Links mode you can mix link types in one run — a leaderboard, a topic and a maker profile together. The **How many products?** limit is shared across all of them, so a leaderboard link can use up the whole budget.
- Weekly leaderboard links use Product Hunt's own week numbers: `/leaderboard/weekly/2022/49` is the week of 5 December 2022, not the 49th day.

## FAQ

**Do I need a Product Hunt account or API key?**
No. Just set the input and run.

**How fresh is the data?**
It is read live from Product Hunt at the moment the run starts.

**Why is `websiteUrl` sometimes empty?**
A few Product Hunt entries have no external website listed. The field is `null` rather than a guess.

**Why did I get fewer products than I asked for?**
That period, topic or search simply has fewer published products. The run still finishes successfully.

**What happens if I leave a required field empty?**
The run finishes successfully with zero results and explains what was missing, in the log and in the run's status message. A typo in your input is not treated as a failure.

**Which links can I paste into Links mode?**
Launches (`/posts/...`), products (`/products/...`), topics (`/topics/...`), maker profiles (`/@username`), searches (`/search?q=...`, `/search/users?q=...`) and any leaderboard (`/leaderboard/daily/2026/9/13`, `/weekly/2022/49`, `/monthly/2025/1`, `/yearly/2025`). Weekly links use Product Hunt's ISO week numbers, so `/weekly/2022/1` correctly resolves to 3–9 January 2022.

**If I paste several links, do they share the limit?**
No. **How many products?** applies to each link separately, so nine links will not be exhausted by the first one.

**Can I choose a proxy?**
There is nothing to configure — the Actor handles it for you.

**Can I scrape a category page?**
No. Product Hunt categories are not exposed by the data source this Actor uses, so a `/categories/...` link is skipped with an explanation. Use a topic instead — topics cover the same ground.

**Can I get funding amounts or employee counts?**
Not currently. Those are not part of the data this Actor reads.

**Can I scrape private or logged-in content?**
No. This Actor only reads content that is publicly visible on Product Hunt.

## Support

Found a bug or need a field that is not here? Open an issue on the **Issues** tab of this Actor and it will be looked at.

## Legal & compliance

This Actor collects only publicly available information from Product Hunt. It does not access private, login-gated or personal data, and it does not attempt to bypass access controls. You are responsible for using the data in line with Product Hunt's terms and with applicable laws, including GDPR and CCPA where personal data such as names, profiles or email addresses is involved — including having a lawful basis for any outreach you carry out.

---

Built and maintained by **FlowExtractAPI**.
