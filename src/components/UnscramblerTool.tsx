import React, { useState, useEffect } from 'react';
import { Search, X, CornerDownLeft, AlertCircle, Loader2, History, Trash2, HelpCircle } from 'lucide-react';
import FilterControls from './FilterControls.tsx';
import type { FilterState, DictionaryStatus, RecentSearchItem } from '../types.ts';
import { parseAndValidateInput } from '../lib/unscrambler.ts';
import { getRecentSearches, clearRecentSearches } from '../lib/recentSearches.ts';

interface UnscramblerToolProps {
  onSearch: (letters: string, filters: FilterState) => void;
  onClear: () => void;
  dictStatus?: DictionaryStatus;
  initialLetters?: string;
  initialFilters?: FilterState;
}

export default function UnscramblerTool({
  onSearch,
  onClear,
  dictStatus,
  initialLetters = '',
  initialFilters,
}: UnscramblerToolProps) {
  const [inputVal, setInputVal] = useState(initialLetters);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      minLength: 2,
      maxLength: 15,
      sortBy: 'length-desc',
    }
  );

  // Synchronize if initial letters or filters arrive from URL
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

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const refreshRecentSearches = () => {
    setRecentSearches(getRecentSearches());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert * to ? wildcard and uppercase all letters
    const raw = e.target.value.replace(/\*/g, '?').toUpperCase();
    setInputVal(raw);
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
    const parsed = parseAndValidateInput(lettersToSearch, searchFilters);
    if (!parsed.isValid) {
      setValidationError(parsed.validationError || 'Invalid input letters.');
      return;
    }

    setValidationError(null);
    onSearch(lettersToSearch.trim(), searchFilters);
    refreshRecentSearches();

    // Smooth scroll down to results if on mobile/smaller screens
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

  // Extract individual letter characters for tactile preview (letters or wildcards)
  const previewLetters = inputVal
    .replace(/[^A-Z?]/gi, '')
    .split('')
    .slice(0, 16);

  return (
    <section id="tool" aria-labelledby="hero-heading" className="w-full flex flex-col gap-6">
      {/* 2. Hero Section */}
      <section id="hero-section">
        <h1
          id="hero-heading"
          className="text-3xl font-extrabold text-slate-900 leading-tight"
        >
          Word Unscrambler
        </h1>
        <p
          id="hero-subheading"
          className="text-slate-500 mt-2 text-sm sm:text-base leading-relaxed"
        >
          Unscramble letters, wildcard tiles (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">?</code>), and find all valid words.
        </p>
      </section>

      {/* 3. Main Tool Card */}
      <div
        id="main-tool-card"
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-5"
      >
        <form id="unscrambler-form" onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-2">
            {/* Input Label */}
            <div className="flex items-center justify-between">
              <label
                id="letters-input-label"
                htmlFor="letters-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"
              >
                <span>Enter your letters</span>
                <span
                  title="Use ? for blank / wildcard tiles (up to 3)"
                  className="inline-flex items-center text-slate-400 hover:text-slate-600 cursor-help"
                >
                  <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </label>
              {inputVal.length > 0 && (
                <span className="text-xs text-slate-400 font-medium">
                  {inputVal.replace(/\s+/g, '').length} characters
                </span>
              )}
            </div>

            {/* Input field */}
            <div className="relative">
              <input
                id="letters-input"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={inputVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter letters, e.g. A R E T or A R E ?"
                aria-describedby="letters-helper-text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-lg text-slate-900 placeholder:text-slate-400 uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all pr-10"
              />
              {inputVal.length > 0 && (
                <button
                  id="inline-clear-btn"
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                  aria-label="Clear entered letters"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Tactile tile preview */}
            {previewLetters.length > 0 && (
              <div
                id="letter-tiles-preview"
                aria-label="Entered letters preview"
                className="flex flex-wrap items-center gap-1.5 pt-1"
              >
                {previewLetters.map((char, index) => {
                  const isWildcard = char === '?';
                  return (
                    <span
                      key={`tile-${index}-${char}`}
                      className={`flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-bold shadow-2xs transition-colors ${
                        isWildcard
                          ? 'border-2 border-dashed border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border border-slate-300 bg-slate-100 text-slate-800'
                      }`}
                      title={isWildcard ? 'Wildcard tile (represents any letter)' : undefined}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Validation Error Message */}
            {validationError && (
              <p
                id="input-validation-error"
                role="alert"
                className="text-xs text-amber-600 font-semibold flex items-center gap-1.5 pt-1"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                <span>{validationError}</span>
              </p>
            )}

            {/* Helper Text */}
            <p
              id="letters-helper-text"
              className="text-xs text-slate-400 flex items-center justify-between"
            >
              <span>Use <span className="font-mono font-semibold text-slate-600">?</span> for wildcard blank tiles (max 3).</span>
              <span className="hidden sm:inline text-[11px] text-slate-400">Press Enter to unscramble</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div id="tool-action-buttons" className="flex gap-3">
            <button
              id="unscramble-button"
              type="submit"
              disabled={Boolean(dictStatus && !dictStatus.loaded && dictStatus.totalWords === 0)}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
            >
              {dictStatus && !dictStatus.loaded && dictStatus.totalWords === 0 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Loading dictionary...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Unscramble</span>
                  <CornerDownLeft className="hidden sm:inline h-3.5 w-3.5 text-indigo-200" aria-hidden="true" />
                </>
              )}
            </button>

            <button
              id="clear-button"
              type="button"
              onClick={handleClear}
              disabled={inputVal.length === 0 && !validationError}
              className="px-6 bg-slate-100 text-slate-600 font-semibold py-3 rounded-lg hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Clear
            </button>
          </div>

          {/* Recent Searches Section (Requirement 7) */}
          {recentSearches.length > 0 && (
            <div id="recent-searches-container" className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <History className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>Recent Searches</span>
                </span>
                <button
                  id="clear-recent-searches-btn"
                  type="button"
                  onClick={handleClearHistory}
                  className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  title="Clear search history"
                >
                  <Trash2 className="w-3 h-3" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5" role="list" aria-label="Recent searches list">
                {recentSearches.map((item) => (
                  <button
                    key={item.id}
                    id={`recent-search-${item.letters}`}
                    type="button"
                    onClick={() => handleRecentClick(item)}
                    className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 rounded-md border border-slate-200 transition-colors"
                    title={`Restore search: ${item.letters}`}
                  >
                    {item.letters}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. Filter Section */}
          <FilterControls filters={filters} onChange={setFilters} />
        </form>
      </div>
    </section>
  );
}
