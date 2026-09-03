export default function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Enter your letters',
      desc: 'Type or paste your letters into the search field.',
    },
    {
      num: '2',
      title: 'Optionally use wildcard tiles',
      desc: 'Add ? or * for blank tiles (up to 3 wildcards).',
    },
    {
      num: '3',
      title: 'Choose minimum & maximum word lengths',
      desc: 'Filter by letter count and pick your sort order.',
    },
    {
      num: '4',
      title: 'Click Unscramble',
      desc: 'Press Enter or click the Unscramble button.',
    },
    {
      num: '5',
      title: 'Review and copy the results',
      desc: 'Browse words with scores and copy with one click.',
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
          A word unscrambler rearranges supplied letters and compares letter frequency maps against an authoritative English dictionary. Rather than generating slow factorial permutations, the unscrambler verifies letter counts in linear time, ensuring duplicate letters and blank tiles are matched with 100% accuracy.
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

      {/* What Is a Word Unscrambler? */}
      <section id="what-is-unscrambler" aria-labelledby="what-is-heading" className="pt-4 border-t border-indigo-100">
        <h3
          id="what-is-heading"
          className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5"
        >
          What Is a Word Unscrambler?
        </h3>
        <p className="text-xs sm:text-sm text-indigo-900/80 leading-relaxed">
          A word unscrambler is an online anagram solver and word finder. It takes jumbled letters and identifies every legitimate word that can be formed from them. It is an essential companion for word games like Scrabble, Words with Friends, Boggle, Jumble, and crossword puzzles.
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
          Wildcards (typed as <code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">?</code> or <code className="font-mono bg-white px-1 py-0.5 rounded text-indigo-700 font-bold border border-indigo-200">*</code>) represent blank tiles in board games. Each wildcard substitutes for any letter from A to Z, helping you solve tricky letter combinations and discover high-scoring plays.
        </p>
      </section>
    </article>
  );
}

