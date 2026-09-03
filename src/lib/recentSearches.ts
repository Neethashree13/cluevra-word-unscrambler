import type { RecentSearchItem, SortOption } from '../types.ts';

const STORAGE_KEY = 'word_unscrambler_recent_searches_v1';
const MAX_RECENT_SEARCHES = 5;

// In-memory fallback if localStorage is disabled or throws SecurityError
let inMemoryFallback: RecentSearchItem[] = [];

/**
 * Checks if localStorage is accessible in the current browser environment.
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves the list of recent searches (capped at 5).
 * Falls back safely to in-memory store if localStorage is unavailable.
 */
export function getRecentSearches(): RecentSearchItem[] {
  if (!isStorageAvailable()) {
    return [...inMemoryFallback];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Sanitize and validate items
    const sanitized: RecentSearchItem[] = [];
    for (const item of parsed) {
      if (
        item &&
        typeof item.letters === 'string' &&
        item.letters.trim().length > 0 &&
        typeof item.minLength === 'number' &&
        typeof item.maxLength === 'number'
      ) {
        const validSort: SortOption =
          item.sortBy === 'length-asc' || item.sortBy === 'alpha-asc'
            ? item.sortBy
            : 'length-desc';

        sanitized.push({
          id: typeof item.id === 'string' ? item.id : `${Date.now()}-${Math.random()}`,
          letters: item.letters.trim().toUpperCase(),
          minLength: Math.max(2, Math.min(15, item.minLength)),
          maxLength: Math.max(2, Math.min(15, item.maxLength)),
          sortBy: validSort,
          timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now(),
        });
      }
    }

    return sanitized.slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [...inMemoryFallback];
  }
}

/**
 * Saves a new search to recent searches list.
 * Deduplicates by letters (case-insensitive) and moves recent query to top.
 * Caps list at maximum 5 items.
 */
export function saveRecentSearch(
  entry: Omit<RecentSearchItem, 'id' | 'timestamp'>
): RecentSearchItem[] {
  const lettersTrimmed = entry.letters.trim().toUpperCase();
  if (!lettersTrimmed) {
    return getRecentSearches();
  }

  const existing = getRecentSearches();
  // Filter out any previous search for the exact same letters
  const filtered = existing.filter(
    (item) => item.letters.toUpperCase() !== lettersTrimmed
  );

  const newItem: RecentSearchItem = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    letters: lettersTrimmed,
    minLength: entry.minLength ?? 2,
    maxLength: entry.maxLength ?? 15,
    sortBy: entry.sortBy || 'length-desc',
    timestamp: Date.now(),
  };

  const updated = [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      inMemoryFallback = updated;
    }
  } else {
    inMemoryFallback = updated;
  }

  return updated;
}

/**
 * Clears all recent searches from localStorage and in-memory store.
 */
export function clearRecentSearches(): void {
  inMemoryFallback = [];
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
