import React, { useState } from 'react';
import {
  X,
  Share2,
  Heart,
  MessageSquare,
  FileDown,
  Video,
  Printer,
  Check,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Edit3,
  AlignJustify,
  AlignLeft,
  Images
} from 'lucide-react';
import { Article, MagazineConfig } from '../types';
import { THEME_CONFIGS, FONT_CONFIGS } from '../utils/themeHelper';
import { ArticleShareModal } from './ArticleShareModal';
import { ArticlePrintModal } from './ArticlePrintModal';

interface ArticleDetailModalProps {
  article: Article | null;
  config: MagazineConfig;
  onClose: () => void;
  onLike: (id: string) => void;
  onOpenEdit?: (article: Article) => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  config,
  onClose,
  onLike,
  onOpenEdit,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [isJustified, setIsJustified] = useState(article?.isJustified ?? true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Crucial reporting on bilateral trade relations. The pulse tariff stability will protect countless farming communities in Saskatchewan.',
    'Very well researched legal analysis on the healthcare Express Entry draw.',
  ]);

  if (!article) return null;

  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;
  const fonts = FONT_CONFIGS[config.fontMode] || FONT_CONFIGS.editorial_serif;

  const handleOpenPrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [commentInput.trim(), ...prev]);
    setCommentInput('');
  };

  const getTextSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-lg leading-relaxed';
      case 'huge':
        return 'text-xl leading-loose';
      case 'normal':
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-4xl max-h-[92vh] rounded-2xl border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} shadow-2xl flex flex-col overflow-hidden my-auto`}>
        {/* Top Control Bar */}
        <div className={`p-4 border-b ${theme.border} flex items-center justify-between ${theme.canvasBg}`}>
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-bold uppercase tracking-wider ${theme.accentRed}`}>
              {article.category}
            </span>
            <span className="text-neutral-400">&middot;</span>
            <span className="text-neutral-500 font-mono text-[11px]">{article.readTime}</span>
            {article.source && (
              <>
                <span className="text-neutral-400">&middot;</span>
                <span className="text-neutral-500">{article.source}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Font Zoom Controls */}
            <div className="flex items-center border rounded-md p-0.5 border-neutral-300 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-neutral-200 font-bold' : ''}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-neutral-200 font-bold' : ''}`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('huge')}
                className={`px-2 py-0.5 rounded ${fontSize === 'huge' ? 'bg-neutral-200 font-bold' : ''}`}
                title="Huge text size"
              >
                A++
              </button>
            </div>

            {/* Text Alignment */}
            <button
              onClick={() => setIsJustified(!isJustified)}
              className="p-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 text-neutral-600 flex items-center gap-1 transition-colors"
              title={isJustified ? 'Switch to Standard Left Alignment' : 'Switch to Justified Column Alignment (Newspaper Style)'}
            >
              {isJustified ? <AlignJustify className="w-3.5 h-3.5 text-red-700" /> : <AlignLeft className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium hidden md:inline">{isJustified ? 'Justified' : 'Left'}</span>
            </button>

            {/* Edit Article */}
            {onOpenEdit && (
              <button
                onClick={() => onOpenEdit(article)}
                className="p-1.5 rounded-md border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-800 flex items-center gap-1 transition-colors"
                title="Edit Headline, Text, or Photographs"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-[11px] font-semibold hidden sm:inline">Edit Article</span>
              </button>
            )}

            {/* Print and Share */}
            <button
              onClick={handleOpenPrint}
              className="p-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 text-neutral-600 flex items-center gap-1 transition-colors"
              title="Print Article or Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[11px] font-medium hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleOpenShare}
              className="p-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 text-neutral-600 flex items-center gap-1 transition-colors"
              title="Share Article (WhatsApp, X, Facebook, Email, Link)"
            >
              <Share2 className="w-3.5 h-3.5 text-red-700" />
              <span className="text-[11px] font-medium hidden sm:inline text-red-700">Share</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md border border-neutral-300 hover:bg-neutral-100 text-neutral-700"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          {/* Article Header Lockup */}
          <div className="space-y-4 max-w-3xl">
            {article.hindiTitle && (
              <div className="text-base sm:text-lg font-serif font-bold text-amber-800">
                {article.hindiTitle}
              </div>
            )}

            <h1
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${theme.textPrimary} ${fonts.headlineFont} leading-tight`}
            >
              {article.title}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed ${theme.textSecondary} font-serif italic border-l-2 border-red-700 pl-4 py-1`}>
              {article.subtitle}
            </p>

            {/* Byline & Timestamps */}
            <div className={`pt-3 border-t ${theme.border} flex flex-wrap items-center justify-between gap-3 text-xs ${theme.textMuted}`}>
              <div>
                <span className="font-bold text-neutral-900">{article.author}</span>
                {article.authorRole && <span> &mdash; {article.authorRole}</span>}
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  {article.location}
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {article.publishedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.imageUrl && (
            <figure className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 aspect-16/9">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {article.imageCaption && (
                <figcaption className="text-xs text-neutral-500 font-serif italic">
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Multimedia Attachment: Embedded Video Player if present */}
          {article.videoUrl && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800">
                <Video className="w-4 h-4" />
                <span>{article.videoTitle || 'Multimedia Video Coverage'}</span>
              </div>
              <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-black">
                {article.videoUrl.includes('youtube') || article.videoUrl.includes('embed') ? (
                  <iframe
                    src={article.videoUrl}
                    title={article.videoTitle || 'Video Report'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={article.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* Document Attachment: PDF E-Paper / Official Gazette */}
          {article.pdfUrl && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <FileDown className="w-4 h-4 text-blue-700" />
                  <span>Attached Official Document / E-Paper Gazette (PDF)</span>
                </div>
                <p className="text-xs text-neutral-600">
                  {article.pdfTitle || 'Complete press release & official policy docket available for download'}
                </p>
              </div>
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="shrink-0 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          )}

          {/* Main Article Body (Editorial Measure 65-75ch) */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div
              className={`whitespace-pre-line font-serif ${getTextSizeClass()} ${theme.textPrimary} ${
                isJustified ? 'text-justify' : 'text-left'
              } first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1`}
            >
              {article.content}
            </div>

            {/* Additional Photo Gallery */}
            {article.galleryImages && article.galleryImages.length > 0 && (
              <div className="pt-6 border-t border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-neutral-800">
                  <Images className="w-4 h-4 text-red-700" />
                  <span>Photo Gallery &amp; Archival Records ({article.galleryImages.length} Photographs)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {article.galleryImages.map((img, idx) => (
                    <figure key={idx} className="rounded-xl overflow-hidden border border-neutral-300 bg-neutral-100 shadow-2xs space-y-1">
                      <img
                        src={img}
                        alt={article.galleryCaptions?.[idx] || `Photo ${idx + 1}`}
                        className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {article.galleryCaptions?.[idx] && (
                        <figcaption className="p-2 text-[11px] text-neutral-600 font-serif italic border-t border-neutral-200 bg-white">
                          {article.galleryCaptions[idx]}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interaction Bar: Likes & Comments */}
          <div className={`pt-6 border-t ${theme.border} max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs`}>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onLike(article.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-red-500 hover:text-red-600 transition-colors font-mono tabular-nums"
              >
                <Heart className="w-4 h-4 text-red-600 fill-current" />
                <span>{article.likes} Applauds</span>
              </button>

              <button
                onClick={handleOpenShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 font-semibold transition-colors shadow-2xs"
                title="Share via WhatsApp, X, Facebook, Email or Link"
              >
                <Share2 className="w-3.5 h-3.5 text-red-700" />
                <span>Share Story</span>
              </button>

              <button
                onClick={handleOpenPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-medium transition-colors"
                title="Print broadsheet layout or save as text/PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Edition</span>
              </button>

              {onOpenEdit && (
                <button
                  onClick={() => onOpenEdit(article)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition-colors"
                  title="Edit Headline, Text, or Photographs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Article</span>
                </button>
              )}
            </div>

            <span className="text-neutral-500 font-mono text-[11px]">
              {article.views.toLocaleString()} Impressions &middot; {comments.length} Comments
            </span>
          </div>

          {/* Comments Discussion Section */}
          <div className="max-w-2xl mx-auto space-y-4 pt-4 border-t border-dotted border-neutral-300">
            <div className="flex items-center gap-2 text-sm font-bold">
              <MessageSquare className="w-4 h-4 text-neutral-600" />
              <span>Reader Discussion ({comments.length})</span>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your perspective on this report..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className={`flex-1 px-3.5 py-2 rounded-lg border text-xs ${theme.canvasBg} ${theme.border} focus:outline-hidden`}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-xs font-semibold ${theme.accentBg}`}
              >
                Post
              </button>
            </form>

            <div className="space-y-2">
              {comments.map((comm, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-800">
                  <div className="font-semibold text-[11px] text-neutral-600 mb-1">
                    Verified Reader &middot; Just now
                  </div>
                  <p>{comm}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t ${theme.border} ${theme.canvasBg} flex items-center justify-between text-xs`}>
          <span className="text-neutral-500">
            Published by The Hind Canadian Times &middot; Ottawa &amp; Toronto Bureaus
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenShare}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-red-700" />
              <span>Share</span>
            </button>
            <button
              onClick={handleOpenPrint}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${theme.accentBg}`}
            >
              Close Article
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ArticleShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        article={article}
      />

      {/* Print Reader Modal Dialog */}
      <ArticlePrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        article={article}
      />
    </div>
  );
};
