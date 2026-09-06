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
    "Unscramble letters instantly with Cluevra's free word unscrambler. Find words from letters, use blank tiles, filter by word length, and solve word puzzles faster.",
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
    wordFinder: {
      path: '/word-finder',
      title: 'Word Finder - Find Words From Letters | Cluevra',
      description:
        "Find words from letters with Cluevra's Word Finder. Search by letters, word length, beginning, ending, or pattern to quickly find matching words.",
    },
    wordsWithLetters: {
      path: '/words-with-letters',
      title: 'Words With Letters - Find Words From Letters | Cluevra',
      description:
        'Find words using your available letters with Cluevra. Discover words from letter combinations, use wildcards, filter by length, and sort results by length, alphabet, or score.',
    },
    anagramSolver: {
      path: '/anagram-solver',
      title: 'Anagram Solver - Find Anagrams From Letters | Cluevra',
      description:
        'Solve anagrams with Cluevra. Enter letters to find valid words and anagrams quickly, with wildcard support, word-length filters, and useful sorting options.',
    },
    fiveLetterFinder: {
      path: '/5-letter-word-finder',
      title: '5 Letter Word Finder | Cluevra',
      description:
        'Find 5 letter words from letters, patterns, and known positions. Use our free 5 letter word finder for Wordle, word games, puzzles, and more.',
    },
    sixLetterUnscrambler: {
      path: '/6-letter-word-unscrambler',
      title: '6 Letter Word Unscrambler - Unscramble 6 Letter Words | Cluevra',
      description:
        'Unscramble 6 letter words with Cluevra. Enter up to 6 letters, use wildcard tiles, and find valid 6 letter words quickly.',
    },
    sevenLetterUnscrambler: {
      path: '/7-letter-word-unscrambler',
      title: '7 Letter Word Unscrambler | Cluevra',
      description:
        'Unscramble up to 7 letters into valid words with our free 7 Letter Word Unscrambler. Find matching 7-letter words, use wildcard tiles, sort results, and solve word puzzles.',
    },
    eightLetterUnscrambler: {
      path: '/8-letter-word-unscrambler',
      title: '8 Letter Word Unscrambler - Unscramble 8 Letter Words | Cluevra',
      description:
        'Unscramble 8 letter words with Cluevra. Enter up to 8 letters, use wildcard tiles, and quickly find valid words for word games and puzzles.',
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
