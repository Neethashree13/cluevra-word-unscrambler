import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DictionaryStatus, FilterState } from '../types.ts';
import { dictionaryService } from '../lib/dictionary.ts';
import { saveRecentSearch } from '../lib/recentSearches.ts';
import WordFinderTool from '../components/WordFinderTool.tsx';
import ResultsPanel from '../components/ResultsPanel.tsx';
import WordFinderContent from '../components/WordFinderContent.tsx';
import { findWords, type WordFinderFilterOptions, type WordFinderResult, type WordFinderLength } from '../lib/wordFinder.ts';
import { Search, Sparkles } from 'lucide-react';

interface WordFinderPageProps {
  onNavigate?: (path: string) => void;
}

export default function WordFinderPage({ onNavigate }: WordFinderPageProps) {
  const [options, setOptions] = useState<WordFinderFilterOptions>({
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

  // Check URL params on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const queryLetters = urlParams.get('letters') || urlParams.get('q');
    const queryLength = urlParams.get('length');
    const queryStarts = urlParams.get('starts') || urlParams.get('startsWith');
    const queryEnds = urlParams.get('ends') || urlParams.get('endsWith');
    const queryContains = urlParams.get('contains');
    const querySort = urlParams.get('sort') || urlParams.get('sortBy');

    let parsedLength: WordFinderLength = 'any';
    if (queryLength === '10+') {
      parsedLength = '10+';
    } else if (queryLength && !isNaN(Number(queryLength))) {
      const num = Number(queryLength);
      if (num >= 2 && num <= 15) parsedLength = num;
    }

    const initialOpts: WordFinderFilterOptions = {
      letters: queryLetters ? queryLetters.replace(/[^a-zA-Z?*]/g, '').slice(0, 15).toUpperCase() : '',
      length: parsedLength,
      startsWith: queryStarts ? queryStarts.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
      endsWith: queryEnds ? queryEnds.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
      contains: queryContains ? queryContains.replace(/[^a-zA-Z]/g, '').slice(0, 15).toUpperCase() : '',
      sortBy: querySort === 'alpha-asc' || querySort === 'length-asc' ? querySort : 'length-desc',
    };

    const hasAnyParam =
      Boolean(initialOpts.letters) ||
      initialOpts.length !== 'any' ||
      Boolean(initialOpts.startsWith) ||
      Boolean(initialOpts.endsWith) ||
      Boolean(initialOpts.contains);

    if (hasAnyParam) {
      setOptions(initialOpts);
      setHasTriggeredSearch(true);
    }
  }, []);

  // Compute Word Finder search results
  const result: WordFinderResult | null = useMemo(() => {
    if (!hasTriggeredSearch) {
      return null;
    }
    return findWords(options, dictionaryService);
  }, [options, hasTriggeredSearch, dictStatus.loaded]);

  const handleSearch = useCallback((newOptions: WordFinderFilterOptions) => {
    setOptions(newOptions);
    setHasTriggeredSearch(true);

    if (newOptions.letters && newOptions.letters.trim().length > 0) {
      saveRecentSearch({
        letters: newOptions.letters.trim(),
        minLength: typeof newOptions.length === 'number' ? newOptions.length : 2,
        maxLength: typeof newOptions.length === 'number' ? newOptions.length : 15,
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
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Construct summary description for ResultsPanel
  const summaryValue = useMemo(() => {
    const parts: string[] = [];
    if (options.letters?.trim()) {
      parts.push(options.letters.trim().toUpperCase().split('').join(' '));
    }
    if (options.startsWith?.trim()) {
      parts.push(`Starts: ${options.startsWith.trim().toUpperCase()}`);
    }
    if (options.endsWith?.trim()) {
      parts.push(`Ends: ${options.endsWith.trim().toUpperCase()}`);
    }
    if (options.contains?.trim()) {
      parts.push(`Contains: ${options.contains.trim().toUpperCase()}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'All Dictionary Words';
  }, [options]);

  const filterSummaryText = useMemo(() => {
    if (typeof options.length === 'number') {
      return `${options.length} letters`;
    }
    if (options.length === '10+') {
      return '10+ letters';
    }
    return 'Any length (2-15)';
  }, [options.length]);

  // Compatibility filter state for ResultsPanel
  const filterStateCompat: FilterState = useMemo(() => {
    const min = typeof options.length === 'number' ? options.length : options.length === '10+' ? 10 : 2;
    const max = typeof options.length === 'number' ? options.length : 15;
    return {
      minLength: min,
      maxLength: max,
      sortBy: options.sortBy || 'length-desc',
    };
  }, [options.length, options.sortBy]);

  return (
    <main id="word-finder-page" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero / Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
          <span>Advanced Word Search & Pattern Engine</span>
        </div>
        <h1
          id="word-finder-page-title"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          Word Finder - Find Words From Letters
        </h1>
        <p
          id="word-finder-page-description"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Find words from letters with Cluevra's Word Finder. Search by letters, word length, beginning, ending, or pattern to quickly find matching words.
        </p>
      </div>

      {/* Two-Column Interactive Tool & Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Word Finder Tool */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <WordFinderTool
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
            summaryLabel="Search Criteria"
            summaryValue={summaryValue}
            filterSummaryText={filterSummaryText}
            emptyStateTitle="Your matching words will appear here"
            emptyStateDesc="Enter available letters, choose a length, or specify prefix, suffix, and pattern filters on the left, then click Find Words."
            noResultsDesc="No matching words found in the dictionary. Try adjusting your letter rack, wildcards (?), word length, or prefix/suffix filters."
            loadedWordsText={`${dictStatus?.totalWords ? dictStatus.totalWords.toLocaleString() : '168,551'} total dictionary words loaded`}
          />
        </div>
      </div>

      {/* Educational & SEO Content Below the Tool */}
      <WordFinderContent onNavigate={onNavigate} />
    </main>
  );
}
