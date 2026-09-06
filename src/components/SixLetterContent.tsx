import React from 'react';
import { SIX_LETTER_FAQS } from '../data/sixLetterFaq.ts';
import { ArrowRight, SpellCheck, LayoutGrid, Hash } from 'lucide-react';

interface SixLetterContentProps {
  onNavigate?: (path: string) => void;
}

export default function SixLetterContent({ onNavigate }: SixLetterContentProps) {
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
      title: 'Enter up to 6 letters',
      desc: 'Type or paste up to 6 scrambled letters into the input field in any order.',
    },
    {
      num: '2',
      title: 'Add wildcard tiles if needed',
      desc: 'Use ? or * for unknown or blank tiles (up to 3 wildcards supported).',
    },
    {
      num: '3',
      title: 'Pick your sort preference',
      desc: 'Choose alphabetical (A-Z) or score sorting to organize your answers.',
    },
    {
      num: '4',
      title: 'Click Unscramble',
      desc: 'Press Enter or click the Unscramble button to search the loaded dictionary.',
    },
    {
      num: '5',
      title: 'Review and copy results',
      desc: 'Browse matching 6-letter words with letter scores and copy answers with one click.',
    },
  ];

  return (
    <article id="six-letter-content" className="space-y-10 mt-12 text-slate-700">
      {/* 1. How to Use the 6 Letter Word Unscrambler */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading" className="space-y-4">
        <h2
          id="how-to-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How to Use the 6 Letter Word Unscrambler
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

      {/* 2. What 6 Letter Words Can You Make? */}
      <section id="what-words-can-you-make" aria-labelledby="what-words-heading" className="space-y-3">
        <h2
          id="what-words-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          What 6 Letter Words Can You Make?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Cluevra compares your entered letters against its comprehensive English dictionary and finds every matching six-letter word that can be constructed. Duplicate letters are strictly counted: a letter is only used as many times as you have provided it, unless a wildcard tile supplies an extra occurrence.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          This tool is calibrated to search specifically for words of exactly 6 letters. All results are verified against standard English lexicon data, ensuring valid answers for your puzzle or word game.
        </p>
      </section>

      {/* 3. 6 Letter Words for Word Games */}
      <section id="word-games" aria-labelledby="word-games-heading" className="space-y-3">
        <h2
          id="word-games-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          6 Letter Words for Word Games & Puzzles
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Six-letter words are central to many classic and modern word games. In games like Text Twist and Anagrams, unscrambling the 6-letter master word is essential to advance to the next round. In Scrabble and Words With Friends, six-letter words provide reliable high-scoring tile placements across bonus squares.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Whether you are tackling daily anagram jumbles, solving crosswords, or expanding your vocabulary with common six-letter stems and compound roots, our 6-letter solver provides rapid, distraction-free assistance.
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
          If you have blank tiles or want to explore missing letter possibilities, simply type a question mark (<code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">?</code>) or asterisk (<code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">*</code>) into the input box.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Up to 3 wildcards are supported. Each wildcard represents any letter from A to Z, helping you discover high-scoring 6-letter options that fit your available rack and board conditions.
        </p>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section id="faq" aria-labelledby="faq-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="faq-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Frequently Asked Questions
        </h2>
        <div id="six-letter-faq-list" className="space-y-3">
          {SIX_LETTER_FAQS.map((faq) => (
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

      {/* 6. Related Word Tools */}
      <section id="related-word-tools" aria-labelledby="related-tools-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="related-tools-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Related Word Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1: 8 Letter Word Unscrambler */}
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

          {/* Tool 2: 7 Letter Word Unscrambler */}
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Find seven-letter anagrams and bingo plays from up to 7 letters with wildcard tile support.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 7 Letter Unscrambler</span>
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
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Filter 5-letter words by known tile positions, starting/ending letters, and exclusions.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 5 Letter Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 3: Word Unscrambler */}
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
                Unscramble letters of any length from 2 to 15 characters. Filter by length and sort results.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open Word Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </section>
    </article>
  );
}
