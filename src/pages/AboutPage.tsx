import { ArrowLeft, BookOpen, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PageProps {
  onNavigateHome: () => void;
}

export default function AboutPage({ onNavigateHome }: PageProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Word Unscrambler</span>
        </button>
      </div>

      <article className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <header className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Informational Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            About Word Unscrambler
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
            A free, fast, and simple online word-solving utility built for word games, vocabulary building, and anagram discovery.
          </p>
        </header>

        {/* What is Word Unscrambler */}
        <section aria-labelledby="about-what-is" className="space-y-3">
          <h2 id="about-what-is" className="text-lg sm:text-xl font-bold text-slate-800">
            What Is Word Unscrambler?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Word Unscrambler is an online anagram solver and word finder. When you enter a jumble of letters, the tool cross-references every possible valid combination against an authoritative English word dictionary and instantly displays every word that can be constructed from your rack.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Unlike simple scramble generators that produce unreadable permutations, Word Unscrambler groups valid words systematically by letter length and provides standard Scrabble-style tile point values so you can easily analyze your highest-scoring play options.
          </p>
        </section>

        {/* What the Tool Does */}
        <section aria-labelledby="about-features" className="space-y-4">
          <h2 id="about-features" className="text-lg sm:text-xl font-bold text-slate-800">
            Key Features & Capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                <span>Exact Letter Frequency Matching</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Repeated letters are strictly counted. If you enter two "A"s, words requiring three "A"s are excluded.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                <span>Wildcard & Blank Tile Support</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Use question marks (?) or asterisks (*) to represent blank tiles. Wildcards dynamically match any missing letter from A to Z.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                <span>Length Filtering & Flexible Sorting</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Narrow results from 2 to 15 letters and sort by longest first, shortest first, or alphabetical order.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" aria-hidden="true" />
                <span>One-Click Copy & Sharing</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Copy individual words or entire result sets, or share your exact search query with teammates via shareable URLs.
              </p>
            </div>
          </div>
        </section>

        {/* Who Can Use It */}
        <section aria-labelledby="about-who-for" className="space-y-3">
          <h2 id="about-who-for" className="text-lg sm:text-xl font-bold text-slate-800">
            Who May Find It Useful?
          </h2>
          <ul className="space-y-2 text-sm sm:text-base text-slate-600 list-disc pl-5">
            <li>
              <strong>Board game players:</strong> Scrabble, Words with Friends, Wordfeud, and Upwords enthusiasts looking to verify rack possibilities during post-game review or friendly matches.
            </li>
            <li>
              <strong>Puzzle solvers:</strong> Crossword enthusiasts, daily Jumble solvers, and anagram hobbyists working through tricky word clues.
            </li>
            <li>
              <strong>Students and educators:</strong> Learners expanding their English vocabulary, discovering word roots, and studying phonics and letter combinations.
            </li>
            <li>
              <strong>Writers and poets:</strong> Creative writers seeking rhyming words, alliteration pairs, or concise synonyms based on specific letter sets.
            </li>
          </ul>
        </section>

        {/* Simple Online Tool Philosophy */}
        <section aria-labelledby="about-philosophy" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 id="about-philosophy" className="text-lg sm:text-xl font-bold text-slate-800">
            Our Purpose
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Word Unscrambler was created with a clear focus: to deliver a straightforward, clutter-free, and accessible word-solving tool that works immediately in your browser without paywalls, signups, or distractions.
          </p>
        </section>
      </article>
    </div>
  );
}
