import { useState } from 'react';
import { Search, Copy, Check, FileQuestion, Sparkles, Share2 } from 'lucide-react';
import type { DictionaryStatus, FilterState, UnscrambleResult } from '../types.ts';
import { calculateWordScore } from '../lib/scoring.ts';
import { formatGroupsForClipboard } from '../lib/unscrambler.ts';
import { shareSearch } from '../lib/share.ts';

interface ResultsPanelProps {
  searchedLetters?: string;
  hasTriggeredSearch?: boolean;
  result?: UnscrambleResult | null;
  dictStatus?: DictionaryStatus;
  filters?: FilterState;
  loadedWordsText?: string;
  summaryLabel?: string;
  summaryValue?: string;
  emptyStateTitle?: string;
  emptyStateDesc?: string;
  noResultsDesc?: string;
  filterSummaryText?: string;
}

export default function ResultsPanel({
  searchedLetters = '',
  hasTriggeredSearch = false,
  result = null,
  dictStatus,
  filters,
  loadedWordsText,
  summaryLabel,
  summaryValue,
  emptyStateTitle,
  emptyStateDesc,
  noResultsDesc,
  filterSummaryText,
}: ResultsPanelProps) {
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [copyAllStatus, setCopyAllStatus] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const wordCountFormatted = dictStatus?.totalWords
    ? dictStatus.totalWords.toLocaleString()
    : '168,551';

  const handleCopyWord = (word: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(word.toUpperCase()).catch(() => {});
      setCopiedWord(word);
      setTimeout(() => {
        setCopiedWord((prev) => (prev === word ? null : prev));
      }, 1500);
    }
  };

  const handleCopyAll = async () => {
    if (!result || !result.groups || result.groups.length === 0) {
      return;
    }

    const formatted = formatGroupsForClipboard(result.groups);

    let copied = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(formatted);
        copied = true;
      } catch {
        copied = false;
      }
    }

    // Fallback if clipboard API throws or restricted
    if (!copied && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = formatted;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopyAllStatus(true);
      setTimeout(() => setCopyAllStatus(false), 2000);
    }
  };

  const handleShare = async () => {
    const activeLetters = result?.lettersNormalized || searchedLetters;
    const currentFilters: FilterState = filters || {
      minLength: 2,
      maxLength: 15,
      sortBy: 'length-desc',
    };

    const shareRes = await shareSearch(activeLetters, currentFilters);
    if (shareRes.sharedViaWebShare) {
      setShareFeedback('Shared!');
    } else if (shareRes.copiedToClipboard) {
      setShareFeedback('Link Copied!');
    } else {
      setShareFeedback('Unable to share');
    }

    setTimeout(() => {
      setShareFeedback(null);
    }, 2500);
  };

  const hasWords = Boolean(hasTriggeredSearch && result && result.totalWords > 0);
  const isEmptyResult = Boolean(hasTriggeredSearch && (!result || result.totalWords === 0));

  // Format letters for prominent display: "A R E T" or "A R E ?"
  const displayLetters = result?.lettersNormalized
    ? result.lettersNormalized.toUpperCase().split('').join(' ')
    : searchedLetters
    ? searchedLetters.toUpperCase().replace(/[^A-Z?]/g, '').split('').join(' ')
    : '';

  // Filter description for header
  const filterSummary = filterSummaryText
    ? filterSummaryText
    : filters
    ? filters.minLength === filters.maxLength
      ? `${filters.minLength} letters only`
      : `${filters.minLength} - ${filters.maxLength} letters`
    : '2 - 15 letters';

  return (
    <section
      id="results-section"
      aria-labelledby="results-heading"
      aria-live="polite"
      className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full min-h-[480px]"
    >
      {/* Top Status Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <h2 id="results-heading" className="font-bold text-slate-800 text-sm sm:text-base">
            Results
          </h2>
          {hasWords && (
            <span
              id="results-summary-pill"
              className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100 hidden sm:inline-block"
            >
              {filters?.sortBy === 'alpha-asc'
                ? `${result?.totalWords} ${result?.totalWords === 1 ? 'word' : 'words'}`
                : `${result?.groups.length} ${result?.groups.length === 1 ? 'group' : 'groups'}`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasWords && (
            <div className="flex items-center gap-1.5">
              {/* Copy All Button (Requirement 4) */}
              <button
                id="copy-all-btn"
                type="button"
                onClick={handleCopyAll}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                title="Copy all visible results to clipboard"
                aria-label="Copy all visible results to clipboard"
              >
                {copyAllStatus ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              {/* Share Search Button (Requirement 8) */}
              <button
                id="share-search-btn"
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
                title="Share this search or copy link"
                aria-label="Share search link"
              >
                {shareFeedback ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                    <span className="text-indigo-700">{shareFeedback}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          )}

          <span
            id="results-count-badge"
            className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors ${
              hasWords
                ? 'bg-indigo-600 text-white shadow-2xs'
                : isEmptyResult
                ? 'bg-slate-200 text-slate-600'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {hasWords
              ? `${result?.totalWords} ${result?.totalWords === 1 ? 'word' : 'words'} found`
              : isEmptyResult
              ? '0 words found'
              : loadedWordsText || `${wordCountFormatted} words loaded`}
          </span>
        </div>
      </div>

      {/* State 1: Active Search Results */}
      {hasWords && result && (
        <div id="active-results-container" className="flex-1 flex flex-col overflow-hidden">
          {/* Results Summary Header (Requirement 9) */}
          <div
            id="results-summary-bar"
            className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                {summaryLabel || 'Unscrambled Letters'}
              </span>
              <span
                id="searched-letters-display"
                className="font-mono text-base sm:text-lg font-bold text-indigo-950 tracking-widest"
              >
                {summaryValue !== undefined ? summaryValue : displayLetters}
              </span>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Filter Range
                </span>
                <span id="filter-range-display" className="text-xs font-semibold text-slate-600">
                  {filterSummary}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Results
                </span>
                <span
                  id="total-words-count-display"
                  className="text-sm sm:text-base font-bold text-slate-700"
                >
                  {result.totalWords} {result.totalWords === 1 ? 'word' : 'words'}
                </span>
              </div>
            </div>
          </div>

          {/* Grouped Words Content */}
          <div
            id="grouped-results-scroll-area"
            className="flex-1 overflow-y-auto p-5 space-y-6 divide-y divide-slate-100"
          >
            {result.groups.map((group, groupIdx) => {
              const groupIdentifier = group.length > 0 ? `${group.length}` : 'alpha';
              const headingText = group.label || `${group.length} LETTER WORDS`;

              return (
                <div
                  key={`group-${group.length}-${groupIdx}`}
                  id={`group-${groupIdentifier}-letters`}
                  className={groupIdx === 0 ? 'space-y-3' : 'pt-5 space-y-3'}
                >
                  {/* Group Heading */}
                  <div className="flex items-center justify-between">
                    <h3
                      id={`group-heading-${groupIdentifier}`}
                      className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                    >
                      <span>{headingText}</span>
                    </h3>
                    <span
                      id={`group-count-${groupIdentifier}`}
                      className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                    >
                      {group.words.length} {group.words.length === 1 ? 'word' : 'words'}
                    </span>
                  </div>

                  {/* Words Grid */}
                  <div
                    id={`words-grid-${groupIdentifier}`}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                  >
                  {group.words.map((word) => {
                    const isCopied = copiedWord === word;
                    const score = calculateWordScore(word);

                    return (
                      <button
                        key={word}
                        id={`word-tile-${word}`}
                        type="button"
                        onClick={() => handleCopyWord(word)}
                        title={`Click to copy "${word.toUpperCase()}" (${score} pts)`}
                        aria-label={`Copy word ${word.toUpperCase()}, Scrabble-style score ${score} points`}
                        className={`group relative px-3 py-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                          isCopied
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-300 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-mono text-sm font-bold tracking-wider uppercase">
                            {word}
                          </span>
                          {/* Scrabble-style Score Badge (Requirement 3 & 9) */}
                          <span
                            className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 font-sans shrink-0"
                            title="Scrabble-style score"
                          >
                            {score} pts
                          </span>
                        </div>
                        <span className="shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors ml-1">
                          {isCopied ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>

          {/* Scrabble-style score disclaimer footer */}
          <div
            id="scoring-disclaimer-footer"
            className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between shrink-0"
          >
            <span>* Scrabble-style score: calculated from standard letter tile point values.</span>
          </div>
        </div>
      )}

      {/* State 2: No Results Found */}
      {isEmptyResult && (
        <div
          id="no-results-state"
          className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        >
          <div
            id="no-results-icon"
            className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400"
          >
            <FileQuestion className="w-8 h-8 text-slate-400" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p id="no-results-title" className="text-slate-700 font-bold text-base">
            No words found
          </p>
          <p id="no-results-description" className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
            {noResultsDesc ||
              'No matching words found in the dictionary. Try different letters, use wildcard tiles (?), or adjust your word length.'}
          </p>
          {searchedLetters && (
            <div className="mt-3 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs font-mono text-slate-600 font-medium">
              Input: {summaryValue || displayLetters || searchedLetters.toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* State 3: Initial Empty State (Awaiting input) */}
      {!hasTriggeredSearch && (
        <div
          id="empty-results-state"
          className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        >
          <div
            id="empty-state-icon"
            className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300 border border-slate-100"
          >
            <Search className="w-8 h-8 text-slate-300" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p id="empty-results-message" className="text-slate-700 font-bold text-base">
            {emptyStateTitle || 'Your words will appear here'}
          </p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
            {emptyStateDesc ||
              'Enter letters or wildcards (?) on the left and click Unscramble to find matching words from the dictionary.'}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
            <span>Fast dictionary lookups & Scrabble-style scoring</span>
          </div>
        </div>
      )}
    </section>
  );
}
