import React from 'react';
import { ANAGRAM_SOLVER_FAQS } from '../data/anagramSolverFaq.ts';
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
} from 'lucide-react';

interface AnagramSolverContentProps {
  onNavigate?: (path: string) => void;
}

export default function AnagramSolverContent({ onNavigate }: AnagramSolverContentProps) {
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
      title: 'Enter your letters or phrase',
      desc: 'Type letters into the search field (e.g., LISTEN, EARTH, or CARE). For phrases like "THE EYES", spaces are stripped automatically into a letter bank.',
    },
    {
      num: '2',
      title: 'Choose exact or sub-anagram mode',
      desc: 'By default, the solver searches for exact anagrams matching your exact letter count. Switch to "Any Length" to find all smaller sub-anagrams.',
    },
    {
      num: '3',
      title: 'Use wildcards for unknown letters',
      desc: 'Add up to 3 wildcards (? or *) to represent blank tiles or missing letters. The engine tests every letter of the alphabet.',
    },
    {
      num: '4',
      title: 'Sort by score, length, or alphabet',
      desc: 'Choose to display words alphabetically A-Z, longest first, or ordered by Scrabble point value to discover high-scoring puzzle moves.',
    },
    {
      num: '5',
      title: 'Click Solve Anagrams',
      desc: 'Execute instant dictionary lookups against 168,551 verified words with complete word lengths, scores, and one-click copy.',
    },
  ];

  return (
    <article id="anagram-solver-content" className="space-y-12 mt-12 text-slate-700">
      {/* 1. What is an Anagram Solver? */}
      <section id="what-is-anagram-solver" aria-labelledby="what-is-anagram-heading" className="space-y-4">
        <h2
          id="what-is-anagram-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Sparkles className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>What is an Anagram Solver?</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          An <strong>Anagram Solver</strong> is a specialized word puzzle utility that rearranges a set of letters to find all legitimate words in the English dictionary. Unlike a general unscrambler that might return smaller fragments by default, an anagram solver focuses primarily on <em>exact anagrams</em>—words that utilize all your entered letters exactly once.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Whether you are tackling newspaper Jumble puzzles, playing Scrabble, solving crosswords, or unraveling cryptographic word games, Cluevra’s Anagram Solver instantly generates valid solutions from any combination of letters or phrases.
        </p>
      </section>

      {/* 2. How to Use the Anagram Solver */}
      <section id="how-to-use-anagram-solver" aria-labelledby="how-to-use-heading" className="space-y-6">
        <h2
          id="how-to-use-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Layers className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>How to Use the Anagram Solver</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Follow these simple steps to solve anagrams and discover every valid word permutation in seconds:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How Anagrams Work */}
      <section id="how-anagrams-work" aria-labelledby="how-anagrams-work-heading" className="space-y-4">
        <h2
          id="how-anagrams-work-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Brain className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>How Anagrams Work</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          An anagram is created by taking the exact letters of one word and reorganizing them to form another valid word. Mathematically, the number of possible letter permutations for an <em>n</em>-letter word with distinct letters is <em>n!</em> (factorial). For example, a 6-letter word like <strong>LISTEN</strong> has 6! = 720 possible letter orderings.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Classic Anagram Examples:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-600">LISTEN:</span>
              <span>Rearranges into <em>silent, enlist, inlets, tinsel</em></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-600">EARTH:</span>
              <span>Rearranges into <em>heart, hater, rathe</em></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-600">CARE:</span>
              <span>Rearranges into <em>race, acre</em></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono font-bold text-indigo-600">PLANET:</span>
              <span>Rearranges into <em>platen</em></span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Wildcards and Blank Tiles */}
      <section id="anagram-wildcards" aria-labelledby="wildcards-heading" className="space-y-4">
        <h2
          id="wildcards-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <HelpCircle className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>Using Wildcards and Blank Tiles</span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          In games like Scrabble and Words with Friends, blank tiles can represent any letter of the alphabet. Cluevra supports up to 3 wildcard characters using either a question mark (<strong>?</strong>) or asterisk (<strong>*</strong>).
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          When you enter <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-xs font-semibold">PLAN?T</code>, the solver tests each possible substitution from A to Z, finding valid words such as <em>planet</em>, <em>platen</em>, and <em>plaint</em>.
        </p>
      </section>

      {/* 5. Anagram Game Strategy */}
      <section id="anagram-strategy" aria-labelledby="strategy-heading" className="space-y-4">
        <h2
          id="strategy-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <Lightbulb className="w-6 h-6 text-indigo-600" aria-hidden="true" />
          <span>Anagram Solving Strategies & Tips</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Separate Vowels and Consonants
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mentally grouping vowels (A, E, I, O, U) away from consonants helps you identify natural syllable structures (CVC, CVCC) and frequent blends.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Look for Common Prefixes & Suffixes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Check if your letter rack contains common endings like <em>-ING, -ED, -ER, -ES, -EST</em> or beginnings like <em>RE-, UN-, PRE-</em>.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Target High-Scoring Tiles
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              High-value tiles like Q, Z, J, and X require deliberate placement. Sort results by "Scrabble Score" to immediately reveal maximum-point plays.
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Identify Word Roots
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pairing familiar 3-letter stems with remaining consonants can uncover surprising anagram matches that you might not spot at first glance.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section id="faq" aria-labelledby="faq-section-heading">
        <h2 id="faq-section-heading" className="sr-only">
          Frequently Asked Questions
        </h2>
        <FAQ items={ANAGRAM_SOLVER_FAQS} />
      </section>

      {/* 7. Related Word Tools */}
      <section id="related-tools" aria-labelledby="related-tools-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="related-tools-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          <SpellCheck className="w-5 h-5 text-indigo-600" />
          <span>Explore More Cluevra Word Tools</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <a
            href="/word-unscrambler"
            onClick={(e) => handleToolClick(e, '/word-unscrambler')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                Word Unscrambler
              </span>
              <span className="text-xs text-slate-500">Unscramble letters into words</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/word-finder"
            onClick={(e) => handleToolClick(e, '/word-finder')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                Word Finder
              </span>
              <span className="text-xs text-slate-500">Search by prefix, suffix, & length</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/5-letter-word-finder"
            onClick={(e) => handleToolClick(e, '/5-letter-word-finder')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                5-Letter Word Finder
              </span>
              <span className="text-xs text-slate-500">Perfect for Wordle & Jumble</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/6-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/6-letter-word-unscrambler')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                6-Letter Unscrambler
              </span>
              <span className="text-xs text-slate-500">Unscramble 6-letter racks</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/7-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/7-letter-word-unscrambler')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                7-Letter Unscrambler
              </span>
              <span className="text-xs text-slate-500">Find 7-letter Scrabble bingos</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/8-letter-word-unscrambler"
            onClick={(e) => handleToolClick(e, '/8-letter-word-unscrambler')}
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all group flex items-center justify-between"
          >
            <div>
              <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 block">
                8-Letter Unscrambler
              </span>
              <span className="text-xs text-slate-500">Solve 8-letter anagrams</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </section>
    </article>
  );
}
