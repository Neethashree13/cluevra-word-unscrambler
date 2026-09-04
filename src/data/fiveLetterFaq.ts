import type { FAQItem } from '../types.ts';

export const FIVE_LETTER_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is',
    question: 'What is a 5 letter word finder?',
    answer:
      'A 5 letter word finder is a specialized word-solving tool that helps you discover, filter, and solve five-letter English words using known letter positions, patterns, starting and ending letters, required letters, and excluded letters.',
  },
  {
    id: 'faq-how-pattern',
    question: 'How do I find a 5 letter word from a pattern?',
    answer:
      'Enter known letters into their exact positions across the five tile boxes (or type a pattern like _ A _ E _). Leave unknown positions blank or as underscores. The finder instantly checks the dictionary and returns all five-letter words matching that exact letter placement.',
  },
  {
    id: 'faq-can-exclude',
    question: 'Can I exclude letters?',
    answer:
      'Yes. Enter any letters you know are not in the word into the "Exclude Letters" box. The tool will automatically eliminate any word containing those letters from your results.',
  },
  {
    id: 'faq-can-contains',
    question: 'Can I find words containing specific letters?',
    answer:
      'Yes. Use the "Contains Letters" field to specify letters that must appear somewhere in the word, even if you do not yet know their exact positions.',
  },
  {
    id: 'faq-is-free',
    question: 'Is the tool free?',
    answer:
      'Yes, the 5 Letter Word Finder on ClueVra is 100% free with no account, signup, or subscription required. You can search as many patterns and letter combinations as you need.',
  },
  {
    id: 'faq-mobile',
    question: 'Does it work on mobile?',
    answer:
      'Yes. The 5 Letter Word Finder is fully responsive and optimized for mobile smartphones, tablets, and desktop computers with touch-friendly controls and instant auto-advancing letter inputs.',
  },
];
