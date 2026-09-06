import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DictionaryStatus, FilterState, SortOption } from '../types.ts';
import { dictionaryService } from '../lib/dictionary.ts';
import { saveRecentSearch } from '../lib/recentSearches.ts';
import WordsWithLettersTool from '../components/WordsWithLettersTool.tsx';
import ResultsPanel from '../components/ResultsPanel.tsx';
import WordsWithLettersContent from '../components/WordsWithLettersContent.tsx';
import {
  findWordsWithLetters,
  type WordsWithLettersOptions,
  type WordsWithLettersResult,
  type WordsWithLettersLength,
} from '../lib/wordsWithLetters.ts';
import { Sparkles } from 'lucide-react';

interface WordsWithLettersPageProps {
  onNavigate?: (path: string) => void;
}

export default function WordsWithLettersPage({ onNavigate }: WordsWithLettersPageProps) {
  const [options, setOptions] = useState<WordsWithLettersOptions>({
    letters: '',
    length: 'any',
    startsWith: '',
    endsWith: '',
    contains: '',
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

  // Check URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryLetters = urlParams.get('letters') || urlParams.get('q');
    const queryLength = urlParams.get('length');
    const queryStarts = urlParams.get('starts') || urlParams.get('startsWith');
    const queryEnds = urlParams.get('ends') || urlParams.get('endsWith');
    const queryContains = urlParams.get('contains');
    const querySort = urlParams.get('sort') || urlParams.get('sortBy');

    let parsedLength: WordsWithLettersLength = 'any';
    if (queryLength === '10+') {
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
        startsWith: queryStarts ? queryStarts.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
        endsWith: queryEnds ? queryEnds.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
        contains: queryContains ? queryContains.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
        sortBy: parsedSort,
      });
      setHasTriggeredSearch(true);
    }
  }, []);

  // Compute Words With Letters search results
  const result: WordsWithLettersResult | null = useMemo(() => {
    if (!hasTriggeredSearch) {
      return null;
    }
    return findWordsWithLetters(options, dictionaryService);
  }, [options, hasTriggeredSearch, dictStatus.loaded]);

  const handleSearch = useCallback((newOptions: WordsWithLettersOptions) => {
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

      if (newOptions.length && newOptions.length !== 'any') {
        url.searchParams.set('length', String(newOptions.length));
      } else {
        url.searchParams.delete('length');
      }

      if (newOptions.startsWith?.trim()) {
        url.searchParams.set('starts', newOptions.startsWith.trim().toUpperCase());
      } else {
        url.searchParams.delete('starts');
      }

      if (newOptions.endsWith?.trim()) {
        url.searchParams.set('ends', newOptions.endsWith.trim().toUpperCase());
      } else {
        url.searchParams.delete('ends');
      }

      if (newOptions.contains?.trim()) {
        url.searchParams.set('contains', newOptions.contains.trim().toUpperCase());
      } else {
        url.searchParams.delete('contains');
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
      length: 'any',
      startsWith: '',
      endsWith: '',
      contains: '',
      sortBy: 'length-desc',
    });
    setHasTriggeredSearch(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('letters');
      url.searchParams.delete('q');
      url.searchParams.delete('length');
      url.searchParams.delete('starts');
      url.searchParams.delete('ends');
      url.searchParams.delete('contains');
      url.searchParams.delete('sort');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Summary labels and text for ResultsPanel
  const summaryValue = useMemo(() => {
    if (!options.letters?.trim()) return 'None entered';
    const parts = [options.letters.trim().toUpperCase().split('').join(' ')];
    if (options.startsWith?.trim()) parts.push(`Starts: ${options.startsWith.trim().toUpperCase()}`);
    if (options.endsWith?.trim()) parts.push(`Ends: ${options.endsWith.trim().toUpperCase()}`);
    if (options.contains?.trim()) parts.push(`Contains: ${options.contains.trim().toUpperCase()}`);
    return parts.join(' | ');
  }, [options]);

  const filterSummaryText = useMemo(() => {
    if (options.length === 'any') {
      return 'All lengths (from 2 letters up)';
    }
    if (typeof options.length === 'number') {
      return `${options.length} letters`;
    }
    if (options.length === '10+') {
      return '10 or more letters';
    }
    return undefined;
  }, [options.length]);

  // Compatibility filter state for ResultsPanel
  const filterStateCompat: FilterState = useMemo(() => {
    const clean = (options.letters || '').replace(/[^a-zA-Z]/g, '');
    const wild = ((options.letters || '').match(/[?*]/g) || []).length;
    const tot = Math.max(2, clean.length + wild);

    const min = typeof options.length === 'number' ? options.length : 2;
    const max = typeof options.length === 'number' ? options.length : Math.max(15, tot);

    return {
      minLength: min,
      maxLength: max,
      sortBy: options.sortBy || 'length-desc',
    };
  }, [options.length, options.letters, options.sortBy]);

  return (
    <main id="words-with-letters-page" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero / Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
          <span>Word Discovery & Construction Engine</span>
        </div>
        <h1
          id="words-with-letters-page-title"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Words With Letters - Find Words From Letters
        </h1>
        <p
          id="words-with-letters-page-description"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Find words using your available letters with Cluevra. Discover words from letter combinations, use wildcards, filter by length, and sort results by length, alphabet, or score.
        </p>
      </div>

      {/* Two-Column Interactive Tool & Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Words With Letters Tool */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <WordsWithLettersTool
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
            summaryLabel="Available Letters"
            summaryValue={summaryValue}
            filterSummaryText={filterSummaryText}
            emptyStateTitle="Your matching words will appear here"
            emptyStateDesc="Enter your available letters or blank tiles on the left to see every valid word you can form."
            noResultsDesc="No valid dictionary words could be formed with those letters and filters. Try adding wildcards (?) or relaxing your constraints."
            loadedWordsText={`${dictStatus?.totalWords ? dictStatus.totalWords.toLocaleString() : '168,551'} total dictionary words loaded`}
          />
        </div>
      </div>

      {/* Educational & SEO Content Below the Tool */}
      <WordsWithLettersContent onNavigate={onNavigate} />
    </main>
  );
}
