import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Hash,
  ArrowUpDown,
} from 'lucide-react';
import type { DictionaryStatus, SortOption, AnagramLength, AnagramSolverOptions } from '../types.ts';
import { validateAnagramSolverOptions } from '../lib/anagramSolver.ts';

interface AnagramSolverToolProps {
  onSearch: (options: AnagramSolverOptions) => void;
  onClear: () => void;
  dictStatus?: DictionaryStatus;
  initialOptions?: AnagramSolverOptions;
}

const LENGTH_OPTIONS: { label: string; value: AnagramLength }[] = [
  { label: 'Exact Length (All Letters)', value: 'exact' },
  { label: 'Any Length (Sub-Anagrams)', value: 'any' },
  { label: '2 Letters', value: 2 },
  { label: '3 Letters', value: 3 },
  { label: '4 Letters', value: 4 },
  { label: '5 Letters', value: 5 },
  { label: '6 Letters', value: 6 },
  { label: '7 Letters', value: 7 },
  { label: '8 Letters', value: 8 },
  { label: '9 Letters', value: 9 },
  { label: '10 Letters', value: 10 },
  { label: '11 Letters', value: 11 },
  { label: '12 Letters', value: 12 },
  { label: '13 Letters', value: 13 },
  { label: '14 Letters', value: 14 },
  { label: '15 Letters', value: 15 },
  { label: '10+ Letters', value: '10+' },
];

const PRESET_EXAMPLES: {
  label: string;
  description: string;
  options: AnagramSolverOptions;
}[] = [
  {
    label: 'LISTEN',
    description: 'Exact 6-letter anagrams (silent, enlist...)',
    options: { letters: 'LISTEN', length: 'exact', sortBy: 'length-desc' },
  },
  {
    label: 'EARTH',
    description: 'Exact 5-letter anagrams (heart, hater...)',
    options: { letters: 'EARTH', length: 'exact', sortBy: 'length-desc' },
  },
  {
    label: 'CARE',
    description: 'Exact 4-letter anagrams (acre, race...)',
    options: { letters: 'CARE', length: 'exact', sortBy: 'length-desc' },
  },
  {
    label: 'PLANET',
    description: 'Exact 6-letter anagrams (platen...)',
    options: { letters: 'PLANET', length: 'exact', sortBy: 'length-desc' },
  },
  {
    label: 'SILENT',
    description: 'Exact 6-letter anagrams (listen, tinsel...)',
    options: { letters: 'SILENT', length: 'exact', sortBy: 'length-desc' },
  },
  {
    label: 'THE EYES',
    description: 'Phrase anagram letters (sub-words)',
    options: { letters: 'THE EYES', length: 'any', sortBy: 'length-desc' },
  },
];

