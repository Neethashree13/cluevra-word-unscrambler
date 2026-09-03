import { SITE_CONFIG } from '../config/site.ts';

export type AppRoute = 'home' | 'about' | 'privacy' | 'terms' | 'contact';

/**
 * Normalizes window.location.pathname into an AppRoute identifier.
 */
export function getRouteFromPath(pathname: string): AppRoute {
  // Strip trailing slash unless it's just '/'
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  switch (cleanPath) {
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
 * Updates document.title, meta descriptions, canonical URLs, and social tags for the active page route.
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
}
