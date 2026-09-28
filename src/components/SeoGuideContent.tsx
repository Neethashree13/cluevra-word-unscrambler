import React from 'react';
import seoGuides from '../data/seoGuides.json';

type SeoGuideKey = keyof typeof seoGuides;

interface SeoGuideContentProps {
  pageKey: SeoGuideKey;
  onNavigate?: (path: string) => void;
}

export default function SeoGuideContent({ pageKey, onNavigate }: SeoGuideContentProps) {
  const guide = seoGuides[pageKey];

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.button === 1) return;
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <article className="max-w-4xl mx-auto mt-12 space-y-8 text-slate-700" aria-label={guide.heading}>
      <p className="text-sm sm:text-base leading-relaxed text-slate-600">{guide.intro}</p>
      {guide.sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm sm:text-base leading-relaxed text-slate-600">
              {paragraph}
            </p>
          ))}
          {'items' in section && section.items && (
            <ul className="list-disc space-y-2 pl-6 text-sm sm:text-base leading-relaxed text-slate-600">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}
      <section className="space-y-3" aria-labelledby={`${pageKey}-faq-heading`}>
        <h2 id={`${pageKey}-faq-heading`} className="text-lg sm:text-xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {guide.faqs.map((faq) => (
            <details key={faq.question} className="border-b border-slate-200 py-3">
              <summary className="cursor-pointer font-semibold text-slate-800">{faq.question}</summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <nav aria-label="Related word tools" className="space-y-3 border-t border-slate-200 pt-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900">Related Word Tools</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          {guide.related.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleLinkClick(event, link.href)}
                className="text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}