import { ArrowLeft, Shield, Lock, HardDrive, Bell, Megaphone } from 'lucide-react';
import { SITE_CONFIG } from '../config/site.ts';

interface PageProps {
  onNavigateHome: () => void;
}

export default function PrivacyPage({ onNavigateHome }: PageProps) {
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
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span>Legal & Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy - Word Unscrambler
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Last Updated: January 2026
          </p>
        </header>

        {/* Introduction */}
        <section aria-labelledby="privacy-overview" className="space-y-3">
          <h2 id="privacy-overview" className="text-lg sm:text-xl font-bold text-slate-800">
            Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Word Unscrambler is committed to transparent and respectful privacy practices. As a free word-solving utility, our mission is to provide fast, accessible anagram assistance without collecting unnecessary personal data.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            This policy outlines what data the application interacts with, how local browser storage is used, and how advertising partners or future monetization may interact with your visit to support this free service.
          </p>
        </section>

        {/* No Account & No Personal Information */}
        <section aria-labelledby="privacy-no-personal-data" className="space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <h2 id="privacy-no-personal-data" className="text-lg sm:text-xl font-bold text-slate-800">
              No Personal Information or Accounts
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Word Unscrambler does not require you to create an account, register an email address, or provide any personal identification. You can use all core features of the word unscrambler anonymously.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We do not collect names, phone numbers, postal addresses, or payment details.
          </p>
        </section>

        {/* Local Storage & Recent Searches */}
        <section aria-labelledby="privacy-local-storage" className="space-y-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <h2 id="privacy-local-storage" className="text-lg sm:text-xl font-bold text-slate-800">
              Browser Storage (Recent Searches)
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            To provide the convenient "Recent Searches" feature, Word Unscrambler saves up to your 5 most recent letter queries and their associated filter settings directly in your web browser using standard client-side Web Storage (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code>).
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>Key facts about your recent searches:</strong>
          </p>
          <ul className="space-y-1.5 text-sm text-slate-600 list-disc pl-5">
            <li>Your recent searches remain strictly on your own device.</li>
            <li>They are <strong>not</strong> transmitted to or stored on any central server or database.</li>
            <li>You can erase your stored history at any time simply by clicking the "Clear" button next to Recent Searches in the tool, or by clearing your browser site data.</li>
          </ul>
        </section>

        {/* Advertising, Cookies & Third-Party Partners */}
        <section aria-labelledby="privacy-advertising" className="space-y-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <h2 id="privacy-advertising" className="text-lg sm:text-xl font-bold text-slate-800">
              Advertising, Cookies & Future Monetization
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Word Unscrambler is offered as a free website. To support the ongoing hosting, maintenance, and development of this free resource without requiring paid subscriptions, the site may display advertisements and partner with third-party advertising networks (such as Google AdSense and certified ad partners) or web analytics providers now or in the future.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Third-party vendors and ad networks may use cookies, web beacons, and similar technologies to serve ads based on your visits to this website and other websites across the Internet. These cookies allow advertising partners to recognize your device and deliver relevant advertisements.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>Managing your advertising choices:</strong>
          </p>
          <ul className="space-y-1.5 text-sm text-slate-600 list-disc pl-5">
            <li>
              You can opt out of personalized Google advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium"
              >
                Google Ads Settings
              </a>.
            </li>
            <li>
              You can opt out of interest-based advertising from participating vendors through the{' '}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium"
              >
                Digital Advertising Alliance (DAA)
              </a>{' '}
              or the{' '}
              <a
                href="https://optout.networkadvertising.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline font-medium"
              >
                Network Advertising Initiative (NAI)
              </a>.
            </li>
            <li>
              You can configure your browser to reject cookies or notify you when cookies are being set.
            </li>
          </ul>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            All core word-unscrambling calculations, dictionary searches, and tile filters continue to execute directly within your web browser client.
          </p>
        </section>

        {/* Policy Updates */}
        <section aria-labelledby="privacy-updates" className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            <h2 id="privacy-updates" className="text-lg sm:text-xl font-bold text-slate-800">
              Future Policy Updates
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We may periodically update this Privacy Policy to reflect future enhancements, new features, advertising partnerships, or legal requirements. When updates are published, the "Last Updated" date at the top of this page will be revised accordingly. We encourage users to review this page periodically.
          </p>
        </section>

        {/* Contact Information */}
        <section aria-labelledby="privacy-contact" className="space-y-3 pt-4 border-t border-slate-100">
          <h2 id="privacy-contact" className="text-lg sm:text-xl font-bold text-slate-800">
            Contact Us Regarding Privacy
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            If you have questions, feedback, or concerns regarding this privacy policy or our data practices, please reach out to:
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-mono text-slate-700">
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
            >
              {SITE_CONFIG.contactEmail}
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}
