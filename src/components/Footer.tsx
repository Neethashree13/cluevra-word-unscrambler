import React from 'react';

interface FooterProps {
  onNavigate?: (pathOrHash: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = Math.max(2026, new Date().getFullYear());

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, pathOrHash: string) => {
    // If user clicked with Ctrl/Cmd or Middle-click, allow default new-tab navigation
    if (e.metaKey || e.ctrlKey || e.button === 1) {
      return;
    }
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pathOrHash);
    }
  };

  return (
    <footer
      id="site-footer"
      className="bg-white border-t border-slate-200 shrink-0 text-slate-600 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Section */}
          <div className="md:col-span-6 space-y-3">
            <a
              id="footer-brand-link"
              href="/word-unscrambler"
              onClick={(e) => handleLinkClick(e, '/word-unscrambler')}
              className="inline-flex items-center gap-2.5 text-slate-900 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
              aria-label="Cluevra home"
            >
              <div
                id="footer-brand-tile"
                className="w-7 h-7 bg-indigo-600 group-hover:bg-indigo-700 rounded flex items-center justify-center shrink-0 shadow-xs transition-colors"
                aria-hidden="true"
              >
                <span className="text-white font-bold text-base leading-none">W</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Cluevra
              </span>
            </a>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Free word tools to unscramble letters, find words, and solve anagrams.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-6">
            <nav id="footer-navigation" aria-label="Footer Navigation">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4">
                {/* Tools */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Tools
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium">
                    <li>
                      <a
                        id="footer-link-words-with-letters"
                        href="/words-with-letters"
                        onClick={(e) => handleLinkClick(e, '/words-with-letters')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Words With Letters
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-word-finder"
                        href="/word-finder"
                        onClick={(e) => handleLinkClick(e, '/word-finder')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Word Finder
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-anagram-solver"
                        href="/anagram-solver"
                        onClick={(e) => handleLinkClick(e, '/anagram-solver')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Anagram Solver
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-word-unscrambler"
                        href="/word-unscrambler"
                        onClick={(e) => handleLinkClick(e, '/word-unscrambler')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Word Unscrambler
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-six-letter-unscrambler"
                        href="/6-letter-word-unscrambler"
                        onClick={(e) => handleLinkClick(e, '/6-letter-word-unscrambler')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        6 Letter Unscrambler
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-seven-letter-unscrambler"
                        href="/7-letter-word-unscrambler"
                        onClick={(e) => handleLinkClick(e, '/7-letter-word-unscrambler')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        7 Letter Unscrambler
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-eight-letter-unscrambler"
                        href="/8-letter-word-unscrambler"
                        onClick={(e) => handleLinkClick(e, '/8-letter-word-unscrambler')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        8 Letter Unscrambler
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-five-letter-finder"
                        href="/5-letter-word-finder"
                        onClick={(e) => handleLinkClick(e, '/5-letter-word-finder')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        5 Letter Finder
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Guide & Help */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Guide
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium">
                    <li>
                      <a
                        id="footer-link-how-it-works"
                        href="#how-it-works"
                        onClick={(e) => handleLinkClick(e, '#how-it-works')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        How It Works
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-faq"
                        href="#faq"
                        onClick={(e) => handleLinkClick(e, '#faq')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company & Info */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Information
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium">
                    <li>
                      <a
                        id="footer-link-about"
                        href="/about"
                        onClick={(e) => handleLinkClick(e, '/about')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-contact"
                        href="/contact"
                        onClick={(e) => handleLinkClick(e, '/contact')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Legal
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm font-medium">
                    <li>
                      <a
                        id="footer-link-privacy-policy"
                        href="/privacy-policy"
                        onClick={(e) => handleLinkClick(e, '/privacy-policy')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        id="footer-link-terms"
                        href="/terms"
                        onClick={(e) => handleLinkClick(e, '/terms')}
                        className="text-slate-600 hover:text-indigo-600 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-xs"
                      >
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p id="footer-copyright" className="text-slate-500 font-medium">
            © {currentYear} ClueVra. All rights reserved.
          </p>
          <p className="text-slate-400">
            A free online word-solving and anagram reference utility.
          </p>
        </div>
      </div>
    </footer>
  );
}
