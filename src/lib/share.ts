import type { FilterState, SortOption } from '../types.ts';
import { SITE_CONFIG } from '../config/site.ts';

export interface ParsedUrlParams {
  letters: string;
  minLength: number;
  maxLength: number;
  sortBy: SortOption;
  hasParams: boolean;
}

/**
 * Parses search parameters from a query string or URL.
 * Strictly validates all inputs and guarantees safe defaults against malformed data.
 *
 * Example:
 * "?letters=are%3F&min=3&max=4&sort=alpha-asc"
 * -> { letters: "are?", minLength: 3, maxLength: 4, sortBy: "alpha-asc", hasParams: true }
 */
export function parseShareUrl(searchStringOrUrl: string): ParsedUrlParams {
  const defaultResult: ParsedUrlParams = {
    letters: '',
    minLength: 2,
    maxLength: 15,
    sortBy: 'length-desc',
    hasParams: false,
  };

  if (!searchStringOrUrl || typeof searchStringOrUrl !== 'string') {
    return defaultResult;
  }

  try {
    let search = searchStringOrUrl;
    if (searchStringOrUrl.includes('?')) {
      search = searchStringOrUrl.slice(searchStringOrUrl.indexOf('?'));
    }

    const params = new URLSearchParams(search);
    const rawLetters = params.get('letters');
    const rawMin = params.get('min');
    const rawMax = params.get('max');
    const rawSort = params.get('sort');

    if (!rawLetters && !rawMin && !rawMax && !rawSort) {
      return defaultResult;
    }

    // 1. Sanitize letters: allow letters a-z, A-Z, and wildcard ?
    let sanitizedLetters = '';
    if (rawLetters) {
      sanitizedLetters = rawLetters
        .trim()
        .toLowerCase()
        .replace(/[^a-z?]/g, '')
        .slice(0, 15);
    }

    // 2. Sanitize min length
    let minLength = 2;
    if (rawMin) {
      const parsedMin = parseInt(rawMin, 10);
      if (!isNaN(parsedMin) && parsedMin >= 2 && parsedMin <= 15) {
        minLength = parsedMin;
      }
    }

    // 3. Sanitize max length
    let maxLength = 15;
    if (rawMax) {
      const parsedMax = parseInt(rawMax, 10);
      if (!isNaN(parsedMax) && parsedMax >= 2 && parsedMax <= 15) {
        maxLength = parsedMax;
      }
    }

    // Ensure minLength does not exceed maxLength
    if (minLength > maxLength) {
      minLength = Math.min(minLength, maxLength);
    }

    // 4. Sanitize sort
    let sortBy: SortOption = 'length-desc';
    if (rawSort === 'length-asc' || rawSort === 'alpha-asc' || rawSort === 'length-desc') {
      sortBy = rawSort;
    }

    return {
      letters: sanitizedLetters,
      minLength,
      maxLength,
      sortBy,
      hasParams: sanitizedLetters.length > 0 || !!rawMin || !!rawMax,
    };
  } catch {
    return defaultResult;
  }
}

/**
 * Builds a shareable URL string based on the current search query and filters.
 *
 * Example:
 * buildShareUrl("are?", { minLength: 3, maxLength: 4, sortBy: "length-desc" })
 * -> "https://.../?letters=are%3F&min=3&max=4"
 */
export function buildShareUrl(
  letters: string,
  filters: FilterState,
  baseUrl?: string
): string {
  const base = baseUrl || SITE_CONFIG.canonicalUrl;

  try {
    const url = new URL(base);
    // Reset existing query parameters
    url.searchParams.delete('letters');
    url.searchParams.delete('min');
    url.searchParams.delete('max');
    url.searchParams.delete('sort');

    const cleanLetters = letters.trim().toLowerCase().replace(/[^a-z?]/g, '');
    if (cleanLetters) {
      url.searchParams.set('letters', cleanLetters);
    }

    if (filters.minLength && filters.minLength !== 2) {
      url.searchParams.set('min', String(filters.minLength));
    }

    if (filters.maxLength && filters.maxLength !== 15) {
      url.searchParams.set('max', String(filters.maxLength));
    }

    if (filters.sortBy && filters.sortBy !== 'length-desc') {
      url.searchParams.set('sort', filters.sortBy);
    }

    return url.toString();
  } catch {
    return '';
  }
}

export interface ShareResult {
  sharedViaWebShare: boolean;
  copiedToClipboard: boolean;
  success: boolean;
}

/**
 * Shares the search URL using the native Web Share API if available,
 * or copies the URL to the clipboard as a fallback.
 */
export async function shareSearch(
  letters: string,
  filters: FilterState
): Promise<ShareResult> {
  const shareUrl = buildShareUrl(letters, filters);
  if (!shareUrl) {
    return { sharedViaWebShare: false, copiedToClipboard: false, success: false };
  }

  // Attempt Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `Word Unscrambler - ${letters.toUpperCase()}`,
        text: `Unscramble letters: ${letters.toUpperCase()}`,
        url: shareUrl,
      });
      return { sharedViaWebShare: true, copiedToClipboard: false, success: true };
    } catch (err: unknown) {
      // AbortError indicates user dismissed share sheet; treat gracefully
      if (err instanceof Error && err.name === 'AbortError') {
        return { sharedViaWebShare: false, copiedToClipboard: false, success: false };
      }
      // Otherwise proceed to clipboard fallback
    }
  }

  // Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return { sharedViaWebShare: false, copiedToClipboard: true, success: true };
    } catch {
      // Ignore
    }
  }

  return { sharedViaWebShare: false, copiedToClipboard: false, success: false };
}
