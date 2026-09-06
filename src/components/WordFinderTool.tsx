import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Hash,
  ArrowRight,
} from 'lucide-react';
import type { DictionaryStatus, SortOption } from '../types.ts';
import type { WordFinderFilterOptions, WordFinderLength } from '../lib/wordFinder.ts';
import { validateWordFinderOptions } from '../lib/wordFinder.ts';

interface WordFinderToolProps {
  onSearch: (options: WordFinderFilterOptions) => void;
  onClear: () => void;
  dictStatus?: DictionaryStatus;
  initialOptions?: WordFinderFilterOptions;
}

const LENGTH_SELECT_OPTIONS: { label: string; value: WordFinderLength }[] = [
  { label: 'Any Length', value: 'any' },
  { label: '2 Letters', value: 2 },
  { label: '3 Letters', value: 3 },
  { label: '4 Letters', value: 4 },
  { label: '5 Letters', value: 5 },
  { label: '6 Letters', value: 6 },
  { label: '7 Letters', value: 7 },
  { label: '8 Letters', value: 8 },
  { label: '9 Letters', value: 9 },
  { label: '10+ Letters', value: '10+' },
  { label: '10 Letters', value: 10 },
  { label: '11 Letters', value: 11 },
  { label: '12 Letters', value: 12 },
  { label: '13 Letters', value: 13 },
  { label: '14 Letters', value: 14 },
  { label: '15 Letters', value: 15 },
];

const PRESETS: {
  label: string;
  description: string;
  options: WordFinderFilterOptions;
}[] = [
  {
    label: 'Letters: AARET',
    description: 'Anagram-style search with available letters',
    options: { letters: 'AARET', length: 'any', startsWith: '', endsWith: '', contains: '' },
  },
  {
    label: 'Starts with: TR',
    description: 'Find words beginning with TR',
    options: { letters: '', length: 'any', startsWith: 'TR', endsWith: '', contains: '' },
  },
  {
    label: 'Ends with: ING',
    description: 'Find words ending with ING',
    options: { letters: '', length: 'any', startsWith: '', endsWith: 'ING', contains: '' },
  },
  {
    label: 'Contains: TION',
    description: 'Find words with TION pattern',
    options: { letters: '', length: 'any', startsWith: '', endsWith: '', contains: 'TION' },
  },
  {
    label: 'PLANET (6 Letters)',
    description: 'Exact 6-letter word search from letters',
    options: { letters: 'PLANET', length: 6, startsWith: '', endsWith: '', contains: '' },
  },
  {
    label: 'ARET? + Starts T',
    description: '5-letter word with wildcards starting with T',
    options: { letters: 'ARET?', length: 5, startsWith: 'T', endsWith: '', contains: '' },
  },
];

