export type NewsCategory =
  | 'Canada'
  | 'India'
  | 'Immigration'
  | 'Business'
  | 'Diaspora & Community'
  | 'Opinion & Editorial'
  | 'Arts & Culture'
  | 'Sports';

export interface Article {
  id: string;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  category: NewsCategory;
  author: string;
  authorRole?: string;
  location: string;
  publishedAt: string;
  readTime: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  galleryImages?: string[];
  galleryCaptions?: string[];
  isJustified?: boolean;
  videoUrl?: string;
  videoTitle?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  isBreaking?: boolean;
  isLeadStory?: boolean;
  isTrending?: boolean;
  views: number;
  likes: number;
  commentsCount: number;
  source?: 'Editorial Staff' | 'Archived Dispatch' | 'Blogger Transfer' | 'Community Contributor' | 'Press Wire';
  timestamp?: number;
}

export interface EPaperPage {
  pageNumber: number;
  title: string;
  headline: string;
  summary: string;
  previewImageUrl?: string;
}

export interface EPaperEdition {
  id: string;
  title: string;
  volumeIssue: string;
  date: string;
  coverImageUrl: string;
  pdfUrl: string;
  totalPages: number;
  pages: EPaperPage[];
  fileSize: string;
  downloadsCount: number;
  isUserUploaded?: boolean;
  pdfDataUrl?: string;
  pdfFileName?: string;
}

export type AdFormat = 'jpg' | 'gif' | 'video';
export type AdSlot = 'leaderboard' | 'sidebar_mpu' | 'in_feed' | 'super_footer';

export interface Advertisement {
  id: string;
  slot: AdSlot;
  format: AdFormat;
  mediaUrl: string;
  advertiser: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  targetUrl: string;
  isActive: boolean;
}

export interface BloggerImportItem {
  id: string;
  title: string;
  snippet: string;
  author: string;
  publishedDate: string;
  originalUrl: string;
  contentHtml: string;
  imageUrl?: string;
  category: NewsCategory;
  tags: string[];
}

export type ThemePreset = 'broadsheet' | 'crimson_maple' | 'royal_navy' | 'dark_newsroom' | 'forest_dispatch';
export type FontMode = 'editorial_serif' | 'modern_grotesk' | 'classic_broadsheet';

export interface MagazineConfig {
  publicationName: string;
  tagline: string;
  motto: string;
  establishedYear: number;
  editionLocation: string;
  theme: ThemePreset;
  fontMode: FontMode;
  showBreakingTicker: boolean;
  showLeaderboardAd: boolean;
  showSidebarAd: boolean;
  showInFeedAd: boolean;
  ePaperEnabled: boolean;
  videoDeskEnabled: boolean;
  bloggerTransferEnabled: boolean;
  contactEmail: string;
  editorialPhone: string;
}
