import React from 'react';
import { WORDS_WITH_LETTERS_FAQS } from '../data/wordsWithLettersFaq.ts';
import FAQ from './FAQ.tsx';
import {
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle,
  Brain,
  Lightbulb,
  Layers,
  ArrowRight,
  SpellCheck,
  Target,
  Trophy,
} from 'lucide-react';

interface WordsWithLettersContentProps {
  onNavigate?: (path: string) => void;
}

export default function WordsWithLettersContent({ onNavigate }: WordsWithLettersContentProps) {
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
      title: 'Enter your available letters',
      desc: 'Type your available rack tiles or letters (e.g. PLANET, STREAM, or TRAE). Spaces and punctuation are stripped automatically.',
    },
    {
      num: '2',
      title: 'Add blank wildcards if needed',
      desc: 'Use ? or * for up to 3 unknown tiles. The solver checks all 26 substitutions to build valid words.',
    },
    {
      num: '3',
      title: 'Apply optional board filters',
      desc: 'Specify a desired word length, or lock in "Starts with", "Ends with", or "Contains" to hook onto letters on your game board.',
    },
    {
      num: '4',
      title: 'Choose your preferred sort order',
      desc: 'Default to Longest First, or switch to Highest Score to quickly spot high-value Scrabble and Words with Friends moves.',
    },
    {
      num: '5',
      title: 'Explore results & definitions',
      desc: 'Browse grouped words by letter length, check Scrabble scores, copy words with one click, or check definitions.',
    },
  ];

  return (
    <article id="words-with-letters-content" className="space-y-12 mt-12 text-slate-700">
      {/* 1. What is Words With Letters */}
      <section
        id="about-words-with-letters"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <Brain className="w-5 h-5" aria-hidden="true" />
          <span>Core Concept & Purpose</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          What Is "Words With Letters"?
        </h2>
        <p className="leading-relaxed text-slate-600">
          The <strong>Words With Letters</strong> tool is built to solve one primary challenge: 
          <em> "What words can I make with these letters?"</em> Whether you are playing Scrabble, 
          Words with Friends, Wordle, or a crossword puzzle, you frequently have a specific hand 
          of tiles and need to discover every dictionary-accepted word you can form.
        </p>
        <p className="leading-relaxed text-slate-600">
          Crucially, <strong>you do not need to use every letter</strong> in your hand. For instance, 
          if you provide the letters <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">PLANET</span>, 
          you will not only discover 6-letter solutions like <em>PLANET</em> and <em>PLATEN</em>, but also 
          5-letter words (<em>PLANE, PANEL, PLANT, PLATE</em>), 4-letter words (<em>LATE, LANE, LEAN, PEAL</em>), 
          and high-utility 2- and 3-letter combinations.
        </p>
      </section>

      {/* 2. Tool Comparison Grid */}
      <section
        id="tool-comparisons"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <Layers className="w-5 h-5" aria-hidden="true" />
          <span>Understanding Cluevra Tools</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Words With Letters vs. Word Finder vs. Anagram Solver
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Cluevra offers dedicated tools tailored to different word puzzles. Here is how to choose the right one:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-2">
            <h3 className="font-bold text-indigo-900 text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Words With Letters</span>
            </h3>
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              Rack-Based Sub-Words
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Finds all words of any length buildable from your available letter pool. Ideal when you have 
              tiles on your rack and want to see every possible play from 2 letters up.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <Search className="w-4 h-4 text-slate-600" />
              <span>Word Finder</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pattern & Position Matching
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allows broad dictionary pattern searches without needing a rack of letters. Great for 
              "words starting with UN and ending with ING" or specific length queries.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <SpellCheck className="w-4 h-4 text-slate-600" />
              <span>Anagram Solver</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exact Letter Rearrangements
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Defaults to exact permutations using every single input letter once (e.g. LISTEN &rarr; SILENT). 
              Engineered specifically for anagram puzzles.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Letter Frequency & Wildcards Explained */}
      <section
        id="rules-and-mechanics"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <Target className="w-5 h-5" aria-hidden="true" />
          <span>Rules & Accuracy</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          How Letter Frequency & Wildcards Work
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strict Letter Frequency Accounting</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike simplistic search bars that only check whether a letter is present, Cluevra enforces 
              exact mathematical frequencies:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-100">
              <li>Input <strong className="font-mono text-slate-800">APPLE</strong> has two P’s, one A, one L, and one E.</li>
              <li>Valid: <span className="font-mono text-emerald-700">APPLE, PEAL, PLEA, LEAP</span>.</li>
              <li>Invalid: <span className="font-mono text-rose-700">PAPER</span> (no R available).</li>
              <li>Invalid: Any word requiring three P’s cannot be formed without wildcards.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Blank Tile Wildcards (? or *)</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In board games like Scrabble, blank tiles can represent any letter of the alphabet. 
              Cluevra supports up to 3 wildcards:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside bg-slate-50 p-3 rounded-lg border border-slate-100">
              <li>Input <strong className="font-mono text-slate-800">PLAN?</strong> has 4 known letters and 1 blank tile.</li>
              <li>Matches 5-letter words like <span className="font-mono text-emerald-700">PLANE, PLANT, PLANK, PLANS</span>.</li>
              <li>Also matches valid sub-words like <span className="font-mono text-emerald-700">PLAN, LANE, LATE, PALE</span>.</li>
              <li>Enter up to 3 wildcards for complex multi-blank scenarios.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Strategic Guide for Word Games */}
      <section
        id="word-game-strategies"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <Trophy className="w-5 h-5" aria-hidden="true" />
          <span>Game Strategy</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          How to Find High-Scoring Plays in Scrabble & Words with Friends
        </h2>
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Winning competitive word games comes down to rack balance, high-point letter utilization, 
            and board hook exploitation. Here are key tactics when using Words With Letters:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Hook into Open Letters
              </div>
              <p className="text-xs text-slate-600">
                If the board has an open "T" on a Triple Word Score, include that T in your available letters 
                or set "Starts with T" to find direct placement plays.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Sort by Highest Score
              </div>
              <p className="text-xs text-slate-600">
                Switch the sort dropdown to "Highest Tile Score". This prioritizes high-value consonants (Q, Z, J, X) 
                to immediately expose 20+ point plays.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                Hunt for 7-Letter Bingos
              </div>
              <p className="text-xs text-slate-600">
                In Scrabble, playing all 7 tiles awards a 50-point bonus. Filter by "7 Letters" to immediately see if a 
                bingo is hiding on your rack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Step-by-Step Instructions */}
      <section
        id="how-to-use"
        className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <Lightbulb className="w-5 h-5" aria-hidden="true" />
          <span>Quick Guide</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          How to Use Words With Letters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2 relative flex flex-col justify-start"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {step.num}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Comprehensive FAQs */}
      <section id="frequently-asked-questions" className="space-y-6">
        <div className="flex items-center gap-2.5 text-indigo-600 font-semibold text-sm">
          <HelpCircle className="w-5 h-5" aria-hidden="true" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <FAQ items={WORDS_WITH_LETTERS_FAQS} />
      </section>

      {/* 7. Internal Cross-Linking Grid */}
      <section
        id="related-word-tools"
        className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-white rounded-xl border border-indigo-100 p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Explore More Word Solvers</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Related Word Search & Unscrambler Tools
        </h2>
        <p className="text-sm text-slate-600">
          Looking for a specific type of word puzzle solver? Try these dedicated Cluevra tools:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <a
            href="/word-finder"
            onClick={(e) => handleToolClick(e, '/word-finder')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>Word Finder</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Search by length, prefixes, suffixes, and patterns.
            </p>
          </a>

          <a
            href="/anagram-solver"
            onClick={(e) => handleToolClick(e, '/anagram-solver')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>Anagram Solver</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Solve exact word anagrams and permutations.
            </p>
          </a>

          <a
            href="/word-unscrambler"
            onClick={(e) => handleToolClick(e, '/word-unscrambler')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>Word Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unscramble mixed tiles with length grouping.
            </p>
          </a>

          <a
            href="/5-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/5-letter-word-unscrambler')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>5 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Specialized for Wordle and 5-letter puzzles.
            </p>
          </a>

          <a
            href="/6-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/6-letter-word-unscrambler')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>6 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Find 6-letter words from letter tiles.
            </p>
          </a>

          <a
            href="/7-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/7-letter-word-unscrambler')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>7 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Target 7-letter Scrabble bingos and word games.
            </p>
          </a>

          <a
            href="/8-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/8-letter-word-unscrambler')}
            className="p-3.5 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all group"
          >
            <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 flex items-center justify-between">
              <span>8 Letter Unscrambler</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Find 8-letter solutions and bonus words.
            </p>
          </a>
        </div>
      </section>
    </article>
  );
}
