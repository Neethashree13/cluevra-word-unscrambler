import React from 'react';
import { SEVEN_LETTER_FAQS } from '../data/sevenLetterFaq.ts';
import { ArrowRight, SpellCheck, LayoutGrid, Search, Shuffle, Type } from 'lucide-react';

interface SevenLetterContentProps {
  onNavigate?: (path: string) => void;
}

export default function SevenLetterContent({ onNavigate }: SevenLetterContentProps) {
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
      title: 'Enter up to 7 letters',
      desc: 'Type or paste up to 7 scrambled letters into the input field in any order.',
    },
    {
      num: '2',
      title: 'Add wildcard tiles if needed',
      desc: 'Use ? or * for unknown or blank tiles (up to 3 wildcards supported).',
    },
    {
      num: '3',
      title: 'Pick your sort preference',
      desc: 'Choose alphabetical (A-Z) or word length sorting to organize your answers.',
    },
    {
      num: '4',
      title: 'Click Unscramble',
      desc: 'Press Enter or click the Unscramble button to search the loaded dictionary.',
    },
    {
      num: '5',
      title: 'Review and copy results',
      desc: 'Browse matching 7-letter words with letter scores and copy answers with one click.',
    },
  ];

  return (
    <article id="seven-letter-content" className="space-y-10 mt-12 text-slate-700">
      {/* 1. How to Use the 7 Letter Word Unscrambler */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading" className="space-y-4">
        <h2
          id="how-to-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How to Use the 7 Letter Word Unscrambler
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

      {/* 2. What 7 Letter Words Can You Make? */}
      <section id="what-words-can-you-make" aria-labelledby="what-words-heading" className="space-y-3">
        <h2
          id="what-words-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          What 7 Letter Words Can You Make?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Cluevra compares the letters you enter with its English word dictionary and finds seven-letter words that can be built from those letters. The letters can be entered in any order, making the tool useful for solving scrambled-letter puzzles and word games.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Duplicate letters are handled according to the number of times they appear in your input. For example, if you enter two A&apos;s, a result can use both A&apos;s; a letter cannot be used more times than supplied unless a wildcard tile provides the missing letter.
        </p>
      </section>

      {/* 3. 7 Letter Words for Word Games */}
      <section id="word-games" aria-labelledby="word-games-heading" className="space-y-3">
        <h2
          id="word-games-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          7 Letter Words for Word Games
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Seven-letter words are useful in many word games, including Scrabble-style games, anagram puzzles, word scrambles, and crossword-related challenges. In Scrabble, using all seven tiles in one play earns a bingo bonus, making seven-letter combinations especially useful when your rack contains seven playable tiles.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Recognizing common prefixes (such as <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">RE-</code>, <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">UN-</code>, or <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">DIS-</code>) and suffixes (such as <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">-ING</code>, <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">-ERS</code>, or <code className="font-mono bg-slate-100 text-indigo-700 font-semibold px-1 py-0.5 rounded text-xs">-EST</code>) can help you spot potential seven-letter words manually, while Cluevra quickly checks your available letters against dictionary words to reveal options you might have overlooked.
        </p>
      </section>

      {/* 4. Using Blank or Wildcard Tiles */}
      <section id="wildcards" aria-labelledby="wildcards-heading" className="space-y-3">
        <h2
          id="wildcards-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Using Blank or Wildcard Tiles
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          If you have a blank tile or are missing a letter, enter <code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">?</code> or <code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">*</code> as a wildcard. Each wildcard can represent one letter from A through Z.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Cluevra supports up to 3 wildcard characters in a query. Wildcards are useful when you know some of the letters but still need to find possible seven-letter words.
        </p>
      </section>

      {/* 5. Why Use a 7 Letter Word Unscrambler? */}
      <section id="why-use-7-letter-unscrambler" aria-labelledby="why-use-heading" className="space-y-3">
        <h2
          id="why-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Why Use a 7 Letter Word Unscrambler?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          A dedicated 7 letter word unscrambler is especially helpful when you have seven scrambled letters and want to rearrange letters into words without sifting through shorter answers. When solving an anagram or word puzzle with an exact tile count, filtering directly for seven-letter words saves time and focuses on matching solutions.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Whether you need to unscramble 7 letter words from your rack, test blank or wildcard tiles, or check possible seven-letter combinations for a daily game, this tool quickly generates words from letters so you can make confident plays.
        </p>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section id="faq" aria-labelledby="faq-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="faq-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Frequently Asked Questions
        </h2>
        <div id="seven-letter-faq-list" className="space-y-3">
          {SEVEN_LETTER_FAQS.map((faq) => (
            <details
              key={faq.id}
              id={faq.id}
              className="group p-4 bg-white border border-slate-200 rounded-xl shadow-2xs transition-colors [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-left font-bold text-sm text-slate-800 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-600 rounded-sm">
                <span>{faq.question}</span>
                <span className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center text-slate-400 group-open:rotate-180 group-open:text-indigo-600 transition-transform">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 7. Related Word Tools */}
      <section id="related-word-tools" aria-labelledby="related-tools-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="related-tools-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Related Word Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Unscramble letters of any length from 2 to 15 characters. Filter by word length, sort results, and solve anagrams quickly.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Word Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 2: Word Finder */}
          <a
            id="related-tool-word-finder"
            href="/word-finder"
            onClick={(e) => handleToolClick(e, '/word-finder')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <Search className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Word Finder
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Search words using advanced filters including starting letters, ending letters, containing letters, and word length.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Word Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 3: Words With Letters */}
          <a
            id="related-tool-words-with-letters"
            href="/words-with-letters"
            onClick={(e) => handleToolClick(e, '/words-with-letters')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <Type className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Words With Letters
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Discover all valid words that can be made using your specific letters and wildcard tiles.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Words With Letters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 4: Anagram Solver */}
          <a
            id="related-tool-anagram-solver"
            href="/anagram-solver"
            onClick={(e) => handleToolClick(e, '/anagram-solver')}
            className="group p-5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <Shuffle className="w-5 h-5" />
                <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Anagram Solver
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Rearrange letters to find complete anagrams and word game solutions.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Anagram Solver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 5: 5 Letter Word Finder */}
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Filter 5-letter words by known tile positions, starting/ending letters, must-contain letters, and excluded letters.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 5 Letter Word Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 6: 6 Letter Word Unscrambler */}
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Unscramble six-letter words from up to 6 letters. Perfect for Text Twist, anagram puzzles, and word games.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 6 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 7: 8 Letter Word Unscrambler */}
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Unscramble eight-letter words from up to 8 letters. Perfect for Scrabble board hook bingos and word puzzles.
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
