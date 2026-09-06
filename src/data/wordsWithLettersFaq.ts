import type { FAQItem } from '../types.ts';

export const WORDS_WITH_LETTERS_FAQS: FAQItem[] = [
  {
    id: 'faq-what-is-words-with-letters',
    question: 'What does "Words With Letters" mean?',
    answer:
      'Words With Letters is a word search tool designed to answer: "What words can I make with these letters?" It finds all valid dictionary words that can be assembled using any combination or subset of your available tiles or letters.',
  },
  {
    id: 'faq-all-letters-needed',
    question: 'Do I have to use all my available letters?',
    answer:
      'No. Unlike an Anagram Solver which strictly requires using all supplied letters by default, Words With Letters searches for all valid words of any length (from 2 letters up to your total letter count) that can be built from your available tiles.',
  },
  {
    id: 'faq-how-it-works',
    question: 'How does the Words With Letters tool work?',
    answer:
      'The tool normalizes your input, analyzes character frequencies, and compares them against Cluevra’s comprehensive 168,551-word tournament dictionary. It extracts every valid word whose letter requirements can be satisfied by your letter bank and wildcards.',
  },
  {
    id: 'faq-letter-frequency',
    question: 'How does letter frequency work?',
    answer:
      'The algorithm enforces exact character counts. For example, if you enter "APPLE" (two P’s, one A, one L, one E), you can make words like "APPLE", "PEAL", and "PLEA", but you cannot make "PAPER" because you do not have an R, nor can you make a word requiring three P’s unless you supply a wildcard tile.',
  },
  {
    id: 'faq-wildcards',
    question: 'How do wildcards work?',
    answer:
      'You can include up to 3 wildcards using question marks (?) or asterisks (*) to represent blank tiles. Each wildcard can represent any letter from A to Z when forming dictionary words.',
  },
  {
    id: 'faq-diff-word-finder',
    question: 'What is the difference between Words With Letters and Word Finder?',
    answer:
      'Word Finder allows broad pattern queries without entering letters (such as finding all words starting with "UN" or ending with "ING"). Words With Letters is focused on rack-based tile play: you supply your available letters, and optionally filter those letter-built words by prefix, suffix, substring, or length.',
  },
  {
    id: 'faq-diff-anagram-solver',
    question: 'What is the difference between Words With Letters and Anagram Solver?',
    answer:
      'An Anagram Solver defaults to exact rearrangements using every single letter (e.g. LISTEN -> SILENT). Words With Letters defaults to finding all possible sub-words (e.g. PLANET -> PLANET, PLANE, PLANT, PLATE, LATE, LANE, LEAN).',
  },
  {
    id: 'faq-filters',
    question: 'Can I filter by length, starts with, ends with, or contains?',
    answer:
      'Yes. You can narrow down your results to specific word lengths (e.g., 5 letters), or require that the generated words start with a specific prefix, end with a suffix, or contain a particular letter sequence.',
  },
  {
    id: 'faq-sorting',
    question: 'How can I sort the results?',
    answer:
      'You can sort by Word Length (Longest First or Shortest First), Alphabetical (A to Z), or Scrabble Tile Score (Highest Score First) based on official letter values.',
  },
  {
    id: 'faq-word-games',
    question: 'How can I use this tool to win Scrabble and Words with Friends?',
    answer:
      'Enter the 7 tiles on your rack (including ? for blank tiles). Sort by Highest Score or Longest Word, and use the "Starts with" or "Ends with" filters to connect with open letters already played on the board.',
  },
];
