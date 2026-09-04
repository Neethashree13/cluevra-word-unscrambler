import { FIVE_LETTER_FAQS } from '../data/fiveLetterFaq.ts';

export default function FiveLetterContent() {
  return (
    <article id="five-letter-content-article" className="space-y-10 mt-12 text-slate-700">
      {/* 1. What is a 5 Letter Word Finder */}
      <section id="about-tool" aria-labelledby="about-tool-heading" className="space-y-3">
        <h2
          id="about-tool-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          5 Letter Word Finder
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          The ClueVra 5 Letter Word Finder is a dedicated linguistic utility engineered to help word game players, puzzle enthusiasts, students, and writers quickly identify valid five-letter English words. Whether you are solving daily word puzzles, tackling cryptic crosswords, or brainstorming vocabulary, our dictionary-backed engine filters thousands of five-letter words from its built-in dictionary in milliseconds.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Fast In-Memory Filtering: The finder starts with the dictionary&apos;s five-letter word bucket, avoiding unnecessary checks against words of other lengths. It combines fixed-position tile matching, prefix and suffix parameters, inclusion rules, and negative letter exclusions into a fast, responsive interface.
        </p>
      </section>

      {/* 2. How to Use */}
      <section id="how-to-use" aria-labelledby="how-to-use-heading" className="space-y-4">
        <h2
          id="how-to-use-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          How to Use the 5 Letter Word Finder
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              1
            </span>
            <h3 className="text-sm font-bold text-slate-900">Enter Known Positions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fill in the letter tiles for any position you know with certainty. Leave empty tiles blank for unknown letters.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              2
            </span>
            <h3 className="text-sm font-bold text-slate-900">Set Letter Rules</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Add letters that must be included somewhere, letters that are completely excluded, or specific start and end letters.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
              3
            </span>
            <h3 className="text-sm font-bold text-slate-900">Explore & Copy Words</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click &quot;Find 5 Letter Words&quot; to review sorted results. Tap any individual word to copy it instantly to your clipboard.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Find 5 Letter Words by Pattern */}
      <section id="pattern-matching" aria-labelledby="pattern-matching-heading" className="space-y-3">
        <h2
          id="pattern-matching-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Find 5 Letter Words by Pattern
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Positional pattern matching is one of the most effective strategies for narrowing down potential words. When you know which specific slots contain certain letters, the finder filters out every non-conforming word.
        </p>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-slate-700">Common Pattern Examples:</div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 list-disc list-inside">
            <li>
              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">_ A _ E _</span>
              Finds words with &apos;A&apos; in slot 2 and &apos;E&apos; in slot 4, such as <em>BAKER</em>, <em>DATES</em>, and <em>WATER</em>.
            </li>
            <li>
              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">S A _ E _</span>
              Finds words starting with &apos;SA&apos; and having &apos;E&apos; in the fourth slot, such as <em>SAFER</em> and <em>SABER</em>.
            </li>
            <li>
              <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">S T _ _ E</span>
              Finds words starting with &apos;ST&apos; and ending in &apos;E&apos;, such as <em>STAGE</em>, <em>STAKE</em>, <em>STALE</em>, and <em>STAVE</em>.
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Find 5 Letter Words from Letters */}
      <section id="available-letters" aria-labelledby="available-letters-heading" className="space-y-3">
        <h2
          id="available-letters-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Find 5 Letter Words from Letters
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          If you have a scrambled hand of letters or an anagram rack, use the <strong>Available Letters Pool</strong> filter. Enter your letter tiles (e.g., <code className="font-mono text-indigo-700 bg-slate-100 px-1 py-0.5 rounded">AREST?</code>). The solver will only show five-letter words that can be assembled strictly from your letter supply.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          You can include question marks (<code className="font-mono text-indigo-700 bg-slate-100 px-1 py-0.5 rounded">?</code>) to represent wildcard or blank tiles. Each wildcard substitutes for any English alphabet character, enabling flexible solving even when some tiles are missing.
        </p>
      </section>

      {/* 5. For Word Games & Puzzles */}
      <section id="word-games" aria-labelledby="word-games-heading" className="space-y-3">
        <h2
          id="word-games-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          5 Letter Word Finder for Word Games
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Five-letter words are the cornerstone of modern word puzzle games, crosswords, anagram tournaments, and educational spelling challenges. Because five letters hit the sweet spot between manageable letter permutations and deep vocabulary diversity, mastering five-letter words gives players a competitive edge.
        </p>
        <p className="text-sm sm:text-base leading-relaxed text-slate-600">
          Our tool serves as an educational companion to help you discover new word combinations, study letter frequency tendencies, and learn high-probability letter placements without external distractions.
        </p>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section id="faq" aria-labelledby="five-letter-faq-heading" className="space-y-4 pt-4 border-t border-slate-200">
        <h2
          id="five-letter-faq-heading"
          className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
        >
          Frequently Asked Questions
        </h2>
        <div id="five-letter-faq-list" className="space-y-3">
          {FIVE_LETTER_FAQS.map((faq) => (
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
    </article>
  );
}
