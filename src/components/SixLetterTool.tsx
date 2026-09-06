import React, { useState, useEffect } from 'react';
import { Search, X, CornerDownLeft, AlertCircle, Loader2, History, Trash2, HelpCircle } from 'lucide-react';
import type { FilterState, DictionaryStatus, RecentSearchItem } from '../types.ts';
import { parseAndValidateInput } from '../lib/unscrambler.ts';
import { getRecentSearches, clearRecentSearches } from '../lib/recentSearches.ts';
import { SCRABBLE_LETTER_VALUES } from '../lib/scoring.ts';

interface SixLetterToolProps {
  onSearch: (letters: string, filters: FilterState) => void;
  onClear: () => void;
  dictStatus?: DictionaryStatus;
  initialLetters?: string;
  initialFilters?: FilterState;
}

export default function SixLetterTool({
  onSearch,
  onClear,
  dictStatus,
  initialLetters = '',
  initialFilters,
}: SixLetterToolProps) {
  const [inputVal, setInputVal] = useState(initialLetters);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      minLength: 6,
      maxLength: 6,
      sortBy: 'alpha-asc',
    }
  );

  useEffect(() => {
    if (initialLetters && initialLetters !== inputVal) {
      setInputVal(initialLetters);
    }
  }, [initialLetters]);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const refreshRecentSearches = () => {
    setRecentSearches(getRecentSearches());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert * to ? wildcard and uppercase
    // Filter to valid characters (A-Z, ?) and allow a maximum of 6 characters
    const clean = e.target.value
      .replace(/\*/g, '?')
      .toUpperCase()
      .replace(/[^A-Z?]/g, '')
      .slice(0, 6);
    setInputVal(clean);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleClear = () => {
    setInputVal('');
    setValidationError(null);
    onClear();
  };

  const executeSearch = (lettersToSearch: string, searchFilters: FilterState) => {
    const rawClean = lettersToSearch.replace(/[^A-Z?]/gi, '');
    if (!rawClean) {
      setValidationError('Please enter up to 6 letters or wildcards (?).');
      return;
    }

    if (rawClean.length > 6) {
      setValidationError('Please enter up to 6 letters.');
      return;
    }

    const parsed = parseAndValidateInput(lettersToSearch, searchFilters);
    if (!parsed.isValid) {
      setValidationError(parsed.validationError || 'Invalid input letters.');
      return;
    }

    setValidationError(null);
    onSearch(lettersToSearch.trim(), searchFilters);
    refreshRecentSearches();

    // Smooth scroll down to results on smaller screens
    const resultsElem = document.getElementById('results-section');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(inputVal, filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch(inputVal, filters);
    }
  };

  const handleRecentClick = (item: RecentSearchItem) => {
    setInputVal(item.letters);
    const restoredFilters: FilterState = {
      minLength: item.minLength,
      maxLength: item.maxLength,
      sortBy: item.sortBy,
    };
    setFilters(restoredFilters);
    setValidationError(null);
    onSearch(item.letters, restoredFilters);
    refreshRecentSearches();

    const resultsElem = document.getElementById('results-section');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Extract preview tiles (up to 6)
  const previewChars = inputVal
    .replace(/[^A-Z?]/gi, '')
    .split('')
    .slice(0, 6);

  const wordCountFormatted = dictStatus?.totalWords
    ? dictStatus.totalWords.toLocaleString()
    : '168,551';

  return (
    <div id="six-letter-tool-container" className="w-full flex flex-col gap-6">
      {/* Main Tool Card */}
      <div
        id="six-letter-tool-card"
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-5"
      >
        {/* Dictionary Status Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Dictionary Loaded — {wordCountFormatted} total words</span>
          </div>
          <span className="bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-indigo-100">
            Target: 6 Letters
          </span>
        </div>

        <form id="six-letter-form" onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            {/* Input Label */}
            <div className="flex items-center justify-between">
              <label
                id="six-letters-input-label"
                htmlFor="six-letters-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
              >
                <span>Enter up to 6 letters</span>
                <span
                  title="Use ? or * for blank / wildcard tiles (up to 3)"
                  className="inline-flex items-center text-slate-400 hover:text-slate-600 cursor-help"
                >
                  <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </label>
              <span id="six-letters-counter" className="text-xs text-slate-400 font-medium">
                {inputVal.length} / 6
              </span>
            </div>

            {/* Input field */}
            <div className="relative">
              <input
                id="six-letters-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter up to 6 letters, e.g. AARET? or PLANET"
                aria-describedby="six-letters-helper-text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-lg text-slate-900 placeholder:text-slate-400 uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
              />
              {inputVal.length > 0 && (
                <button
                  id="six-inline-clear-btn"
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  aria-label="Clear entered letters"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div
                id="six-letters-validation-error"
                role="alert"
                className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Helper Text */}
            <p id="six-letters-helper-text" className="text-xs text-slate-500 leading-relaxed">
              Use <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold border border-slate-200">?</code> or <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold border border-slate-200">*</code> for wildcard tiles (up to 3). Defaults to 6-letter words.
            </p>
          </div>

          {/* Tactile Letter Tiles Preview (Up to 6 slots) */}
          <div id="six-tiles-preview-container" className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Tile Rack Preview ({previewChars.length}/6)
            </span>
            <div className="flex flex-wrap gap-1.5 items-center min-h-[44px]">
              {Array.from({ length: 6 }).map((_, idx) => {
                const char = previewChars[idx];
                const isWildcard = char === '?';
                const score = isWildcard ? 0 : (char ? SCRABBLE_LETTER_VALUES[char.toLowerCase()] || 1 : null);

                return (
                  <div
                    key={idx}
                    className={`w-9 h-10 rounded-md flex flex-col items-center justify-center border font-bold select-none relative transition-all ${
                      char
                        ? isWildcard
                          ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs'
                          : 'bg-white border-slate-300 text-slate-900 shadow-2xs'
                        : 'bg-slate-50/80 border-dashed border-slate-200 text-slate-300'
                    }`}
                  >
                    <span className="text-base leading-none">{char || '·'}</span>
                    {char && (
                      <span className="text-[9px] font-medium leading-none text-slate-400 absolute bottom-1 right-1">
                        {score}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div id="six-letter-filters-box" className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Search Filters
              </span>
              <span className="text-[11px] text-slate-400">
                Word length set to 6 letters
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sort Order */}
              <div className="space-y-1">
                <label
                  htmlFor="six-sort-by-select"
                  className="text-xs font-medium text-slate-700 block"
                >
                  Sort Order
                </label>
                <select
                  id="six-sort-by-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy'],
                    }))
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="alpha-asc">Alphabetical (A to Z)</option>
                  <option value="length-desc">Highest Score / Length</option>
                  <option value="length-asc">Shortest First</option>
                </select>
              </div>

              {/* Word Length Target */}
              <div className="space-y-1">
                <label
                  htmlFor="six-length-range"
                  className="text-xs font-medium text-slate-700 block"
                >
                  Word Length Range
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 w-full text-center">
                    Min: {filters.minLength} / Max: {filters.maxLength} letters
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              id="six-unscramble-submit-btn"
              type="submit"
              disabled={dictStatus ? !dictStatus.loaded : false}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-bold text-sm shadow-xs transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {dictStatus && !dictStatus.loaded ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Loading Dictionary...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Unscramble 6 Letter Words</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-indigo-200 ml-1 hidden sm:inline" />
                </>
              )}
            </button>

            <button
              id="six-clear-all-btn"
              type="button"
              onClick={handleClear}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Recent Searches (Optional Helper) */}
      {recentSearches.length > 0 && (
        <section
          id="six-recent-searches-section"
          aria-labelledby="six-recent-searches-heading"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h2
                id="six-recent-searches-heading"
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Recent Searches
              </h2>
            </div>
            <button
              id="six-clear-recent-btn"
              type="button"
              onClick={handleClearHistory}
              className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear search history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.slice(0, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleRecentClick(item)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                {item.letters}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
