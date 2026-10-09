import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  Calendar,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Article } from '../types';

interface ArticlePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export const ArticlePrintModal: React.FC<ArticlePrintModalProps> = ({
  isOpen,
  onClose,
  article,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  // Safe window.print invocation
  const handleTriggerPrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct window.print error:', err);
    }
  };

  // Download clean formatted text file
  const handleDownloadTextFile = () => {
    try {
      const textContent = `================================================================================
THE HIND CANADIAN TIMES — OFFICIAL ARCHIVE PRINT DISPATCH
Ottawa & Toronto Bureaus | ISSN 1712-4980 | Established 2024
A Multilingual International Magazine | Ontario Reg. No. 44109
================================================================================

TITLE: ${article.title}
${article.hindiTitle ? `HINDI: ${article.hindiTitle}\n` : ''}SUBTITLE: ${article.subtitle}
SECTION: ${article.category.toUpperCase()}
LOCATION: ${article.location}
DATE: ${article.publishedAt}
AUTHOR: ${article.author}${article.authorRole ? ` (${article.authorRole})` : ''}

--------------------------------------------------------------------------------
ARTICLE CONTENT:
--------------------------------------------------------------------------------

${article.content}

--------------------------------------------------------------------------------
© The Hind Canadian Times. All rights reserved. Registered print media.
Published online at: ${typeof window !== 'undefined' ? window.location.origin : 'https://thehindcanadiantimes.com'}
================================================================================`;

      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `HCT_${article.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download text file failed:', err);
    }
  };

  // Copy clean text to clipboard
  const handleCopyText = async () => {
    const textToCopy = `${article.title}\n\n${article.subtitle}\n\nBy ${article.author} | ${article.location} | ${article.publishedAt}\n\n${article.content}\n\n— The Hind Canadian Times`;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-300 overflow-hidden my-auto flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-4 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-700 text-white">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base">Print &amp; Reader Replica</h3>
              <p className="text-[11px] text-neutral-400 font-mono">Clean broadsheet typography formatted for standard letter/A4 paper</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Page (Ctrl+P)</span>
            </button>

            <button
              onClick={handleDownloadTextFile}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download clean text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save .TXT</span>
            </button>

            <button
              onClick={handleCopyText}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Copy text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formatted Printable Newspaper Document */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-6 printable-article bg-[#fffefc] text-black">
          {/* Newspaper Masthead Lockup */}
          <div className="border-b-4 border-black pb-3 text-center space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-600">
              Canadian National Heritage &bull; ESTD. 2024 &bull; Ontario Reg. No. 44109 &bull; ISSN 1712-4980
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl tracking-tight uppercase">
              THE HIND CANADIAN TIMES
            </h1>
            <div className="text-[10px] font-serif font-bold uppercase tracking-widest text-red-800">
              A Multilingual International Magazine &bull; द हिन्द कैनेडियन टाइम्स &bull; ਦ ਹਿੰਦ ਕੈਨੇਡੀਅਨ ਟਾਈਮਜ਼
            </div>
            <div className="flex items-center justify-between border-t border-b border-black py-1 text-[11px] font-mono uppercase tracking-wider text-neutral-800">
              <span>{article.category} Section</span>
              <span>Toronto &bull; Vancouver &bull; Ottawa &bull; U.K. &bull; Chandigarh</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>

          {/* Headline & Standfirst */}
          <div className="space-y-3">
            {article.hindiTitle && (
              <div className="text-base font-serif font-bold text-amber-900">
                {article.hindiTitle}
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-serif font-black leading-tight uppercase tracking-tight text-neutral-900">
              {article.title}
            </h2>
            <p className="text-sm sm:text-base font-serif italic text-neutral-700 leading-relaxed border-l-2 border-black pl-3 py-0.5">
              {article.subtitle}
            </p>
          </div>

          {/* Author Byline & Details */}
          <div className="border-t border-b border-neutral-300 py-2 flex flex-wrap items-center justify-between text-xs font-serif text-neutral-700">
            <div>
              By <strong>{article.author}</strong> {article.authorRole && <span>({article.authorRole})</span>}
            </div>
            <div className="font-mono text-[11px] flex items-center gap-3">
              <span>Dateline: {article.location}</span>
              <span>&bull;</span>
              <span>Source: {article.source || 'The Hind Canadian Times Bureau'}</span>
            </div>
          </div>

          {/* Article Image if present */}
          {article.imageUrl && (
            <div className="space-y-1.5 my-4">
              <div className="max-h-80 overflow-hidden border border-neutral-300">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto object-cover max-h-80 grayscale contrast-125"
                />
              </div>
              {article.imageCaption && (
                <div className="text-[11px] font-serif italic text-neutral-600">
                  Photo &amp; Caption: {article.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Article Text in 2-Column Broadsheet Flow */}
          <div className="font-serif text-sm leading-relaxed text-justify space-y-4 pt-2 sm:columns-2 sm:gap-8">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                className={idx === 0 ? 'first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer Notice */}
          <div className="border-t-2 border-black pt-3 mt-8 flex flex-wrap items-center justify-between text-[10px] font-mono text-neutral-600">
            <span>The Hind Canadian Times &copy; {new Date().getFullYear()}</span>
            <span>Printed via Digital Reader &bull; thehindcanadiantimes.com</span>
            <span>Archived with National Library of Canada</span>
          </div>
        </div>

        {/* Bottom Action Footer (Hidden during print) */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-300 flex items-center justify-between text-xs print:hidden">
          <span className="text-neutral-500 font-mono text-[11px]">
            Tip: Select "Save as PDF" in your print dialog to save as high-resolution PDF
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
