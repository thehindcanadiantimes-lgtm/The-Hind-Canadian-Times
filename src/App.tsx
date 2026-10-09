/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MagazineConfig,
  Article,
  EPaperEdition,
  Advertisement,
  NewsCategory,
  ThemePreset
} from './types';
import {
  DEFAULT_MAGAZINE_CONFIG,
  INITIAL_ARTICLES,
  INITIAL_EPAPER_EDITIONS,
  INITIAL_ADS,
  SAMPLE_BLOGGER_POSTS
} from './data/newsData';
import { THEME_CONFIGS, FONT_CONFIGS } from './utils/themeHelper';

import { MastheadHeader } from './components/MastheadHeader';
import { AdBanner } from './components/AdBanner';
import { FrontPageGrid } from './components/FrontPageGrid';
import { NewsFooter } from './components/NewsFooter';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { ArticlePublishModal } from './components/ArticlePublishModal';
import { EPaperModal } from './components/EPaperModal';
import { BloggerImportModal } from './components/BloggerImportModal';
import { GooglePlatformModal } from './components/GooglePlatformModal';
import { AdvertiseMediaKitModal } from './components/AdvertiseMediaKitModal';
import {
  persistArticles,
  loadArticlesFromIndexedDB,
  scanLocalStorageForArticles,
  saveEPaperEditionsToIndexedDB,
  loadEPaperEditionsFromIndexedDB,
  PRIMARY_STORAGE_KEY
} from './utils/storage';

const STORAGE_KEY = 'hct_magazine_config_v2';
const ARTICLES_STORAGE_KEY = PRIMARY_STORAGE_KEY;

// Helper to extract timestamp from article for chronological ordering
export const getArticleTimestamp = (art: Article): number => {
  if (art.timestamp && art.timestamp > 0) return art.timestamp;
  if (art.publishedAt) {
    const isoMatch = art.publishedAt.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
    if (isoMatch) {
      const parsed = Date.parse(`${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`);
      if (!isNaN(parsed)) return parsed;
    }
    const monthMatch = art.publishedAt.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i);
    if (monthMatch) {
      const parsed = Date.parse(monthMatch[0]);
      if (!isNaN(parsed)) return parsed;
    }
    const dayMonthMatch = art.publishedAt.match(/\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4}/i);
    if (dayMonthMatch) {
      const parsed = Date.parse(dayMonthMatch[0]);
      if (!isNaN(parsed)) return parsed;
    }
    const yearMatch = art.publishedAt.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      return new Date(`${yearMatch[1]}-06-01`).getTime();
    }
  }
  return 0;
};