export default function WordFinderTool({
  onSearch,
  onClear,
  dictStatus,
  initialOptions,
}: WordFinderToolProps) {
  const [letters, setLetters] = useState(initialOptions?.letters || '');
  const [length, setLength] = useState<WordFinderLength>(initialOptions?.length ?? 'any');
  const [startsWith, setStartsWith] = useState(initialOptions?.startsWith || '');
  const [endsWith, setEndsWith] = useState(initialOptions?.endsWith || '');
  const [contains, setContains] = useState(initialOptions?.contains || '');
  const [sortBy, setSortBy] = useState<SortOption>(initialOptions?.sortBy || 'length-desc');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync when initialOptions change from URL navigation
  useEffect(() => {
    if (initialOptions) {
      if (initialOptions.letters !== undefined) setLetters(initialOptions.letters);
      if (initialOptions.length !== undefined) setLength(initialOptions.length);
      if (initialOptions.startsWith !== undefined) setStartsWith(initialOptions.startsWith);
      if (initialOptions.endsWith !== undefined) setEndsWith(initialOptions.endsWith);
      if (initialOptions.contains !== undefined) setContains(initialOptions.contains);
      if (initialOptions.sortBy !== undefined) setSortBy(initialOptions.sortBy);
    }
  }, [initialOptions]);

  const handleLettersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\*/g, '?').toUpperCase();
    setLetters(raw);
    if (validationError) setValidationError(null);
  };

  const handleStartsWithChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setStartsWith(raw);
    if (validationError) setValidationError(null);
  };

  const handleEndsWithChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setEndsWith(raw);
    if (validationError) setValidationError(null);
  };

  const handleContainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setContains(raw);
    if (validationError) setValidationError(null);
  };

  const handleLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'any') {
      setLength('any');
    } else if (val === '10+') {
      setLength('10+');
    } else {
      setLength(Number(val));
    }
    if (validationError) setValidationError(null);
  };

  const handleClear = () => {
    setLetters('');
    setLength('any');
    setStartsWith('');
    setEndsWith('');
    setContains('');
    setSortBy('length-desc');
    setValidationError(null);
    onClear();
  };

  const executeSearch = (opts?: WordFinderFilterOptions) => {
    const activeOpts: WordFinderFilterOptions = opts || {
      letters,
      length,
      startsWith,
      endsWith,
      contains,
      sortBy,
    };

    const validated = validateWordFinderOptions(activeOpts);
    if (!validated.isValid) {
      setValidationError(validated.validationError || 'Invalid search criteria.');
      return;
    }

    setValidationError(null);
    onSearch(activeOpts);

    // Smooth scroll down to results if on mobile
    const resultsElem = document.getElementById('results-section');
    if (resultsElem) {
      resultsElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch();
    }
  };

  const handleApplyPreset = (preset: (typeof PRESETS)[number]) => {
    setLetters(preset.options.letters || '');
    setLength(preset.options.length ?? 'any');
    setStartsWith(preset.options.startsWith || '');
    setEndsWith(preset.options.endsWith || '');
    setContains(preset.options.contains || '');
    setValidationError(null);
    executeSearch(preset.options);
  };

  const hasAnyFilter = Boolean(
    letters.trim() ||
      length !== 'any' ||
      startsWith.trim() ||
      endsWith.trim() ||
      contains.trim()
  );

  return (
    <div
      id="word-finder-tool-card"
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between"
    >
      <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
        {/* Tool Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              <span>Word Finder</span>
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
              Pattern & Letter Search
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Find words using letters, length, starting/ending patterns, and substrings.
          </p>
        </div>

        {/* 1. Available Letters Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="wf-letters-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Available Letters (Rack)
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Use ? or * for wildcards (max 3)
            </span>
          </div>
          <div className="relative">
            <input
              id="wf-letters-input"
              type="text"
              value={letters}
              onChange={handleLettersChange}
              placeholder="e.g. A R E T ?"
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 font-mono text-base tracking-widest uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
            {letters && (
              <button
                id="clear-letters-btn"
                type="button"
                onClick={() => setLetters('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
                aria-label="Clear letters input"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2. Search Constraints Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Word Length */}
          <div className="space-y-1.5">
            <label
              htmlFor="wf-length-select"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
            >
              <Hash className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Word Length</span>
            </label>
            <select
              id="wf-length-select"
              value={length}
              onChange={handleLengthChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            >
              {LENGTH_SELECT_OPTIONS.map((opt) => (
                <option key={`len-${opt.value}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Starts With */}
          <div className="space-y-1.5">
            <label
              htmlFor="wf-starts-with-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Starts With</span>
            </label>
            <input
              id="wf-starts-with-input"
              type="text"
              value={startsWith}
              onChange={handleStartsWithChange}
              placeholder="e.g. TR"
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Ends With */}
          <div className="space-y-1.5">
            <label
              htmlFor="wf-ends-with-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 rotate-180" aria-hidden="true" />
              <span>Ends With</span>
            </label>
            <input
              id="wf-ends-with-input"
              type="text"
              value={endsWith}
              onChange={handleEndsWithChange}
              placeholder="e.g. ING"
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Contains Pattern */}
          <div className="space-y-1.5">
            <label
              htmlFor="wf-contains-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Contains</span>
            </label>
            <input
              id="wf-contains-input"
              type="text"
              value={contains}
              onChange={handleContainsChange}
              placeholder="e.g. TION"
              maxLength={15}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-sm tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* 3. Sort Order Selection */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label
            htmlFor="wf-sort-select"
            className="text-xs font-bold uppercase tracking-wider text-slate-500"
          >
            Sort Results By
          </label>
          <select
            id="wf-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors sm:w-auto"
          >
            <option value="length-desc">Longest words first</option>
            <option value="length-asc">Shortest words first</option>
            <option value="alpha-asc">Alphabetical (A to Z)</option>
          </select>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div
            id="word-finder-error-banner"
            role="alert"
            className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" aria-hidden="true" />
            <p id="word-finder-error-text" className="leading-relaxed font-medium">
              {validationError}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            id="find-words-btn"
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm active:translate-y-px"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Find Words</span>
          </button>
          <button
            id="clear-all-btn"
            type="button"
            onClick={handleClear}
            disabled={!hasAnyFilter}
            className="px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold rounded-lg text-sm transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear all inputs and filters"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Clear</span>
          </button>
        </div>

        {/* Quick Example Presets */}
        <div id="quick-presets-section" className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2 text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quick Searches
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={`preset-${idx}`}
                id={`preset-btn-${idx}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-[11px] font-mono font-medium px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-600 transition-colors"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Dictionary Load Status Badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Dictionary Lexicon</span>
        <span className="font-semibold text-slate-600">
          {dictStatus?.totalWords ? dictStatus.totalWords.toLocaleString() : '168,551'} words
        </span>
      </div>
    </div>
  );
}
