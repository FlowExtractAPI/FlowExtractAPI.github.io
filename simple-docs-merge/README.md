# Simple Docs Merge — landing + legal pages

**This folder is self-contained and unrelated to the FlowExtract API site.** It was
added to host the public pages that Google requires before it will approve the
**Simple Docs Merge** Google Workspace Add-on (a separate product living at
`D:\Dev\Add-ons\simple-docs-merge`). It is parked here temporarily on the existing
`flowextractapi.com` domain until a dedicated domain is bought.

> **To whoever maintains the FlowExtract site:** nothing outside this folder was
> touched. No existing file was modified; the docs generator, SEO pipeline, sync
> manifest, sitemap and `config.json` are all untouched. You can ignore this folder
> entirely — it does not participate in any build step (`generate-docs.js` only
> reads `./docs/`). It just needs to be committed and pushed so the pages go live.

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

- `https://flowextractapi.com/simple-docs-merge/`
- `https://flowextractapi.com/simple-docs-merge/privacy.html`
- `https://flowextractapi.com/simple-docs-merge/terms.html`

Verified locally (served exactly as GitHub Pages would): all three pages + the CSS
return `200`, all internal links resolve, and the existing site is unchanged.

---

## Why it exists (the Google review requirement)

The add-on uses **restricted OAuth scopes** (`.../auth/documents`,
`.../auth/drive.readonly`). Google will not approve those until it can see, live on a
domain the developer controls:

1. a **homepage** describing the app,
2. a **privacy policy** on the same domain, and
3. a **terms of service** page.

The reviewer clicks these URLs during review — they can't be "coming soon", which is
why they had to exist *before* submission rather than after.

The privacy policy is written to match **exactly what the add-on actually does**:
it reads only user-selected documents, processes them on a Cloud Run backend acting
with the user's short-lived token, **stores no document content**, and keeps only a
per-user monthly merge counter in Firestore. It carries the mandatory Google API
Services User Data Policy **Limited Use** statement.

---

## Design decisions (change any of these if you prefer)

- **Sub-path, not a subdomain.** A subfolder serves immediately on GitHub Pages with
  zero DNS or config change, which is the least invasive way to add it. If you'd
  rather use `docsmerge.flowextractapi.com`, that needs a DNS record + a separate
  Pages target; the pages themselves would move unchanged (see "Moving to a real
  domain" below).
- **Static, no backend.** A review landing page needs no server. The add-on's own
  Cloud Run backend is wired inside the add-on, not to this page. Nothing here calls
  it. (If a live "service status" badge or a server-backed contact form is ever
  wanted, that's a separate, optional addition.)
- **Contact email:** `flowextractapi@outlook.com` (the existing site contact from
  `config.json`). Change it in all four HTML/CSS files if the add-on should use a
  different support address. It appears in the footer, the "Get it" section, and the
  privacy/terms contact sections.

---

## Before / around submission — action items

1. **Fill in the Marketplace listing URL.** `index.html` has two `TODO` markers (the
   header "Add to Google Docs" button and the `#get` section button) pointing at
   `#`. Replace with the real Workspace Marketplace listing URL once the add-on is
   published. (Not required for the *review* itself — the listing provides install —
   but should be set before public launch.)
2. **Point the add-on at these URLs.** In the add-on project
   (`D:\Dev\Add-ons\simple-docs-merge\src\Code.gs`), `BRAND_DOMAIN` is a single
   placeholder (`simpledocsmerge.example`). Set the add-on's homepage / privacy /
   terms / support links and the **OAuth consent screen** + **Marketplace listing**
   fields to the three URLs above. (Left unchanged here — that's the add-on repo, not
   this site.)
3. **Verify the domain** is confirmed in Google Search Console for the OAuth consent
   screen — it already is for `flowextractapi.com` (`google476e7ab5832fa67e.html`
   exists at the site root).
4. **Sitemap:** deliberately **not** modified — updating it would change the existing
   site's structure, and Google's reviewer does not need these pages in the sitemap.
   If you want them indexed later, add the three URLs to `site/sitemap.xml` yourself.

---

## Deploying

It's a static GitHub Pages site (`FlowExtractAPI/FlowExtractAPI.github.io`), so:

```bash
cd D:\Dev\FlowExtract-API\site
git add simple-docs-merge/
git commit -m "Add Simple Docs Merge add-on landing + legal pages"
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
  `https://flowextractapi.com/simple-docs-merge/...`).

When the dedicated domain is ready you can either move this folder to the new site's
root (so the pages sit at `/`, `/privacy.html`, `/terms.html`) or keep the same
sub-path — either works. Then update the canonical/og URLs, and repoint the add-on's
consent screen + Marketplace listing to the new domain.
