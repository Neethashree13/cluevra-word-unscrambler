import { CORE_WORDS } from '../data/words.ts';
import type { DictionaryStatus } from '../types.ts';

/**
 * Reusable utility for normalizing dictionary words and user input:
 * - Converts to lowercase
 * - Strips all non-alphabetic characters (spaces, dashes, numbers, punctuation, symbols)
 * - Prevents arbitrary symbols or numbers from breaking the application
 *
 * Examples:
 * - "A R E T" -> "aret"
 * - "AreT"    -> "aret"
 * - "a-r-e-t" -> "aret"
 * - "w0rd! "  -> "wrd"
 */
export function normalizeWord(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Checks if a string is a valid dictionary entry:
 * - Must be non-empty string
 * - Length between 2 and 15 alphabetic characters
 * - Avoids HTML tags, numbers, punctuation, definitions, or corrupted entries
 */
export function isValidDictionaryWord(rawWord: unknown): boolean {
  if (typeof rawWord !== 'string') {
    return false;
  }
  const trimmed = rawWord.trim();
  // Ensure the original entry didn't contain HTML, sentences with spaces, or definitions
  if (trimmed.includes(' ') || trimmed.includes('<') || trimmed.includes('>')) {
    return false;
  }
  const normalized = normalizeWord(trimmed);
  // Must be strictly alphabetic and between 2 and 15 letters
  return normalized.length >= 2 && normalized.length <= 15 && /^[a-z]+$/.test(normalized);
}

/**
 * Precomputes sorted letter signature for fast anagram indexing:
 * For example:
 * RATE -> aert
 * TEAR -> aert
 * TARE -> aert
 */
export function getWordSignature(word: string): string {
  const normalized = normalizeWord(word);
  return normalized.split('').sort().join('');
}

/**
 * WordDictionary Service:
 * Manages the English lexicon, provides O(1) word validation,
 * precomputed anagram signature lookups, and length categorization.
 */
export class WordDictionary {
  private wordsSet: Set<string> = new Set();
  private wordsList: string[] = [];
  private signatureMap: Map<string, string[]> = new Map();
  private wordsByLength: Map<number, string[]> = new Map();
  private status: DictionaryStatus = {
    loaded: false,
    totalWords: 0,
    source: 'core',
    loadError: null,
  };
  private listeners: Set<(status: DictionaryStatus) => void> = new Set();
  private loadPromise: Promise<boolean> | null = null;

  constructor(initialWords?: Iterable<string>) {
    // Default initialization with built-in CORE_WORDS for synchronous availability
    const seed = initialWords || CORE_WORDS;
    this.initFromList(seed, 'core');
  }

  /**
   * Initializes or updates dictionary from a collection of words.
   * Handles normalization, deduplication, and invalid entry filtering.
   */
  public initFromList(
    rawWords: Iterable<string>,
    source: 'core' | 'full' | 'custom' = 'core'
  ): void {
    const newSet = new Set<string>();
    const newSignatureMap = new Map<string, string[]>();
    const newByLength = new Map<number, string[]>();

    for (const raw of rawWords) {
      if (!isValidDictionaryWord(raw)) {
        continue;
      }
      const normalized = normalizeWord(raw);
      if (!normalized || newSet.has(normalized)) {
        // Skip empty or duplicate entries
        continue;
      }

      newSet.add(normalized);

      // Precompute anagram signature (e.g. "rate" -> "aert")
      const sig = getWordSignature(normalized);
      const existingAnagrams = newSignatureMap.get(sig);
      if (existingAnagrams) {
        existingAnagrams.push(normalized);
      } else {
        newSignatureMap.set(sig, [normalized]);
      }

      // Group by length
      const len = normalized.length;
      const lenList = newByLength.get(len);
      if (lenList) {
        lenList.push(normalized);
      } else {
        newByLength.set(len, [normalized]);
      }
    }

    this.wordsSet = newSet;
    this.wordsList = Array.from(newSet).sort();
    this.signatureMap = newSignatureMap;
    this.wordsByLength = newByLength;

    this.status = {
      loaded: true,
      totalWords: newSet.size,
      source,
      loadError: null,
    };

    this.notifyListeners();
  }

  /**
   * Asynchronously loads the full comprehensive word list from public/dictionary.txt
   * in browser environments without blocking initial rendering.
   */
  public async loadFullDictionary(url = '/dictionary.txt'): Promise<boolean> {
    if (this.status.source === 'full' && this.status.loaded) {
      return true;
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      try {
        if (typeof window === 'undefined') {
          // In Node/non-browser environment, built-in list is already active
          return true;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load dictionary: HTTP ${response.status}`);
        }

        const text = await response.text();
        const lines = text.split(/\r?\n/);
        this.initFromList(lines, 'full');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.status = {
          ...this.status,
          loadError: message,
        };
        this.notifyListeners();
        return false;
      } finally {
        this.loadPromise = null;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Checks whether a word exists in the dictionary (O(1)).
   * Automatically normalizes the input before checking.
   */
  public hasWord(word: string): boolean {
    const normalized = normalizeWord(word);
    if (!normalized) return false;
    return this.wordsSet.has(normalized);
  }

  /**
   * Returns precomputed anagrams matching the word's exact letters (O(1)).
   */
  public getExactAnagrams(word: string): string[] {
    const sig = getWordSignature(word);
    return this.signatureMap.get(sig) || [];
  }

  /**
   * Access all words for a specific length.
   */
  public getWordsByLength(length: number): string[] {
    return this.wordsByLength.get(length) || [];
  }

  /**
   * Access the entire list of sorted valid words.
   */
  public getWords(): readonly string[] {
    return this.wordsList;
  }

  /**
   * Access precomputed signature map for Phase 3 algorithm.
   */
  public getSignatureMap(): ReadonlyMap<string, string[]> {
    return this.signatureMap;
  }

  /**
   * Get total word count currently loaded.
   */
  public getWordCount(): number {
    return this.wordsSet.size;
  }

  /**
   * Returns current dictionary status.
   */
  public getStatus(): DictionaryStatus {
    return { ...this.status };
  }

  /**
   * Subscribe to dictionary updates (e.g. when full dictionary finishes loading).
   */
  public subscribe(listener: (status: DictionaryStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const currentStatus = this.getStatus();
    for (const listener of this.listeners) {
      listener(currentStatus);
    }
  }
}

// Global singleton instance
export const dictionaryService = new WordDictionary();

// Helper exports
export default dictionaryService;
