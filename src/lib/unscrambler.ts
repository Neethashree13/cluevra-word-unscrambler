import { normalizeWord, dictionaryService, WordDictionary } from './dictionary.ts';
import type { SortOption, UnscrambleOptions, UnscrambleResult, WordGroup } from '../types.ts';

/**
 * Calculates letter frequencies for an alphabetic string (ignoring wildcards and non-letters).
 *
 * Example:
 * Input: "A A R E T" -> { a: 2, r: 1, e: 1, t: 1 }
 */
export function getLetterFrequency(letters: string): Record<string, number> {
  const normalized = normalizeWord(letters);
  const freq: Record<string, number> = {};

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    freq[char] = (freq[char] || 0) + 1;
  }

  return freq;
}

/**
 * Validates whether a candidate word can be constructed from available letter frequencies
 * and an optional number of wildcard / blank tiles (?).
 *
 * Matching rule:
 * For each unique character in the candidate word:
 *   If the candidate requires more copies than available in availableFrequencies,
 *   the difference must be supplied by available wildcards.
 * If total wildcards required <= wildcardCount, the candidate is valid.
 *
 * Examples:
 * Input available: { a: 1, r: 1, e: 1 }, wildcards: 1
 * Candidate "rate" -> needs 't' (0 available) -> 1 wildcard used -> valid (true)
 * Candidate "rare" -> needs 2nd 'r' (1 available) -> 1 wildcard used -> valid (true)
 * Candidate "area" -> needs 2nd 'a' (1 available) -> 1 wildcard used -> valid (true)
 * Candidate "tree" -> needs 't' and 2nd 'e' -> 2 wildcards needed -> invalid (false)
 *
 * Input available: { a: 2 }, wildcards: 1
 * Candidate with 3 'a's -> needs 3rd 'a' -> 1 wildcard used -> valid (true)
 * Candidate with 4 'a's -> needs 2 wildcards -> invalid (false)
 */
export function canBuildWordWithWildcards(
  word: string,
  availableFrequencies: Record<string, number>,
  wildcardCount: number = 0
): boolean {
  const normalized = normalizeWord(word);
  if (!normalized) {
    return false;
  }

  // Tally needed frequencies for candidate word
  const neededFreq: Record<string, number> = {};
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    neededFreq[char] = (neededFreq[char] || 0) + 1;
  }

  let wildcardsNeeded = 0;
  for (const char in neededFreq) {
    const needed = neededFreq[char];
    const available = availableFrequencies[char] || 0;
    if (needed > available) {
      wildcardsNeeded += needed - available;
      if (wildcardsNeeded > wildcardCount) {
        return false;
      }
    }
  }

  return wildcardsNeeded <= wildcardCount;
}

/**
 * Backward-compatible wrapper for exact letter matching (zero wildcards).
 */
export function canBuildWord(
  word: string,
  availableFrequencies: Record<string, number>
): boolean {
  return canBuildWordWithWildcards(word, availableFrequencies, 0);
}

/**
 * Sorts an array of words according to the chosen sort strategy:
 * - 'length-desc': Longer words first (descending length), then alphabetical.
 * - 'length-asc': Shorter words first (ascending length), then alphabetical.
 * - 'alpha-asc': Strictly alphabetical (locale-aware), then length.
 *
 * Automatically deduplicates the results.
 */
export function sortResults(
  words: string[],
  sortBy: SortOption = 'length-desc'
): string[] {
  const uniqueSet = new Set<string>();
  for (const raw of words) {
    const norm = normalizeWord(raw);
    if (norm) {
      uniqueSet.add(norm);
    }
  }

  const uniqueList = Array.from(uniqueSet);

  return uniqueList.sort((a, b) => {
    if (sortBy === 'length-desc') {
      if (b.length !== a.length) {
        return b.length - a.length;
      }
      return a.localeCompare(b);
    }

    if (sortBy === 'length-asc') {
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      return a.localeCompare(b);
    }

    // 'alpha-asc'
    const alphaCompare = a.localeCompare(b);
    if (alphaCompare !== 0) {
      return alphaCompare;
    }
    return b.length - a.length;
  });
}

/**
 * Groups words by length into WordGroup records.
 * Maintains sorted order within each group and sets group order appropriately.
 */
export function groupResultsByLength(
  words: string[],
  sortBy: SortOption = 'length-desc'
): WordGroup[] {
  const sorted = sortResults(words, sortBy);

  // When Alphabetical (A to Z) is selected, do not sort the groups by word length.
  // Return all matching words globally in alphabetical order.
  if (sortBy === 'alpha-asc') {
    return [
      {
        length: 0,
        label: 'Words (A to Z)',
        words: sorted,
      },
    ];
  }

  const groupMap = new Map<number, string[]>();

  for (const word of sorted) {
    const len = word.length;
    const existing = groupMap.get(len);
    if (existing) {
      existing.push(word);
    } else {
      groupMap.set(len, [word]);
    }
  }

  const lengths = Array.from(groupMap.keys());
  if (sortBy === 'length-asc') {
    lengths.sort((a, b) => a - b);
  } else {
    lengths.sort((a, b) => b - a);
  }

  const groups: WordGroup[] = [];
  for (const length of lengths) {
    groups.push({
      length,
      words: groupMap.get(length) || [],
    });
  }

  return groups;
}

