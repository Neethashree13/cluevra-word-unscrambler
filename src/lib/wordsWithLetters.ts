import { normalizeWord, dictionaryService, WordDictionary } from './dictionary.ts';
import {
  canBuildWordWithWildcards,
  getLetterFrequency,
  sortResults,
  groupResultsByLength,
} from './unscrambler.ts';
import type {
  SortOption,
  WordsWithLettersLength,
  WordsWithLettersOptions,
  WordsWithLettersResult,
} from '../types.ts';

export type { WordsWithLettersLength, WordsWithLettersOptions, WordsWithLettersResult };

/**
 * Normalizes user input letters:
 * - Replaces '*' with '?' wildcards
 * - Strips characters other than letters and '?'
 * - Converts to uppercase
 */
export function normalizeLettersInput(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\*/g, '?')
    .replace(/[^a-zA-Z?]/g, '')
    .toUpperCase();
}

/**
 * Validates and extracts parameters for Words With Letters search.
 */
export function validateWordsWithLettersOptions(options: WordsWithLettersOptions): {
  isValid: boolean;
  validationError: string | null;
  letters: string;
  wildcardCount: number;
  normalizedLetters: string;
  startsWith: string;
  endsWith: string;
  contains: string;
  length: WordsWithLettersLength;
  sortBy: SortOption;
} {
  const rawLetters = options.letters || '';
  const startsWith = normalizeWord(options.startsWith || '');
  const endsWith = normalizeWord(options.endsWith || '');
  const contains = normalizeWord(options.contains || '');
  const length: WordsWithLettersLength = options.length !== undefined ? options.length : 'any';
  const sortBy: SortOption = options.sortBy || 'length-desc';

  // 1. Check if letters input is empty or whitespace only
  if (!rawLetters.trim()) {
    return {
      isValid: false,
      validationError: 'Please enter available letters to find words.',
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

  // 2. Normalize and count wildcards
  const normalizedRaw = rawLetters.replace(/\*/g, '?');
  const wildcardMatches = normalizedRaw.match(/\?/g);
  const wildcardCount = wildcardMatches ? wildcardMatches.length : 0;
  const letters = normalizeWord(rawLetters);

  // 3. Letters input contains characters, but no letters and no wildcards
  if (letters.length === 0 && wildcardCount === 0) {
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
 * Words With Letters Search Engine:
 * Answers: "What words can I make with these letters?"
 * Allows any valid subset of available letters (does not require using all letters).
 * Respects letter frequencies and up to 3 wildcards.
 * Supports optional word length, startsWith, endsWith, and contains filters.
 */
export function findWordsWithLetters(
  options: WordsWithLettersOptions = {},
  dictionary: WordDictionary = dictionaryService
): WordsWithLettersResult {
  const validated = validateWordsWithLettersOptions(options);

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

  const totalRack = letters.length + wildcardCount;

  // Determine min and max length search range
  let minLen = 2;
  let maxLen = Math.min(15, totalRack);

  if (typeof length === 'number') {
    minLen = length;
    maxLen = length;
  } else if (length === '10+') {
    minLen = 10;
    maxLen = Math.min(15, totalRack);
  }

  // If user requested a length longer than the total available rack, no valid words can be made
  if (minLen > totalRack) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: normalizedLetters,
      wildcardCount,
      validationError: null,
    };
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
  const availableFreq = getLetterFrequency(letters);

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

      // 4. Available letters & wildcards frequency check
      if (!canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
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

export default findWordsWithLetters;
