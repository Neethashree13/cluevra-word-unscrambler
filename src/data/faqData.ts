import type { FAQItem } from '../types.ts';

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-what-is',
    question: 'What is a word unscrambler?',
    answer:
      'A word unscrambler is a free online tool that rearranges scrambled letters into all possible valid dictionary words. It serves as an anagram solver and word finder for games like Scrabble, Words with Friends, Wordfeud, and crossword puzzles.',
  },
  {
    id: 'faq-how-unscramble',
    question: 'How do I unscramble letters?',
    answer:
      'Enter your letters into the input box and click Unscramble. You can enter letters in any order, use spaces or punctuation (which are automatically cleaned), and press Enter to instantly see all valid matching words grouped by length.',
  },
  {
    id: 'faq-duplicate-letters',
    question: 'Can I use duplicate letters?',
    answer:
      "Yes. The unscrambler strictly respects letter frequencies. If you enter two 'A's, only words requiring up to two 'A's will be generated. Words requiring more copies of a letter than you provided will not be shown.",
  },
  {
    id: 'faq-blank-wildcard-tiles',
    question: 'Can I use blank or wildcard tiles?',
    answer:
      'Yes. You can use question marks (?) or asterisks (*) to represent blank tiles. Each wildcard can represent any letter from A to Z, allowing you to solve board game racks with unknown or blank spaces (up to 3 wildcards supported).',
  },
  {
    id: 'faq-filter-length',
    question: 'Can I filter words by length?',
    answer:
      'Yes. Use the word length sliders to define minimum and maximum word lengths between 2 and 15 letters. You can also sort the results by longest first, shortest first, or alphabetically.',
  },
  {
    id: 'faq-mobile-support',
    question: 'Does the tool work on mobile?',
    answer:
      'Yes. The Word Unscrambler is fully responsive and optimized for mobile devices, tablets, and desktop browsers with touch-friendly controls and instant copy features.',
  },
  {
    id: 'faq-is-free',
    question: 'Is the Word Unscrambler free?',
    answer:
      'Yes, the Word Unscrambler is 100% free to use with no account registration, subscriptions, or hidden limits required.',
  },
];
