#!/usr/bin/env node

/**
 * Documentation Generator for FlowExtract API
 * 
 * This script reads actors.json and generates individual HTML documentation
 * pages for each actor from the _template.html file.
 * 
 * Usage: node generate-docs.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const ACTORS_JSON = './actors.json';
const TEMPLATE_FILE = './docs/_template.html';
const DOCS_DIR = './docs';

console.log('📚 FlowExtract API Documentation Generator\n');

// Read actors data
console.log('📖 Reading actors.json...');
let actors;
try {
    const actorsData = fs.readFileSync(ACTORS_JSON, 'utf8');
    actors = JSON.parse(actorsData);
    console.log(`✅ Found ${actors.length} actors\n`);
} catch (error) {
    console.error('❌ Error reading actors.json:', error.message);
    process.exit(1);
}

// Read template
console.log('📄 Reading template...');
let template;
try {
    template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    console.log('✅ Template loaded\n');
} catch (error) {
    console.error('❌ Error reading template:', error.message);
    process.exit(1);
}

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Generate documentation for each actor
console.log('🔨 Generating documentation pages...\n');

let generated = 0;
let skipped = 0;

actors.forEach(actor => {
    const outputFile = path.join(DOCS_DIR, `${actor.docsPath}.html`);
    const markdownFile = path.join(DOCS_DIR, 'actors', actor.readmeFile);
    
    // Check if markdown file exists
    if (!fs.existsSync(markdownFile)) {
        console.log(`⚠️  Skipping ${actor.name} - markdown file not found: ${actor.readmeFile}`);
        skipped++;
        return;
    }
    
    // Replace ACTOR_ID_PLACEHOLDER with actual actor ID
    const html = template.replace('ACTOR_ID_PLACEHOLDER', actor.id);
    
    // Write HTML file
    try {
        fs.writeFileSync(outputFile, html, 'utf8');
        console.log(`✅ Generated: ${actor.docsPath}.html (${actor.name})`);
        generated++;
    } catch (error) {
        console.error(`❌ Error generating ${actor.name}:`, error.message);
    }
});

console.log('\n' + '='.repeat(50));
console.log(`\n✨ Generation complete!`);
console.log(`   Generated: ${generated} pages`);
if (skipped > 0) {
    console.log(`   Skipped: ${skipped} pages (missing markdown)`);
}
console.log('\n📁 Output directory: ./docs/');
console.log('🚀 You can now commit and push to GitHub!\n');

// Summary of missing markdown files
const missingMarkdown = actors.filter(actor => {
    const markdownFile = path.join(DOCS_DIR, 'actors', actor.readmeFile);
    return !fs.existsSync(markdownFile);
});

if (missingMarkdown.length > 0) {
    console.log('⚠️  Missing markdown files:');
    missingMarkdown.forEach(actor => {
        console.log(`   - docs/actors/${actor.readmeFile} (for ${actor.name})`);
    });
    console.log('\nCreate these files to generate their documentation pages.\n');
}
