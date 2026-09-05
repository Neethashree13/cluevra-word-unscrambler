/**
 * SEO & Site Configuration
 *
 * Change `productionDomain` and `contactEmail` to your real values
 * before deploying to your production environment.
 */
export const SITE_CONFIG = {
  name: 'Cluevra',
  title: 'Word Unscrambler – Unscramble Letters & Find Words | Cluevra',
  description:
    "Unscramble letters instantly with Cluevra's free word unscrambler. Find words from your letters, use blank tiles, filter by word length, and solve word puzzles faster.",
  siteName: 'Cluevra',
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
      title: 'Word Unscrambler – Unscramble Letters & Find Words | Cluevra',
      description:
        "Unscramble letters instantly with Cluevra's free word unscrambler. Find words from your letters, use blank tiles, filter by word length, and solve word puzzles faster.",
    },
    fiveLetterFinder: {
      path: '/5-letter-word-finder',
      title: '5 Letter Word Finder | Cluevra',
      description:
        'Find 5 letter words from letters, patterns, and known positions. Use our free 5 letter word finder for Wordle, word games, puzzles, and more.',
    },
    sevenLetterUnscrambler: {
      path: '/7-letter-word-unscrambler',
      title: '7 Letter Word Unscrambler | Cluevra',
      description:
        'Unscramble up to 7 letters into valid words with our free 7 Letter Word Unscrambler. Find matching 7-letter words, use wildcard tiles, sort results, and solve word puzzles.',
    },
    about: {
      path: '/about',
      title: 'About Cluevra',
      description:
        'Learn about Cluevra, our dictionary-based anagram solver and word-finding tool designed for word game players and puzzle enthusiasts.',
    },
    privacy: {
      path: '/privacy-policy',
      title: 'Privacy Policy | Cluevra',
      description:
        'Read the Privacy Policy for Cluevra. Learn how we handle user data, local browser storage, and advertising policies for our free tool.',
    },
    terms: {
      path: '/terms',
      title: 'Terms of Use | Cluevra',
      description:
        'Review the Terms of Use for Cluevra. Understand acceptable use, service conditions, advertising disclosures, and user responsibilities.',
    },
    contact: {
      path: '/contact',
      title: 'Contact Cluevra',
      description:
        'Get in touch with the Cluevra team for feedback, bug reports, feature suggestions, or general inquiries.',
    },
  },
};
