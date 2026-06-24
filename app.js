// Configuration
const CONFIG = {
    dataPath: './',
    formEndpoint: 'flowextractapi@outlook.com'
};

// Fallback category labels if catalog.json is unavailable
const DEFAULT_CATEGORY_LABELS = {
    ads: 'Advertising Intelligence', 'real-estate': 'Real Estate', social: 'Social Media',
    downloads: 'Media & Downloads', leads: 'Lead Generation & Business',
    tools: 'Developer Tools & Utilities', education: 'Education'
};

// State (single source of truth, everything derives from the data)
const state = {
    actors: [],
    categoryLabels: {},
    categoryOrder: [],
    stats: null,      // stats.json — public pre-computed aggregates (built by sync.js)
    filter: 'all',
    query: ''
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initializeForm();
    initializeNavScroll();
    initializeSearch();
    initializeCategoryDropdown();
});

// Load all JSON data
async function loadAllData() {
    try {
        const [config, services, actors, catalog, stats] = await Promise.all([
            fetch(`${CONFIG.dataPath}config.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}services.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}actors.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}catalog.json`).then(r => r.json()).catch(() => null),
            // Public, pre-computed aggregates (built by sync.js from the private snapshot
            // which never ships). The site only ever sees these totals.
            fetch(`${CONFIG.dataPath}stats.json`).then(r => r.json()).catch(() => null)
        ]);

        state.actors = actors;
        state.stats = stats;
        state.categoryLabels = (catalog && catalog.categories) ? catalog.categories : DEFAULT_CATEGORY_LABELS;
        // Category order = catalog order, limited to categories that actually have actors
        const present = new Set(actors.map(a => a.category));
        state.categoryOrder = Object.keys(state.categoryLabels).filter(k => present.has(k));

        renderConfig(config);
        renderServices(services);
        renderFilters();
        renderActorGroups();
        renderTechStack(config.techStack);
        renderSocialLinks(config.social);
        setTimeout(initializeScrollAnimations, 100);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// --- Dynamic stats — from the public, pre-built stats.json --------------------
// Standing rule: numbers are never hardcoded. sync.js computes them from the private
// FlowExtract_API_Actors.json (which never ships) and writes stats.json. Here we just read it.
// Category count is the live count of categories that actually have actors.
function computeStats() {
    const s = state.stats || {};
    const cat = state.categoryOrder.length;
    const pick = (k, fallback) => (s[k] && s[k].value !== undefined)
        ? { value: s[k].value, display: s[k].display !== undefined ? String(s[k].display) : String(s[k].value) }
        : fallback;
    return {
        actors:     pick('actors', { value: null, display: '—' }),
        runs:       pick('runs',    { value: null, display: '—' }),
        users:      pick('users',   { value: null, display: '—' }),
        categories: { value: cat, display: String(cat) }
    };
}

// Render site configuration + dynamic stats
function renderConfig(config) {
    document.getElementById('hero-title').textContent = config.site.title;
    document.getElementById('hero-tagline').textContent = config.site.tagline;
    document.getElementById('logo-text').textContent = config.site.title;

    const ctaContainer = document.getElementById('hero-cta');
    ctaContainer.innerHTML = `
        <a href="${config.cta.primary.url}" target="_blank" class="btn btn-primary">${config.cta.primary.text}</a>
        <a href="${config.cta.secondary.url}" class="btn btn-secondary">${config.cta.secondary.text}</a>
    `;

    // Stats: every value comes from the public stats.json (built by sync.js); never hardcoded.
    // Each config stat names a `source` (actors|runs|users|categories); we render its display value.
    const stats = computeStats();
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = config.stats.map(stat => {
        const computed = stat.source && stats[stat.source];
        const value = computed ? computed.display : '—';
        return `
            <div class="stat-card">
                <div class="stat-value">${value}</div>
                <div class="stat-label">${escapeHTML(stat.label)}</div>
            </div>`;
    }).join('');

    if (config.contact.formEndpoint && config.contact.formEndpoint.includes('formspree')) {
        CONFIG.formEndpoint = config.contact.formEndpoint;
    }
}

// Render services
function renderServices(services) {
    const grid = document.getElementById('services-grid');
    grid.innerHTML = services.map(service => `
        <div class="service-card fade-in">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            ${service.features ? `
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>` : ''}
        </div>
    `).join('');
}

// --- Actor rendering: grouped by category, filtered + searched ----------------
function actorCardHTML(actor) {
    const img = actor.image
        ? `<img src="${actor.image}" alt="${escapeAttr(actor.name)}" class="actor-image" loading="lazy">`
        : `<div class="actor-image actor-image--placeholder">${escapeHTML((actor.name || '?').trim().charAt(0))}</div>`;
    return `
        <div class="actor-card fade-in" data-category="${actor.category}">
            ${actor.featured ? '<div class="actor-badge">Featured</div>' : ''}
            <div class="actor-image-container">${img}</div>
            <h3>${escapeHTML(actor.name)}</h3>
            <p>${escapeHTML(actor.description || '')}</p>
            <div class="actor-buttons">
                <a href="${actor.apifyUrl}" target="_blank" rel="noopener" class="actor-btn actor-btn-primary">Launch on Apify</a>
                <a href="docs/${actor.docsPath}.html" target="_blank" rel="noopener" class="actor-btn actor-btn-secondary">Documentation</a>
            </div>
        </div>`;
}

// Does an actor pass the current category/featured filter?
function passesFilter(a) {
    return state.filter === 'all' ? true
         : state.filter === 'featured' ? a.featured
         : a.category === state.filter;
}

// Weighted relevance score for a query. Title 60%, description 30%, category 10%.
// A title hit always outscores a description-only hit. Returns 0 if no field matches.
function scoreActor(a, q) {
    if (!q) return 0;
    const name = (a.name || '').toLowerCase();
    const desc = (a.description || '').toLowerCase();
    const catLabel = (state.categoryLabels[a.category] || a.category || '').toLowerCase();

    const field = (text, weight) => {
        if (!text) return 0;
        const idx = text.indexOf(q);
        if (idx === -1) return 0;
        // Base weight for any hit; bonuses for word-boundary start and exact match.
        let s = weight;
        if (idx === 0 || /\W/.test(text[idx - 1] || ' ')) s += weight * 0.3; // starts a word
        if (text === q) s += weight * 0.5;                                    // exact field match
        return s;
    };

    // Title 60 / description 30 / category 10
    return field(name, 60) + field(desc, 30) + field(catLabel, 10);
}

// Actors to show: category filter narrows the pool; search scores + sorts within it.
function visibleActors() {
    const q = state.query.trim().toLowerCase();
    const pool = state.actors.filter(passesFilter);
    if (!q) return pool;
    return pool
        .map(a => ({ a, score: scoreActor(a, q) }))
        .filter(x => x.score > 0)
        .sort((x, y) => y.score - x.score || x.a.name.localeCompare(y.a.name))
        .map(x => x.a);
}

function renderActorGroups() {
    const container = document.getElementById('actors-groups');
    const empty = document.getElementById('actors-empty');
    const actors = visibleActors();

    // Update the dynamic count line under the section title.
    // Headline actor count comes from the snapshot (source of truth); category count from the catalog.
    const stats = computeStats();
    const totalActors = stats.actors.value;
    const categoryCount = stats.categories.value;
    const line = document.getElementById('actors-count-line');
    if (line) {
        const q = state.query.trim();
        if (q) {
            // Search is the only case where "showing N of M" is meaningful
            line.textContent = `Showing ${actors.length} of ${totalActors} actors`;
            line.hidden = false;
        } else if (state.filter === 'all') {
            line.textContent = `${totalActors} actors across ${categoryCount} categories`;
            line.hidden = false;
        } else {
            // A category is selected — its heading already shows "Category — N actors"
            line.hidden = true;
        }
    }

    if (actors.length === 0) {
        container.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;

    // While searching: ONE flat list, already ordered by relevance score (best match first).
    if (state.query.trim()) {
        container.innerHTML = `
            <div class="actor-group actor-group--results">
                <div class="actors-grid">
                    ${actors.map(actorCardHTML).join('')}
                </div>
            </div>`;
        return;
    }

    // Otherwise: grouped by category (catalog order), only categories with visible actors.
    const cats = state.categoryOrder.filter(c => actors.some(a => a.category === c));
    container.innerHTML = cats.map(cat => {
        const items = actors.filter(a => a.category === cat);
        return `
            <div class="actor-group">
                <div class="actor-group-header">
                    <h3 class="actor-group-title">${escapeHTML(state.categoryLabels[cat] || cat)}</h3>
                    <span class="actor-group-count">${items.length} ${items.length === 1 ? 'actor' : 'actors'}</span>
                </div>
                <div class="actors-grid">
                    ${items.map(actorCardHTML).join('')}
                </div>
            </div>`;
    }).join('');
}

// --- Custom themed category dropdown (button + listbox) -----------------------
function filterOptions() {
    return [
        { value: 'all', label: 'All Categories' },
        { value: 'featured', label: 'Featured' },
        ...state.categoryOrder.map(k => ({ value: k, label: state.categoryLabels[k] || k }))
    ];
}

function currentFilterLabel() {
    const o = filterOptions().find(o => o.value === state.filter);
    return o ? o.label : 'All Categories';
}

// Render the option list + the button label
function renderFilters() {
    const list = document.getElementById('category-filter-list');
    const label = document.getElementById('category-filter-label');
    if (!list || !label) return;
    label.textContent = currentFilterLabel();
    list.innerHTML = filterOptions().map(o => `
        <li role="option" class="category-filter-option${o.value === state.filter ? ' is-active' : ''}"
            data-value="${escapeAttr(o.value)}" aria-selected="${o.value === state.filter}">
            <span>${escapeHTML(o.label)}</span>
            <svg class="category-filter-check" viewBox="0 0 16 12" width="15" height="11" aria-hidden="true">
                <path d="M1 6l4.5 4.5L15 1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </li>`).join('');
}

function setFilter(value) {
    state.filter = value;
    renderFilters();
    renderActorGroups();
    setTimeout(initializeScrollAnimations, 100);
}

function openDropdown(open) {
    const root = document.getElementById('category-filter');
    const btn = document.getElementById('category-filter-btn');
    const list = document.getElementById('category-filter-list');
    if (!root || !btn || !list) return;
    const isOpen = open === undefined ? list.hidden : open;
    list.hidden = !isOpen;
    root.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
        const active = list.querySelector('.category-filter-option.is-active') || list.firstElementChild;
        if (active) active.focus ? active.focus() : list.focus();
        list.focus();
    }
}

function initializeCategoryDropdown() {
    const root = document.getElementById('category-filter');
    const btn = document.getElementById('category-filter-btn');
    const list = document.getElementById('category-filter-list');
    if (!root || !btn || !list) return;

    btn.addEventListener('click', () => openDropdown(list.hidden));

    list.addEventListener('click', (e) => {
        const opt = e.target.closest('.category-filter-option');
        if (!opt) return;
        setFilter(opt.dataset.value);
        openDropdown(false);
        btn.focus();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!root.contains(e.target)) openDropdown(false);
    });

    // Keyboard: Esc closes; Up/Down/Enter navigate the open list
    document.addEventListener('keydown', (e) => {
        if (list.hidden) return;
        const opts = Array.from(list.querySelectorAll('.category-filter-option'));
        let idx = opts.findIndex(o => o.dataset.value === state.filter);
        if (e.key === 'Escape') { openDropdown(false); btn.focus(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); setFilter(opts[Math.min(idx + 1, opts.length - 1)].dataset.value); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); setFilter(opts[Math.max(idx - 1, 0)].dataset.value); }
        else if (e.key === 'Enter')     { e.preventDefault(); openDropdown(false); btn.focus(); }
    });
}

