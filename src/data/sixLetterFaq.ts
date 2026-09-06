import type { FAQItem } from '../types.ts';

export const SIX_LETTER_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is-6-letter',
    question: 'What is a 6 letter word unscrambler?',
    answer:
      'A 6 letter word unscrambler is a dedicated anagram solver designed to take up to 6 scrambled letters and find every valid 6-letter English word that can be made from them. It is ideal for 6-letter puzzle games, Wordle variants, Text Twist, Scrabble, and daily newspaper anagrams.',
  },
  {
    id: 'faq-how-to-unscramble-6',
    question: 'How do I unscramble 6 letters?',
    answer:
      'Type or paste up to 6 letters into the input box and click "Unscramble" or press Enter. The tool instantly queries the loaded English dictionary and displays all valid 6-letter words, sorted in your chosen order.',
  },
  {
    id: 'faq-wildcards-6',
    question: 'Can I use blank or wildcard tiles?',
    answer:
      'Yes. You can enter "?" or "*" for wildcard tiles (up to 3 wildcards per search). Each wildcard can represent any letter from A to Z, helping you discover valid 6-letter words even if you are missing tiles.',
  },
  {
    id: 'faq-duplicate-letters-6',
    question: 'Can I enter duplicate letters?',
    answer:
      'Yes. Duplicate letters are fully supported and their counts are strictly respected. A letter will only appear in candidate words as many times as you have provided it, unless a wildcard tile is used to substitute for an additional instance.',
  },
  {
    id: 'faq-full-dictionary-6',
    question: 'Does the tool check against a full English dictionary?',
    answer:
      'Yes. Cluevra verifies your letters against our loaded English dictionary containing over 168,000 words. Every 6-letter word returned is a verified English word suitable for tournament and recreational word games.',
  },
];
