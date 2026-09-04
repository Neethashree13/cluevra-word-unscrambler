import { normalizeWord, dictionaryService, WordDictionary } from './dictionary.ts';
import { canBuildWordWithWildcards, getLetterFrequency } from './unscrambler.ts';
import type { FiveLetterFilterOptions, FiveLetterResult } from '../types.ts';

/**
 * Standardizes a 5-position pattern into a 5-character string.
 * Each character is either an alphabetic letter [a-z] or an underscore '_' representing a blank.
 *
 * Examples:
 * - ['s', 'a', '', 'e', ''] -> "sa_e_"
 * - "S A _ E _"             -> "sa_e_"
 * - "_ A _ E _"             -> "_a_e_"
 * - ""                      -> "_____"
 */
export function normalizePattern(
  rawPattern?: string | (string | null | undefined)[]
): {
  pattern: string;
  hasFixedLetters: boolean;
  isValid: boolean;
  error: string | null;
} {
  if (!rawPattern) {
    return { pattern: '_____', hasFixedLetters: false, isValid: true, error: null };
  }

  let slots: string[] = [];

  if (Array.isArray(rawPattern)) {
    if (rawPattern.length > 5) {
      return {
        pattern: '_____',
        hasFixedLetters: false,
        isValid: false,
        error: 'Pattern cannot have more than 5 letter slots.',
      };
    }
    slots = rawPattern.slice(0, 5).map((item) => {
      if (!item) return '_';
      const clean = normalizeWord(String(item));
      return clean.length > 0 ? clean[0] : '_';
    });
    // Pad to 5 slots if fewer were passed
    while (slots.length < 5) {
      slots.push('_');
    }
  } else if (typeof rawPattern === 'string') {
    const trimmed = rawPattern.trim();
    if (trimmed.length === 0) {
      return { pattern: '_____', hasFixedLetters: false, isValid: true, error: null };
    }

    // Check if input contains space-separated or dash-separated tokens, e.g. "_ A _ E _" or "S A _ E _"
    const hasSeparators = /[\s,-]/.test(trimmed);
    if (hasSeparators) {
      const tokens = trimmed.split(/[\s,-]+/).filter((t) => t.length > 0);
      if (tokens.length > 5) {
        return {
          pattern: '_____',
          hasFixedLetters: false,
          isValid: false,
          error: 'Pattern cannot exceed 5 characters.',
        };
      }
      slots = tokens.slice(0, 5).map((tok) => {
        const lower = tok.toLowerCase();
        if (/^[a-z]$/.test(lower)) return lower;
        return '_';
      });
      while (slots.length < 5) {
        slots.push('_');
      }
    } else {
      // Continuous string e.g. "_a_e_" or "s?a?e" or "sa_e_"
      const cleaned = trimmed.toLowerCase();
      const chars: string[] = [];
      for (let i = 0; i < cleaned.length; i++) {
        const c = cleaned[i];
        if (/^[a-z]$/.test(c)) {
          chars.push(c);
        } else if (c === '_' || c === '?' || c === '.' || c === '*') {
          chars.push('_');
        }
      }

      if (chars.length > 5) {
        return {
          pattern: '_____',
          hasFixedLetters: false,
          isValid: false,
          error: 'Pattern cannot exceed 5 characters.',
        };
      }

      slots = chars.slice(0, 5);
      while (slots.length < 5) {
        slots.push('_');
      }
    }
  }

  const finalPattern = slots.join('');
  const hasFixedLetters = slots.some((c) => c !== '_');

  return {
    pattern: finalPattern,
    hasFixedLetters,
    isValid: true,
    error: null,
  };
}

/**
 * Validates consistency between all 5-letter search constraints:
 * - StartsWith length and pattern position checks
 * - EndsWith length and pattern position checks
 * - Conflict detection between excluded letters and included/pattern letters
 * - Available letters / wildcard count check
 */