export default function App() {
  // Configuration
  const [config, setConfig] = useState<MagazineConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate legacy placeholders to the user's updated settings
        if (parsed.establishedYear === 2004) parsed.establishedYear = 2024;
        if (!parsed.tagline || parsed.tagline.includes('Indo-Canadian Diaspora')) {
          parsed.tagline = 'An Independent Voice for the Global Diaspora';
        }
        if (!parsed.editionLocation || !parsed.editionLocation.includes('U.K.')) {
          parsed.editionLocation = 'Toronto · Vancouver · Ottawa · U.K. · Chandigarh';
        }
        if (parsed.contactEmail === 'editor@thehindcanadiantimes.com' || !parsed.contactEmail) {
          parsed.contactEmail = 'thehindcanadiantimes@gmail.com';
        }
        parsed.editorialPhone = '';
        return { ...DEFAULT_MAGAZINE_CONFIG, ...parsed };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_MAGAZINE_CONFIG;
  });

  // Articles state - initial load scans all localStorage keys (rescues old versions)
  const [articles, setArticles] = useState<Article[]>(() => {
    const rescued = scanLocalStorageForArticles();
    if (rescued && rescued.length > 0) {
      rescued.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
      return rescued;
    }
    return INITIAL_ARTICLES;
  });

  // E-Paper Editions state
  const [epaperEditions, setEpaperEditions] = useState<EPaperEdition[]>(INITIAL_EPAPER_EDITIONS);

  // Advertisements
  const [ads] = useState<Advertisement[]>(INITIAL_ADS);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isEPaperModalOpen, setIsEPaperModalOpen] = useState(false);
  const [isBloggerModalOpen, setIsBloggerModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);

  // Load from IndexedDB on startup (unlimited storage quota, bypasses 5MB limit)
  useEffect(() => {
    loadArticlesFromIndexedDB().then((stored) => {
      if (stored && stored.length > 0) {
        setArticles((prev) => {
          // If stored in IndexedDB has articles, sort newest first and load
          if (stored.length >= prev.length || prev === INITIAL_ARTICLES) {
            const list = [...stored];
            list.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
            return list;
          }
          return prev;
        });
      }
    });

    // Also restore E-Paper editions from IndexedDB
    loadEPaperEditionsFromIndexedDB().then((storedEditions) => {
      if (storedEditions && storedEditions.length > 0) {
        setEpaperEditions(storedEditions);
      }
    });
  }, []);

  // Sync configuration to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // Ignore write errors
    }
  }, [config]);

  // Persist articles safely to IndexedDB and LocalStorage
  useEffect(() => {
    persistArticles(articles);
  }, [articles]);

  // Persist EPaper editions safely to IndexedDB
  useEffect(() => {
    if (epaperEditions && epaperEditions.length > 0) {
      saveEPaperEditionsToIndexedDB(epaperEditions);
    }
  }, [epaperEditions]);

  // Handler: Cycle Theme
  const handleToggleTheme = () => {
    const themes: ThemePreset[] = ['broadsheet', 'crimson_maple', 'royal_navy', 'dark_newsroom', 'forest_dispatch'];
    const currentIdx = themes.indexOf(config.theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    setConfig({ ...config, theme: nextTheme });
  };

  // Handler: Like Article
  const handleLikeArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
    );
  };

  // Handler: Add New Published Article
  const handlePublishArticle = (newArt: Article) => {
    const articleWithTime = {
      ...newArt,
      timestamp: newArt.timestamp || Date.now(),
    };
    setArticles((prev) => [articleWithTime, ...prev]);
    setSelectedArticle(articleWithTime);
  };

  // Handler: Import Blogger Article
  const handleImportBloggerPost = (newArt: Article) => {
    const articleWithTime = {
      ...newArt,
      timestamp: newArt.timestamp || getArticleTimestamp(newArt) || Date.now(),
    };
    setArticles((prev) => {
      const list = [articleWithTime, ...prev.filter((a) => a.id !== newArt.id)];
      list.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
      return list;
    });
  };

  // Handler: Batch Import Articles from Blogger XML or Feed
  const handleImportBatch = (newArticles: Article[]) => {
    setArticles((prev) => {
      const map = new Map<string, Article>();
      // Keep existing
      prev.forEach((a) => {
        const key = a.id || a.title;
        map.set(key, a);
      });
      // Add or update new
      newArticles.forEach((a) => {
        const key = a.id || a.title;
        map.set(key, a);
      });
      const list = Array.from(map.values());
      // Sort newest first! Today / 2026 at the top, 2025 further down
      list.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
      return list;
    });
  };

  // Handler: Upload New E-Paper PDF Edition
  const handleUploadEdition = (newEdition: EPaperEdition) => {
    setEpaperEditions((prev) => [newEdition, ...prev]);
  };

  // Chronologically sorted filtered articles (strictly newest first!)
  const sortedArticles = [...articles].sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));

  const filteredArticles = sortedArticles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breakingArticle = articles.find((a) => a.isBreaking);
  const leaderboardAd = ads.find((a) => a.slot === 'leaderboard') || ads[0];
  const sidebarAd = ads.find((a) => a.slot === 'sidebar_mpu') || ads[1];
  const inFeedAd = ads.find((a) => a.slot === 'in_feed') || ads[2];
  const footerAd = ads.find((a) => a.slot === 'super_footer') || ads[3];

  const currentTheme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const currentFont = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  return (
    <div className={`min-h-screen ${currentTheme.canvasBg} ${currentTheme.textPrimary} ${currentFont.bodyFont} transition-colors duration-300`}>
      {/* Newspaper Masthead & Top Navigation */}
      <MastheadHeader
        config={config}
        selectedCategory={selectedCategory}
        breakingArticle={breakingArticle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onOpenArticle={setSelectedArticle}
        onOpenEPaper={() => setIsEPaperModalOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onOpenBloggerTransfer={() => setIsBloggerModalOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
        onOpenGooglePlatform={() => setIsGoogleModalOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Newspaper Feed Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Leaderboard Advertisement (JPG / GIF / Video) */}
        {config.showLeaderboardAd && leaderboardAd && (
          <AdBanner ad={leaderboardAd} onOpenAdKit={() => setIsAdvertiseModalOpen(true)} />
        )}

        {/* Category Header Indicator if filtered */}
        {selectedCategory !== 'All' && (
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-700">
                Editorial Section
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                {selectedCategory}
              </h2>
            </div>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-neutral-600 hover:text-black underline font-mono"
            >
              &larr; Return to Front Page
            </button>
          </div>
        )}

        {/* 3-Tier Front Page News Grid */}
        <FrontPageGrid
          articles={filteredArticles}
          config={config}
          sidebarAd={sidebarAd}
          inFeedAd={inFeedAd}
          onOpenArticle={setSelectedArticle}
          onOpenEPaper={() => setIsEPaperModalOpen(true)}
          onOpenAdKit={() => setIsAdvertiseModalOpen(true)}
          onLikeArticle={handleLikeArticle}
        />

        {/* Bottom Super Leaderboard Advertisement */}
        {footerAd && (
          <AdBanner ad={footerAd} onOpenAdKit={() => setIsAdvertiseModalOpen(true)} />
        )}
      </main>

      {/* Newspaper Colophon & Footer */}
      <NewsFooter
        config={config}
        onSelectCategory={setSelectedCategory}
        onOpenEPaper={() => setIsEPaperModalOpen(true)}
        onOpenBloggerTransfer={() => setIsBloggerModalOpen(true)}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
        onOpenGooglePlatform={() => setIsGoogleModalOpen(true)}
      />

      {/* 1. Article Detail & Multimedia Reader Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          config={config}
          onClose={() => setSelectedArticle(null)}
          onLike={handleLikeArticle}
        />
      )}

      {/* 2. Article Publishing Studio with Image, Video, and PDF upload */}
      {isPublishModalOpen && (
        <ArticlePublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          config={config}
          onPublishArticle={handlePublishArticle}
        />
      )}

      {/* 3. E-Paper PDF Multi-Page Reader & PDF Edition Uploader */}
      {isEPaperModalOpen && (
        <EPaperModal
          isOpen={isEPaperModalOpen}
          onClose={() => setIsEPaperModalOpen(false)}
          config={config}
          editions={epaperEditions}
          onUploadEdition={handleUploadEdition}
        />
      )}

      {/* 4. Google Blogger Post Importer & Migration Tool */}
      {isBloggerModalOpen && (
        <BloggerImportModal
          isOpen={isBloggerModalOpen}
          onClose={() => setIsBloggerModalOpen(false)}
          config={config}
          samplePosts={SAMPLE_BLOGGER_POSTS}
          articles={articles}
          onImportPost={handleImportBloggerPost}
          onImportBatch={handleImportBatch}
        />
      )}

      {/* 5. Google Cloud Run, AdSense & News Integration Details */}
      {isGoogleModalOpen && (
        <GooglePlatformModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
          config={config}
        />
      )}

      {/* 6. Media Kit, Ad Rate Card & Interactive Creative Mockup Simulator */}
      {isAdvertiseModalOpen && (
        <AdvertiseMediaKitModal
          isOpen={isAdvertiseModalOpen}
          onClose={() => setIsAdvertiseModalOpen(false)}
          config={config}
        />
      )}
    </div>
  );
}
