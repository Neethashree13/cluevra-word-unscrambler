/**
 * SEO & Site Configuration
 *
 * Change `productionDomain` and `contactEmail` to your real values
 * before deploying to your production environment.
 */
export const SITE_CONFIG = {
  name: 'Word Unscrambler',
  title: 'Word Unscrambler - Unscramble Letters Into Words',
  description:
    'Unscramble letters into words with our free Word Unscrambler. Find words from letters, use wildcards, filter by length, sort results, and copy your answers.',
  siteName: 'Word Unscrambler',
  // Configurable production domain
  productionDomain: 'https://cluevra.com',
  productionPath: '/word-unscrambler',
  // Support contact email
  contactEmail: 'neethashree13@gmail.com',
  get canonicalUrl(): string {
    return `${this.productionDomain}${this.productionPath}`;
  },
  pages: {
    home: {
      path: '/word-unscrambler',
      title: 'Word Unscrambler - Unscramble Letters Into Words',
      description:
        'Unscramble letters into words with our free Word Unscrambler. Find words from letters, use wildcards, filter by length, sort results, and copy your answers.',
    },
    about: {
      path: '/about',
      title: 'About Word Unscrambler',
      description:
        'Learn about Word Unscrambler, our dictionary-based anagram solver and word-finding tool designed for word game players and puzzle enthusiasts.',
    },
    privacy: {
      path: '/privacy-policy',
      title: 'Privacy Policy - Word Unscrambler',
      description:
        'Read the Privacy Policy for Word Unscrambler. Learn how we handle user data, local browser storage, and advertising policies for our free tool.',
    },
    terms: {
      path: '/terms',
      title: 'Terms of Use - Word Unscrambler',
      description:
        'Review the Terms of Use for Word Unscrambler. Understand acceptable use, service conditions, advertising disclosures, and user responsibilities.',
    },
    contact: {
      path: '/contact',
      title: 'Contact Word Unscrambler',
      description:
        'Get in touch with the Word Unscrambler team for feedback, bug reports, feature suggestions, or general inquiries.',
    },
  },
};
