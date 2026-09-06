import { useState } from 'react';
import { Menu, X, SpellCheck } from 'lucide-react';
import type { NavItem } from '../types.ts';

interface HeaderProps {
  currentRoute?: string;
  onNavigate?: (target: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Words With Letters', href: '/words-with-letters' },
  { label: 'Word Finder', href: '/word-finder' },
  { label: 'Anagram Solver', href: '/anagram-solver' },
  { label: 'Word Unscrambler', href: '/word-unscrambler' },
  { label: '6 Letter Unscrambler', href: '/6-letter-word-unscrambler' },
  { label: '7 Letter Unscrambler', href: '/7-letter-word-unscrambler' },
  { label: '8 Letter Unscrambler', href: '/8-letter-word-unscrambler' },
  { label: '5 Letter Word Finder', href: '/5-letter-word-finder' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export default function Header({ currentRoute = 'home', onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(href);
    } else {
      if (href.startsWith('#')) {
        const targetId = href.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = href;
      }
    }
  };

  const isItemActive = (item: NavItem) => {
    if (currentRoute === 'wordsWithLetters' && item.href === '/words-with-letters') return true;
    if (currentRoute === 'wordFinder' && item.href === '/word-finder') return true;
    if (currentRoute === 'anagramSolver' && item.href === '/anagram-solver') return true;
    if (currentRoute === 'sixLetterUnscrambler' && item.href === '/6-letter-word-unscrambler') return true;
    if (currentRoute === 'sevenLetterUnscrambler' && item.href === '/7-letter-word-unscrambler') return true;
    if (currentRoute === 'eightLetterUnscrambler' && item.href === '/8-letter-word-unscrambler') return true;
    if (currentRoute === 'fiveLetterFinder' && item.href === '/5-letter-word-finder') return true;
    if (currentRoute === 'home' && item.href === '/word-unscrambler') return true;
    return false;
  };

  return (
    <header
      id="site-header"
      className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-40 transition-colors"
    >
      <div className="w-full flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          id="header-brand-logo"
          href="/word-unscrambler"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.button === 1) return;
            e.preventDefault();
            handleNavClick('/word-unscrambler');
          }}
          className="flex items-center gap-2.5 text-slate-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-md"
        >
          <div
            id="brand-icon-tile"
            className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shrink-0 shadow-xs"
          >
            <img
              src="/favicon.png.png"
              alt=""
              className="w-full h-full rounded object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Word Unscrambler
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-navigation" aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(item);
            return (
              <a
                key={item.label}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                href={item.href}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.button === 1) return;
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`text-sm font-medium transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-sm ${
                  isActive
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-600"
            aria-controls="mobile-navigation-menu"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close main navigation' : 'Open main navigation'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="absolute top-16 left-0 right-0 border-b border-slate-200 bg-white px-6 py-4 shadow-md md:hidden"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = isItemActive(item);
              return (
                <a
                  key={item.label}
                  id={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={item.href}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.button === 1) return;
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