export default function AnagramSolverTool({
  onSearch,
  onClear,
  dictStatus,
  initialOptions,
}: AnagramSolverToolProps) {
  const [letters, setLetters] = useState(initialOptions?.letters || '');
  const [length, setLength] = useState<AnagramLength>(initialOptions?.length ?? 'exact');
  const [sortBy, setSortBy] = useState<SortOption>(initialOptions?.sortBy || 'length-desc');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync state when initialOptions change (e.g. navigation / url load)
  useEffect(() => {
    if (initialOptions) {
      if (initialOptions.letters !== undefined) setLetters(initialOptions.letters);
      if (initialOptions.length !== undefined) setLength(initialOptions.length);
      if (initialOptions.sortBy !== undefined) setSortBy(initialOptions.sortBy);
    }
  }, [initialOptions]);

  // Derived character and wildcard metrics
  const cleanLetters = letters.replace(/[^a-zA-Z]/g, '');
  const wildcardCount = (letters.match(/[?*]/g) || []).length;
  const totalLength = cleanLetters.length + wildcardCount;

  const handleLettersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    // Allow letters, wildcards (?, *), and spaces for phrases
    const filtered = rawVal.replace(/[^A-Z?*\s]/g, '');
    setLetters(filtered);
    if (validationError) setValidationError(null);
  };

  const handleInsertWildcard = () => {
    if (wildcardCount >= 3) return;
    if (totalLength >= 15) return;
    setLetters((prev) => `${prev}?`);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentOptions: AnagramSolverOptions = {
      letters: letters.trim(),
      length,
      sortBy,
    };

    const validation = validateAnagramSolverOptions(currentOptions);
    if (!validation.isValid) {
      setValidationError(validation.validationError);
      return;
    }

    setValidationError(null);
    onSearch(currentOptions);
  };

  const handleClearClick = () => {
    setLetters('');
    setLength('exact');
    setSortBy('length-desc');
    setValidationError(null);
    onClear();
  };

  const handlePresetClick = (preset: (typeof PRESET_EXAMPLES)[0]) => {
    setLetters(preset.options.letters || '');
    setLength(preset.options.length ?? 'exact');
    setSortBy(preset.options.sortBy || 'length-desc');
    setValidationError(null);
    onSearch(preset.options);
  };

  const isFormEmpty = letters.trim() === '';

  return (
    <div
      id="anagram-solver-card"
      className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden"
    >
      {/* Tool Header */}
      <div className="bg-slate-50/75 border-b border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            Anagram Solver
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter letters or words to rearrange and find exact anagram solutions.
          </p>
        </div>

        {dictStatus && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                dictStatus.loaded
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  dictStatus.loaded ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              {dictStatus.loaded
                ? `${dictStatus.totalWords.toLocaleString()} words`
                : 'Loading Lexicon...'}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* Primary Letters Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="anagram-letters-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Enter Letters or Phrase <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>
                {totalLength}/15 letters {wildcardCount > 0 && `(${wildcardCount} ?)`}
              </span>
              <button
                type="button"
                id="anagram-insert-wildcard-btn"
                onClick={handleInsertWildcard}
                disabled={wildcardCount >= 3 || totalLength >= 15}
                title="Add wildcard (?)"
                className="px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed rounded border border-indigo-200 transition-colors"
              >
                + ? Wildcard
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              id="anagram-letters-input"
              type="text"
              value={letters}
              onChange={handleLettersChange}
              placeholder="e.g. LISTEN, EARTH, CARE, PLANET"
              maxLength={25}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className={`w-full text-base sm:text-lg font-mono tracking-wider px-3.5 py-2.5 rounded-lg border bg-white focus:outline-hidden focus:ring-2 transition-all ${
                validationError
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 text-rose-900'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100 text-slate-900'
              }`}
            />
            {letters && (
              <button
                type="button"
                id="anagram-clear-input-inline-btn"
                onClick={() => setLetters('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs"
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Enter letters to rearrange. Use ? or * for blank tiles (up to 3). Spaces in phrases are
            automatically normalized.
          </p>
        </div>

        {/* Filters and Options Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {/* Length Filter */}
          <div>
            <label
              htmlFor="anagram-length-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              Anagram Length
            </label>
            <select
              id="anagram-length-select"
              value={length.toString()}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'exact' || val === 'any' || val === '10+') {
                  setLength(val as AnagramLength);
                } else {
                  setLength(parseInt(val, 10));
                }
                if (validationError) setValidationError(null);
              }}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              {LENGTH_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value.toString()}>
                  {opt.label}
                  {opt.value === 'exact' && totalLength > 0 ? ` (${totalLength} Letters)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label
              htmlFor="anagram-sort-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              Sort Results By
            </label>
            <select
              id="anagram-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full text-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors"
            >
              <option value="length-desc">Word Length (Longest First)</option>
              <option value="length-asc">Word Length (Shortest First)</option>
              <option value="alpha-asc">Alphabetical (A to Z)</option>
              <option value="score-desc">Scrabble Score (Highest First)</option>
            </select>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div
            id="anagram-validation-error-banner"
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Input Error</span>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            id="anagram-solve-btn"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-xs hover:shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Solve Anagrams
          </button>

          <button
            type="button"
            id="anagram-reset-btn"
            onClick={handleClearClick}
            disabled={isFormEmpty && length === 'exact' && sortBy === 'length-desc'}
            className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold py-2.5 px-4 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Quick Example Presets */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Try Quick Examples:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_EXAMPLES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                id={`anagram-preset-${preset.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handlePresetClick(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors text-left"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
