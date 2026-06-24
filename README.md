Professional data extraction and automation platform. Custom web scrapers, APIs, and workflow automation powered by Apify.

🌐 **Live Site:** [flowextractapi.com](https://flowextractapi.com)

---

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Architecture:** JSON-driven content, static site generation
- **Hosting:** GitHub Pages
- **Documentation:** Markdown → HTML with marked.js
- **Form:** Formspree integration

---

## Project Structure
```markdown

├── index.html              # Main landing page
├── styles.css              # Responsive light theme
├── app.js                  # Client-side logic
├── actors.json             # Actor data (images, URLs, metadata)
├── services.json           # Service offerings
├── config.json             # Site configuration
├── generate-docs.js        # Documentation generator
│
└── docs/
    ├── _template.html      # Documentation template
    ├── docs.css            # Documentation styles
    ├── docs.js             # Markdown renderer
    ├── *.html              # Generated documentation pages
    └── actors/
        └── *.md            # Actor documentation (markdown)

```


## Features

- **SEO Optimized:** Individual pages for each actor with custom meta tags
- **Responsive Design:** Mobile-first, works on all devices
- **JSON-Driven Content:** Update actors/services without touching HTML
- **Automated Documentation:** Generate HTML from markdown
- **Performance:** Vanilla JS, no frameworks, fast load times

---

## Local Development

```bash
# Clone repository
git clone https://github.com/FlowExtractAPI/FlowExtractAPI.github.io.git
cd FlowExtractAPI.github.io

# Start local server
python3 -m http.server 8000
# or
npx http-server

# Visit http://localhost:8000
```

---

## Adding / Updating Actors

Actor docs are **generated from the source READMEs** in `D:\Dev\Apify` by `sync.js` — driven from
`catalog.json` (the source of truth). Do not hand-edit `actors.json` or the files in `docs/`; they
are generated.

```bash
node sync.js            # mirror changed source READMEs → regenerate only changed pages
node sync.js --check    # dry run: list what changed, write nothing
node sync.js --only <slug>   # regenerate one actor
node sync.js --all      # rebuild everything
```

The full workflow (categories, how to add a new actor, the Apify snapshot) is documented once in the
workspace guide: **`../README.md`** (`D:\Dev\FlowExtract-API\README.md`).

---

## Documentation System

- `catalog.json` maps each actor → category + its **source README** path under `D:\Dev\Apify`.
- `sync.js` hashes each source README (`.sync-manifest.json`) and regenerates only changed actors.
- **Generated:** `actors.json` (card data), `docs/actors/<slug>.md` (README mirror),
  `docs/<slug>.html` (page shell rendered client-side by `docs.js` + marked.js).
- **SEO-friendly URLs:** `flowextractapi.com/docs/<slug>.html`, TOC auto-generated from headings.

---
## Deployment

Automatic deployment via GitHub Pages:
- Push to `main` branch
- GitHub Pages builds automatically
- Live in 2-3 minutes

Custom domain configured via `CNAME` file.

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1s
- **Time to Interactive:** < 2s
- **No external dependencies** (except marked.js for docs)

---

## Contact

**Business Inquiries:**
- 📧 Email: flowextractapi@outlook.com
- 🐦 Twitter: [@FlowExtractAPI](https://x.com/FlowExtractAPI)
- 💼 LinkedIn: [FlowExtract API](https://www.linkedin.com/in/flowextract-api/)

**Custom Development:**
Need a custom scraper, API, or automation workflow? [Contact us](https://flowextractapi.com#contact)
