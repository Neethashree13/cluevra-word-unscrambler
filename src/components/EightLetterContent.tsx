import React from 'react';
import { EIGHT_LETTER_FAQS } from '../data/eightLetterFaq.ts';
import { ArrowRight, SpellCheck, LayoutGrid } from 'lucide-react';

interface EightLetterContentProps {
  onNavigate?: (path: string) => void;
}

export default function EightLetterContent({ onNavigate }: EightLetterContentProps) {
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
      title: 'Enter up to 8 letters',
      desc: 'Type or paste up to 8 scrambled letters into the input box in any order.',
    },
    {
      num: '2',
      title: 'Add wildcard tiles',
      desc: 'Use ? or * to represent blank tiles or missing letters (up to 3 wildcards).',
    },
    {
      num: '3',
      title: 'Choose sort order',
      desc: 'Select alphabetical (A-Z) or Scrabble score sorting to organize your words.',
    },
    {
      num: '4',
      title: 'Click Unscramble',
      desc: 'Press Enter or click the Unscramble button to scan the 168,551-word dictionary.',
    },
    {
      num: '5',
      title: 'Copy winning words',
      desc: 'Browse matching 8-letter words with letter point values and copy them instantly.',
    },
  ];

  return (
    <article id="eight-letter-content" className="space-y-10 mt-12 text-slate-700">
      {/* 1. How to Use the 8 Letter Word Unscrambler */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading" className="space-y-4">
        <h2
          id="how-to-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How to Use the 8 Letter Word Unscrambler
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

      {/* 2. What 8 Letter Words Can You Make? */}
      <section id="what-words-can-you-make" aria-labelledby="what-words-heading" className="space-y-3">
        <h2
          id="what-words-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          What 8 Letter Words Can You Make?
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Cluevra compares your entered letter set directly against our loaded English lexicon of 168,551 words to uncover every valid 8-letter anagram. The algorithm strictly respects letter counts: duplicate letters are only used as many times as they are supplied in your input or substituted by wildcard tiles.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Because this page is specifically calibrated for eight-letter queries, the length filter defaults to exactly 8 letters (Min: 8, Max: 8). Every solution returned is an authentic dictionary entry, giving you instant confidence during fast-paced word games and competitive puzzles.
        </p>
      </section>

      {/* 3. Tips for Finding 8-Letter Words */}
      <section id="tips-eight-letter-words" aria-labelledby="tips-heading" className="space-y-3">
        <h2
          id="tips-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Tips for Finding 8-Letter Words
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Eight-letter words may seem daunting to spot on a scrambled rack, but recognizing structured morphological patterns makes them significantly easier to uncover:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Look for Common Suffixes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Separate high-frequency endings such as <strong>-ING</strong>, <strong>-ED</strong>, <strong>-ERS</strong>, <strong>-EST</strong>, <strong>-TION</strong>, <strong>-MENT</strong>, or <strong>-ABLE</strong>. Grouping these tiles isolates the root word.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Identify Productive Prefixes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scan for frequent prefixes like <strong>RE-</strong>, <strong>UN-</strong>, <strong>DIS-</strong>, <strong>MIS-</strong>, <strong>OVER-</strong>, or <strong>OUT-</strong>. Placing them on the left side of your rack immediately reveals smaller recognizable stems.
            </p>
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">Spot Compound Words</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Many common eight-letter words are natural compound combinations of two 4-letter words (e.g. <em>NOTE</em> + <em>BOOK</em> = <strong>NOTEBOOK</strong>, <em>PLAY</em> + <em>BACK</em> = <strong>PLAYBACK</strong>).
            </p>
          </div>
        </div>
      </section>

      {/* 4. Using the Tool for Word Games & Puzzles */}
      <section id="word-games" aria-labelledby="word-games-heading" className="space-y-3">
        <h2
          id="word-games-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Using the Tool for Word Games and Puzzles
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          In Scrabble and Words With Friends, players hold 7 tiles on their rack. While a 7-letter play earns the coveted 50-point bonus, elite players frequently aim for an <strong>8-letter bingo play</strong> by hooking all 7 of their rack tiles onto an open tile already resting on the board.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Whether you are tackling an 8-letter daily puzzle like Wordle 8-letter challenges, solving complex anagram teasers, or seeking optimal hook opportunities in tabletop word games, the 8 Letter Word Unscrambler provides the rapid feedback you need.
        </p>
      </section>

      {/* 5. Using Blank or Wildcard Tiles */}
      <section id="wildcards" aria-labelledby="wildcards-heading" className="space-y-3">
        <h2
          id="wildcards-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How Wildcard Tiles Work
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          When playing with blank Scrabble tiles or trying to test possible letters on a game board, you can use a question mark (<code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">?</code>) or an asterisk (<code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">*</code>) as a wildcard.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          You can include up to 3 wildcards per query (e.g., <code className="font-mono bg-slate-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-slate-200">NOTEBOO?</code>). The solver will substitute each wildcard with every letter from A through Z, identifying matching eight-letter words such as <strong>NOTEBOOK</strong>.
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
        <div id="eight-letter-faq-list" className="space-y-3">
          {EIGHT_LETTER_FAQS.map((faq) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tool 1: 7 Letter Word Unscrambler */}
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
                Unscramble up to 7 letters into valid seven-letter words. Perfect for Scrabble 50-point bingo plays and anagram puzzles.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 7 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 2: 6 Letter Word Unscrambler */}
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

          {/* Tool 3: 5 Letter Word Finder */}
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
                Filter 5-letter words by known tile positions, starting/ending letters, must-contain letters, and excluded letters.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Open 5 Letter Word Finder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Tool 4: Word Unscrambler */}
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
        </div>
      </section>
    </article>
  );
}
