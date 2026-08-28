import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../../src');

console.log('========================================');
console.log('SCANNING ALL LINKS ACROSS ENTIRE CODEBASE');
console.log('========================================\n');

// 1. Gather all defined valid routes in Astro pages
function getValidRoutes(pagesDir) {
  const routes = new Set(['/', '/404', '/sitemap.xml']);
  
  function scan(dir, baseRoute = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath, `${baseRoute}/${entry.name}`);
      } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.ts') || entry.name.endsWith('.js')) {
        const nameWithoutExt = entry.name.replace(/\.(astro|ts|js)$/, '');
        if (nameWithoutExt === 'index') {
          routes.add(baseRoute || '/');
        } else if (nameWithoutExt.startsWith('[...')) {
          // Dynamic catch-all like [...slug]
          routes.add(`${baseRoute}/*`);
        } else if (nameWithoutExt.startsWith('[')) {
          routes.add(`${baseRoute}/*`);
        } else {
          routes.add(`${baseRoute}/${nameWithoutExt}`);
        }
      }
    }
  }

  scan(pagesDir);
  return routes;
}

const validRoutes = getValidRoutes(path.join(srcDir, 'pages'));

// Also collect article slugs in src/content/articles
const articlesDir = path.join(srcDir, 'content/articles');
const articleSlugs = new Set();
if (fs.existsSync(articlesDir)) {
  fs.readdirSync(articlesDir).forEach(file => {
    if (file.endsWith('.md')) {
      articleSlugs.add(file.replace(/\.md$/, ''));
    }
  });
}

console.log('Defined Astro Page Routes:');
console.log(Array.from(validRoutes).sort());
console.log('\nDefined Article Slugs (/learn/[slug]):');
console.log(Array.from(articleSlugs).sort());

// 2. Find all internal links in .astro and .tsx files
function getAllFiles(dir, exts = ['.astro', '.tsx']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.astro') {
        files = files.concat(getAllFiles(fullPath, exts));
      }
    } else if (exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = getAllFiles(srcDir);
let brokenLinks = [];
let totalLinksFound = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(srcDir, file).replace(/\\/g, '/');

  // Match href="..." and href={`...`}
  const hrefMatches = content.matchAll(/href=["'`]([^"'`#?]+)([^"'`]*)["'`]/g);

  for (const match of hrefMatches) {
    const rawTarget = match[1].trim();
    const queryOrHash = match[2] || '';
    const fullLink = rawTarget + queryOrHash;

    // Ignore external links, mailto, tel, javascript, data, or anchor-only
    if (
      rawTarget.startsWith('http://') ||
      rawTarget.startsWith('https://') ||
      rawTarget.startsWith('mailto:') ||
      rawTarget.startsWith('tel:') ||
      rawTarget.startsWith('javascript:') ||
      rawTarget.startsWith('#') ||
      rawTarget === ''
    ) {
      continue;
    }

    totalLinksFound++;

    // Normalize path
    let normalized = rawTarget;
    if (normalized.endsWith('/') && normalized.length > 1) {
      normalized = normalized.slice(0, -1);
    }

    // Check if it's a learn article route
    if (normalized.startsWith('/learn/')) {
      const slug = normalized.replace('/learn/', '');
      if (!articleSlugs.has(slug)) {
        brokenLinks.push({ file: relPath, link: fullLink, reason: `Article slug "${slug}" does not exist in src/content/articles/` });
      }
      continue;
    }

    // Check static asset in /public or /assets
    if (normalized.startsWith('/assets/')) {
      const publicPath = path.join(srcDir, '../public', normalized);
      if (!fs.existsSync(publicPath)) {
        brokenLinks.push({ file: relPath, link: fullLink, reason: `Asset file not found in public: ${publicPath}` });
      }
      continue;
    }

    // Check against valid Astro page routes
    if (!validRoutes.has(normalized)) {
      brokenLinks.push({ file: relPath, link: fullLink, reason: `Route "${normalized}" does not exist in src/pages/` });
    }
  }
}

console.log(`\nAudited ${totalLinksFound} internal links across ${allFiles.length} files.`);

if (brokenLinks.length > 0) {
  console.error(`\n❌ FOUND ${brokenLinks.length} BROKEN LINKS:`);
  brokenLinks.forEach(b => console.error(`  - In [${b.file}]: href="${b.link}" -> ${b.reason}`));
} else {
  console.log('✅ PASS: All internal href routes and article slugs are 100% valid.');
}
