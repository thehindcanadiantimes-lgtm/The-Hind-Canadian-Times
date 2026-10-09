import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  Mail,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Article } from '../types';

interface ArticleShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export const ArticleShareModal: React.FC<ArticleShareModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFullText, setCopiedFullText] = useState(false);

  if (!isOpen || !article) return null;

  // Build clean canonical share URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://thehindcanadiantimes.com';
  const shareUrl = `${baseUrl}/#article-${article.id}`;
  const shareTitle = article.title;
  const shareSummary = `${article.title}\n\n${article.subtitle}\n\nRead full story on The Hind Canadian Times:\n${shareUrl}`;

  // Robust multi-fallback clipboard copy
  const handleCopy = async (textToCopy: string, isFullText = false) => {
    let succeeded = false;

    // Method 1: Modern Clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    // Method 2: Fallback textarea execCommand
    if (!succeeded) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        succeeded = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        console.warn('Fallback copy failed:', err);
      }
    }

    if (isFullText) {
      setCopiedFullText(true);
      setTimeout(() => setCopiedFullText(false), 2500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Native Web Share API if supported
  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: article.subtitle,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User cancelled or share dismissed
      }
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-700 text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">Share Article</h3>
              <p className="text-xs text-neutral-400 font-mono">The Hind Canadian Times &middot; Ottawa Bureau</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Article Summary Capsule */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-800 mb-1">
            {article.category}
          </div>
          <h4 className="font-serif font-bold text-sm text-neutral-900 leading-snug line-clamp-2">
            {article.title}
          </h4>
          <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-serif">
            {article.subtitle}
          </p>
        </div>

        {/* Share Channels */}
        <div className="p-4 sm:p-6 space-y-5 text-xs">
          {/* Quick Social Share Buttons */}
          <div>
            <div className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px] mb-3">
              Share to Platform
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareSummary)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px]">WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-medium transition-all group"
              >
                <span className="font-mono text-base font-black mb-1 group-hover:scale-110 transition-transform">𝕏</span>
                <span className="text-[11px]">X (Twitter)</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium transition-all group"
              >
                <span className="font-serif font-black text-base text-blue-700 mb-1 group-hover:scale-110 transition-transform">f</span>
                <span className="text-[11px]">Facebook</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:?subject=${encodeURIComponent(article.title + ' — The Hind Canadian Times')}&body=${encodeURIComponent(shareSummary)}`}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium transition-all group"
              >
                <Mail className="w-5 h-5 text-amber-700 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px]">Email Dispatch</span>
              </a>
            </div>
          </div>

          {/* Copy Link Strip */}
          <div className="space-y-1.5">
            <label className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px] block">
              Direct Article Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 p-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-800 font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-red-600 select-all"
              />
              <button
                onClick={() => handleCopy(shareUrl, false)}
                className={`px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-800 hover:bg-red-900 text-white shadow-xs'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Share Options */}
          <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => handleCopy(`${article.title}\n\n${article.subtitle}\n\n${article.content}\n\n— The Hind Canadian Times\n${shareUrl}`, true)}
              className="text-xs text-neutral-600 hover:text-black flex items-center gap-1.5 p-1 rounded hover:bg-neutral-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-neutral-500" />
              <span>{copiedFullText ? '✓ Full Story Copied!' : 'Copy Full Headline & Story'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="text-xs text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Share via Phone / Device...</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 text-center">
          <p className="text-[11px] text-neutral-500 font-serif">
            Free & open journalism &middot; Verified digital distribution from The Hind Canadian Times
          </p>
        </div>
      </div>
    </div>
  );
};
