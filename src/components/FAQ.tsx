import { FAQ_DATA } from '../data/faqData.ts';
import type { FAQItem } from '../types.ts';

interface FAQProps {
  items?: FAQItem[];
  id?: string;
  title?: string;
}

export default function FAQ({ items = FAQ_DATA, id = 'faq', title = 'Frequently Asked Questions' }: FAQProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="flex flex-col"
    >
      <h2
        id={`${id}-heading`}
        className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4"
      >
        {title}
      </h2>

      <div id={`${id}-accordion-list`} className="space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            id={item.id}
            className="group p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs transition-colors [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-left font-bold text-xs sm:text-sm text-slate-700 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-sm">
              <span>{item.question}</span>
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
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

