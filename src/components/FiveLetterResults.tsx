import { useState } from 'react';
import { Copy, Check, AlertCircle, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import type { FiveLetterResult } from '../types.ts';
import { formatFiveLetterWordsForClipboard } from '../lib/fiveLetterFinder.ts';

interface FiveLetterResultsProps {
  result: FiveLetterResult;
  sortBy: 'alpha-asc' | 'alpha-desc';
  onSortChange: (sort: 'alpha-asc' | 'alpha-desc') => void;
}

export default function FiveLetterResults({
  result,
  sortBy,
  onSortChange,
}: FiveLetterResultsProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const { words, totalWords, patternNormalized, validationError } = result;

  const handleCopyAll = async () => {
    if (words.length === 0) return;
    const formatted = formatFiveLetterWordsForClipboard(words);
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = formatted;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopyWord = async (word: string) => {
    const uppercaseWord = word.toUpperCase();
    try {
      await navigator.clipboard.writeText(uppercaseWord);
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(null), 1800);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = uppercaseWord;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedWord(word);
      setTimeout(() => setCopiedWord(null), 1800);
    }
  };

  // 1. Validation Error State
  if (validationError) {
    return (
      <section
        id="five-letter-validation-alert"
        aria-live="polite"
        className="p-5 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex items-start gap-3.5 text-amber-900 shadow-2xs"
      >
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-amber-900 mb-1">
            Search Constraint Notice
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            {validationError}
          </p>
        </div>
      </section>
    );
  }

  // 2. Empty State (No words match)
  if (totalWords === 0) {
    return (
      <section
        id="five-letter-empty-state"
        aria-live="polite"
        className="p-8 text-center bg-white border border-slate-200 rounded-2xl mb-8 shadow-2xs"
      >
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-1">
          No 5-Letter Words Found
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          No dictionary words matched your exact combination of pattern and letter constraints. Try clearing some excluded letters or opening up pattern slots.
        </p>
      </section>
    );
  }

  // 3. Matched Results State
  return (
    <section
      id="five-letter-results-section"
      aria-labelledby="five-letter-results-heading"
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs mb-10 transition-colors"
    >
      {/* Header controls & stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <h2
            id="five-letter-results-heading"
            className="text-base font-bold text-slate-900"
          >
            Matching Words
          </h2>
          <span
            id="five-letter-count-badge"
            className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full"
          >
            {totalWords} {totalWords === 1 ? 'word' : 'words'}
          </span>
          {patternNormalized && patternNormalized !== '_____' && (
            <span
              id="results-pattern-badge"
              className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline-block"
            >
              Pattern: {patternNormalized.toUpperCase().split('').join(' ')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort selector */}
          <div className="relative">
            <select
              id="results-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'alpha-asc' | 'alpha-desc')}
              aria-label="Sort 5-letter words"
              className="appearance-none pl-8 pr-7 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="alpha-asc">A to Z</option>
              <option value="alpha-desc">Z to A</option>
            </select>
            {sortBy === 'alpha-asc' ? (
              <ArrowDownAZ className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            ) : (
              <ArrowUpZA className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            )}
          </div>

          {/* Copy all button */}
          <button
            id="copy-all-five-letter-btn"
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 rounded-lg transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of 5-letter words */}
      <div
        id="five-letter-words-grid"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5"
        role="list"
        aria-label="5 Letter Words"
      >
        {words.map((word) => {
          const isCopied = copiedWord === word;
          return (
            <button
              key={word}
              id={`word-card-${word}`}
              type="button"
              onClick={() => handleCopyWord(word)}
              title={`Click to copy "${word.toUpperCase()}"`}
              className={`relative group px-3 py-2.5 rounded-xl border text-center font-mono font-bold text-sm sm:text-base tracking-wider transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                isCopied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-800 hover:text-indigo-900'
              }`}
            >
              <span>{word.toUpperCase()}</span>
              {isCopied && (
                <span
                  id={`copied-badge-${word}`}
                  className="absolute -top-2 right-2 text-[10px] font-sans font-semibold bg-emerald-600 text-white px-1.5 py-0.2 rounded shadow-xs animate-fade-in"
                >
                  Copied!
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile-friendly hint */}
      <p className="text-[11px] text-slate-400 text-center mt-4">
        Tip: Tap any word to copy it to your clipboard.
      </p>
    </section>
  );
}
