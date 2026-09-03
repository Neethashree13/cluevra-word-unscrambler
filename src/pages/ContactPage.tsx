import { ArrowLeft, Mail, MessageSquare, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config/site.ts';

interface PageProps {
  onNavigateHome: () => void;
}

export default function ContactPage({ onNavigateHome }: PageProps) {
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
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>Support & Communications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Word Unscrambler
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
            We welcome your questions, thoughts, dictionary suggestions, and bug reports. Here is how to reach us.
          </p>
        </header>

        {/* What You Can Contact Us About */}
        <section aria-labelledby="contact-topics" className="space-y-4">
          <h2 id="contact-topics" className="text-lg sm:text-xl font-bold text-slate-800">
            What Can You Contact Us About?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
                <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>General Feedback</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tell us about your experience using the tool, ideas for layout polish, or overall comments.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
                <Bug className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Bug Reports & Glitches</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Let us know if you spot an unexpected error, missing word, layout issue, or browser compatibility snag.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
                <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Feature & Word Suggestions</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Suggest new sorting modes, additional dictionary improvements, or filtering capabilities you would like to see.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
                <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Questions & Assistance</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Need help understanding how wildcard calculations, point scores, or sharing features work? Send us a note.
              </p>
            </div>
          </div>
        </section>

        {/* Official Email Contact Block */}
        <section aria-labelledby="contact-email-section" className="space-y-4 pt-4 border-t border-slate-100">
          <h2 id="contact-email-section" className="text-lg sm:text-xl font-bold text-slate-800">
            Email Us Directly
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Please send an email to our inbox below. When reporting an issue, including the letters you typed and your device/browser type helps us resolve it faster.
          </p>

          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                Official Support Contact
              </span>
              {/*
                Official support email populated from SITE_CONFIG.contactEmail in src/config/site.ts
              */}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-base sm:text-lg font-mono font-bold text-indigo-700 hover:text-indigo-900 underline decoration-indigo-300 hover:decoration-indigo-700 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
              >
                {SITE_CONFIG.contactEmail}
              </a>
            </div>

            <a
              href={`mailto:${SITE_CONFIG.contactEmail}?subject=Word%20Unscrambler%20Feedback`}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>Compose Email</span>
            </a>
          </div>

          <p className="text-xs text-slate-400">
            Note: We do not operate an automated third-party contact submission form to prevent unsent message errors. Direct email ensures your communication reaches us directly.
          </p>
        </section>
      </article>
    </div>
  );
}
