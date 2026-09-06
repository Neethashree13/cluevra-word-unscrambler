import { normalizeWord, dictionaryService, WordDictionary } from './dictionary.ts';
import {
  canBuildWordWithWildcards,
  getLetterFrequency,
  sortResults,
  groupResultsByLength,
} from './unscrambler.ts';
import type {
  AnagramLength,
  AnagramSolverOptions,
  AnagramSolverResult,
  SortOption,
  WordGroup,
} from '../types.ts';

export type { AnagramLength, AnagramSolverOptions, AnagramSolverResult };

/**
 * Normalizes user input for Anagram Solver:
 * - Replaces '*' with '?' wildcards
 * - Keeps uppercase letters and wildcards
 * - Preserves phrase characters during initial input entry
 */
export function normalizeAnagramInput(raw: string): string {
  return (raw || '').replace(/\*/g, '?').replace(/[^a-zA-Z?\s]/g, '').toUpperCase();
}

/**
 * Validates and extracts parameters for Anagram Solver search.
 */
export function validateAnagramSolverOptions(options: AnagramSolverOptions): {
  isValid: boolean;
  validationError: string | null;
  letters: string;
  wildcardCount: number;
  totalAvailableLength: number;
  normalizedLetters: string;
  length: AnagramLength;
  sortBy: SortOption;
} {
  const rawLetters = options.letters || '';
  const length: AnagramLength = options.length !== undefined ? options.length : 'exact';
  const sortBy: SortOption = options.sortBy || 'length-desc';

  // 1. Extract wildcards (? or *) before stripping non-letters
  const wildcardMatches = rawLetters.match(/[?*]/g);
  const wildcardCount = wildcardMatches ? wildcardMatches.length : 0;

  // 2. Extract standard alphabetic letters (A-Z), ignoring spaces and punctuation
  const letters = normalizeWord(rawLetters);

  // 3. Empty input validation
  if (rawLetters.trim().length === 0) {
    return {
      isValid: false,
      validationError: 'Please enter letters or a phrase to find anagrams.',
      letters: '',
      wildcardCount: 0,
      totalAvailableLength: 0,
      normalizedLetters: '',
      length,
      sortBy,
    };
  }

  // 4. Input provided but no valid alphabetic characters or wildcards
  if (letters.length === 0 && wildcardCount === 0) {
    return {
      isValid: false,
      validationError: 'Please enter valid letters (A-Z) or wildcard tiles (?).',
      letters: '',
      wildcardCount: 0,
      totalAvailableLength: 0,
      normalizedLetters: '',
      length,
      sortBy,
    };
  }

  // 5. Wildcard count limit
  if (wildcardCount > 3) {
    return {
      isValid: false,
      validationError: 'Please limit wildcards (?) to a maximum of 3.',
      letters,
      wildcardCount,
      totalAvailableLength: letters.length + wildcardCount,
      normalizedLetters: `${letters.toUpperCase()}${'?'.repeat(wildcardCount)}`,
      length,
      sortBy,
    };
  }

  // 6. Total length check (max 15 letters)
  const totalAvailableLength = letters.length + wildcardCount;
  if (totalAvailableLength > 15) {
    return {
      isValid: false,
      validationError: 'Input is too long. Please enter up to 15 letters.',
      letters,
      wildcardCount,
      totalAvailableLength,
      normalizedLetters: `${letters.toUpperCase()}${'?'.repeat(wildcardCount)}`,
      length,
      sortBy,
    };
  }

  // 7. Minimum length check for exact anagrams (need at least 2 letters)
  if (totalAvailableLength < 2) {
    return {
      isValid: false,
      validationError: 'Please enter at least 2 letters to find anagrams.',
      letters,
      wildcardCount,
      totalAvailableLength,
      normalizedLetters: `${letters.toUpperCase()}${'?'.repeat(wildcardCount)}`,
      length,
      sortBy,
    };
  }

  return {
    isValid: true,
    validationError: null,
    letters,
    wildcardCount,
    totalAvailableLength,
    normalizedLetters: `${letters.toUpperCase()}${'?'.repeat(wildcardCount)}`,
    length,
    sortBy,
  };
}

/**
 * Solves anagrams based on provided letters and options.
 *
 * Primary mode ('exact'): Finds valid words that use the supplied letters exactly.
 * Sub-anagram mode ('any'): Finds exact anagrams as well as all valid smaller sub-anagrams.
 * Length-filtered mode (number or '10+'): Restricts anagrams to specific word lengths.
 */
