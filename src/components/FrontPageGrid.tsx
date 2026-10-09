import React, { useState } from 'react';
import {
  Video,
  FileDown,
  FileText,
  Heart,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Share2,
  Printer
} from 'lucide-react';
import { Article, MagazineConfig, Advertisement } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../utils/themeHelper';
import { AdBanner } from './AdBanner';
import { ArticleShareModal } from './ArticleShareModal';
import { ArticlePrintModal } from './ArticlePrintModal';

interface FrontPageGridProps {
  articles: Article[];
  config: MagazineConfig;
  sidebarAd: Advertisement;
  inFeedAd: Advertisement;
  onOpenArticle: (art: Article) => void;
  onOpenEPaper: () => void;
  onOpenAdKit: () => void;
  onLikeArticle: (id: string) => void;
}

export const FrontPageGrid: React.FC<FrontPageGridProps> = ({
  articles,
  config,
  sidebarAd,
  inFeedAd,
  onOpenArticle,
  onOpenEPaper,
  onOpenAdKit,
  onLikeArticle,
}) => {
  const [shareArticle, setShareArticle] = useState<Article | null>(null);
  const [printArticle, setPrintArticle] = useState<Article | null>(null);

  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const fonts = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  // The lead story is the newest, freshest top story (articles[0])
  const leadStory = articles[0] || null;
  const secondaryStories = articles.filter((a) => a.id !== leadStory?.id).slice(0, 3);
  const remainingStories = articles.filter((a) => a.id !== leadStory?.id).slice(3);

  return (
    <div className="space-y-10">
      {/* 3-Tier Front Page Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Tier 1 Lead Story + Tier 2 Secondary Features */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tier 1: Lead Story */}
          {leadStory && (
            <article
              onClick={() => onOpenArticle(leadStory)}
              className={`group cursor-pointer rounded-2xl border ${theme.border} ${theme.surfaceBg} p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md space-y-5`}
            >
              {/* Unboxed Metadata Strip - Zero-Pill Discipline */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-black uppercase tracking-wider ${theme.accentRed}`}>
                    {leadStory.category}
                  </span>
                  <span className="text-neutral-300">&middot;</span>
                  <span className="font-mono text-neutral-500 text-[11px]">{leadStory.location}</span>
                  <span className="text-neutral-300">&middot;</span>
                  <span className="text-neutral-500 font-mono text-[11px]">{leadStory.readTime}</span>
                </div>

                <div className="flex items-center gap-2">
                  {leadStory.videoUrl && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </span>
                  )}
                  {leadStory.pdfUrl && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      <FileDown className="w-3 h-3" />
                      <span>PDF Brief</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Hindi Title if present */}
              {leadStory.hindiTitle && (
                <div className="text-sm font-serif font-bold text-amber-800">
                  {leadStory.hindiTitle}
                </div>
              )}

              {/* Dominant Headline */}
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${theme.textPrimary} ${fonts.headlineFont} leading-tight group-hover:${theme.accentRed} transition-colors [text-wrap:balance]`}
              >
                {leadStory.title}
              </h2>

              {/* Lead Image */}
              {leadStory.imageUrl && (
                <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-neutral-900 border border-neutral-200">
                  <img
                    src={leadStory.imageUrl}
                    alt={leadStory.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  {leadStory.imageCaption && (
                    <div className="absolute bottom-2 left-3 right-3 text-[11px] text-neutral-200 font-serif italic truncate">
                      {leadStory.imageCaption}
                    </div>
                  )}
                </div>
              )}

              {/* Subtitle / Standfirst */}
              <p className={`text-base leading-relaxed ${theme.textSecondary} font-serif line-clamp-3`}>
                {leadStory.subtitle}
              </p>

              {/* Card Footer */}
              <div className={`pt-4 border-t ${theme.border} flex items-center justify-between text-xs text-neutral-500`}>
                <div className="font-serif">
                  By <strong className="text-neutral-900">{leadStory.author}</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareArticle(leadStory);
                    }}
                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-red-700 transition-colors flex items-center gap-1"
                    title="Share story (WhatsApp, X, Facebook, Email, Link)"
                  >
                    <Share2 className="w-3.5 h-3.5 text-red-700" />
                    <span className="hidden sm:inline text-[11px] font-semibold text-red-700">Share</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrintArticle(leadStory);
                    }}
                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-black transition-colors flex items-center gap-1"
                    title="Print story or save text"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Print</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeArticle(leadStory.id);
                    }}
                    className="flex items-center gap-1 hover:text-red-600 font-mono text-xs tabular-nums"
                  >
                    <Heart className="w-3.5 h-3.5 hover:fill-current" />
                    <span>{leadStory.likes}</span>
                  </button>
                  <span className="font-mono text-[11px]">{leadStory.publishedAt}</span>
                </div>
              </div>
            </article>
          )}

          {/* Tier 2: Secondary Feature Stories (3-in-a-row or stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryStories.map((art) => (
              <article
                key={art.id}
                onClick={() => onOpenArticle(art)}
                className={`group cursor-pointer rounded-xl border ${theme.border} ${theme.surfaceBg} p-5 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all`}
              >
                <div>
                  {/* Thumbnail if present */}
                  {art.imageUrl && (
                    <div className="rounded-lg overflow-hidden aspect-16/10 mb-3 bg-neutral-100 border border-neutral-200">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mb-2">
                    <span className={`font-bold uppercase ${theme.accentRed}`}>{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className={`text-base font-bold font-serif leading-snug ${theme.textPrimary} group-hover:${theme.accentRed} transition-colors line-clamp-3`}>
                    {art.title}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed font-serif">
                    {art.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>{art.location}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareArticle(art);
                      }}
                      className="p-1 rounded hover:text-red-700 transition-colors"
                      title="Share story"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrintArticle(art);
                      }}
                      className="p-1 rounded hover:text-black transition-colors"
                      title="Print story"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />
                      <span>{art.likes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* In-Feed Multimedia Advertisement */}
          {config.showInFeedAd && inFeedAd && (
            <AdBanner ad={inFeedAd} onOpenAdKit={onOpenAdKit} />
          )}

          {/* Remaining Newsroom Columns */}
          {remainingStories.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-neutral-300">
              <h3 className="text-lg font-bold font-serif text-neutral-900 border-b border-black pb-1 uppercase tracking-tight">
                More Dispatches &amp; Investigative Columns
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {remainingStories.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => onOpenArticle(art)}
                    className={`p-4 rounded-xl border ${theme.border} ${theme.surfaceBg} cursor-pointer hover:border-neutral-400 transition-colors flex gap-4`}
                  >
                    {art.imageUrl && (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-24 h-24 object-cover rounded-lg shrink-0 border border-neutral-200"
                      />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.accentRed}`}>
                          {art.category}
                        </span>
                        <h4 className="text-sm font-bold font-serif leading-snug mt-0.5 line-clamp-2 group-hover:underline">
                          {art.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-2">
                        <span>{art.author.split(' ')[0]}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrintArticle(art);
                            }}
                            className="p-1 hover:text-neutral-900 text-neutral-400 hover:scale-110 transition-all"
                            title="Print Article"
                          >
                            <Printer className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareArticle(art);
                            }}
                            className="p-1 hover:text-red-700 text-neutral-400 hover:scale-110 transition-all"
                            title="Share Article"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                          <span>{art.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column (4 cols): E-Paper Promo, MPU Ad, Trending & Opinion Desk */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Digital E-Paper Broadsheet Showcase Card */}
          <div className="p-6 rounded-2xl border-2 border-red-800 bg-gradient-to-b from-red-950 to-neutral-950 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-300 bg-red-900/60 px-2 py-0.5 rounded">
                Weekly Broadsheet PDF
              </span>
              <FileText className="w-4 h-4 text-amber-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif tracking-tight text-neutral-100">
                The Hind Canadian Times
              </h3>
              <p className="text-xs text-neutral-300 font-serif italic mt-1">
                Complete digital print replica with 4 full broadsheet pages &amp; verified legal classifieds.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/10 border border-white/10 text-xs space-y-1">
              <div className="flex justify-between text-neutral-300">
                <span>Latest Volume:</span>
                <span className="font-mono text-white font-bold">Vol. XXVI Issue 14</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Publication Date:</span>
                <span className="font-mono text-white">October 07, 2026</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Format:</span>
                <span className="font-mono text-amber-300">Print Vector PDF</span>
              </div>
            </div>

            <button
              onClick={onOpenEPaper}
              className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              <span>Read E-Paper Online</span>
            </button>
          </div>

          {/* 2. Sidebar MPU Advertisement (GIF / JPG / Video) */}
          {config.showSidebarAd && sidebarAd && (
            <AdBanner ad={sidebarAd} onOpenAdKit={onOpenAdKit} />
          )}

          {/* 3. Trending Dispatches & Editorial Commentary */}
          <div className={`p-5 rounded-2xl border ${theme.border} ${theme.surfaceBg} space-y-4 shadow-2xs`}>
            <div className="flex items-center justify-between border-b border-black pb-2">
              <h3 className="font-serif font-black text-sm uppercase tracking-tight text-neutral-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>Trending &amp; Most Read</span>
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">Live Traffic</span>
            </div>

            <div className="space-y-3">
              {articles.slice(0, 4).map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => onOpenArticle(art)}
                  className="cursor-pointer group flex items-start gap-3 py-1.5 border-b border-neutral-100 last:border-0"
                >
                  <span className="font-mono font-bold text-xl text-neutral-300 group-hover:text-red-700 transition-colors w-6 shrink-0">
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-red-700 uppercase">
                      {art.category}
                    </span>
                    <h4 className="text-xs font-bold font-serif leading-snug text-neutral-900 group-hover:text-red-800 transition-colors line-clamp-2">
                      {art.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      {art.views.toLocaleString()} reads &middot; {art.publishedAt.split('·')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Bureau Contacts & Editorial Inquiries */}
          <div className={`p-5 rounded-2xl border ${theme.border} ${theme.canvasBg} space-y-2 text-xs`}>
            <h4 className="font-bold font-serif text-sm text-neutral-900">
              Community Bureau &amp; Editorial Inquiries
            </h4>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Have a news tip, investigative lead, or community press release from Ontario, BC, Alberta, U.K., or Punjab?
            </p>
            <div className="pt-2 text-neutral-700 font-mono text-[11px] space-y-1.5">
              <div>
                Editorial Desk:{' '}
                <a
                  href={`mailto:${config.contactEmail || 'thehindcanadiantimes@gmail.com'}`}
                  className="font-bold text-red-800 hover:underline"
                >
                  {config.contactEmail || 'thehindcanadiantimes@gmail.com'}
                </a>
              </div>
              <div className="text-[10px] text-neutral-500 font-sans">
                Submissions &amp; Press Releases &middot; Global Diaspora Newsroom
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Share Modal Dialog */}
      {shareArticle && (
        <ArticleShareModal
          isOpen={!!shareArticle}
          onClose={() => setShareArticle(null)}
          article={shareArticle}
        />
      )}

      {/* Quick Print Modal Dialog */}
      {printArticle && (
        <ArticlePrintModal
          isOpen={!!printArticle}
          onClose={() => setPrintArticle(null)}
          article={printArticle}
        />
      )}
    </div>
  );
};