export function validateFiveLetterFilters(
  options: FiveLetterFilterOptions,
  pattern: string
): string | null {
  const startsWith = normalizeWord(options.startsWith || '');
  const endsWith = normalizeWord(options.endsWith || '');
  const containsLetters = normalizeWord(options.containsLetters || '');
  const excludeLetters = Array.from(new Set(normalizeWord(options.excludeLetters || '').split('')));

  if (startsWith.length > 5) {
    return 'Starts with letters cannot be longer than 5 letters.';
  }

  if (endsWith.length > 5) {
    return 'Ends with letters cannot be longer than 5 letters.';
  }

  if (containsLetters.length > 5) {
    return 'Contains letters cannot exceed 5 letters.';
  }

  // Check startsWith compatibility with pattern positions
  for (let i = 0; i < startsWith.length; i++) {
    if (pattern[i] !== '_' && pattern[i] !== startsWith[i]) {
      return `Pattern position ${i + 1} ('${pattern[i].toUpperCase()}') conflicts with "Starts with" ('${startsWith[i].toUpperCase()}').`;
    }
  }

  // Check endsWith compatibility with pattern positions
  for (let i = 0; i < endsWith.length; i++) {
    const patternIdx = 5 - endsWith.length + i;
    if (pattern[patternIdx] !== '_' && pattern[patternIdx] !== endsWith[i]) {
      return `Pattern position ${patternIdx + 1} ('${pattern[patternIdx].toUpperCase()}') conflicts with "Ends with" ('${endsWith[i].toUpperCase()}').`;
    }
  }

  // Check overlap between startsWith and endsWith if sum of lengths > 5
  if (startsWith.length + endsWith.length > 5) {
    const overlap = startsWith.length + endsWith.length - 5;
    for (let i = 0; i < overlap; i++) {
      const startChar = startsWith[startsWith.length - overlap + i];
      const endChar = endsWith[i];
      if (startChar !== endChar) {
        return `Combined "Starts with" ('${startsWith.toUpperCase()}') and "Ends with" ('${endsWith.toUpperCase()}') conflict.`;
      }
    }
  }

  // Excluded letters conflict checks
  for (const exc of excludeLetters) {
    // 1. Excluded letter cannot be in pattern
    if (pattern.includes(exc)) {
      return `Letter '${exc.toUpperCase()}' cannot be both in the pattern and in excluded letters.`;
    }
    // 2. Excluded letter cannot be in startsWith
    if (startsWith.includes(exc)) {
      return `Letter '${exc.toUpperCase()}' cannot be both in "Starts with" and in excluded letters.`;
    }
    // 3. Excluded letter cannot be in endsWith
    if (endsWith.includes(exc)) {
      return `Letter '${exc.toUpperCase()}' cannot be both in "Ends with" and in excluded letters.`;
    }
    // 4. Excluded letter cannot be in containsLetters
    if (containsLetters.includes(exc)) {
      return `Letter '${exc.toUpperCase()}' cannot be both in "Contains" and in excluded letters.`;
    }
  }

  // Available letters / rack check
  if (options.availableLetters && options.availableLetters.trim().length > 0) {
    const rawRack = options.availableLetters.trim();
    const wildcards = (rawRack.match(/\?/g) || []).length;
    const cleanLetters = normalizeWord(rawRack);
    const totalTiles = cleanLetters.length + wildcards;

    if (totalTiles < 5) {
      return 'Please enter at least 5 available letters or wildcards (?) to form a 5-letter word.';
    }
  }

  return null;
}

/**
 * Formats 5-letter words array for clipboard copying.
 * Produces clean uppercase newline-separated words.
 */
export function formatFiveLetterWordsForClipboard(words: string[]): string {
  if (!words || words.length === 0) return '';
  return words.map((w) => w.toUpperCase()).join('\n');
}

/**
 * 5-Letter Word Finder Search Algorithm:
 * Evaluates candidate words directly from the dictionary's 5-letter bucket.
 * Guarantees every candidate is strictly 5 letters.
 *
 * Filters applied in sequence:
 * 1. 5-slot Pattern matching (e.g. "_a_e_")
 * 2. Starts-with prefix matching
 * 3. Ends-with suffix matching
 * 4. Contains-letters frequency matching
 * 5. Excluded-letters check (rejection on any occurrence)
 * 6. Available-letters pool & wildcard check (canBuildWordWithWildcards)
 *
 * Sorts results according to options.sortBy ('alpha-asc' default or 'alpha-desc').
 */