/**
 * Formats visible word groups into plain text for clipboard copying.
 *
 * Example Output:
 * 4 Letter Words
 * RATE
 * TARE
 * TEAR
 *
 * 3 Letter Words
 * ARE
 * ART
 */
export function formatGroupsForClipboard(groups: WordGroup[]): string {
  return groups
    .filter((g) => g.words && g.words.length > 0)
    .map((g) => {
      const heading = g.label || `${g.length} Letter Words`;
      const wordList = g.words.map((w) => w.toUpperCase()).join('\n');
      return `${heading}\n${wordList}`;
    })
    .join('\n\n');
}

/**
 * Validates and extracts letters and wildcards from user input.
 * Wildcards ('?') are extracted BEFORE alphabetic character normalization.
 */
export function parseAndValidateInput(
  rawInput: string,
  options: UnscrambleOptions = {}
): {
  isValid: boolean;
  validationError: string | null;
  letters: string;
  wildcardCount: number;
  normalizedLetters: string;
} {
  if (!rawInput || rawInput.trim().length === 0) {
    return {
      isValid: false,
      validationError: 'Please enter at least one letter or wildcard (?) to unscramble.',
      letters: '',
      wildcardCount: 0,
      normalizedLetters: '',
    };
  }

  // 1. Extract wildcards BEFORE stripping non-alphabetic characters
  const wildcardMatches = rawInput.match(/\?/g);
  const wildcardCount = wildcardMatches ? wildcardMatches.length : 0;

  // 2. Extract standard alphabetic letters [a-z]
  const letters = normalizeWord(rawInput);

  // 3. Check for empty input (no letters and no wildcards)
  if (letters.length === 0 && wildcardCount === 0) {
    return {
      isValid: false,
      validationError: 'Please enter valid letters (A-Z) or wildcards (?).',
      letters: '',
      wildcardCount: 0,
      normalizedLetters: '',
    };
  }

  // 4. Wildcard count limit
  if (wildcardCount > 3) {
    return {
      isValid: false,
      validationError: 'Please limit wildcards (?) to a maximum of 3.',
      letters,
      wildcardCount,
      normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
    };
  }

  // 5. Total letter length limit
  const totalLength = letters.length + wildcardCount;
  if (totalLength > 15) {
    return {
      isValid: false,
      validationError: 'Input is too long. Please enter up to 15 letters.',
      letters,
      wildcardCount,
      normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
    };
  }

  // 6. Minimum vs Maximum length check
  const userMin = options.minLength !== undefined ? options.minLength : 2;
  const userMax = options.maxLength !== undefined ? options.maxLength : 15;
  if (userMin > userMax) {
    return {
      isValid: false,
      validationError: 'Minimum length cannot be greater than maximum length.',
      letters,
      wildcardCount,
      normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
    };
  }

  return {
    isValid: true,
    validationError: null,
    letters,
    wildcardCount,
    normalizedLetters: `${letters}${'?'.repeat(wildcardCount)}`,
  };
}

/**
 * Main Unscrambler Algorithm:
 * Finds every valid dictionary word that can be formed using available letters and wildcards.
 *
 * 1. Safely parses letters and wildcards before normalization removes wildcards.
 * 2. Validates inputs against length limits, empty inputs, and wildcard limits.
 * 3. Applies length controls (minLength, maxLength, effectiveMax).
 * 4. Filters candidate search space using dictionary length buckets.
 * 5. Validates candidate letter frequencies using canBuildWordWithWildcards.
 * 6. Deduplicates, sorts (longest-first, shortest-first, or alphabetical), and groups results.
 */
export function findWordsFromLetters(
  inputLetters: string,
  options: UnscrambleOptions = {},
  dictionary: WordDictionary = dictionaryService
): UnscrambleResult {
  const parsed = parseAndValidateInput(inputLetters, options);

  if (!parsed.isValid) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: parsed.normalizedLetters,
      wildcardCount: parsed.wildcardCount,
      validationError: parsed.validationError,
    };
  }

  const { letters, wildcardCount, normalizedLetters } = parsed;

  const userMin = options.minLength !== undefined ? options.minLength : 2;
  const userMax = options.maxLength !== undefined ? options.maxLength : 15;
  const sortBy: SortOption = options.sortBy || 'length-desc';

  const minLength = Math.max(2, userMin);
  const totalAvailableLength = letters.length + wildcardCount;
  const effectiveMax = Math.min(userMax, totalAvailableLength);

  if (minLength > effectiveMax) {
    return {
      totalWords: 0,
      groups: [],
      allWords: [],
      lettersNormalized: normalizedLetters,
      wildcardCount,
      validationError: null,
    };
  }

  // Available letter frequencies
  const availableFreq = getLetterFrequency(letters);

  // Search candidate space by length
  const matchedWords: string[] = [];

  for (let len = effectiveMax; len >= minLength; len--) {
    const candidateWords = dictionary.getWordsByLength(len);
    if (!candidateWords || candidateWords.length === 0) {
      continue;
    }

    for (let i = 0; i < candidateWords.length; i++) {
      const candidate = candidateWords[i];
      if (canBuildWordWithWildcards(candidate, availableFreq, wildcardCount)) {
        matchedWords.push(candidate);
      }
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

export default findWordsFromLetters;
