import { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import UnscramblerTool from './components/UnscramblerTool.tsx';
import ResultsPanel from './components/ResultsPanel.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import FAQ from './components/FAQ.tsx';
import Footer from './components/Footer.tsx';
import AboutPage from './pages/AboutPage.tsx';
import PrivacyPage from './pages/PrivacyPage.tsx';
import TermsPage from './pages/TermsPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import FiveLetterWordFinderPage from './pages/FiveLetterWordFinderPage.tsx';
import SixLetterWordUnscramblerPage from './pages/SixLetterWordUnscramblerPage.tsx';
import SevenLetterWordUnscramblerPage from './pages/SevenLetterWordUnscramblerPage.tsx';
import EightLetterWordUnscramblerPage from './pages/EightLetterWordUnscramblerPage.tsx';
import WordFinderPage from './pages/WordFinderPage.tsx';
import WordsWithLettersPage from './pages/WordsWithLettersPage.tsx';
import AnagramSolverPage from './pages/AnagramSolverPage.tsx';
import type { FilterState, DictionaryStatus, UnscrambleResult } from './types.ts';
import { dictionaryService } from './lib/dictionary.ts';
import { findWordsFromLetters } from './lib/unscrambler.ts';
import { parseShareUrl, buildShareUrl } from './lib/share.ts';
import { saveRecentSearch } from './lib/recentSearches.ts';
import { getRouteFromPath, getPathFromRoute, updatePageSEO, type AppRoute } from './lib/router.ts';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      return getRouteFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [searchedLetters, setSearchedLetters] = useState('');
  const [hasTriggeredSearch, setHasTriggeredSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<UnscrambleResult | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    minLength: 2,
    maxLength: 15,
    sortBy: 'length-desc',
  });
  const [dictStatus, setDictStatus] = useState<DictionaryStatus>(dictionaryService.getStatus());

  // 1. Initial SEO & URL parameters check (Preserves /word-unscrambler?letters=...)
  useEffect(() => {
    updatePageSEO(currentRoute);

    if (typeof window !== 'undefined' && window.location.search) {
      const parsed = parseShareUrl(window.location.search);
      if (parsed.hasParams && parsed.letters) {
        const restoredFilters: FilterState = {
          minLength: parsed.minLength,
          maxLength: parsed.maxLength,
          sortBy: parsed.sortBy,
        };
        setSearchedLetters(parsed.letters);
        setActiveFilters(restoredFilters);
        setHasTriggeredSearch(true);

        const initialResult = findWordsFromLetters(
          parsed.letters,
          restoredFilters,
          dictionaryService
        );
        setSearchResult(initialResult);

        // Save into recent searches
        saveRecentSearch({
          letters: parsed.letters,
          minLength: restoredFilters.minLength,
          maxLength: restoredFilters.maxLength,
          sortBy: restoredFilters.sortBy,
        });
      }
    }
  }, []);

  // 2. Popstate listener for browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromPath(window.location.pathname);
      setCurrentRoute(route);
      updatePageSEO(route);

      // If returning to home with query parameters, re-parse and restore
      if (route === 'home' && window.location.search) {
        const parsed = parseShareUrl(window.location.search);
        if (parsed.hasParams && parsed.letters) {
          const restoredFilters: FilterState = {
            minLength: parsed.minLength,
            maxLength: parsed.maxLength,
            sortBy: parsed.sortBy,
          };
          setSearchedLetters(parsed.letters);
          setActiveFilters(restoredFilters);
          setHasTriggeredSearch(true);
          const initialResult = findWordsFromLetters(
            parsed.letters,
            restoredFilters,
            dictionaryService
          );
          setSearchResult(initialResult);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 3. Subscribe to dictionary loading events
  useEffect(() => {
    const unsubscribe = dictionaryService.subscribe((status) => {
      setDictStatus(status);
      // If a search was already performed, re-evaluate with the expanded dictionary
      if (searchedLetters && hasTriggeredSearch) {
        const updatedResult = findWordsFromLetters(
          searchedLetters,
          activeFilters,
          dictionaryService
        );
        setSearchResult(updatedResult);
      }
    });

    dictionaryService.loadFullDictionary();

    return () => {
      unsubscribe();
    };
  }, [searchedLetters, hasTriggeredSearch, activeFilters]);

  const handleSearch = (letters: string, filters: FilterState) => {
    setSearchedLetters(letters);
    setActiveFilters(filters);
    setHasTriggeredSearch(true);

    const result = findWordsFromLetters(letters, filters, dictionaryService);
    setSearchResult(result);

    // Save to local recent searches history
    saveRecentSearch({
      letters,
      minLength: filters.minLength,
      maxLength: filters.maxLength,
      sortBy: filters.sortBy,
    });

    // Update URL query parameters for shareability without page reload
    if (typeof window !== 'undefined') {
      const shareUrl = buildShareUrl(letters, filters);
      if (shareUrl) {
        window.history.replaceState(null, '', shareUrl);
      }
    }
  };

  const handleClear = () => {
    setSearchedLetters('');
    setSearchResult(null);
    setHasTriggeredSearch(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleNavigate = (target: string) => {
    if (target.startsWith('#')) {
      const targetId = target.replace('#', '');
      if (currentRoute !== 'home') {
        setCurrentRoute('home');
        updatePageSEO('home');
        window.history.pushState(null, '', `/word-unscrambler${target}`);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const newRoute = getRouteFromPath(target);
    setCurrentRoute(newRoute);
    updatePageSEO(newRoute);

    let targetUrl = getPathFromRoute(newRoute);
    if (newRoute === 'home' && searchedLetters) {
      const shareUrl = buildShareUrl(searchedLetters, activeFilters);
      if (shareUrl) {
        try {
          const parsed = new URL(shareUrl);
          targetUrl = `${parsed.pathname}${parsed.search}`;
        } catch {
          targetUrl = shareUrl;
        }
      }
    }

    window.history.pushState(null, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="word-unscrambler-app"
      className="min-h-screen flex flex-col font-sans text-slate-800 bg-gray-50 antialiased"
    >
      {/* Header */}
      <Header currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Dynamic Content Routing */}
      {currentRoute === 'home' && (
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Column 1: Tool & Filters */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <UnscramblerTool
                onSearch={handleSearch}
                onClear={handleClear}
                dictStatus={dictStatus}
                initialLetters={searchedLetters}
                initialFilters={activeFilters}
              />
            </div>

            {/* Column 2: Results Panel */}
            <div className="lg:col-span-4 flex flex-col h-full">
              <ResultsPanel
                searchedLetters={searchedLetters}
                hasTriggeredSearch={hasTriggeredSearch}
                result={searchResult}
                dictStatus={dictStatus}
                filters={activeFilters}
              />
            </div>

            {/* Column 3: Informational Guides & FAQ */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <HowItWorks />
              <FAQ />
            </div>
          </div>

          <section
            id="related-word-tools"
            aria-labelledby="related-word-tools-heading"
            className="mt-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
          >
            <div className="max-w-4xl">
              <h2
                id="related-word-tools-heading"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900"
              >
                Related Word Tools
              </h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                Explore our full suite of free word finding and anagram solving utilities:
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                <a
                  href="/word-finder"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/word-finder');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  Word Finder (By Pattern & Rack) →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/words-with-letters"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/words-with-letters');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  Words With Letters →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/anagram-solver"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/anagram-solver');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  Anagram Solver (Exact Rearrangements) →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/5-letter-word-finder"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/5-letter-word-finder');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  5 Letter Word Finder →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/6-letter-word-unscrambler"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/6-letter-word-unscrambler');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  6 Letter Unscrambler →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/7-letter-word-unscrambler"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/7-letter-word-unscrambler');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  7 Letter Unscrambler →
                </a>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <a
                  href="/8-letter-word-unscrambler"
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavigate('/8-letter-word-unscrambler');
                  }}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm"
                >
                  8 Letter Unscrambler →
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {currentRoute === 'about' && (
        <main id="main-content" className="flex-1 w-full">
          <AboutPage onNavigateHome={() => handleNavigate('/word-unscrambler')} />
        </main>
      )}

      {currentRoute === 'privacy' && (
        <main id="main-content" className="flex-1 w-full">
          <PrivacyPage onNavigateHome={() => handleNavigate('/word-unscrambler')} />
        </main>
      )}

      {currentRoute === 'terms' && (
        <main id="main-content" className="flex-1 w-full">
          <TermsPage onNavigateHome={() => handleNavigate('/word-unscrambler')} />
        </main>
      )}

      {currentRoute === 'contact' && (
        <main id="main-content" className="flex-1 w-full">
          <ContactPage onNavigateHome={() => handleNavigate('/word-unscrambler')} />
        </main>
      )}

      {currentRoute === 'wordFinder' && (
        <WordFinderPage onNavigate={handleNavigate} />
      )}

      {currentRoute === 'wordsWithLetters' && (
        <WordsWithLettersPage onNavigate={handleNavigate} />
      )}

      {currentRoute === 'anagramSolver' && (
        <AnagramSolverPage onNavigate={handleNavigate} />
      )}

      {currentRoute === 'fiveLetterFinder' && (
        <main id="main-content" className="flex-1 w-full">
          <FiveLetterWordFinderPage />
        </main>
      )}

      {currentRoute === 'sixLetterUnscrambler' && (
        <SixLetterWordUnscramblerPage onNavigate={handleNavigate} />
      )}

      {currentRoute === 'sevenLetterUnscrambler' && (
        <SevenLetterWordUnscramblerPage onNavigate={handleNavigate} />
      )}

      {currentRoute === 'eightLetterUnscrambler' && (
        <EightLetterWordUnscramblerPage onNavigate={handleNavigate} />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
