import type { FAQItem } from '../types.ts';

export const SEVEN_LETTER_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is-7-letter',
    question: 'What is a 7 letter word unscrambler?',
    answer:
      'A 7 letter word unscrambler is a specialized anagram solver that checks up to 7 scrambled letters against a comprehensive dictionary to find every valid seven-letter word that can be constructed from your tiles. It is especially useful for board game bingos, anagram challenges, and jumble puzzles.',
  },
  {
    id: 'faq-how-to-unscramble-7',
    question: 'How do I unscramble 7 letters?',
    answer:
      'Enter up to 7 letters in any order into the input box and click "Unscramble" (or press Enter). The tool compares your letter set against the dictionary and displays matching 7-letter words instantly, sorted by your preferred order.',
  },
  {
    id: 'faq-wildcards-7',
    question: 'Can I use blank or wildcard tiles?',
    answer:
      'Yes. You can use "?" or "*" to represent wildcard or blank tiles (up to 3 wildcards supported). Each wildcard stands in for any missing letter from A to Z, helping you discover valid 7-letter word combinations when your rack is incomplete.',
  },
  {
    id: 'faq-duplicate-letters-7',
    question: 'Can I enter duplicate letters?',
    answer:
      'Yes. You can enter duplicate letters, and letter frequencies are strictly respected. A letter will only be used up to the number of times it appears in your entered letters, unless a blank or wildcard tile is used to provide extra instances.',
  },
  {
    id: 'faq-full-dictionary-7',
    question: 'Does the tool show words from the full dictionary?',
    answer:
      'Yes. Cluevra checks your letters against its loaded English word dictionary. All returned 7-letter words are verified against this dictionary so you can confidently use them in word games and puzzles.',
  },
];
