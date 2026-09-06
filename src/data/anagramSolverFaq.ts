import type { FAQItem } from '../types.ts';

export const ANAGRAM_SOLVER_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is-an-anagram',
    question: 'What is an anagram?',
    answer:
      'An anagram is a word or phrase formed by rearranging the exact letters of another word or phrase using each original letter once. For example, LISTEN is an anagram of SILENT, ENLIST, INLETS, and TINSEL.',
  },
  {
    id: 'faq-how-it-works',
    question: 'How does the Anagram Solver work?',
    answer:
      'The Anagram Solver normalizes your entered letters, counts letter frequencies, and cross-references them against Cluevra’s 168,551-word tournament dictionary. In exact mode, it uses precomputed letter signature hashes for instant O(1) matching.',
  },
  {
    id: 'faq-exact-anagrams',
    question: 'Can I find exact anagrams?',
    answer:
      'Yes. Exact Anagrams mode is the default setting. It restricts results to words that match the exact letter count and letter frequencies of your input, ensuring every available letter is used.',
  },
  {
    id: 'faq-wildcards',
    question: 'Can I use blank or wildcard letters?',
    answer:
      'Yes. You can enter up to 3 question marks (?) or asterisks (*) to represent blank tiles. The solver dynamically substitutes the wildcards across all 26 alphabet letters to find valid anagram solutions.',
  },
  {
    id: 'faq-length-filter',
    question: 'Can I filter anagrams by word length?',
    answer:
      'Yes. You can keep the default Exact Length mode, switch to Any Length to discover all smaller sub-anagrams, or choose a specific length (such as 5 letters) to explore target puzzle solutions.',
  },
  {
    id: 'faq-sorting',
    question: 'Can I sort the results?',
    answer:
      'Yes. You can sort anagrams by Word Length (Longest First or Shortest First), Alphabetical (A to Z), or Scrabble Score (Highest Score First) based on official letter point values.',
  },
  {
    id: 'faq-phrases',
    question: 'Can I enter phrases with spaces?',
    answer:
      'Yes. Spaces and punctuation in phrases (such as "THE EYES") are automatically stripped to extract the complete pool of available letters, allowing you to solve for single-word anagrams and sub-anagrams.',
  },
  {
    id: 'faq-diff-unscrambler',
    question: 'How is an Anagram Solver different from a Word Unscrambler?',
    answer:
      'A Word Unscrambler prioritizes discovering every possible smaller sub-word from a rack of letters. An Anagram Solver defaults to exact rearrangements using all provided letters, making it ideal for direct anagram puzzles.',
  },
  {
    id: 'faq-dictionary',
    question: "Does the solver use the same dictionary as Cluevra's other tools?",
    answer:
      'Yes. The Anagram Solver is powered by the same verified 168,551-word Scrabble-tournament and standard English dictionary shared across all Cluevra tools.',
  },
  {
    id: 'faq-mobile',
    question: 'Can I use the Anagram Solver on mobile?',
    answer:
      'Yes. Cluevra is fully responsive and optimized for touch devices, smartphones, tablets, and desktops with zero downloads or account registration required.',
  },
];