// Live search
function initializeSearch() {
    const input = document.getElementById('actors-search');
    if (!input) return;
    input.addEventListener('input', debounce(() => {
        state.query = input.value;
        renderActorGroups();
        setTimeout(initializeScrollAnimations, 50);
    }, 150));
}

// --- Small HTML-escaping helpers (data is trusted, but keep markup safe) -------
function escapeHTML(s) {
    return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
function escapeAttr(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Render tech stack
function renderTechStack(techStack) {
    const grid = document.getElementById('tech-grid');
    grid.innerHTML = techStack.map(tech => `
        <div class="tech-item">${tech}</div>
    `).join('');
}

// Render social links
function renderSocialLinks(social) {
    const container = document.getElementById('social-links');
    
    const socialIcons = {
        twitter: '𝕏',
        linkedin: 'in',
        facebook: 'f',
        tiktok: '♪',
        github: 'gh',
        apify: 'A'
    };
    
    container.innerHTML = Object.entries(social).map(([platform, url]) => `
        <a href="${url}" target="_blank" class="social-link" title="${platform}">
            ${socialIcons[platform] || '→'}
        </a>
    `).join('');
}

// Initialize contact form
function initializeForm() {
    const form = document.getElementById('contact-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        messageDiv.style.display = 'none';
        try {
            const formData = new FormData(form);
            const response = await fetch('https://formspree.io/f/mdalkpqj', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                showMessage('success', 'Message sent successfully! We\'ll get back to you soon.');
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    const errors = data.errors.map(error => error.message).join(', ');
                    showMessage('error', errors);
                } else {
                    throw new Error('Form submission failed');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('error', 'Failed to send message. Please email us directly at flowextractapi@outlook.com');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
    function showMessage(type, text) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// Initialize navigation scroll effect
function initializeNavScroll() {
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        } else {
            nav.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.04)';
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Re-calculate any layout-dependent features if needed
}, 250));

console.log('%cFlowExtract API', 'font-size: 20px; font-weight: bold; color: #5bb5b5;');
console.log('%cProfessional data extraction solutions', 'font-size: 12px; color: #6b7f99;');
