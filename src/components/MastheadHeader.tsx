import React from 'react';
import { 
  FileText, 
  DollarSign, 
  Palette, 
  Search, 
  Flame, 
  Globe
} from 'lucide-react';
import { Article, MagazineConfig, NewsCategory } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../utils/themeHelper';

interface MastheadHeaderProps {
  config: MagazineConfig;
  selectedCategory: NewsCategory | 'All';
  breakingArticle?: Article;
  onSelectCategory: (cat: NewsCategory | 'All') => void;
  onOpenArticle: (art: Article) => void;
  onOpenEPaper: () => void;
  onOpenAdvertise?: () => void;
  onToggleTheme?: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const CATEGORIES: (NewsCategory | 'All')[] = [
  'All',
  'Canada',
  'Diaspora & Community',
  'Business',
  'India',
  'Immigration',
  'Arts & Culture',
  'Sports',
  'Opinion & Editorial'
];

export const MastheadHeader: React.FC<MastheadHeaderProps> = ({
  config,
  selectedCategory,
  breakingArticle,
  onSelectCategory,
  onOpenArticle,
  onOpenEPaper,
  onOpenAdvertise,
  onToggleTheme,
  onSearchChange,
  searchQuery,
}) => {
  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const fonts = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  const todayStr = new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className={`border-b ${theme.border} ${theme.surfaceBg} shadow-xs select-none`}>
      {/* 1. Top Broadsheet Weather & Currency Bar */}
      <div className={`border-b ${theme.border} py-1.5 px-4 sm:px-6 text-[11px] font-sans ${theme.textSecondary}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Dateline, Edition, Bureaus */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-800">{todayStr}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline">Greater Toronto &amp; Vancouver Edition</span>
            <span className="hidden md:inline">&middot;</span>
            <span className="hidden md:inline">Circulation across Canada &amp; India</span>
          </div>

          {/* Center/Ticker: Exchange Rates */}
          <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono">
            <span>
              USD/CAD: <strong className="text-neutral-800 font-semibold">$1.38</strong>
            </span>
            <span>&middot;</span>
            <span>
              CAD/INR: <strong className="text-neutral-800 font-semibold">₹61.40</strong>
            </span>
            <span>&middot;</span>
            <span>
              Print Price: <strong className="text-neutral-800 font-semibold">$1.36</strong>
            </span>
          </div>

          {/* Right: Only 3 Public Buttons: Digital E-Paper, Ad Rates, Theme */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenEPaper}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${theme.accentBg}`}
            >
              <FileText className="w-3 h-3" />
              <span>Digital E-Paper</span>
            </button>

            {onOpenAdvertise && (
              <button
                onClick={onOpenAdvertise}
                className={`px-2 py-1 rounded-md text-[11px] font-medium border ${theme.border} text-neutral-600 hover:${theme.textPrimary} flex items-center gap-1 cursor-pointer`}
                title="View Advertising Kit & Rate Card"
              >
                <DollarSign className="w-3 h-3 text-amber-600" />
                <span className="hidden sm:inline">Ad Rates</span>
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-1 rounded-md border ${theme.border} text-neutral-600 hover:${theme.textPrimary} cursor-pointer`}
                title="Change Newsroom Theme"
              >
                <Palette className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Prestigious Broadsheet Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-semibold text-neutral-500">
          <span>द हिन्द कैनेडियन टाइम्स</span>
          <span>&bull;</span>
          <span>THE HIND CANADIAN TIMES</span>
          <span>&bull;</span>
          <span>ਦ ਹਿੰਦ ਕੈਨੇਡੀਅਨ ਟਾਈਮਜ਼</span>
        </div>

        <div className="py-1">
          <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight ${theme.textPrimary} ${fonts.headlineFont} uppercase`}>
            {config.name}
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-neutral-600 mt-1">
            &ldquo;{config.tagline}&rdquo; &mdash; Serving Ontario, Vancouver, Delhi &amp; The Diaspora Since {config.foundedYear}
          </p>
        </div>

        <div className="pt-2">
          <div className={`h-[2px] ${theme.accentBar}`} />
          <div className="h-[1px] bg-neutral-300 mt-[2px]" />
        </div>
      </div>

      {/* 3. Breaking News Ticker (If Active) */}
      {breakingArticle && (
        <div className="bg-red-800 text-white text-xs py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="bg-white text-red-900 px-2 py-0.5 rounded font-black uppercase text-[10px] tracking-wider flex items-center gap-1 shrink-0">
              <Flame className="w-3 h-3 fill-red-700" />
              <span>Breaking</span>
            </span>
            <button
              onClick={() => onOpenArticle(breakingArticle)}
              className="hover:underline font-serif truncate text-left cursor-pointer"
            >
              {breakingArticle.title}
            </button>
          </div>
        </div>
      )}

      {/* 4. Category Navigation & Live Search Bar */}
      <div className={`border-t ${theme.border} py-2 px-4 sm:px-6 bg-neutral-50/50`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? `${theme.accentBg} shadow-xs`
                      : `text-neutral-600 hover:${theme.textPrimary} hover:bg-neutral-200/50`
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </nav>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search news & archives..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-8 pr-3 py-1 text-xs rounded-md border ${theme.border} bg-white focus:outline-none focus:ring-1 focus:ring-neutral-800`}
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          </div>
        </div>
      </div>
    </header>
  );
};
