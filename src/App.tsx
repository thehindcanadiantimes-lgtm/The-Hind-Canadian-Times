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
  INITIAL_ARTICLES, 
  INITIAL_EPAPER_EDITIONS, 
  INITIAL_ADS 
} from './data/newsData';
import { THEME_CONFIGS, FONT_CONFIGS } from './utils/themeHelper';
import { fetchLiveNewsFeed } from './utils/bloggerArchiveParser';
import { 
  loadArticlesFromIndexedDB, 
  persistArticles, 
  scanLocalStorageForArticles, 
  loadEPaperEditionsFromIndexedDB, 
  saveEPaperEditionsToIndexedDB,
  getArticleTimestamp 
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

  // Articles state
  const [articles, setArticles] = useState<Article[]>(() => {
    const rescued = scanLocalStorageForArticles();
    if (rescued && rescued.length > 0) {
      rescued.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
      return rescued;
    }
    return INITIAL_ARTICLES;
  });
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

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

  // Load articles on startup: works out-of-the-box on Vercel with 0 dependencies
  useEffect(() => {
    // 1. Load archived articles catalog if present
    fetch('/articles.json')
      .then((res) => res.json())
      .then((archiveArticles) => {
        if (Array.isArray(archiveArticles) && archiveArticles.length > 0) {
          setArticles((prev) => {
            const map = new Map<string, Article>();
            archiveArticles.forEach((a: Article) => map.set(a.id, a));
            prev.forEach((a) => map.set(a.id, a));
            const list = Array.from(map.values());
            list.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
            return list;
          });
        }
        setIsStorageLoaded(true);
      })
      .catch(() => {
        // Fallback cache from IndexedDB
        loadArticlesFromIndexedDB().then((stored) => {
          if (stored && stored.length > 0) {
            setArticles((prev) => {
              const map = new Map<string, Article>();
              stored.forEach((a) => map.set(a.id, a));
              prev.forEach((a) => map.set(a.id, a));
              const list = Array.from(map.values());
              list.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
              return list;
            });
          }
          setIsStorageLoaded(true);
        });
      });

    // Also restore E-Paper editions from IndexedDB
    loadEPaperEditionsFromIndexedDB().then((storedEditions) => {
      if (storedEditions && storedEditions.length > 0) {
        setEpaperEditions(storedEditions);
      }
    });

    // Auto-sync real-time dispatches from live news feed
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
              merged.sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a));
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

  // Persist articles safely to IndexedDB and LocalStorage
  useEffect(() => {
    if (isStorageLoaded && articles.length > 0) {
      persistArticles(articles);
    }
  }, [articles, isStorageLoaded]);

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

  const breakingArticle = articles.find((a) => a.isBreaking);
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
