// Load actor data and render documentation
let actorData = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load actors data
        const actors = await fetch('../actors.json').then(r => r.json());
        actorData = actors.find(a => a.id === ACTOR_ID);
        
        if (!actorData) {
            showError('Actor not found');
            return;
        }
        
        // Update page metadata
        updateMetadata();
        
        // Load and render markdown
        await loadMarkdown();
        
    } catch (error) {
        console.error('Error loading documentation:', error);
        showError('Failed to load documentation');
    }
});

function updateMetadata() {
    // Update page title
    document.getElementById('page-title').textContent = `${actorData.metaTitle} - FlowExtract API`;
    document.title = `${actorData.metaTitle} - FlowExtract API`;
    
    // Update meta tags
    document.getElementById('meta-title').setAttribute('content', actorData.metaTitle);
    document.getElementById('meta-description').setAttribute('content', actorData.metaDescription);
    
    // Update CTA button
    document.getElementById('cta-apify').href = actorData.apifyUrl;
}

async function loadMarkdown() {
    try {
        const markdownPath = `actors/${actorData.readmeFile}`;
        const response = await fetch(markdownPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load markdown: ${response.status}`);
        }
        
        const markdown = await response.text();
        renderMarkdown(markdown);
        
    } catch (error) {
        console.error('Error loading markdown:', error);
        showError('Failed to load documentation content');
    }
}

function renderMarkdown(markdown) {
    const contentDiv = document.getElementById('content');
    
    // Configure marked options
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
    
    // Render markdown to HTML
    const html = marked.parse(markdown);
    contentDiv.innerHTML = html;
    
    // Generate table of contents
    generateTOC();
    
    // Add anchor links to headings
    addAnchorLinks();
    
    // Syntax highlighting for code blocks (basic)
    highlightCodeBlocks();
}

function generateTOC() {
    const content = document.getElementById('content');
    const toc = document.getElementById('toc');
    const headings = content.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        toc.innerHTML = '<p style="color: var(--text-muted); font-size: 13px;">No sections found</p>';
        return;
    }
    
    const tocHTML = Array.from(headings).map(heading => {
        const id = heading.id || slugify(heading.textContent);
        heading.id = id;
        
        const level = heading.tagName === 'H2' ? '' : 'sub';
        const indent = heading.tagName === 'H3' ? 'padding-left: 15px;' : '';
        
        return `<a href="#${id}" class="toc-${level}" style="${indent}">${heading.textContent}</a>`;
    }).join('');
    
    toc.innerHTML = tocHTML;
    
    // Update active link on scroll
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
    }, {
        rootMargin: '-100px 0px -66%',
        threshold: 0
    });
    
    headings.forEach(heading => observer.observe(heading));
}

function addAnchorLinks() {
    const headings = document.querySelectorAll('.docs-content h2, .docs-content h3');
    
    headings.forEach(heading => {
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = 'anchor-link';
        link.innerHTML = '#';
        link.style.cssText = 'margin-left: 10px; color: var(--accent); text-decoration: none; opacity: 0; transition: opacity 0.3s;';
        
        heading.style.position = 'relative';
        heading.appendChild(link);
        
        heading.addEventListener('mouseenter', () => {
            link.style.opacity = '1';
        });
        
        heading.addEventListener('mouseleave', () => {
            link.style.opacity = '0';
        });
    });
}

function highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Basic syntax highlighting for JSON
        if (block.textContent.trim().startsWith('{') || block.textContent.trim().startsWith('[')) {
            try {
                const json = JSON.parse(block.textContent);
                block.textContent = JSON.stringify(json, null, 2);
                block.style.color = 'var(--text)';
            } catch (e) {
                // Not valid JSON, leave as is
            }
        }
    });
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function showError(message) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <h2 style="color: var(--text); margin-bottom: 15px;">Error Loading Documentation</h2>
            <p>${message}</p>
            <p style="margin-top: 20px;">
                <a href="../index.html" style="color: var(--accent);">← Return to Home</a>
            </p>
        </div>
    `;
}

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = e.target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});
