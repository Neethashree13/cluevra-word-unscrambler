export type SortOption = 'length-desc' | 'length-asc' | 'alpha-asc' | 'score-desc';

export interface FilterState {
  minLength: number;
  maxLength: number;
  sortBy: SortOption;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface DictionaryStatus {
  loaded: boolean;
  totalWords: number;
  source: 'core' | 'full' | 'custom';
  loadError: string | null;
}

export interface WordGroup {
  length: number;
  label?: string;
  words: string[];
}

export interface UnscrambleOptions {
  minLength?: number;
  maxLength?: number;
  sortBy?: SortOption;
}

export interface UnscrambleResult {
  totalWords: number;
  groups: WordGroup[];
  allWords: string[];
  lettersNormalized: string;
  wildcardCount: number;
  validationError?: string | null;
}

export interface RecentSearchItem {
  id: string;
  letters: string;
  minLength: number;
  maxLength: number;
  sortBy: SortOption;
  timestamp: number;
}

export interface FiveLetterFilterOptions {
  pattern?: string | (string | null | undefined)[];
  startsWith?: string;
  endsWith?: string;
  containsLetters?: string;
  excludeLetters?: string;
  availableLetters?: string;
  sortBy?: 'alpha-asc' | 'alpha-desc';
}

export interface FiveLetterResult {
  totalWords: number;
  words: string[];
  patternNormalized: string;
  validationError?: string | null;
}

export type WordFinderLength = 'any' | number | '10+';

export interface WordFinderFilterOptions {
  letters?: string;
  length?: WordFinderLength;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  sortBy?: SortOption;
}

export interface WordFinderResult {
  totalWords: number;
  groups: WordGroup[];
  allWords: string[];
  lettersNormalized: string;
  wildcardCount: number;
  validationError?: string | null;
}

export type AnagramLength = 'exact' | 'any' | number | '10+';

export interface AnagramSolverOptions {
  letters?: string;
  length?: AnagramLength;
  sortBy?: SortOption;
}

export interface AnagramSolverResult {
  totalWords: number;
  groups: WordGroup[];
  allWords: string[];
  lettersNormalized: string;
  wildcardCount: number;
  isExactOnly: boolean;
  effectiveLength?: number;
  validationError?: string | null;
}

export type WordsWithLettersLength = 'any' | number | '10+';

export interface WordsWithLettersOptions {
  letters?: string;
  length?: WordsWithLettersLength;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  sortBy?: SortOption;
}

export interface WordsWithLettersResult {
  totalWords: number;
  groups: WordGroup[];
  allWords: string[];
  lettersNormalized: string;
  wildcardCount: number;
  validationError?: string | null;
}

