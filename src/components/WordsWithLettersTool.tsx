import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Hash,
  ArrowRight,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import type { DictionaryStatus, SortOption } from '../types.ts';
import type {
  WordsWithLettersOptions,
  WordsWithLettersLength,
} from '../lib/wordsWithLetters.ts';
import { validateWordsWithLettersOptions } from '../lib/wordsWithLetters.ts';

interface WordsWithLettersToolProps {
  onSearch: (options: WordsWithLettersOptions) => void;
  onClear: () => void;
  dictStatus?: DictionaryStatus;
  initialOptions?: WordsWithLettersOptions;
}

const LENGTH_SELECT_OPTIONS: { label: string; value: WordsWithLettersLength }[] = [
  { label: 'Any Length (Default)', value: 'any' },
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
  options: WordsWithLettersOptions;
}[] = [
  {
    label: 'PLANET',
    description: 'Sub-words: plane, plant, plate, late, lane...',
    options: { letters: 'PLANET', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'STREAM',
    description: 'Sub-words: master, smart, stare, steam, tame...',
    options: { letters: 'STREAM', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'COMPUTER',
    description: 'Sub-words: compute, erupt, metro, court, pure...',
    options: { letters: 'COMPUTER', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'EDUCATION',
    description: 'Sub-words: auction, notice, united, danced...',
    options: { letters: 'EDUCATION', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'HEART',
    description: 'Sub-words: earth, hater, hear, heat, rate...',
    options: { letters: 'HEART', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'TRAE',
    description: 'Sub-words: rate, tear, tare, ear, are, art...',
    options: { letters: 'TRAE', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
  {
    label: 'AEIOU',
    description: 'Vowel combinations and sub-words: roue, aie...',
    options: { letters: 'AEIOU', length: 'any', startsWith: '', endsWith: '', contains: '', sortBy: 'length-desc' },
  },
];

export default function WordsWithLettersTool({
  onSearch,
  onClear,
  dictStatus,
  initialOptions,
}: WordsWithLettersToolProps) {
  const [letters, setLetters] = useState(initialOptions?.letters || '');
  const [length, setLength] = useState<WordsWithLettersLength>(initialOptions?.length ?? 'any');
  const [startsWith, setStartsWith] = useState(initialOptions?.startsWith || '');
  const [endsWith, setEndsWith] = useState(initialOptions?.endsWith || '');
  const [contains, setContains] = useState(initialOptions?.contains || '');
  const [sortBy, setSortBy] = useState<SortOption>(initialOptions?.sortBy || 'length-desc');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Synchronize when initialOptions change (e.g. from URL or presets)
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

  // Derived character metrics
  const cleanLetters = letters.replace(/[^a-zA-Z]/g, '');
  const wildcardCount = (letters.match(/[?*]/g) || []).length;
  const totalLength = cleanLetters.length + wildcardCount;

  const handleLettersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.toUpperCase();
    // Allow letters, wildcards (?, *), and spaces for flexible pasting
    const filtered = rawVal.replace(/[^A-Z?*\s]/g, '');
    setLetters(filtered);
    if (validationError) setValidationError(null);
  };

  const handleAddWildcard = () => {
    if (wildcardCount >= 3 || totalLength >= 15) return;
    setLetters((prev) => `${prev}?`);
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

  const handleReset = () => {
    setLetters('');
    setLength('any');
    setStartsWith('');
    setEndsWith('');
    setContains('');
    setSortBy('length-desc');
    setValidationError(null);
    onClear();
  };

  const executeSearch = (opts?: WordsWithLettersOptions) => {
    const activeOpts: WordsWithLettersOptions = opts || {
      letters,
      length,
      startsWith,
      endsWith,
      contains,
      sortBy,
    };

    const validated = validateWordsWithLettersOptions(activeOpts);
    if (!validated.isValid) {
      setValidationError(validated.validationError || 'Please enter valid available letters.');
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
    setSortBy(preset.options.sortBy || 'length-desc');
    setValidationError(null);
    executeSearch(preset.options);
  };

  return (
    <div
      id="words-with-letters-card"
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between"
    >
      <form onSubmit={handleSubmit} className="space-y-5" onKeyDown={handleKeyDown}>
        {/* Tool Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              <span>Words With Letters</span>
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
              Word Construction
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover every word you can build from your available tiles. Words do not need to use every letter.
          </p>
        </div>

        {/* 1. Main Available Letters Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="wwl-letters-input"
              className="text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Available Letters (Rack)
            </label>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>{totalLength}/15 letters</span>
              <span>•</span>
              <span className={wildcardCount > 0 ? 'text-indigo-600 font-semibold' : ''}>
                {wildcardCount}/3 wildcards
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              id="wwl-letters-input"
              type="text"
              value={letters}
              onChange={handleLettersChange}
              placeholder="Enter letters, e.g. PLANET"
              maxLength={20}
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

          {/* Wildcard helper chips */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Quick wildcard:</span>
              <button
                type="button"
                id="add-wildcard-chip"
                onClick={handleAddWildcard}
                disabled={wildcardCount >= 3 || totalLength >= 15}
                className={`text-xs px-2.5 py-1 rounded-md border font-mono font-medium transition-colors ${
                  wildcardCount >= 3 || totalLength >= 15
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300'
                }`}
                title="Add unknown letter tile (? or *)"
              >
                +? Add Blank Tile
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              ? or * = unknown tile
            </span>
          </div>
        </div>

        {/* 2. Search Filters Grid */}
        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
            <span>Search Filters (Optional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Word Length */}
            <div className="space-y-1">
              <label
                htmlFor="wwl-length-select"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
              >
                <Hash className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Word Length</span>
              </label>
              <select
                id="wwl-length-select"
                value={length}
                onChange={handleLengthChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              >
                {LENGTH_SELECT_OPTIONS.map((opt) => (
                  <option key={`len-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Starts With */}
            <div className="space-y-1">
              <label
                htmlFor="wwl-starts-with-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Starts With</span>
              </label>
              <input
                id="wwl-starts-with-input"
                type="text"
                value={startsWith}
                onChange={handleStartsWithChange}
                placeholder="e.g. P"
                maxLength={15}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-mono text-xs tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Ends With */}
            <div className="space-y-1">
              <label
                htmlFor="wwl-ends-with-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 rotate-180" aria-hidden="true" />
                <span>Ends With</span>
              </label>
              <input
                id="wwl-ends-with-input"
                type="text"
                value={endsWith}
                onChange={handleEndsWithChange}
                placeholder="e.g. E"
                maxLength={15}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-mono text-xs tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Contains */}
            <div className="space-y-1">
              <label
                htmlFor="wwl-contains-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1"
              >
                <span className="font-mono text-slate-400 text-xs">[..]</span>
                <span>Contains</span>
              </label>
              <input
                id="wwl-contains-input"
                type="text"
                value={contains}
                onChange={handleContainsChange}
                placeholder="e.g. LAN"
                maxLength={15}
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-mono text-xs tracking-wider uppercase text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3. Sorting and Lexicon Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs border-t border-slate-100">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <label htmlFor="wwl-sort-select" className="font-medium text-slate-600">
              Sort By:
            </label>
            <select
              id="wwl-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="length-desc">Length: Longest First (Default)</option>
              <option value="length-asc">Length: Shortest First</option>
              <option value="alpha-asc">Alphabetical (A–Z)</option>
              <option value="score-desc">Highest Tile Score</option>
            </select>
          </div>

          {dictStatus && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  dictStatus.loaded ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                }`}
              />
              {dictStatus.loaded
                ? `${dictStatus.totalWords.toLocaleString()} words loaded`
                : 'Loading Lexicon...'}
            </div>
          )}
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div
            id="words-with-letters-validation-error"
            role="alert"
            className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 4. Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            id="find-words-btn"
            type="submit"
            className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            <span>Find Words</span>
          </button>
          <button
            id="reset-search-btn"
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </form>

      {/* 5. Preset Examples */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Preset Examples:
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
