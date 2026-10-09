import React from 'react';
import { FileText, Globe, DollarSign, Share2, Upload } from 'lucide-react';
import { MagazineConfig, NewsCategory } from '../types';
import { THEME_CONFIGS } from '../utils/themeHelper';

interface NewsFooterProps {
  config: MagazineConfig;
  onSelectCategory: (cat: NewsCategory | 'All') => void;
  onOpenEPaper: () => void;
  onOpenBloggerTransfer: () => void;
  onOpenPublish: () => void;
  onOpenAdvertise: () => void;
  onOpenGooglePlatform: () => void;
}

export const NewsFooter: React.FC<NewsFooterProps> = ({
  config,
  onSelectCategory,
  onOpenEPaper,
  onOpenBloggerTransfer,
  onOpenPublish,
  onOpenAdvertise,
  onOpenGooglePlatform,
}) => {
  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;

  return (
    <footer className={`border-t-4 border-double ${theme.borderStrong} ${theme.surfaceBg} mt-20 pt-16 pb-12 transition-colors`}>
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Top Colophon Lockup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-neutral-200">
          <div className="md:col-span-5 space-y-3">
            <h2 className="text-2xl font-black font-serif uppercase tracking-tight text-neutral-900">
              {config.publicationName}
            </h2>
            <div className="text-xs text-amber-900 font-serif font-bold flex flex-wrap items-center gap-1.5">
              <span>द हिन्द कैनेडियन टाइम्स</span>
              <span>&middot;</span>
              <span>ਦ ਹਿੰਦ ਕੈਨੇਡੀਅਨ ਟਾਈਮਜ਼</span>
              <span>&middot;</span>
              <span>ESTD. {config.establishedYear}</span>
            </div>
            <div className="text-[11px] font-serif font-bold uppercase tracking-wider text-red-800">
              A Multilingual International Magazine
            </div>
            <p className="text-xs text-neutral-600 font-serif leading-relaxed max-w-sm">
              An independent voice for the global diaspora dedicated to investigative journalism, civic affairs, immigration law, and international commerce across Canada, U.K., and worldwide.
            </p>
            <div className="text-[11px] font-mono text-neutral-500 pt-1 space-y-0.5">
              <div>ISSN 1712-4980 &middot; NATL. LIBRARY CAN. &middot; ONTARIO REG. NO. 44109</div>
              <div>Editorial Desk: <a href="mailto:thehindcanadiantimes@gmail.com" className="hover:underline text-neutral-700">thehindcanadiantimes@gmail.com</a></div>
            </div>
          </div>

          {/* Quick Departments */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="font-bold font-serif text-neutral-900 uppercase tracking-wider text-[11px]">
              Editorial Desks
            </h4>
            <ul className="space-y-1.5 text-neutral-600">
              <li>
                <button onClick={() => onSelectCategory('Canada')} className="hover:underline">
                  Canada Affairs &amp; Parliament
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('India')} className="hover:underline">
                  India &amp; Bilateral Trade
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Immigration')} className="hover:underline">
                  Immigration &amp; Express Entry
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Business')} className="hover:underline">
                  Business &amp; Real Estate
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Diaspora & Community')} className="hover:underline">
                  Diaspora &amp; Community Voices
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Arts & Culture')} className="hover:underline">
                  Arts, Literature &amp; Poetry
                </button>
              </li>
            </ul>
          </div>

          {/* Operational Portals */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <h4 className="font-bold font-serif text-neutral-900 uppercase tracking-wider text-[11px]">
              Digital Portals &amp; Publishing
            </h4>
            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenEPaper}
                className="w-full text-left p-2 rounded-lg border border-neutral-200 hover:border-neutral-400 flex items-center justify-between text-neutral-800"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <span>Digital E-Paper (PDF Editions)</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Weekly</span>
              </button>

              <button
                onClick={onOpenBloggerTransfer}
                className="w-full text-left p-2 rounded-lg border border-neutral-200 hover:border-neutral-400 flex items-center justify-between text-neutral-800"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Archive Import &amp; Content Migration</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600">Import</span>
              </button>

              <button
                onClick={onOpenPublish}
                className="w-full text-left p-2 rounded-lg border border-neutral-200 hover:border-neutral-400 flex items-center justify-between text-neutral-800"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Publish News &amp; Multimedia</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Contributor</span>
              </button>

              <button
                onClick={onOpenAdvertise}
                className="w-full text-left p-2 rounded-lg border border-neutral-200 hover:border-neutral-400 flex items-center justify-between text-neutral-800"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span>Advertise in JPG, GIF, Video Format</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Rates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Google Platform & Hosting Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deployed natively on Google Cloud Platform &middot; Google News &amp; AdSense Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenGooglePlatform} className="text-emerald-700 hover:underline">
              Google Cloud Status
            </button>
            <span>&middot;</span>
            <button onClick={onOpenAdvertise} className="hover:underline">
              Advertise
            </button>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} The Hind Canadian Times</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
