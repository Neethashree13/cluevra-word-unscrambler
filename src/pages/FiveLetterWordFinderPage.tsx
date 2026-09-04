import { useState, useMemo } from 'react';
import type { FiveLetterFilterOptions } from '../types.ts';
import { findFiveLetterWords } from '../lib/fiveLetterFinder.ts';
import { dictionaryService } from '../lib/dictionary.ts';
import FiveLetterTool from '../components/FiveLetterTool.tsx';
import FiveLetterResults from '../components/FiveLetterResults.tsx';
import FiveLetterContent from '../components/FiveLetterContent.tsx';
import { Sparkles } from 'lucide-react';

export default function FiveLetterWordFinderPage() {
  const [filterOptions, setFilterOptions] = useState<FiveLetterFilterOptions>({
    pattern: '_____',
    sortBy: 'alpha-asc',
  });

  // Compute 5-letter results using dictionaryService
  const result = useMemo(() => {
    return findFiveLetterWords(filterOptions, dictionaryService);
  }, [filterOptions]);

  const handleSearch = (newOptions: FiveLetterFilterOptions) => {
    setFilterOptions(newOptions);
  };

  const handleClear = () => {
    setFilterOptions({
      pattern: '_____',
      sortBy: 'alpha-asc',
    });
  };

  const handleSortChange = (newSort: 'alpha-asc' | 'alpha-desc') => {
    setFilterOptions((prev) => ({
      ...prev,
      sortBy: newSort,
    }));
  };

  return (
    <div id="five-letter-finder-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero / Header */}
      <div className="text-center mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Linguistic Pattern & Word Solver</span>
        </div>
        <h1
          id="five-letter-page-title"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          5 Letter Word Finder
        </h1>
        <p
          id="five-letter-page-description"
          className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Find 5 letter words from letters, patterns, and known positions. Filter by starts with, ends with, contains, and excluded letters with instant dictionary results.
        </p>
      </div>

      {/* Interactive Tool Form */}
      <FiveLetterTool
        onSearch={handleSearch}
        onClear={handleClear}
        initialOptions={filterOptions}
      />

      {/* Results Display */}
      <FiveLetterResults
        result={result}
        sortBy={filterOptions.sortBy || 'alpha-asc'}
        onSortChange={handleSortChange}
      />

      {/* In-depth Educational & SEO Content */}
      <FiveLetterContent />
    </div>
  );
}
