import { normalizeWord, dictionaryService, WordDictionary } from './dictionary.ts';
import {
  canBuildWordWithWildcards,
  getLetterFrequency,
  sortResults,
  groupResultsByLength,
} from './unscrambler.ts';
import type { SortOption, WordGroup } from '../types.ts';

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

/**
 * Normalizes input string removing invalid characters and keeping letters and wildcards.
 */
export function normalizeSearchInput(raw: string): string {
  return (raw || '').replace(/[^a-zA-Z?*]/g, '').toUpperCase();
}

/**
 * Validates and extracts parameters for Word Finder search.
 */
export function validateWordFinderOptions(options: WordFinderFilterOptions): {
  isValid: boolean;
  validationError: string | null;
  letters: string;
  wildcardCount: number;
  normalizedLetters: string;
  startsWith: string;
  endsWith: string;
  contains: string;
  length: WordFinderLength;
  sortBy: SortOption;
} {
  const rawLetters = options.letters || '';
  const startsWith = normalizeWord(options.startsWith || '');
  const endsWith = normalizeWord(options.endsWith || '');
  const contains = normalizeWord(options.contains || '');
  const length = options.length !== undefined ? options.length : 'any';
  const sortBy: SortOption = options.sortBy || 'length-desc';

  // 1. Extract wildcards (? or *) from available letters
  const wildcardMatches = rawLetters.match(/[?*]/g);
  const wildcardCount = wildcardMatches ? wildcardMatches.length : 0;
  const letters = normalizeWord(rawLetters);

  // 2. Check if all fields are empty
  const hasLettersInput = rawLetters.trim().length > 0;
  const hasCriteria =
    letters.length > 0 ||
    wildcardCount > 0 ||
    startsWith.length > 0 ||
    endsWith.length > 0 ||
    contains.length > 0 ||
    (length !== 'any');

  if (!hasCriteria) {
    return {
      isValid: false,
      validationError: 'Please enter letters, a starting/ending pattern, or choose a word length.',
      letters: '',
      wildcardCount: 0,
      normalizedLetters: '',
      startsWith,
      endsWith,
      contains,
      length,
      sortBy,
    };
  }

  // 3. If raw letters were provided but contained no valid characters and no wildcards
  if (hasLettersInput && letters.length === 0 && wildcardCount === 0) {
    return {
      isValid: false,
      validationError: 'Please enter valid letters (A-Z) or wildcard tiles (? or *).',
      letters: '',
      wildcardCount: 0,
      normalizedLetters: '',
      startsWith,
      endsWith,
      contains,
      length,
      sortBy,
    };
  }

  // 4. Wildcard count limit
  if (wildcardCount > 3) {
    return {
      isValid: false,
      validationError: 'Please limit wildcards (? or *) to a maximum of 3.',
      letters,
      wildcardCount,
      normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
      startsWith,
      endsWith,
      contains,
      length,
      sortBy,
    };
  }

  // 5. Total letter length limit
  const totalLetters = letters.length + wildcardCount;
  if (totalLetters > 15) {
    return {
      isValid: false,
      validationError: 'Available letters cannot exceed 15 tiles.',
      letters,
      wildcardCount,
      normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
      startsWith,
      endsWith,
      contains,
      length,
      sortBy,
    };
  }

  // 6. Pattern length checks when specific length is chosen
  if (typeof length === 'number') {
    if (startsWith.length > length) {
      return {
        isValid: false,
        validationError: `"Starts with" (${startsWith.toUpperCase()}) is longer than the selected word length (${length}).`,
        letters,
        wildcardCount,
        normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
        startsWith,
        endsWith,
        contains,
        length,
        sortBy,
      };
    }

    if (endsWith.length > length) {
      return {
        isValid: false,
        validationError: `"Ends with" (${endsWith.toUpperCase()}) is longer than the selected word length (${length}).`,
        letters,
        wildcardCount,
        normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
        startsWith,
        endsWith,
        contains,
        length,
        sortBy,
      };
    }

    if (contains.length > length) {
      return {
        isValid: false,
        validationError: `"Contains" pattern (${contains.toUpperCase()}) is longer than the selected word length (${length}).`,
        letters,
        wildcardCount,
        normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
        startsWith,
        endsWith,
        contains,
        length,
        sortBy,
      };
    }

    // Overlap conflict check between startsWith and endsWith
    if (startsWith.length + endsWith.length > length) {
      const overlap = startsWith.length + endsWith.length - length;
      for (let i = 0; i < overlap; i++) {
        if (startsWith[startsWith.length - overlap + i] !== endsWith[i]) {
          return {
            isValid: false,
            validationError: `"Starts with" ('${startsWith.toUpperCase()}') and "Ends with" ('${endsWith.toUpperCase()}') conflict for a ${length}-letter word.`,
            letters,
            wildcardCount,
            normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
            startsWith,
            endsWith,
            contains,
            length,
            sortBy,
          };
        }
      }
    }
  }

  return {
    isValid: true,
    validationError: null,
    letters,
    wildcardCount,
    normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
    startsWith,
    endsWith,
    contains,
    length,
    sortBy,
  };
}

