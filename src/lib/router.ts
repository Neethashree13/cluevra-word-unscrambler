import { SITE_CONFIG } from '../config/site.ts';
import { FIVE_LETTER_FAQS } from '../data/fiveLetterFaq.ts';
import { SEVEN_LETTER_FAQS } from '../data/sevenLetterFaq.ts';
import { FAQ_DATA } from '../data/faqData.ts';

export type AppRoute = 'home' | 'fiveLetterFinder' | 'sevenLetterUnscrambler' | 'about' | 'privacy' | 'terms' | 'contact';

/**
 * Normalizes window.location.pathname into an AppRoute identifier.
 */
export function getRouteFromPath(pathname: string): AppRoute {
  // Strip trailing slash unless it's just '/'
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  switch (cleanPath) {
    case '/5-letter-word-finder':
      return 'fiveLetterFinder';
    case '/7-letter-word-unscrambler':
      return 'sevenLetterUnscrambler';
    case '/about':
      return 'about';
    case '/privacy-policy':
      return 'privacy';
    case '/terms':
      return 'terms';
    case '/contact':
      return 'contact';
    case '/word-unscrambler':
    case '/':
    default:
      return 'home';
  }
}

/**
 * Maps an AppRoute to its canonical URL path.
 */
export function getPathFromRoute(route: AppRoute): string {
  switch (route) {
    case 'fiveLetterFinder':
      return '/5-letter-word-finder';
    case 'sevenLetterUnscrambler':
      return '/7-letter-word-unscrambler';
    case 'about':
      return '/about';
    case 'privacy':
      return '/privacy-policy';
    case 'terms':
      return '/terms';
    case 'contact':
      return '/contact';
    case 'home':
    default:
      return '/word-unscrambler';
  }
}

/**
 * Updates document.title, meta descriptions, canonical URLs, social tags, and structured data JSON-LD.
 */
export function updatePageSEO(route: AppRoute) {
  if (typeof document === 'undefined') return;

  const pageMeta = SITE_CONFIG.pages[route] || SITE_CONFIG.pages.home;
  const canonicalUrl = `${SITE_CONFIG.productionDomain}${pageMeta.path}`;

  document.title = pageMeta.title;

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', canonicalUrl);
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', pageMeta.description);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', pageMeta.title);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', pageMeta.description);
  }

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) {
    ogUrl.setAttribute('content', canonicalUrl);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', pageMeta.title);
  }

  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc) {
    twitterDesc.setAttribute('content', pageMeta.description);
  }

  // Update JSON-LD WebApplication schema
  const webAppScript = document.getElementById('schema-webapplication');
  if (webAppScript) {
    const webAppName =
      route === 'sevenLetterUnscrambler'
        ? '7 Letter Word Unscrambler'
        : route === 'fiveLetterFinder'
        ? '5 Letter Word Finder'
        : 'Word Unscrambler';
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: webAppName,
      url: canonicalUrl,
      description: pageMeta.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };
    webAppScript.textContent = JSON.stringify(webAppSchema, null, 2);
  }

  // Update JSON-LD FAQPage schema (matches visible on-page content exactly)
  const faqScript = document.getElementById('schema-faqpage');
  if (faqScript) {
    const activeFaqs =
      route === 'sevenLetterUnscrambler'
        ? SEVEN_LETTER_FAQS
        : route === 'fiveLetterFinder'
        ? FIVE_LETTER_FAQS
        : route === 'home'
        ? FAQ_DATA
        : [];
    if (activeFaqs.length > 0) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: activeFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };
      faqScript.textContent = JSON.stringify(faqSchema, null, 2);
    }
  }
}

