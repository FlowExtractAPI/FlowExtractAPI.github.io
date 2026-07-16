# Simple Merge — landing + legal pages

**This folder is self-contained and unrelated to the FlowExtract API site.** It hosts
the public pages that Google requires before it will approve the **Simple Merge**
Google Workspace Add-on (a separate product whose code lives at
`D:\Dev\Add-ons\simple-docs-merge` — note the add-on's *code folder* keeps its old
name; only the product's display name and this site path became "Simple Merge"). The
pages are parked here temporarily on the existing `flowextractapi.com` domain until a
dedicated domain is bought.

> **Naming note:** the product was renamed from "Simple Docs Merge" to **"Simple
> Merge"** so it can grow beyond Docs (Sheets, Slides, …) and to satisfy Google's
> branding-consistency check — the OAuth consent screen App name, the Marketplace
> listing, the add-on manifest (`addOns.common.name`), and this landing page must all
> read **exactly** "Simple Merge". Dropping "Docs" also avoids Google's discouragement
> of product-name trademarks in an app name.

> **To whoever maintains the FlowExtract site:** nothing outside this folder was
> touched. No existing file was modified; the docs generator, SEO pipeline, sync
> manifest, sitemap and `config.json` are all untouched. This folder does not
> participate in any build step (`generate-docs.js` only reads `./docs/`). It just
> needs to be committed and pushed so the pages go live.

---

## What's here

| File | Purpose |
|---|---|
| `index.html` | Marketing / homepage for the add-on |
| `privacy.html` | Privacy policy (**required** for OAuth review; includes the Google Limited Use disclosure) |
| `terms.html` | Terms of Service (**required** for the Marketplace listing) |
| `styles.css` | Shared styling. Self-contained — no external fonts, scripts, CDNs, or trackers |
| `README.md` | This file |

Once committed and pushed, these serve at (GitHub Pages, custom domain already set):

- `https://flowextractapi.com/simple-merge/`
- `https://flowextractapi.com/simple-merge/privacy.html`
- `https://flowextractapi.com/simple-merge/terms.html`

All three pages + the CSS return `200`, all internal links resolve, and the existing
site is unchanged.

---

## Why it exists (the Google review requirement)

The add-on uses **restricted OAuth scopes** (`.../auth/documents`,
`.../auth/drive.readonly`). Google will not approve those until it can see, live on a
domain the developer controls:

1. a **homepage** describing the app,
2. a **privacy policy** on the same domain, and
3. a **terms of service** page.

The reviewer clicks these URLs during review — they can't be "coming soon". The
privacy policy matches **exactly what the add-on actually does**: it reads only
user-selected documents, processes them on a Cloud Run backend acting with the user's
short-lived token, **stores no document content**, and keeps only a per-user monthly
merge counter in Firestore. It carries the mandatory Google API Services User Data
Policy **Limited Use** statement.

---

## Design decisions (change any of these if you prefer)

- **Sub-path, not a subdomain.** A subfolder serves immediately on GitHub Pages with
  zero DNS or config change. If you'd rather use `simplemerge.flowextractapi.com`,
  that needs a DNS record + a separate Pages target; the pages themselves would move
  unchanged (see "Moving to a real domain" below).
- **Static, no backend.** A review landing page needs no server. The add-on's own
  Cloud Run backend is wired inside the add-on, not to this page.
- **Contact email:** `flowextractapi@outlook.com` (the existing site contact). Change
  it in all HTML files if the add-on should use a different support address.

---

## Before / around submission — action items

1. **Set the App name to "Simple Merge" everywhere it appears in Google's console** —
   the OAuth **consent screen** App name and the **Marketplace listing** name. These
   must match the manifest and this site *exactly*. (The mismatch — consent screen said
   "Docs Merge" — is what Google flagged.)
2. **Fill in the Marketplace listing URL.** `index.html` has `TODO` markers on the
   "Add to Google Docs" buttons pointing at `#`. Replace with the real listing URL
   once published.
3. **The add-on already points here.** In the add-on
   (`D:\Dev\Add-ons\simple-docs-merge\src\Code.gs`), `BRAND_SITE` is set to
   `https://flowextractapi.com/simple-merge` and `BRAND.name` to `Simple Merge`. If
   you change the domain, update `BRAND_SITE` (one line) and re-push with clasp.
4. **Verify the domain** in Google Search Console for the OAuth consent screen — it is
   already verified for `flowextractapi.com` (`google476e7ab5832fa67e.html` at root).
5. **Sitemap:** deliberately **not** modified. Google's reviewer does not need these
   pages in the sitemap. Add the three URLs to `site/sitemap.xml` yourself if you want
   them indexed.

---

## Deploying

Static GitHub Pages site (`FlowExtractAPI/FlowExtractAPI.github.io`):

```bash
cd D:\Dev\FlowExtract-API\site
git add simple-merge/
git commit -m "Rename add-on pages: Simple Docs Merge -> Simple Merge"
git push
```

GitHub Pages redeploys automatically; the URLs above go live within a minute or two.

---

## Moving to a real domain later

The pages are built to move cleanly:

- All links **between** these pages are **relative** (`privacy.html`, `terms.html`,
  `./`, `styles.css`), so the folder works at any base path or domain with no edits.
- Only the **absolute** URLs need updating when the domain changes: the
  `<link rel="canonical">` and `og:url` tags in each HTML file (currently
  `https://flowextractapi.com/simple-merge/...`).

When the dedicated domain (e.g. `simplemerge.app`) is ready you can move this folder to
the new site's root so the pages sit at `/`, `/privacy.html`, `/terms.html`. Then
update the canonical/og URLs, repoint the add-on's `BRAND_SITE`, and update the consent
screen + Marketplace listing to the new domain.
