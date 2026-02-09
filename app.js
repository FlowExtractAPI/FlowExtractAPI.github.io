// Configuration
const CONFIG = {
    dataPath: './',
    formEndpoint: 'flowextractapi@outlook.com'
};

// State
let actorsData = [];
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initializeForm();
    initializeScrollAnimations();
    initializeNavScroll();
});

// Load all JSON data
async function loadAllData() {
    try {
        const [config, services, actors] = await Promise.all([
            fetch(`${CONFIG.dataPath}config.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}services.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}actors.json`).then(r => r.json())
        ]);
        
        actorsData = actors;
        
        renderConfig(config);
        renderServices(services);
        renderActors(actors);
        renderTechStack(config.techStack);
        renderSocialLinks(config.social);
        setTimeout(initializeScrollAnimations, 100);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render site configuration
function renderConfig(config) {
    document.getElementById('hero-title').textContent = config.site.title;
    document.getElementById('hero-tagline').textContent = config.site.tagline;
    document.getElementById('logo-text').textContent = config.site.title;
    
    // Render CTA buttons
    const ctaContainer = document.getElementById('hero-cta');
    ctaContainer.innerHTML = `
        <a href="${config.cta.primary.url}" target="_blank" class="btn btn-primary">
            ${config.cta.primary.text}
        </a>
        <a href="${config.cta.secondary.url}" class="btn btn-secondary">
            ${config.cta.secondary.text}
        </a>
    `;
    
    // Render stats
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = config.stats.map(stat => `
        <div class="stat-card">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
    
    // Update form endpoint
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
                </ul>
            ` : ''}
        </div>
    `).join('');
}

// Render actors
function renderActors(actors, filter = 'all') {
    const grid = document.getElementById('actors-grid');
    
    const filteredActors = actors.filter(actor => {
        if (filter === 'all') return true;
        if (filter === 'featured') return actor.featured;
        return actor.category === filter;
    });
    
    grid.innerHTML = filteredActors.map(actor => `
        <div class="actor-card fade-in" data-category="${actor.category}">
            ${actor.featured ? '<div class="actor-badge">Featured</div>' : ''}
            <div class="actor-image-container">
                <img src="${actor.image}" alt="${actor.name}" class="actor-image" loading="lazy">
            </div>
            <h3>${actor.name}</h3>
            <p>${actor.description}</p>
            <div class="actor-buttons">
                <a href="${actor.apifyUrl}" target="_blank" class="actor-btn actor-btn-primary">
                    Launch on Apify
                </a>
                <a href="docs/${actor.docsPath}.html" target="_blank" class="actor-btn actor-btn-secondary">
                    Documentation
                </a>
            </div>
        </div>
    `).join('');
    
    if (filteredActors.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <p>No actors found in this category.</p>
            </div>
        `;
    }
}

// Initialize filter buttons
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        currentFilter = filter;
        renderActors(actorsData, filter);
        
        setTimeout(initializeScrollAnimations, 100);
    });
});

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
