import type { FAQItem } from '../types.ts';

export const WORD_FINDER_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is-word-finder',
    question: 'What is a Word Finder?',
    answer:
      'A Word Finder is a versatile search tool that discovers valid dictionary words using any combination of available letters, word lengths, starting letters, ending letters, and contained letter patterns. Unlike a basic anagram solver that only rearranges letters, a Word Finder helps you solve crosswords, fill game boards, and find words with specific constraints.',
  },
  {
    id: 'faq-how-to-find-words-from-letters',
    question: 'How do I find words from letters?',
    answer:
      'Enter the letters from your tile rack or puzzle into the "Available Letters" field. Cluevra scans our comprehensive 168,551-word English dictionary to identify every word that can be constructed with those letters, respecting duplicate letter counts.',
  },
  {
    id: 'faq-search-starts-with',
    question: 'Can I search for words starting with specific letters?',
    answer:
      'Yes. Enter one or more letters in the "Starts With" field (for example, "TR"). The tool filters results to only words that begin with that exact prefix (such as "TREE", "TRAIN", or "TRACK"), with or without available rack letters.',
  },
  {
    id: 'faq-search-ends-with',
    question: 'Can I search for words ending with specific letters?',
    answer:
      'Yes. Enter your suffix in the "Ends With" field (for example, "ING" or "ED"). The tool returns all dictionary words ending with that suffix (such as "RUNNING", "PLAYING", or "WALKED").',
  },
  {
    id: 'faq-contains-pattern',
    question: 'How does the "Contains" pattern filter work?',
    answer:
      'The "Contains" field searches for words that include a specific sequence of letters anywhere inside them (for example, "TION" finds "ACTION", "MOTION", and "STATION"). When combined with rack letters, the word must also be formable from your available tiles.',
  },
  {
    id: 'faq-combine-filters',
    question: 'Can I combine letters, word length, and letter patterns together?',
    answer:
      'Yes. You can combine any or all criteria simultaneously. For example, you can enter available letters "ARET?", set the length to 5 letters, and specify starts with "T" to find matching 5-letter plays like "TAMER", "TRADE", and "TREAT".',
  },
  {
    id: 'faq-wildcards',
    question: 'Can I use wildcard or blank tiles in Word Finder?',
    answer:
      'Yes. You can use a question mark (?) or asterisk (*) in the Available Letters box to represent blank Scrabble tiles or missing letters. Cluevra supports up to 3 wildcards per search, substituting each tile with all 26 letters of the alphabet.',
  },
  {
    id: 'faq-word-length-filter',
    question: 'Can I filter results by specific word length?',
    answer:
      'Yes. Use the "Word Length" dropdown to choose "Any Length", a specific count from 2 to 15 letters, or "10+ Letters". The results are grouped by length and can be sorted alphabetically (A-Z), longest-first, or shortest-first.',
  },
  {
    id: 'faq-mobile-support',
    question: 'Does Cluevra Word Finder work on mobile devices?',
    answer:
      'Yes. Cluevra Word Finder is fully responsive and optimized for touch screens, mobile keyboards, tablets, and desktop browsers without requiring app downloads or account registrations.',
  },
  {
    id: 'faq-dictionary-source',
    question: 'What dictionary does the tool use?',
    answer:
      'Cluevra utilizes a curated tournament-standard English dictionary of 168,551 words. Every solution returned is an authentic, recognized dictionary entry complete with standard Scrabble-style letter tile point calculations.',
  },
];