export function solveAnagrams(
  options: AnagramSolverOptions,
  dictionary: WordDictionary = dictionaryService
): AnagramSolverResult {
  const validated = validateAnagramSolverOptions(options);

  if (!validated.isValid) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: validated.normalizedLetters,
      wildcardCount: validated.wildcardCount,
      isExactOnly: validated.length === 'exact',
      validationError: validated.validationError,
    };
  }

  const { letters, wildcardCount, totalAvailableLength, normalizedLetters, length, sortBy } =
    validated;
  const isExactMode = length === 'exact';
  const availableFreq = getLetterFrequency(letters);

  const matchedWords: string[] = [];

  if (isExactMode) {
    // -------------------------------------------------------------
    // EXACT ANAGRAM MODE (Primary Mode)
    // -------------------------------------------------------------
    // Must use ALL letters exactly (length === totalAvailableLength)
    if (wildcardCount === 0) {
      // Fast path: O(1) precomputed anagram signature lookup
      const exactAnagrams = dictionary.getExactAnagrams(letters);
      for (let i = 0; i < exactAnagrams.length; i++) {
        matchedWords.push(exactAnagrams[i]);
      }
    } else {
      // Wildcard path: filter words of exact target length
      const candidateWords = dictionary.getWordsByLength(totalAvailableLength);
      for (let i = 0; i < candidateWords.length; i++) {
        const candidate = candidateWords[i];
        if (canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
          matchedWords.push(candidate);
        }
      }
    }
  } else if (length === 'any') {
    // -------------------------------------------------------------
    // ANY LENGTH MODE (All Anagrams & Sub-anagrams)
    // -------------------------------------------------------------
    for (let len = totalAvailableLength; len >= 2; len--) {
      const candidateWords = dictionary.getWordsByLength(len);
      for (let i = 0; i < candidateWords.length; i++) {
        const candidate = candidateWords[i];
        if (canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
          matchedWords.push(candidate);
        }
      }
    }
  } else if (typeof length === 'number') {
    // -------------------------------------------------------------
    // SPECIFIC LENGTH FILTER
    // -------------------------------------------------------------
    if (length <= totalAvailableLength && length >= 2) {
      const candidateWords = dictionary.getWordsByLength(length);
      for (let i = 0; i < candidateWords.length; i++) {
        const candidate = candidateWords[i];
        if (canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
          matchedWords.push(candidate);
        }
      }
    }
  } else if (length === '10+') {
    // -------------------------------------------------------------
    // 10+ LETTERS FILTER
    // -------------------------------------------------------------
    const maxLen = Math.min(15, totalAvailableLength);
    for (let len = maxLen; len >= 10; len--) {
      const candidateWords = dictionary.getWordsByLength(len);
      for (let i = 0; i < candidateWords.length; i++) {
        const candidate = candidateWords[i];
        if (canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
          matchedWords.push(candidate);
        }
      }
    }
  }

  // Sort matched words
  const sortedWords = sortResults(matchedWords, sortBy);

  // Group results cleanly
  let groups: WordGroup[] = [];

  if (sortBy === 'alpha-asc') {
    groups = [
      {
        length: 0,
        label: 'Words (A to Z)',
        words: sortedWords,
      },
    ];
  } else if (sortBy === 'score-desc') {
    groups = [
      {
        length: 0,
        label: 'Words by Score (Highest First)',
        words: sortedWords,
      },
    ];
  } else if (isExactMode) {
    // In exact anagram mode, label specifically as e.g. "6 Letter Anagrams"
    groups = [
      {
        length: totalAvailableLength,
        label: `${totalAvailableLength} Letter Anagrams`,
        words: sortedWords,
      },
    ];
  } else if (typeof length === 'number') {
    groups = [
      {
        length,
        label: `${length} Letter Anagrams`,
        words: sortedWords,
      },
    ];
  } else {
    // Group by length with custom anagram labels
    const rawGroups = groupResultsByLength(sortedWords, sortBy);
    groups = rawGroups.map((g) => ({
      ...g,
      label: g.label || `${g.length} Letter Anagrams`,
    }));
  }

  return {
    totalWords: sortedWords.length,
    groups: groups.filter((g) => g.words.length > 0),
    allWords: sortedWords,
    lettersNormalized: normalizedLetters,
    wildcardCount,
    isExactOnly: isExactMode,
    effectiveLength: isExactMode
      ? totalAvailableLength
      : typeof length === 'number'
      ? length
      : undefined,
    validationError: null,
  };
}

export default solveAnagrams;