export function findFiveLetterWords(
  options: FiveLetterFilterOptions = {},
  dictionary: WordDictionary = dictionaryService
): FiveLetterResult {
  // 1. Normalize pattern
  const patternResult = normalizePattern(options.pattern);
  if (!patternResult.isValid) {
    return {
      totalWords: 0,
      words: [],
      patternNormalized: patternResult.pattern,
      validationError: patternResult.error,
    };
  }

  const pattern = patternResult.pattern;

  // 2. Validate filters & detect conflicts
  const validationError = validateFiveLetterFilters(options, pattern);
  if (validationError) {
    return {
      totalWords: 0,
      words: [],
      patternNormalized: pattern,
      validationError,
    };
  }

  // 3. Prepare filter criteria
  const startsWith = normalizeWord(options.startsWith || '');
  const endsWith = normalizeWord(options.endsWith || '');
  const containsLetters = normalizeWord(options.containsLetters || '');
  const containsFreq = containsLetters.length > 0 ? getLetterFrequency(containsLetters) : null;
  const excludeLettersSet = new Set(normalizeWord(options.excludeLetters || '').split(''));

  // Available letters handling
  let availableFreq: Record<string, number> | null = null;
  let wildcardCount = 0;
  if (options.availableLetters && options.availableLetters.trim().length > 0) {
    const rawRack = options.availableLetters.trim();
    wildcardCount = (rawRack.match(/\?/g) || []).length;
    const cleanLetters = normalizeWord(rawRack);
    availableFreq = getLetterFrequency(cleanLetters);
  }

  // 4. Retrieve candidate 5-letter words from dictionary
  const candidates = dictionary.getWordsByLength(5);
  const matchedWords: string[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const word = candidates[i];

    // Ensure candidate is strictly 5 letters
    if (word.length !== 5) {
      continue;
    }

    // 1. Pattern filter
    let patternMismatch = false;
    for (let p = 0; p < 5; p++) {
      if (pattern[p] !== '_' && word[p] !== pattern[p]) {
        patternMismatch = true;
        break;
      }
    }
    if (patternMismatch) continue;

    // 2. Starts with filter
    if (startsWith.length > 0 && !word.startsWith(startsWith)) {
      continue;
    }

    // 3. Ends with filter
    if (endsWith.length > 0 && !word.endsWith(endsWith)) {
      continue;
    }

    // 4. Excluded letters filter
    if (excludeLettersSet.size > 0) {
      let containsExcluded = false;
      for (let c = 0; c < 5; c++) {
        if (excludeLettersSet.has(word[c])) {
          containsExcluded = true;
          break;
        }
      }
      if (containsExcluded) continue;
    }

    // 5. Contains letters filter (must have at least the required frequency of each letter)
    if (containsFreq) {
      let containsMismatch = false;
      // Count frequency in candidate word
      const wordFreq: Record<string, number> = {};
      for (let c = 0; c < 5; c++) {
        wordFreq[word[c]] = (wordFreq[word[c]] || 0) + 1;
      }

      for (const requiredChar in containsFreq) {
        if ((wordFreq[requiredChar] || 0) < containsFreq[requiredChar]) {
          containsMismatch = true;
          break;
        }
      }
      if (containsMismatch) continue;
    }

    // 6. Available letters filter
    if (availableFreq) {
      if (!canBuildWordWithWildcards(word, availableFreq, wildcardCount)) {
        continue;
      }
    }

    matchedWords.push(word);
  }

  // 5. Sorting
  const sortBy = options.sortBy || 'alpha-asc';
  matchedWords.sort((a, b) => {
    if (sortBy === 'alpha-desc') {
      return b.localeCompare(a);
    }
    return a.localeCompare(b);
  });

  return {
    totalWords: matchedWords.length,
    words: matchedWords,
    patternNormalized: pattern,
    validationError: null,
  };
}