/**
 * Word Finder Search Engine:
 * Combines available letters, word lengths, startsWith, endsWith, and contains filters.
 */
export function findWords(
  options: WordFinderFilterOptions = {},
  dictionary: WordDictionary = dictionaryService
): WordFinderResult {
  const validated = validateWordFinderOptions(options);

  if (!validated.isValid) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: validated.normalizedLetters,
      wildcardCount: validated.wildcardCount,
      validationError: validated.validationError,
    };
  }

  const {
    letters,
    wildcardCount,
    normalizedLetters,
    startsWith,
    endsWith,
    contains,
    length,
    sortBy,
  } = validated;

  // Determine min and max length search range
  let minLen = 2;
  let maxLen = 15;

  if (typeof length === 'number') {
    minLen = length;
    maxLen = length;
  } else if (length === '10+') {
    minLen = 10;
    maxLen = 15;
  }

  const hasRack = letters.length > 0 || wildcardCount > 0;
  if (hasRack) {
    const totalRack = letters.length + wildcardCount;
    maxLen = Math.min(maxLen, totalRack);
  }

  // Ensure pattern lengths do not exceed maxLen
  const minRequiredByPatterns = Math.max(
    startsWith.length,
    endsWith.length,
    contains.length,
    minLen
  );

  if (minRequiredByPatterns > maxLen) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: normalizedLetters,
      wildcardCount,
      validationError: null,
    };
  }

  const effectiveMin = Math.max(minLen, minRequiredByPatterns);
  const availableFreq = hasRack ? getLetterFrequency(letters) : {};

  const matchedWords: string[] = [];

  for (let l = maxLen; l >= effectiveMin; l--) {
    const candidates = dictionary.getWordsByLength(l);
    if (!candidates || candidates.length === 0) {
      continue;
    }

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];

      // 1. Starts with prefix filter
      if (startsWith && !candidate.startsWith(startsWith)) {
        continue;
      }

      // 2. Ends with suffix filter
      if (endsWith && !candidate.endsWith(endsWith)) {
        continue;
      }

      // 3. Contains pattern filter
      if (contains && !candidate.includes(contains)) {
        continue;
      }

      // 4. Available letters & wildcards filter
      if (hasRack && !canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
        continue;
      }

      matchedWords.push(candidate);
    }
  }

  const sortedWords = sortResults(matchedWords, sortBy);
  const groups = groupResultsByLength(sortedWords, sortBy);

  return {
    totalWords: sortedWords.length,
    groups,
    allWords: sortedWords,
    lettersNormalized: normalizedLetters,
    wildcardCount,
    validationError: null,
  };
}

export default findWords;
