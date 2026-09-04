import React, { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { FiveLetterFilterOptions } from '../types.ts';

interface FiveLetterToolProps {
  onSearch: (options: FiveLetterFilterOptions) => void;
  onClear: () => void;
  initialOptions?: FiveLetterFilterOptions;
}

const PRESETS = [
  { label: '_ A _ E _', pattern: ['_', 'a', '_', 'e', '_'] },
  { label: 'S A _ E _', pattern: ['s', 'a', '_', 'e', '_'] },
  { label: 'S T _ _ E', pattern: ['s', 't', '_', '_', 'e'] },
  { label: '_ R A N _', pattern: ['_', 'r', 'a', 'n', '_'] },
  { label: '_ _ O U T', pattern: ['_', '_', 'o', 'u', 't'] },
];

export default function FiveLetterTool({
  onSearch,
  onClear,
  initialOptions,
}: FiveLetterToolProps) {
  // 5 individual slot inputs
  const [tiles, setTiles] = useState<string[]>(['', '', '', '', '']);
  const [startsWith, setStartsWith] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const [containsLetters, setContainsLetters] = useState('');
  const [excludeLetters, setExcludeLetters] = useState('');
  const [availableLetters, setAvailableLetters] = useState('');
  const [sortBy, setSortBy] = useState<'alpha-asc' | 'alpha-desc'>('alpha-asc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Trigger search on mount and when initialOptions change
  useEffect(() => {
    if (initialOptions) {
      if (Array.isArray(initialOptions.pattern)) {
        setTiles(initialOptions.pattern.map((p) => (p && p !== '_' ? p.toUpperCase() : '')));
      } else if (typeof initialOptions.pattern === 'string') {
        const clean = initialOptions.pattern.replace(/[^a-zA-Z_]/g, '');
        const newTiles = clean.split('').slice(0, 5).map((c) => (c !== '_' ? c.toUpperCase() : ''));
        while (newTiles.length < 5) newTiles.push('');
        setTiles(newTiles);
      }
      if (initialOptions.startsWith) setStartsWith(initialOptions.startsWith);
      if (initialOptions.endsWith) setEndsWith(initialOptions.endsWith);
      if (initialOptions.containsLetters) setContainsLetters(initialOptions.containsLetters);
      if (initialOptions.excludeLetters) setExcludeLetters(initialOptions.excludeLetters);
      if (initialOptions.availableLetters) setAvailableLetters(initialOptions.availableLetters);
      if (initialOptions.sortBy) setSortBy(initialOptions.sortBy);
    }
  }, [initialOptions]);

  const handleTileChange = (index: number, val: string) => {
    // Only allow letters
    const letter = val.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase();
    const nextTiles = [...tiles];
    nextTiles[index] = letter;
    setTiles(nextTiles);

    // Auto-advance to next input if letter was typed
    if (letter && index < 4) {
      tileRefs[index + 1].current?.focus();
    }
  };

  const handleTileKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!tiles[index] && index > 0) {
        // Empty slot backspace: jump to previous slot and clear it
        e.preventDefault();
        const nextTiles = [...tiles];
        nextTiles[index - 1] = '';
        setTiles(nextTiles);
        tileRefs[index - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      tileRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 4) {
      e.preventDefault();
      tileRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleApplyPreset = (presetTiles: string[]) => {
    const formatted = presetTiles.map((t) => (t === '_' ? '' : t.toUpperCase()));
    setTiles(formatted);
    onSearch({
      pattern: presetTiles.map((t) => (t === '' ? '_' : t.toLowerCase())),
      startsWith,
      endsWith,
      containsLetters,
      excludeLetters,
      availableLetters,
      sortBy,
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const patternArray = tiles.map((t) => (t ? t.toLowerCase() : '_'));
    onSearch({
      pattern: patternArray,
      startsWith,
      endsWith,
      containsLetters,
      excludeLetters,
      availableLetters,
      sortBy,
    });
  };

  const handleReset = () => {
    setTiles(['', '', '', '', '']);
    setStartsWith('');
    setEndsWith('');
    setContainsLetters('');
    setExcludeLetters('');
    setAvailableLetters('');
    setSortBy('alpha-asc');
    onClear();
    tileRefs[0].current?.focus();
  };

  const currentPatternString = tiles.map((t) => (t ? t : '_')).join(' ');

  return (
    <section
      id="five-letter-tool-section"
      aria-labelledby="five-letter-tool-heading"
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs mb-8 transition-colors"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pattern Input - 5 prominent letter tiles */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              id="pattern-tiles-label"
              className="text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              5 Letter Pattern (Known Positions)
            </label>
            <span
              id="pattern-preview-badge"
              className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-md"
            >
              Pattern: {currentPatternString}
            </span>
          </div>

          <p id="pattern-explanation" className="text-xs text-slate-500 mb-3">
            Example: _ A _ E _ means A is the 2nd letter and E is the 4th letter.
          </p>

          <div
            id="pattern-tile-grid"
            className="grid grid-cols-5 gap-2 sm:gap-4 max-w-sm sm:max-w-md mx-auto"
            role="group"
            aria-labelledby="pattern-tiles-label"
          >
            {tiles.map((char, index) => (
              <div key={`tile-${index}`} className="flex flex-col items-center">
                <input
                  ref={tileRefs[index]}
                  id={`pattern-tile-${index + 1}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleTileChange(index, e.target.value)}
                  onKeyDown={(e) => handleTileKeyDown(index, e)}
                  aria-label={`Position ${index + 1} letter`}
                  placeholder={(index + 1).toString()}
                  className="w-full aspect-square text-center text-xl sm:text-2xl font-bold uppercase bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-300 shadow-2xs"
                />
                <span className="text-[11px] font-medium text-slate-400 mt-1.5">
                  Slot {index + 1}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 text-center mt-2.5">
            Type known letters in their exact positions. Leave blank if unknown.
          </p>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Presets:
            </span>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                id={`preset-btn-${preset.label.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'blank'}`}
                type="button"
                onClick={() => handleApplyPreset(preset.pattern)}
                className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="pt-2">
          <button
            id="toggle-advanced-filters-btn"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
            aria-expanded={showAdvanced}
            aria-controls="advanced-filters-grid"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide Additional Filters' : 'More Filters (Starts with, Exclude, Contains...)'}</span>
          </button>
        </div>

        {/* Additional Filters Grid */}
        {showAdvanced && (
          <div
            id="advanced-filters-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl"
          >
            {/* Starts With */}
            <div>
              <label
                htmlFor="starts-with-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Starts With
              </label>
              <input
                id="starts-with-input"
                type="text"
                maxLength={5}
                value={startsWith}
                onChange={(e) => setStartsWith(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                placeholder="e.g. st"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase placeholder:normal-case placeholder:text-slate-400"
              />
            </div>

            {/* Ends With */}
            <div>
              <label
                htmlFor="ends-with-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Ends With
              </label>
              <input
                id="ends-with-input"
                type="text"
                maxLength={5}
                value={endsWith}
                onChange={(e) => setEndsWith(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                placeholder="e.g. er"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase placeholder:normal-case placeholder:text-slate-400"
              />
            </div>

            {/* Contains Letters */}
            <div>
              <label
                htmlFor="contains-letters-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Must Contain
              </label>
              <input
                id="contains-letters-input"
                type="text"
                maxLength={5}
                value={containsLetters}
                onChange={(e) => setContainsLetters(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                placeholder="e.g. a, e"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase placeholder:normal-case placeholder:text-slate-400"
              />
            </div>

            {/* Exclude Letters */}
            <div>
              <label
                htmlFor="exclude-letters-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Exclude Letters
              </label>
              <input
                id="exclude-letters-input"
                type="text"
                value={excludeLetters}
                onChange={(e) => setExcludeLetters(e.target.value.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                placeholder="e.g. x, z, q"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase placeholder:normal-case placeholder:text-slate-400"
              />
            </div>

            {/* Available Letters / Rack */}
            <div className="sm:col-span-2">
              <label
                htmlFor="available-letters-input"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Available Letters Pool (Optional Rack)
              </label>
              <input
                id="available-letters-input"
                type="text"
                value={availableLetters}
                onChange={(e) => setAvailableLetters(e.target.value.replace(/[^a-zA-Z?]/g, ''))}
                placeholder="e.g. arest? (supports '?' wildcards)"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase placeholder:normal-case placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Limits results to words formable from these specific letters (anagram mode).
              </span>
            </div>

            {/* Sort Direction */}
            <div className="sm:col-span-2">
              <label
                htmlFor="sort-order-select"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Sort Results
              </label>
              <select
                id="sort-order-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'alpha-asc' | 'alpha-desc')}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="alpha-asc">Alphabetical (A to Z)</option>
                <option value="alpha-desc">Reverse Alphabetical (Z to A)</option>
              </select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            id="five-letter-submit-btn"
            type="submit"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <Search className="w-4 h-4" />
            <span>Find 5 Letter Words</span>
          </button>

          <button
            id="five-letter-clear-btn"
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </form>
    </section>
  );
}
