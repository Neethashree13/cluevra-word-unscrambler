// scripts/prerender.mjs
//
// Runs AFTER `vite build`. No browser, no Puppeteer, no native dependencies —
// just reads the built dist/index.html and writes a per-route copy with the
// correct <title>, meta description, canonical link, OG/Twitter tags, and
// WebApplication JSON-LD stamped in. Vercel serves a matching static file
// (e.g. dist/about/index.html) before falling back to the SPA rewrite in
// vercel.json, so crawlers get the right tags immediately, while real users
// still get the same JS bundle and the app hydrates normally.
//
// IMPORTANT: keep PAGES below in sync with config/site.ts's SITE_CONFIG.pages.
// If you add/rename a route there, mirror the change here too.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const DOMAIN = 'https://cluevra.com';

// Mirrors SITE_CONFIG.pages in config/site.ts
const PAGES = [
  {
    key: 'home',
    path: '/word-unscrambler',
    out: 'index.html',
    title: 'Word Unscrambler – Unscramble Letters & Find Words | Cluevra',
    description:
      "Unscramble letters instantly with Cluevra's free word unscrambler. Find words from your letters, use blank tiles, filter by word length, and solve word puzzles faster.",
    webAppName: 'Word Unscrambler',
  },
  {
    key: 'wordFinder',
    path: '/word-finder',
    out: 'word-finder/index.html',
    title: 'Word Finder - Find Words From Letters | Cluevra',
    description:
      "Find words from letters with Cluevra's Word Finder. Search by letters, word length, beginning, ending, or pattern to quickly find matching words.",
    webAppName: 'Word Finder',
  },
  {
    key: 'wordsWithLetters',
    path: '/words-with-letters',
    out: 'words-with-letters/index.html',
    title: 'Words With Letters - Find Words From Letters | Cluevra',
    description:
      'Find words using your available letters with Cluevra. Discover words from letter combinations, use wildcards, filter by length, and sort results by length, alphabet, or score.',
    webAppName: 'Words With Letters',
  },
  {
    key: 'anagramSolver',
    path: '/anagram-solver',
    out: 'anagram-solver/index.html',
    title: 'Anagram Solver - Find Anagrams From Letters | Cluevra',
    description:
      'Solve anagrams with Cluevra. Enter letters to find valid words and anagrams quickly, with wildcard support, word-length filters, and useful sorting options.',
    webAppName: 'Anagram Solver',
  },
  {
    key: 'fiveLetterFinder',
    path: '/5-letter-word-finder',
    out: '5-letter-word-finder/index.html',
    title: '5 Letter Word Finder | Cluevra',
    description:
      'Find 5 letter words from letters, patterns, and known positions. Use our free 5 letter word finder for Wordle, word games, puzzles, and more.',
    webAppName: '5 Letter Word Finder',
  },
  {
    key: 'sixLetterUnscrambler',
    path: '/6-letter-word-unscrambler',
    out: '6-letter-word-unscrambler/index.html',
    title: '6 Letter Word Unscrambler – Unscramble 6 Letter Words | Cluevra',
    description:
      'Enter up to 6 letters to find 6-letter words you can make from them. Use ? or * as blank tiles to solve anagrams, word games, and puzzles.',
    webAppName: '6 Letter Word Unscrambler',
  },
  {
    key: 'sevenLetterUnscrambler',
    path: '/7-letter-word-unscrambler',
    out: '7-letter-word-unscrambler/index.html',
    title: '7 Letter Word Unscrambler | Cluevra',
    description:
      'Unscramble up to 7 letters into valid words with our free 7 Letter Word Unscrambler. Find matching 7-letter words, use wildcard tiles, sort results, and solve word puzzles.',
    webAppName: '7 Letter Word Unscrambler',
  },
  {
    key: 'eightLetterUnscrambler',
    path: '/8-letter-word-unscrambler',
    out: '8-letter-word-unscrambler/index.html',
    title: '8 Letter Word Unscrambler - Unscramble 8 Letter Words | Cluevra',
    description:
      'Unscramble 8 letter words with Cluevra. Enter up to 8 letters, use wildcard tiles, and quickly find valid words for word games and puzzles.',
    webAppName: '8 Letter Word Unscrambler',
  },
  {
    key: 'about',
    path: '/about',
    out: 'about/index.html',
    title: 'About Cluevra',
    description:
      'Learn about Cluevra, our dictionary-based anagram solver and word-finding tool designed for word game players and puzzle enthusiasts.',
    webAppName: 'Word Unscrambler',
  },
  {
    key: 'privacy',
    path: '/privacy-policy',
    out: 'privacy-policy/index.html',
    title: 'Privacy Policy | Cluevra',
    description:
      'Read the Privacy Policy for Cluevra. Learn how we handle user data, local browser storage, and advertising policies for our free tool.',
    webAppName: 'Word Unscrambler',
  },
  {
    key: 'terms',
    path: '/terms',
    out: 'terms/index.html',
    title: 'Terms of Use | Cluevra',
    description:
      'Review the Terms of Use for Cluevra. Understand acceptable use, service conditions, advertising disclosures, and user responsibilities.',
    webAppName: 'Word Unscrambler',
  },
  {
    key: 'contact',
    path: '/contact',
    out: 'contact/index.html',
    title: 'Contact Cluevra',
    description:
      'Get in touch with the Cluevra team for feedback, bug reports, feature suggestions, or general inquiries.',
    webAppName: 'Word Unscrambler',
  },
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function dollarSafe(str) {
  return str.replace(/\$/g, '$$$$');
}

function replaceTitle(html, newTitle) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(newTitle)}</title>`);
}

// Finds a <meta .../> or <link .../> tag by one of its attributes, then
// replaces a different attribute's value within just that tag.
function replaceTagAttr(html, tagName, matchAttr, matchValue, targetAttr, newValue) {
  const tagRe = new RegExp(
    `<${tagName}[^>]*${matchAttr}=["']${escapeRegExp(matchValue)}["'][^>]*>`,
    'i'
  );
  return html.replace(tagRe, (tag) =>
    tag.replace(
      new RegExp(`${targetAttr}=(["'])[\\s\\S]*?\\1`),
      `${targetAttr}=$1${dollarSafe(escapeAttr(newValue))}$1`
    )
  );
}

