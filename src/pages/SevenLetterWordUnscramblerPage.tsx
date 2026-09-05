import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FilterState, DictionaryStatus, UnscrambleResult } from '../types.ts';
import { findWordsFromLetters } from '../lib/unscrambler.ts';
import { dictionaryService } from '../lib/dictionary.ts';
import { saveRecentSearch } from '../lib/recentSearches.ts';
import SevenLetterTool from '../components/SevenLetterTool.tsx';
import ResultsPanel from '../components/ResultsPanel.tsx';
import SevenLetterContent from '../components/SevenLetterContent.tsx';
import { Sparkles } from 'lucide-react';

interface SevenLetterWordUnscramblerPageProps {
  onNavigate?: (path: string) => void;
}

export default function SevenLetterWordUnscramblerPage({ onNavigate }: SevenLetterWordUnscramblerPageProps) {
  const [letters, setLetters] = useState<string>('');
  const [hasTriggeredSearch, setHasTriggeredSearch] = useState<boolean>(false);
  const [dictStatus, setDictStatus] = useState<DictionaryStatus>(dictionaryService.getStatus());
  const [filters, setFilters] = useState<FilterState>({
    minLength: 7,
    maxLength: 7,
    sortBy: 'alpha-asc',
  });

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
    if (queryLetters) {
      const cleanLetters = queryLetters.replace(/[^a-zA-Z?*]/g, '').slice(0, 7);
      if (cleanLetters) {
        setLetters(cleanLetters);
        setHasTriggeredSearch(true);
      }
    }
  }, []);

  // Compute unscrambler results from dictionary
  const result: UnscrambleResult | null = useMemo(() => {
    if (!hasTriggeredSearch || !letters.trim()) {
      return null;
    }
    return findWordsFromLetters(letters, filters, dictionaryService);
  }, [letters, filters, hasTriggeredSearch, dictStatus.loaded]);

  const handleSearch = useCallback((newLetters: string, newFilters: FilterState) => {
    setLetters(newLetters);
    setFilters(newFilters);
    setHasTriggeredSearch(true);
    saveRecentSearch({
      letters: newLetters,
      minLength: newFilters.minLength,
      maxLength: newFilters.maxLength,
      sortBy: newFilters.sortBy,
    });

    // Update URL query parameters without reloading
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newLetters.trim()) {
        url.searchParams.set('letters', newLetters.trim().toUpperCase());
      } else {
        url.searchParams.delete('letters');
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleClear = useCallback(() => {
    setLetters('');
    setHasTriggeredSearch(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('letters');
      url.searchParams.delete('q');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  return (
    <main id="seven-letter-page" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Hero / Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>7-Letter Anagram & Word Solver</span>
        </div>
        <h1
          id="seven-letter-page-title"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          7 Letter Word Unscrambler
        </h1>
        <p
          id="seven-letter-page-description"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Enter up to 7 letters and find matching 7-letter words from the loaded dictionary. Use blank or wildcard tiles (<code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">?</code> or <code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">*</code>) to solve 7-letter anagrams, board game bingos, and word puzzles.
        </p>
      </div>

      {/* Two-Column Interactive Tool & Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: 7 Letter Unscrambler Tool */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <SevenLetterTool
            onSearch={handleSearch}
            onClear={handleClear}
            dictStatus={dictStatus}
            initialLetters={letters}
            initialFilters={filters}
          />
        </div>

        {/* Right Column: Results Panel */}
        <div className="lg:col-span-6 flex flex-col h-full">
          <ResultsPanel
            searchedLetters={letters}
            hasTriggeredSearch={hasTriggeredSearch}
            result={result}
            dictStatus={dictStatus}
            filters={filters}
          />
        </div>
      </div>

      {/* Educational & SEO Content Below the Tool */}
      <SevenLetterContent onNavigate={onNavigate} />
    </main>
  );
}
