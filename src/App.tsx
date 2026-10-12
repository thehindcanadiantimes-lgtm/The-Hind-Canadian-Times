import React, { useState, useEffect } from 'react';
import { 
  Article, 
  MagazineConfig, 
  ThemePreset, 
  NewsCategory, 
  EPaperEdition, 
  Advertisement 
} from './types';
import { 
  DEFAULT_MAGAZINE_CONFIG, 
  INITIAL_EPAPER_EDITIONS, 
  INITIAL_ADS 
} from './data/newsData';
import { ALL_ARCHIVED_ARTICLES } from './data/articlesArchive';
import { THEME_CONFIGS, FONT_CONFIGS } from './utils/themeHelper';
import { fetchLiveNewsFeed } from './utils/bloggerArchiveParser';
import { 
  loadArticlesFromIndexedDB, 
  persistArticles, 
  loadEPaperEditionsFromIndexedDB, 
  saveEPaperEditionsToIndexedDB 
} from './utils/storage';

// Main Broadsheet & Magazine Components
import { MastheadHeader } from './components/MastheadHeader';
import { FrontPageGrid } from './components/FrontPageGrid';
import { NewsFooter } from './components/NewsFooter';

// Modals
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { EPaperModal } from './components/EPaperModal';
import { AdvertiseMediaKitModal } from './components/AdvertiseMediaKitModal';

const STORAGE_KEY = 'hct_magazine_settings';

export function App() {
  // Magazine Configuration State
  const [config, setConfig] = useState<MagazineConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.contactEmail = 'thehindcanadiantimes@gmail.com';
        parsed.editorialPhone = '';
        parsed.websiteUrl = 'https://www.thehindcanadiantimes.com';
        return { ...DEFAULT_MAGAZINE_CONFIG, ...parsed };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_MAGAZINE_CONFIG, websiteUrl: 'https://www.thehindcanadiantimes.com' };
  });

  // Articles state: Instantly loads all 1,185 articles right out of the box!
  const [articles, setArticles] = useState<Article[]>(() => {
    if (ALL_ARCHIVED_ARTICLES && ALL_ARCHIVED_ARTICLES.length > 0) {
      return ALL_ARCHIVED_ARTICLES;
    }
    return [];
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
  const [isEPaperModalOpen, setIsEPaperModalOpen] = useState(false);
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);

  // Background live feed auto-sync for newly published dispatches
  useEffect(() => {
    // Restore E-Paper editions from IndexedDB if saved
    loadEPaperEditionsFromIndexedDB().then((storedEditions) => {
      if (storedEditions && storedEditions.length > 0) {
        setEpaperEditions(storedEditions);
      }
    });

    // Auto-sync real-time dispatches from live news feed every 60 seconds
    const syncLiveFeed = async () => {
      const feedUrls = [
        'https://thehindcanadiantimes.blogspot.com/feeds/posts/default?alt=json&max-results=500',
        'https://thehindcanadiantimes.blogspot.com/atom.xml?redirect=false&start-index=1&max-results=500',
        'https://www.thehindcanadiantimes.com/feeds/posts/default?alt=json'
      ];
      for (const url of feedUrls) {
        try {
          const livePosts = await fetchLiveNewsFeed(url);
          if (livePosts && livePosts.length > 0) {
            setArticles((prev) => {
              const map = new Map<string, Article>();
              livePosts.forEach((a) => map.set(a.id, a));
              prev.forEach((a) => map.set(a.id, a));
              const merged = Array.from(map.values());
              merged.sort((a, b) => ((b.timestamp || 0) - (a.timestamp || 0)));
              return merged;
            });
            break;
          }
        } catch {}
      }
    };

    syncLiveFeed();
    const interval = setInterval(syncLiveFeed, 60000);
    return () => clearInterval(interval);
  }, []);

  // Sync configuration to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {}
  }, [config]);

  // Persist articles safely to IndexedDB
  useEffect(() => {
    if (articles.length > 0) {
      persistArticles(articles);
    }
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
      prev.map((art) => (art.id === id ? { ...art, likes: (art.likes || 0) + 1 } : art))
    );
  };

  // Filtered Articles based on Category and Search
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const breakingArticle = articles.find((a) => a.isBreaking) || articles[0];
  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const fonts = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  // Dedicated Ads
  const sidebarAd = ads.find((a) => a.placement === 'sidebar') || ads[0];
  const inFeedAd = ads.find((a) => a.placement === 'in_feed') || ads[1] || ads[0];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textPrimary} ${fonts.bodyFont} flex flex-col selection:bg-amber-100 selection:text-amber-900 transition-colors duration-200`}>
      {/* 1. Header: Exactly 3 Buttons: Digital E-Paper, Ad Rates, Theme */}
      <MastheadHeader
        config={config}
        selectedCategory={selectedCategory}
        breakingArticle={breakingArticle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onOpenArticle={setSelectedArticle}
        onOpenEPaper={() => setIsEPaperModalOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. Main News Content Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
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
      </main>

      {/* 3. Footer */}
      <NewsFooter
        config={config}
        onOpenEPaper={() => setIsEPaperModalOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseModalOpen(true)}
      />

      {/* 4. Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          config={config}
          onClose={() => setSelectedArticle(null)}
          onLike={handleLikeArticle}
        />
      )}

      {/* 5. Digital E-Paper Modal */}
      {isEPaperModalOpen && (
        <EPaperModal
          editions={epaperEditions}
          config={config}
          onClose={() => setIsEPaperModalOpen(false)}
        />
      )}

      {/* 6. Media Kit & Ad Rates Modal */}
      {isAdvertiseModalOpen && (
        <AdvertiseMediaKitModal
          config={config}
          onClose={() => setIsAdvertiseModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
