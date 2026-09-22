// scripts/prerender.mjs
//
// Runs AFTER `vite build`. Serves the built dist/ folder locally, visits every
// real route with a headless browser, waits for updatePageSEO() to finish
// updating <title>/<meta>/<link canonical>/JSON-LD, then saves the fully
// rendered HTML into dist/<route>/index.html.
//
// Vercel serves a matching static file before falling back to the SPA
// rewrite in vercel.json, so these prerendered files will be served directly
// for crawlers and social-preview bots, while real users still get the same
// JS bundle and the app hydrates over the static HTML as normal.

import { preview } from 'vite';
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const PRODUCTION_DOMAIN = 'https://cluevra.com';

// Keep this list in sync with getPathFromRoute() in lib/router.ts
const ROUTES = [
  { path: '/word-unscrambler', out: 'index.html' }, // also the SPA fallback
  { path: '/word-finder', out: 'word-finder/index.html' },
  { path: '/words-with-letters', out: 'words-with-letters/index.html' },
  { path: '/anagram-solver', out: 'anagram-solver/index.html' },
  { path: '/5-letter-word-finder', out: '5-letter-word-finder/index.html' },
  { path: '/6-letter-word-unscrambler', out: '6-letter-word-unscrambler/index.html' },
  { path: '/7-letter-word-unscrambler', out: '7-letter-word-unscrambler/index.html' },
  { path: '/8-letter-word-unscrambler', out: '8-letter-word-unscrambler/index.html' },
  { path: '/about', out: 'about/index.html' },
  { path: '/privacy-policy', out: 'privacy-policy/index.html' },
  { path: '/terms', out: 'terms/index.html' },
  { path: '/contact', out: 'contact/index.html' },
];

async function main() {
  const server = await preview({ preview: { port: PORT, strictPort: true } });
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    for (const route of ROUTES) {
      const expectedCanonical = `${PRODUCTION_DOMAIN}${route.path}`;
      const page = await browser.newPage();

      await page.goto(`${BASE}${route.path}`, { waitUntil: 'load' });

      // Wait until updatePageSEO() has actually written this route's
      // canonical URL into the DOM before snapshotting.
      await page.waitForFunction(
        (expected) =>
          document.querySelector('link[rel="canonical"]')?.getAttribute('href') === expected,
        { timeout: 10000 },
        expectedCanonical
      );

      // Small extra buffer for any late-settling child components/FAQ content.
      await new Promise((r) => setTimeout(r, 150));

      const html = await page.content();
      const outPath = path.join(distDir, route.out);
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, html, 'utf-8');
      console.log(`✓ prerendered ${route.path} -> dist/${route.out}`);

      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
