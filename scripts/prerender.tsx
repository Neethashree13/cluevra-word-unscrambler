import { PassThrough } from 'node:stream';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import App from '../src/App.tsx';
import { SITE_CONFIG } from '../src/config/site.ts';
import type { AppRoute } from '../src/lib/router.ts';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(scriptDir, '..', 'dist');
const domain = SITE_CONFIG.productionDomain;
const imageUrl = `${domain}/favicon.png.png`;
const outputRoutes: Record<keyof typeof SITE_CONFIG.pages, string> = {
  home: 'index.html',
  wordFinder: 'word-finder/index.html',
  wordsWithLetters: 'words-with-letters/index.html',
  anagramSolver: 'anagram-solver/index.html',
  fiveLetterFinder: '5-letter-word-finder/index.html',
  sixLetterUnscrambler: '6-letter-word-unscrambler/index.html',
  sevenLetterUnscrambler: '7-letter-word-unscrambler/index.html',
  eightLetterUnscrambler: '8-letter-word-unscrambler/index.html',
  about: 'about/index.html',
  privacy: 'privacy-policy/index.html',
  terms: 'terms/index.html',
  contact: 'contact/index.html',
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function replaceTitle(html: string, title: string): string {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceMeta(html: string, tagName: string, key: string, value: string, content: string): string {
  const tagPattern = new RegExp(`<${tagName}[^>]*${key}=["']${value}["'][^>]*>`, 'i');
  return html.replace(tagPattern, (tag) => tag.replace(/content=["'][^"']*["']/i, `content="${escapeHtml(content)}"`));
}

function replaceLink(html: string, rel: string, href: string): string {
  return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${href}" />`);
}

function wordCount(html: string): number {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39);/g, ' ');
  return (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
}

function renderApp(initialPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let markup = '';
    let renderer: ReturnType<typeof renderToPipeableStream>;
    renderer = renderToPipeableStream(createElement(App, { initialPath }), {
      onAllReady() {
        const output = new PassThrough();
        output.on('data', (chunk: Buffer) => { markup += chunk.toString(); });
        output.on('end', () => resolve(markup));
        output.on('error', reject);
        renderer.pipe(output);
      },
      onShellError: reject,
      onError: reject,
    });
  });
}

function buildBreadcrumbs(pathname: string, title: string) {
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${domain}/` }];
  if (pathname !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: title.replace(/\s*[|–-]\s*Cluevra$/, ''),
      item: `${domain}${pathname}`,
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items });
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf-8');
  const sitemapRoutes = new Set<string>();
  const titles = new Set<string>();
  const headings = new Set<string>();

  for (const [key, page] of Object.entries(SITE_CONFIG.pages) as [keyof typeof SITE_CONFIG.pages, (typeof SITE_CONFIG.pages)[keyof typeof SITE_CONFIG.pages]][]) {
    const pathname = page.path;
    const canonicalUrl = `${domain}${pathname}`;
    const appMarkup = await renderApp(pathname);
    const h1Matches = appMarkup.match(/<h1\b/gi) || [];
    const renderedWords = wordCount(appMarkup);
    if (h1Matches.length !== 1) {
      throw new Error(`${pathname} must render exactly one H1; found ${h1Matches.length}`);
    }
    if (renderedWords < 500) {
      throw new Error(`${pathname} renders only ${renderedWords} words; at least 500 are required`);
    }
    const h1 = (appMarkup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]*>/g, '').trim();
    if (titles.has(page.title) || headings.has(h1)) {
      throw new Error(`${pathname} has a duplicate title or H1`);
    }
    titles.add(page.title);
    headings.add(h1);

    let html = replaceTitle(template, page.title);
    html = replaceMeta(html, 'meta', 'name', 'description', page.description);
    html = replaceMeta(html, 'meta', 'property', 'og:title', page.title);
    html = replaceMeta(html, 'meta', 'property', 'og:description', page.description);
    html = replaceMeta(html, 'meta', 'property', 'og:url', canonicalUrl);
    html = replaceMeta(html, 'meta', 'property', 'og:image', imageUrl);
    html = replaceMeta(html, 'meta', 'name', 'twitter:card', 'summary_large_image');
    html = replaceMeta(html, 'meta', 'name', 'twitter:title', page.title);
    html = replaceMeta(html, 'meta', 'name', 'twitter:description', page.description);
    html = replaceMeta(html, 'meta', 'name', 'twitter:image', imageUrl);
    html = replaceLink(html, 'canonical', canonicalUrl);
    html = html.replace(/<script id="schema-breadcrumbs"[^>]*>[\s\S]*?<\/script>/i, `<script id="schema-breadcrumbs" type="application/ld+json">${buildBreadcrumbs(pathname, page.title)}</script>`);

    const webApp = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `Cluevra ${key === 'home' ? 'Word Unscrambler' : page.title.replace(/\s*[|–-]\s*Cluevra$/, '')}`,
      url: canonicalUrl,
      description: page.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      isAccessibleForFree: true,
      inLanguage: 'en-US',
      image: imageUrl,
      publisher: { '@type': 'Organization', name: SITE_CONFIG.siteName, url: domain },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };
    html = html.replace(/<script id="schema-webapplication"[^>]*>[\s\S]*?<\/script>/i, `<script id="schema-webapplication" type="application/ld+json">${JSON.stringify(webApp)}</script>`);
    html = key === 'home' ? html : html.replace(/\s*<script id="schema-faqpage"[^>]*>[\s\S]*?<\/script>/i, '');

    const root = /<div id="root"><\/div>/;
    if (!root.test(html)) throw new Error(`React root is missing from the HTML template for ${pathname}`);
    html = html.replace(root, `<div id="root">${appMarkup}</div>`);
    const outPath = path.join(distDir, outputRoutes[key]);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
    sitemapRoutes.add(`<loc>${canonicalUrl}</loc>`);
    console.log(`✓ ${pathname} (${renderedWords} words, one H1)`);
  }

  const sitemapPath = path.resolve(scriptDir, '../public/sitemap.xml');
  const sitemap = await fs.readFile(sitemapPath, 'utf-8');
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => `<loc>${match[1]}</loc>`);
  for (const loc of sitemapUrls) {
    if (!sitemapRoutes.has(loc)) throw new Error(`Sitemap contains a non-canonical or unknown URL: ${loc}`);
  }
  for (const loc of sitemapRoutes) {
    if (!sitemapUrls.includes(loc)) throw new Error(`Sitemap is missing a canonical page: ${loc}`);
  }

  let notFound = replaceTitle(template, 'Page Not Found | Cluevra');
  notFound = replaceMeta(notFound, 'meta', 'name', 'robots', 'noindex,follow');
  notFound = notFound.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, '');
  const notFoundMarkup = await renderApp('/404');
  notFound = notFound.replace(/<div id="root"><\/div>/, `<div id="root">${notFoundMarkup}</div>`);
  await fs.writeFile(path.join(distDir, '404.html'), notFound, 'utf-8');
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});