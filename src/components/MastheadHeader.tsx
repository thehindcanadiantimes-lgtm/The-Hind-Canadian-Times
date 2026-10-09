import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Globe,
  Radio,
  Share2,
  Palette,
  Search,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { MagazineConfig, NewsCategory, Article } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../utils/themeHelper';

interface MastheadHeaderProps {
  config: MagazineConfig;
  selectedCategory: NewsCategory | 'All';
  breakingArticle?: Article;
  onSelectCategory: (cat: NewsCategory | 'All') => void;
  onOpenArticle: (art: Article) => void;
  onOpenEPaper: () => void;
  onOpenPublish: () => void;
  onOpenBloggerTransfer: () => void;
  onOpenAdvertise: () => void;
  onOpenGooglePlatform: () => void;
  onToggleTheme: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const MastheadHeader: React.FC<MastheadHeaderProps> = ({
  config,
  selectedCategory,
  breakingArticle,
  onSelectCategory,
  onOpenArticle,
  onOpenEPaper,
  onOpenPublish,
  onOpenBloggerTransfer,
  onOpenAdvertise,
  onOpenGooglePlatform,
  onToggleTheme,
  onSearchChange,
  searchQuery,
}) => {
  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const fonts = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  const [currentDateStr, setCurrentDateStr] = useState('');
  const [activeZone, setActiveZone] = useState<'toronto' | 'vancouver' | 'delhi'>('toronto');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-CA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }, []);

  const getZoneTime = () => {
    const now = new Date();
    if (activeZone === 'vancouver') {
      return now.toLocaleTimeString('en-US', { timeZone: 'America/Vancouver', hour: '2-digit', minute: '2-digit' }) + ' PST (Vancouver)';
    }
    if (activeZone === 'delhi') {
      return now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST (New Delhi)';
    }
    return now.toLocaleTimeString('en-US', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit' }) + ' EST (Toronto)';
  };

  const categories: (NewsCategory | 'All')[] = [
    'All',
    'Canada',
    'India',
    'Immigration',
    'Business',
    'Diaspora & Community',
    'Opinion & Editorial',
    'Arts & Culture',
    'Sports',
  ];

  return (
    <header className={`w-full border-b ${theme.border} ${theme.surfaceBg} transition-colors`}>
      {/* 1. Top Utility Strip */}
      <div className={`border-b ${theme.border} text-xs py-1.5 px-6 ${theme.canvasBg}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Date, Edition & City Clocks */}
          <div className="flex items-center gap-4 text-[11px] font-mono tabular-nums">
            <span className={`font-semibold ${theme.textPrimary}`}>{currentDateStr}</span>
            <span className={theme.textMuted}>&middot;</span>
            <div className="flex items-center gap-1.5 text-neutral-500">
              <button
                onClick={() => setActiveZone(activeZone === 'toronto' ? 'vancouver' : activeZone === 'vancouver' ? 'delhi' : 'toronto')}
                className="hover:underline flex items-center gap-1"
                title="Click to toggle time zone"
              >
                <span>{getZoneTime()}</span>
              </button>
            </div>
            <span className="hidden lg:inline text-neutral-500">&middot;</span>
            <span className="hidden lg:inline text-neutral-500">
              CAD/INR: <strong className="text-emerald-700 font-semibold">₹62.40</strong> &middot; USD/CAD: <strong className="text-neutral-800 font-semibold">$1.36</strong>
            </span>
          </div>

          {/* Right: Quick Operational Modules */}
          <div className="flex items-center gap-2">
            {/* E-Paper Quick Trigger */}
            <button
              onClick={onOpenEPaper}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1.5 transition-colors ${theme.accentBg}`}
            >
              <FileText className="w-3 h-3" />
              <span>Digital E-Paper (PDF)</span>
            </button>

            {/* Archive Import Trigger */}
            <button
              onClick={onOpenBloggerTransfer}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} hover:${theme.surfaceHover} flex items-center gap-1`}
              title="Import past news dispatches, XML feeds, and Takeout archives"
            >
              <Share2 className="w-3 h-3 text-amber-600" />
              <span>Archive Importer</span>
            </button>

            {/* Upload News / Article */}
            <button
              onClick={onOpenPublish}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} hover:${theme.surfaceHover} flex items-center gap-1`}
              title="Publish news with multimedia"
            >
              <Upload className="w-3 h-3 text-blue-600" />
              <span>Publish Article</span>
            </button>

            {/* Google Platform Details */}
            <button
              onClick={onOpenGooglePlatform}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${theme.border} text-neutral-600 hover:${theme.textPrimary} flex items-center gap-1`}
              title="Google Cloud Run, AdSense & News Integration"
            >
              <Globe className="w-3 h-3 text-emerald-600" />
              <span className="hidden sm:inline">Google Cloud</span>
            </button>

            {/* Advertise With Us */}
            <button
              onClick={onOpenAdvertise}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border ${theme.border} text-neutral-600 hover:${theme.textPrimary} flex items-center gap-1`}
              title="View Advertising Kit & Rate Card"
            >
              <DollarSign className="w-3 h-3 text-amber-600" />
              <span className="hidden sm:inline">Ad Rates</span>
            </button>

            {/* Theme switcher */}
            <button
              onClick={onToggleTheme}
              className={`p-1 rounded-md border ${theme.border} text-neutral-600 hover:${theme.textPrimary}`}
              title="Change Newsroom Theme"
            >
              <Palette className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Prestigious Broadsheet Masthead */}
      <div className={`py-6 md:py-8 px-6 text-center border-b ${theme.border} ${theme.surfaceBg}`}>
        <div className="max-w-5xl mx-auto space-y-2">
          {/* ISSN, Publication Mail Agreement & Heritage Registry */}
          <div className="flex flex-wrap items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-mono px-2 gap-2">
            <span className="hidden sm:inline">ISSN 1712-4980 &middot; NATL. LIBRARY CAN.</span>
            <span className="font-semibold text-neutral-600">AN INDEPENDENT VOICE FOR THE GLOBAL DIASPORA</span>
            <span className="hidden sm:inline">PUB. MAIL AGREEMENT #40032901 &middot; ONTARIO REG. NO. 44109 &middot; ESTD. 2024</span>
          </div>

          {/* Main Newspaper Name in Large Architectural Broadsheet Type */}
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight ${theme.textPrimary} ${fonts.headlineFont} uppercase`}
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            {config.publicationName}
          </h1>

          {/* Single Line Below the Main Name: A Multilingual International Magazine */}
          <div className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.25em] text-red-800 border-y border-neutral-300/80 py-1 max-w-xl mx-auto">
            A MULTILINGUAL INTERNATIONAL MAGAZINE
          </div>

          {/* Multilingual Titles (Hindi & Punjabi) & Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-serif pt-1">
            <span className="text-amber-800 font-bold">द हिन्द कैनेडियन टाइम्स</span>
            <span className="text-neutral-400">&bull;</span>
            <span className="text-amber-800 font-bold">ਦ ਹਿੰਦ ਕੈਨੇਡੀਅਨ ਟਾਈਮਜ਼</span>
            <span className="text-neutral-400 hidden sm:inline">&mdash;</span>
            <span className={`italic ${theme.textSecondary}`}>{config.tagline}</span>
          </div>

          {/* Motto and Editions Bar */}
          <div className={`pt-2 border-t border-dotted ${theme.border} flex flex-wrap items-center justify-between text-[11px] ${theme.textMuted} font-serif px-2`}>
            <span>{config.motto}</span>
            <span className="font-sans font-medium text-neutral-700">{config.editionLocation}</span>
          </div>
        </div>
      </div>

      {/* 3. Strict 3-Zone Navigation Bar */}
      <nav className={`border-b ${theme.border} ${theme.surfaceBg} sticky top-0 z-30 shadow-xs`}>
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('All');
            }}
            className={`font-serif font-black text-sm tracking-tight ${theme.textPrimary} hover:opacity-80 shrink-0 whitespace-nowrap`}
          >
            HCT DIGITAL
          </a>

          {/* Zone 2: 7 Category Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-medium overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`py-1 transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? `font-bold ${theme.accentRed} border-b-2 ${theme.accentBorder}`
                    : `${theme.textSecondary} hover:${theme.textPrimary}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Zone 3: Search input & E-Paper Trigger */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search news, topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`pl-8 pr-3 py-1.5 rounded-lg border text-xs w-36 sm:w-48 ${theme.canvasBg} ${theme.border} focus:outline-hidden focus:ring-1 focus:ring-red-600`}
              />
            </div>

            {/* Quick Action */}
            <button
              onClick={onOpenEPaper}
              className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold ${theme.accentBg}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>E-Paper</span>
            </button>
          </div>
        </div>

        {/* Mobile Category Scrollbar */}
        <div className="lg:hidden flex items-center gap-3 px-6 py-2 overflow-x-auto border-t border-neutral-200 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-2 py-0.5 rounded ${
                selectedCategory === cat
                  ? `${theme.accentBg} text-white font-bold`
                  : `${theme.textSecondary} hover:${theme.textPrimary}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* 4. Breaking News Ticker Ribbon */}
      {config.showBreakingTicker && breakingArticle && (
        <div className="bg-red-800 text-white text-xs py-2 px-6 overflow-hidden flex items-center gap-3">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0 bg-red-950 px-2 py-0.5 rounded font-black tracking-wider uppercase text-[10px]">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              <span>Breaking News</span>
            </div>
            <button
              onClick={() => onOpenArticle(breakingArticle)}
              className="text-left font-serif hover:underline truncate text-red-50 text-xs sm:text-sm font-medium"
            >
              {breakingArticle.title}
            </button>
            <span className="hidden md:inline shrink-0 text-red-200 text-[11px] font-mono tabular-nums">
              {breakingArticle.publishedAt.split('·')[1] || 'Just in'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