function replaceJsonLdField(html, scriptId, mutateFn) {
  const re = new RegExp(`(<script id="${scriptId}"[^>]*>)([\\s\\S]*?)(</script>)`, 'i');
  return html.replace(re, (match, open, jsonText, close) => {
    try {
      const data = JSON.parse(jsonText);
      const mutated = mutateFn(data);
      return `${open}\n${JSON.stringify(mutated, null, 2)}\n${close}`;
    } catch (err) {
      console.warn(`  ! could not update JSON-LD #${scriptId}: ${err.message}`);
      return match;
    }
  });
}

function stripFaqSchema(html) {
  return html.replace(/\s*<script id="schema-faqpage"[^>]*>[\s\S]*?<\/script>/i, '');
}

async function main() {
  const templatePath = path.join(distDir, 'index.html');
  const template = await fs.readFile(templatePath, 'utf-8');

  for (const page of PAGES) {
    const canonicalUrl = `${DOMAIN}${page.path}`;
    let html = template;

    html = replaceTitle(html, page.title);
    html = replaceTagAttr(html, 'meta', 'name', 'description', 'content', page.description);
    html = replaceTagAttr(html, 'link', 'rel', 'canonical', 'href', canonicalUrl);
    html = replaceTagAttr(html, 'meta', 'property', 'og:title', 'content', page.title);
    html = replaceTagAttr(html, 'meta', 'property', 'og:description', 'content', page.description);
    html = replaceTagAttr(html, 'meta', 'property', 'og:url', 'content', canonicalUrl);
    html = replaceTagAttr(html, 'meta', 'name', 'twitter:title', 'content', page.title);
    html = replaceTagAttr(html, 'meta', 'name', 'twitter:description', 'content', page.description);

    html = replaceJsonLdField(html, 'schema-webapplication', (data) => ({
      ...data,
      name: `Cluevra ${page.webAppName}`,
      url: canonicalUrl,
      description: page.description,
    }));

    // FAQ schema is only authored for the home page's FAQ content today.
    // Keeping it on other pages would mismatch visible content, so drop it
    // there rather than show incorrect structured data.
    if (page.key !== 'home') {
      html = stripFaqSchema(html);
    }

    const outPath = path.join(distDir, page.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, 'utf-8');
    console.log(`✓ ${page.path} -> dist/${page.out}`);
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
