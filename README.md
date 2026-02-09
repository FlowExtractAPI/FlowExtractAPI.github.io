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

## Adding New Actor

1. **Create markdown documentation:**
   ```bash
   docs/actors/actor-name.md
   ```

2. **Add entry to `actors.json`:**
   ```json
   {
     "id": "actor-name",
     "name": "Actor Name",
     "image": "https://...",
     "category": "social",
     "description": "Brief description",
     "apifyUrl": "https://apify.com/dz_omar/actor?fpr=smcx63",
     "docsPath": "actor-name",
     "readmeFile": "actor-name.md",
     "metaTitle": "Actor Name - SEO Title",
     "metaDescription": "SEO description",
     "featured": true
   }
   ```

3. **Generate documentation:**
   ```bash
   node generate-docs.js
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Added actor: Actor Name"
   git push
   ```

---

## Documentation System

- **Markdown files** in `docs/actors/` contain actor documentation
- **Generator script** creates individual HTML pages from `_template.html`
- **SEO-friendly URLs:** `flowextractapi.com/docs/actor-name.html`
- **Table of contents** auto-generated from markdown headings
- **Syntax highlighting** for code blocks

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
