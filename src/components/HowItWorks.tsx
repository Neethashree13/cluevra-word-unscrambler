export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Enter your letters',
      desc: 'Type or paste letters in any order into the search field.',
    },
    {
      num: '2',
      title: 'Optionally add wildcards',
      desc: 'Use ? or * for blank tiles (up to 3 wildcards supported).',
    },
    {
      num: '3',
      title: 'Set length & sort filters',
      desc: 'Choose minimum & maximum word lengths and pick your preferred sort order.',
    },
    {
      num: '4',
      title: 'Click Unscramble',
      desc: 'Press Enter or tap the Unscramble button to search.',
    },
    {
      num: '5',
      title: 'Review and copy results',
      desc: 'Browse matching words grouped by length with scores and copy with one click.',
    },
  ];

  return (
    <article
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-xs space-y-5"
    >
      {/* Primary Section Heading */}
      <div>
        <h2
          id="how-it-works-heading"
          className="text-base font-bold text-indigo-950 mb-2"
        >
          How Does a Word Unscrambler Work?
        </h2>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          The solver accepts letters entered in any order and compares their frequency counts against an extensive English dictionary. It strictly respects duplicate letter counts and accommodates wildcard or blank tiles to find matching words from the loaded dictionary. You can filter results by word length from 2 to 15 letters, sort words by length or alphabetically, and quickly copy matching answers for your puzzle.
        </p>
      </div>

      {/* How to Use Step-by-Step */}
      <section id="how-to-use-guide" aria-labelledby="how-to-use-heading">
        <h3
          id="how-to-use-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3"
        >
          How to Use the Word Unscrambler
        </h3>
        <ol id="how-to-use-steps-list" className="space-y-2.5">
          {steps.map((step) => (
            <li
              key={step.num}
              id={`step-item-${step.num}`}
              className="flex gap-2.5 items-start"
            >
              <span
                id={`step-badge-${step.num}`}
                className="w-5 h-5 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                aria-hidden="true"
              >
                {step.num}
              </span>
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-indigo-950">{step.title}</span>
                <span className="text-indigo-900/70 block text-xs">{step.desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What Words Can You Make From These Letters? */}
      <section
        id="what-words-can-you-make"
        aria-labelledby="what-words-heading"
        className="pt-4 border-t border-indigo-100"
      >
        <h3
          id="what-words-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5"
        >
          What Words Can You Make From These Letters?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          Cluevra checks your entered letters against its loaded English dictionary to display matching words that can be constructed from those letters. You can uncover words of varying lengths based on your chosen minimum and maximum length filters. Exact letter quantities are strictly respected, meaning a letter cannot be used more times than provided unless a blank wildcard tile (<code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">?</code> or <code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">*</code>) is used to substitute for missing letters (up to 3 wildcards supported). All results are generated directly from the loaded dictionary and can be sorted by length or alphabetically for easy scanning.
        </p>
      </section>

      {/* When Should You Use a Word Unscrambler? */}
      <section id="when-to-use" aria-labelledby="when-to-use-heading" className="pt-4 border-t border-indigo-100">
        <h3
          id="when-to-use-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5"
        >
          When Should You Use a Word Unscrambler?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          This tool is helpful whenever you encounter scrambled-letter puzzles, want to explore valid words from a specific tile rack, or need hints for word games and vocabulary exercises. Whether you are solving daily anagrams, deciphering jumbles, or studying letter combinations, it delivers rapid suggestions organized by length.
        </p>
      </section>

      {/* What Is a Word Unscrambler? */}
      <section id="what-is-unscrambler" aria-labelledby="what-is-heading" className="pt-4 border-t border-indigo-100">
        <h3
          id="what-is-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5"
        >
          What Is a Word Unscrambler?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          A word unscrambler is an online anagram solver and word finder. It takes a pool of jumbled letters and identifies matching words that can be formed from them using its loaded dictionary. It serves as an intuitive companion for word games, anagram challenges, daily jumbles, and crossword puzzles.
        </p>
      </section>

      {/* What Are Wildcard / Blank Tiles? */}
      <section id="wildcards-guide" aria-labelledby="wildcards-heading" className="pt-4 border-t border-indigo-100">
        <h3
          id="wildcards-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5"
        >
          What Are Wildcard / Blank Tiles?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          Wildcards (typed as <code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">?</code> or <code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">*</code>) represent blank tiles in board games. Each wildcard substitutes for any letter from A to Z, helping you solve tricky letter combinations and find possible word-game plays.
        </p>
      </section>
    </article>
  );
}

