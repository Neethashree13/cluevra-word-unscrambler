import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DictionaryStatus, FilterState, SortOption } from '../types.ts';
import { dictionaryService } from '../lib/dictionary.ts';
import { saveRecentSearch } from '../lib/recentSearches.ts';
import AnagramSolverTool from '../components/AnagramSolverTool.tsx';
import ResultsPanel from '../components/ResultsPanel.tsx';
import AnagramSolverContent from '../components/AnagramSolverContent.tsx';
import {
  solveAnagrams,
  type AnagramSolverOptions,
  type AnagramSolverResult,
  type AnagramLength,
} from '../lib/anagramSolver.ts';
import { Sparkles } from 'lucide-react';

interface AnagramSolverPageProps {
  onNavigate?: (path: string) => void;
}

export default function AnagramSolverPage({ onNavigate }: AnagramSolverPageProps) {
  const [options, setOptions] = useState<AnagramSolverOptions>({
    letters: '',
    length: 'exact',
    sortBy: 'length-desc',
  });
  const [hasTriggeredSearch, setHasTriggeredSearch] = useState<boolean>(false);
  const [dictStatus, setDictStatus] = useState<DictionaryStatus>(dictionaryService.getStatus());

  // Subscribe to dictionary loading status
  useEffect(() => {
    const unsubscribe = dictionaryService.subscribe((status) => {
      setDictStatus(status);
    });
    setDictStatus(dictionaryService.getStatus());
    return unsubscribe;
  }, []);

  // Check URL params on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryLetters = urlParams.get('letters') || urlParams.get('q');
    const queryLength = urlParams.get('length');
    const querySort = urlParams.get('sort') || urlParams.get('sortBy');

    let parsedLength: AnagramLength = 'exact';
    if (queryLength === 'any') {
      parsedLength = 'any';
    } else if (queryLength === '10+') {
      parsedLength = '10+';
    } else if (queryLength && !isNaN(Number(queryLength))) {
      const num = Number(queryLength);
      if (num >= 2 && num <= 15) parsedLength = num;
    }

    let parsedSort: SortOption = 'length-desc';
    if (
      querySort === 'length-asc' ||
      querySort === 'alpha-asc' ||
      querySort === 'score-desc'
    ) {
      parsedSort = querySort;
    }

    const cleanInputLetters = queryLetters
      ? queryLetters.replace(/[^a-zA-Z?*\s]/g, '').slice(0, 20).toUpperCase()
      : '';

    if (cleanInputLetters.trim().length > 0) {
      setOptions({
        letters: cleanInputLetters,
        length: parsedLength,
        sortBy: parsedSort,
      });
      setHasTriggeredSearch(true);
    }
  }, []);

  // Compute Anagram Solver search results
  const result: AnagramSolverResult | null = useMemo(() => {
    if (!hasTriggeredSearch) {
      return null;
    }
    return solveAnagrams(options, dictionaryService);
  }, [options, hasTriggeredSearch, dictStatus.loaded]);

  const handleSearch = useCallback((newOptions: AnagramSolverOptions) => {
    setOptions(newOptions);
    setHasTriggeredSearch(true);

    if (newOptions.letters && newOptions.letters.trim().length > 0) {
      const cleanLen = newOptions.letters.replace(/[^a-zA-Z]/g, '').length;
      saveRecentSearch({
        letters: newOptions.letters.trim(),
        minLength: typeof newOptions.length === 'number' ? newOptions.length : 2,
        maxLength: typeof newOptions.length === 'number' ? newOptions.length : Math.max(2, cleanLen),
        sortBy: newOptions.sortBy || 'length-desc',
      });
    }

    // Synchronize URL query parameters without reloading
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newOptions.letters?.trim()) {
        url.searchParams.set('letters', newOptions.letters.trim().toUpperCase());
      } else {
        url.searchParams.delete('letters');
      }

      if (newOptions.length && newOptions.length !== 'exact') {
        url.searchParams.set('length', String(newOptions.length));
      } else {
        url.searchParams.delete('length');
      }

      if (newOptions.sortBy && newOptions.sortBy !== 'length-desc') {
        url.searchParams.set('sort', newOptions.sortBy);
      } else {
        url.searchParams.delete('sort');
      }

      url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleClear = useCallback(() => {
    setOptions({
      letters: '',
      length: 'exact',
      sortBy: 'length-desc',
    });
    setHasTriggeredSearch(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('letters');
      url.searchParams.delete('q');
      url.searchParams.delete('length');
      url.searchParams.delete('sort');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Summary labels and text for ResultsPanel
  const summaryValue = useMemo(() => {
    if (!options.letters?.trim()) return 'None entered';
    return options.letters.trim().toUpperCase().split('').join(' ');
  }, [options.letters]);

  const filterSummaryText = useMemo(() => {
    if (options.length === 'exact') {
      const clean = (options.letters || '').replace(/[^a-zA-Z]/g, '');
      const wild = ((options.letters || '').match(/[?*]/g) || []).length;
      const tot = clean.length + wild;
      return tot > 0 ? `Exact Length (${tot} Letters)` : 'Exact Length (All Letters)';
    }
    if (options.length === 'any') {
      return 'All lengths (Sub-anagrams)';
    }
    if (typeof options.length === 'number') {
      return `${options.length} letters`;
    }
    return `${options.length} letters`;
  }, [options.length, options.letters]);

  // Compatibility filter state for ResultsPanel
  const filterStateCompat: FilterState = useMemo(() => {
    const clean = (options.letters || '').replace(/[^a-zA-Z]/g, '');
    const wild = ((options.letters || '').match(/[?*]/g) || []).length;
    const tot = Math.max(2, clean.length + wild);

    const min =
      options.length === 'exact'
        ? tot
        : typeof options.length === 'number'
        ? options.length
        : 2;
    const max =
      options.length === 'exact'
        ? tot
        : typeof options.length === 'number'
        ? options.length
        : tot;

    return {
      minLength: min,
      maxLength: max,
      sortBy: options.sortBy || 'length-desc',
    };
  }, [options.length, options.letters, options.sortBy]);

  return (
    <main id="anagram-solver-page" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero / Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
          <span>Instant Exact Anagram & Sub-Word Engine</span>
        </div>
        <h1
          id="anagram-solver-page-title"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Anagram Solver - Find Anagrams From Letters
        </h1>
        <p
          id="anagram-solver-page-description"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Solve anagrams with Cluevra. Enter letters to find valid words and anagrams quickly, with wildcard support, word-length filters, and useful sorting options.
        </p>
      </div>

      {/* Two-Column Interactive Tool & Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Anagram Solver Tool */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <AnagramSolverTool
            onSearch={handleSearch}
            onClear={handleClear}
            dictStatus={dictStatus}
            initialOptions={options}
          />
        </div>

        {/* Right Column: Results Panel */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <ResultsPanel
            searchedLetters={options.letters || ''}
            hasTriggeredSearch={hasTriggeredSearch}
            result={result}
            dictStatus={dictStatus}
            filters={filterStateCompat}
            summaryLabel="Anagram Letters"
            summaryValue={summaryValue}
            filterSummaryText={filterSummaryText}
            emptyStateTitle="Your anagram solutions will appear here"
            emptyStateDesc="Enter letters or a phrase on the left, then click Solve Anagrams to discover valid dictionary words."
            noResultsDesc="No valid anagrams found in the dictionary for these letters. Try adding a wildcard (?) or selecting 'Any Length' to find smaller sub-anagrams."
            loadedWordsText={`${dictStatus?.totalWords ? dictStatus.totalWords.toLocaleString() : '168,551'} total dictionary words loaded`}
          />
        </div>
      </div>

      {/* Educational & SEO Content Below the Tool */}
      <AnagramSolverContent onNavigate={onNavigate} />
    </main>
  );
}
