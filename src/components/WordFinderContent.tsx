import React from 'react';
import { WORD_FINDER_FAQS } from '../data/wordFinderFaq.ts';
import FAQ from './FAQ.tsx';
import { ArrowRight, SpellCheck, LayoutGrid, Search, Hash, SlidersHorizontal, Sparkles } from 'lucide-react';

interface WordFinderContentProps {
  onNavigate?: (path: string) => void;
}

export default function WordFinderContent({ onNavigate }: WordFinderContentProps) {
  const handleToolClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.button === 1) return;
    e.preventDefault();
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  };

  const steps = [
    {
      num: '1',
      title: 'Enter available letters',
      desc: 'Type letters from your tile rack or puzzle into the Available Letters box (optional if filtering by pattern).',
    },
    {
      num: '2',
      title: 'Set word length',
      desc: 'Choose "Any Length", an exact number from 2 to 15 letters, or "10+ Letters" to narrow your targets.',
    },
    {
      num: '3',
      title: 'Add prefix or suffix',
      desc: 'Specify letters that words must start with (e.g. TR) or end with (e.g. ING) to fit board hooks.',
    },
    {
      num: '4',
      title: 'Define contained pattern',
      desc: 'Enter letter patterns that must appear anywhere inside the word (e.g. TION or AI).',
    },
    {
      num: '5',
      title: 'Click Find Words',
      desc: 'Press Enter or click Find Words to query the 168,551-word tournament English dictionary instantly.',
    },
  ];

  return (
    <article id="word-finder-content" className="space-y-12 mt-12 text-slate-700">
      {/* 1. What is a Word Finder? */}
      <section id="what-is-word-finder" aria-labelledby="what-is-heading" className="space-y-4">
        <h2
          id="what-is-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Search className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>What is a Word Finder?</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          A <strong>Word Finder</strong> is an advanced linguistic search engine that discovers valid dictionary words based on letters, word lengths, prefixes, suffixes, and internal letter patterns. While a standard word unscrambler rearranges a fixed set of tiles into anagrams, a Word Finder gives you granular control over board placement, missing letters, and puzzle constraints.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Whether you need an 8-letter word ending in <em>-ING</em>, a 5-letter word starting with <em>T</em> built from your rack letters, or every dictionary entry containing the substring <em>TION</em>, Cluevra evaluates your search criteria simultaneously against our comprehensive lexicon of 168,551 words.
        </p>
      </section>

      {/* 2. How to Use Cluevra Word Finder */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading" className="space-y-4">
        <h2
          id="how-to-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How to Use the Word Finder
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                {step.num}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Find Words from Letters (Available Letters / Anagram Search) */}
      <section id="find-words-from-letters" aria-labelledby="letters-heading" className="space-y-4">
        <h2
          id="letters-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <span>Find Words from Letters</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          When playing tile-based board games like Scrabble, Words With Friends, or Bananagrams, you often have a specific collection of letters on your rack. Entering those characters into the <strong>Available Letters</strong> box instructs the engine to form words strictly using those letters.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Strict Letter Frequencies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you enter <em>A R E T</em>, the engine will only form words with at most one A, one R, one E, and one T (e.g. <em>RATE</em>, <em>TARE</em>, <em>TEAR</em>). Duplicate letters require duplicates in your input.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Sub-Word Combinations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When length is set to "Any Length", the tool discovers all valid subsets from 2 letters up to your rack size, including high-scoring 2-letter and 3-letter plays to exploit open board bonus squares.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Scrabble Score Calculation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every result tile displays its standard letter point value, allowing you to prioritize the highest-scoring plays before your turn timer expires.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Find Words by Pattern (Starts with, Ends with, Contains, Length) */}
      <section id="find-words-by-pattern" aria-labelledby="pattern-heading" className="space-y-4">
        <h2
          id="pattern-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <span>Find Words by Pattern: Starts With, Ends With & Contains</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Crosswords and board games frequently require words that connect to existing tiles on the board. Cluevra Word Finder allows you to filter the dictionary by structural patterns even without providing available rack letters:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-xs font-bold uppercase">
              <ArrowRight className="w-4 h-4" />
              <span>Starts With (Prefix)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Isolate words that open with specific prefixes. For example, entering <strong>TR</strong> discovers <em>TREE</em>, <em>TRAIN</em>, <em>TRACE</em>, and <em>TRAVEL</em>.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-xs font-bold uppercase">
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Ends With (Suffix)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find words terminating in specific grammatical endings. Entering <strong>ING</strong> surfaces active participles like <em>RUNNING</em>, <em>PLAYING</em>, and <em>SPRING</em>.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-xs font-bold uppercase">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Contains Pattern</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Require specific letter sequences anywhere within the word. Entering <strong>TION</strong> yields <em>ACTION</em>, <em>MOTION</em>, <em>PORTION</em>, and <em>STATION</em>.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-600 font-mono text-xs font-bold uppercase">
              <Hash className="w-4 h-4" />
              <span>Exact Word Length</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lock the search to an exact letter count (e.g. 5 letters for Wordle or 7 letters for Scrabble bingos), eliminating irrelevant word lengths.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Wildcard Letters Functionality */}
      <section id="wildcards" aria-labelledby="wildcards-heading" className="space-y-3">
        <h2
          id="wildcards-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Using Wildcards for Blank Tiles & Missing Letters
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          In games with blank tiles like Scrabble or when solving crossword puzzles with unknown intersections, wildcards are indispensable. Cluevra supports up to <strong>3 wildcard tiles</strong> per query using either a question mark (<strong>?</strong>) or asterisk (<strong>*</strong>).
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          For example, searching for <code>ARET?</code> evaluates every letter of the alphabet in place of the question mark, uncovering 5-letter gems such as <em>TAMER</em>, <em>TAPER</em>, <em>TRADE</em>, <em>TATER</em>, and <em>TREAT</em>. When combined with prefix or suffix filters, wildcards make pinpointing board hook opportunities effortless.
        </p>
      </section>

      {/* 6. Word Game Use Cases */}
      <section id="word-game-use-cases" aria-labelledby="use-cases-heading" className="space-y-4">
        <h2
          id="use-cases-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Word Game Use Cases & Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Scrabble & Words With Friends</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hook into existing words on the board by setting "Starts With" or "Ends With" to the connector letter on the board, while supplying your rack tiles to the "Available Letters" input.
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Daily Puzzles & Wordle</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When solving daily 5-letter puzzles like Wordle, specify length 5, set known starting or ending letters, and test possible consonant blends to eliminate incorrect guesses.
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Crossword Solving</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you know the starting letters and total length of a crossword clue answer, set the length and "Starts With" filter to browse all valid dictionary matches that fit the grid.
            </p>
          </div>
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Vocabulary Expansion & Creative Writing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore rhyme patterns, poetic assonance, and alliteration by querying words with specific phonemes, suffixes, and Latin or Greek root stems.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Frequently Asked Questions */}
      <section id="faq-section" aria-labelledby="faq-heading" className="space-y-4">
        <h2
          id="faq-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Frequently Asked Questions
        </h2>
        <FAQ items={WORD_FINDER_FAQS} />
      </section>

      {/* 8. Related Word Tools */}
      <section id="related-tools" aria-labelledby="related-tools-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="related-tools-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Related Word Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tool 1: Word Unscrambler */}
          <a
            id="related-tool-word-unscrambler"
            href="/word-unscrambler"
            onClick={(e) => handleToolClick(e, '/word-unscrambler')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <SpellCheck className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Word Unscrambler
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unscramble letters of any length from 2 to 15 characters. Filter by word length, sort results, and solve anagrams quickly.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Word Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 2: 5 Letter Word Finder */}
          <a
            id="related-tool-five-letter-finder"
            href="/5-letter-word-finder"
            onClick={(e) => handleToolClick(e, '/5-letter-word-finder')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <LayoutGrid className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  5 Letter Word Finder
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated 5-slot grid solver for Wordle. Filter by green tile positions, yellow letters, and gray excluded letters.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 5 Letter Word Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 3: 6 Letter Word Unscrambler */}
          <a
            id="related-tool-six-letter-unscrambler"
            href="/6-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/6-letter-word-unscrambler')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <SpellCheck className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  6 Letter Unscrambler
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unscramble six-letter words from up to 6 letters. Ideal for Text Twist, anagram puzzles, and word game strategy.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 6 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 4: 7 Letter Word Unscrambler */}
          <a
            id="related-tool-seven-letter-unscrambler"
            href="/7-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/7-letter-word-unscrambler')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <SpellCheck className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  7 Letter Unscrambler
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unscramble up to 7 letters into valid seven-letter words. Perfect for Scrabble 50-point bingo plays.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 7 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 5: 8 Letter Word Unscrambler */}
          <a
            id="related-tool-eight-letter-unscrambler"
            href="/8-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/8-letter-word-unscrambler')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <SpellCheck className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  8 Letter Unscrambler
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unscramble up to 8 letters into valid eight-letter words. Perfect for high-scoring board plays and long anagrams.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 8 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </section>
    </article>
  );
}
