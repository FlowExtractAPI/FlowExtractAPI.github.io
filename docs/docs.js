// Doc page progressive enhancement.
// Content (hero, unique block, README) is pre-rendered into the HTML at build time by sync.js.
// This script only adds: table of contents, heading anchors, back-to-top, current year.

document.addEventListener('DOMContentLoaded', () => {
    setYear();
    generateTOC();
    addAnchorLinks();
    highlightCodeBlocks();
    initBackToTop();
});

function setYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
}

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Build the sidebar TOC from the rendered README headings
function generateTOC() {
    const content = document.getElementById('readme-body') || document.getElementById('content');
    const toc = document.getElementById('toc');
    if (!content || !toc) return;
    const headings = content.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        toc.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">No sections</p>';
        return;
    }
    toc.innerHTML = Array.from(headings).map(h => {
        if (!h.id) h.id = slugify(h.textContent);
        const sub = h.tagName === 'H3' ? 'sub' : '';
        const indent = h.tagName === 'H3' ? 'padding-left: 15px;' : '';
        return `<a href="#${h.id}" class="toc-${sub}" style="${indent}">${h.textContent}</a>`;
    }).join('');
    setupScrollSpy(headings);
}

function setupScrollSpy(headings) {
    const tocLinks = document.querySelectorAll('.sidebar-nav a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        tocLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-100px 0px -66%', threshold: 0 });
    headings.forEach(h => observer.observe(h));
}

function addAnchorLinks() {
    document.querySelectorAll('.docs-content h2, .docs-content h3').forEach(h => {
        if (!h.id) h.id = slugify(h.textContent);
    });
}

function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach(block => {
        const t = block.textContent.trim();
        if (t.startsWith('{') || t.startsWith('[')) {
            try { block.textContent = JSON.stringify(JSON.parse(t), null, 2); block.style.color = 'var(--text)'; } catch (e) {}
        }
    });
}

// Smooth scroll for in-page anchors
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { e.preventDefault(); window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' }); }
});

function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);
    const toggle = () => btn.classList.toggle('visible', window.pageYOffset > 400);
    window.addEventListener('scroll', toggle, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggle();
}
