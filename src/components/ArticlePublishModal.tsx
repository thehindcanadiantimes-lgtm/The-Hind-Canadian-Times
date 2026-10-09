import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image,
  Video,
  FileText,
  FileDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  AlignJustify,
  AlignLeft,
  Wand2,
  ImagePlus,
  Eye,
  Check
} from 'lucide-react';
import { Article, NewsCategory, MagazineConfig } from '../types';
import { THEME_CONFIGS } from '../utils/themeHelper';

interface ArticlePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MagazineConfig;
  onPublishArticle: (article: Article) => void;
  editingArticle?: Article | null;
}

const CATEGORIES: NewsCategory[] = [
  'Canada',
  'India',
  'Immigration',
  'Business',
  'Diaspora & Community',
  'Opinion & Editorial',
  'Arts & Culture',
  'Sports',
];

export const ArticlePublishModal: React.FC<ArticlePublishModalProps> = ({
  isOpen,
  onClose,
  config,
  onPublishArticle,
  editingArticle,
}) => {
  const [title, setTitle] = useState('');
  const [hindiTitle, setHindiTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<NewsCategory>('Canada');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Toronto, ON');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/newspaper_masthead_hero_1791385485215.jpg');
  const [imageCaption, setImageCaption] = useState('');
  
  // Multi-photo gallery attachments
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>([]);
  
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfTitle, setPdfTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Justification & typography controls
  const [isJustified, setIsJustified] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [formatSuccess, setFormatSuccess] = useState(false);
  
  const [isBreaking, setIsBreaking] = useState(false);
  const [isLeadStory, setIsLeadStory] = useState(false);
  const [success, setSuccess] = useState(false);

  // Prepopulate when editing an existing article
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setHindiTitle(editingArticle.hindiTitle || '');
      setSubtitle(editingArticle.subtitle || '');
      setCategory(editingArticle.category || 'Canada');
      setAuthor(editingArticle.author || '');
      setLocation(editingArticle.location || 'Toronto, ON');
      setImageUrl(editingArticle.imageUrl || '');
      setImageCaption(editingArticle.imageCaption || '');
      setGalleryImages(editingArticle.galleryImages || []);
      setGalleryCaptions(editingArticle.galleryCaptions || []);
      setVideoUrl(editingArticle.videoUrl || '');
      setVideoTitle(editingArticle.videoTitle || '');
      setPdfUrl(editingArticle.pdfUrl || '');
      setPdfTitle(editingArticle.pdfTitle || '');
      setContent(editingArticle.content || '');
      setIsJustified(editingArticle.isJustified ?? true);
      setIsBreaking(!!editingArticle.isBreaking);
      setIsLeadStory(!!editingArticle.isLeadStory);
    } else {
      // Defaults for brand new article
      setTitle('');
      setHindiTitle('');
      setSubtitle('');
      setCategory('Canada');
      setAuthor('Editorial Staff, The Hind Canadian Times');
      setLocation('Toronto, ON');
      setImageUrl('/src/assets/images/newspaper_masthead_hero_1791385485215.jpg');
      setImageCaption('');
      setGalleryImages([]);
      setGalleryCaptions([]);
      setVideoUrl('');
      setVideoTitle('');
      setPdfUrl('');
      setPdfTitle('');
      setContent('');
      setIsJustified(true);
      setIsBreaking(false);
      setIsLeadStory(false);
    }
  }, [editingArticle, isOpen]);

  if (!isOpen) return null;

  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;

  // Handle single main featured image upload (convert to persistent DataURL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple photographs upload
  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setGalleryImages((prev) => [...prev, dataUrl]);
          setGalleryCaptions((prev) => [...prev, file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove photo from gallery
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  // Update specific gallery image caption
  const handleGalleryCaptionChange = (index: number, newCap: string) => {
    setGalleryCaptions((prev) => {
      const updated = [...prev];
      updated[index] = newCap;
      return updated;
    });
  };

  // Handle PDF file upload
  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPdfUrl(event.target.result as string);
          setPdfTitle(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Video file upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setVideoTitle(file.name);
    }
  };

  // Clean & Justify space between words and paragraphs automatically
  const handleCleanAndFormatSpacing = () => {
    if (!content) return;

    let text = content;

    // 1. Normalize line endings
    text = text.replace(/\r\n/g, '\n');

    // 2. Trim trailing spaces from each line
    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t]+$/g, ''))
      .join('\n');

    // 3. Collapse multiple consecutive spaces between words down to a single space (preserving line breaks)
    text = text
      .split('\n')
      .map((line) => line.replace(/[ \t]{2,}/g, ' '))
      .join('\n');

    // 4. Ensure clean single space after standard sentence punctuation if followed immediately by letter
    text = text.replace(/([.,!?:;])([A-Za-z\u0900-\u097F\u0A00-\u0A7F])/g, '$1 $2');

    // 5. Standardize paragraph spacing: exactly two line breaks between paragraphs
    text = text.replace(/\n{3,}/g, '\n\n');

    // 6. Ensure deck/subtitle has clean single spacing too
    if (subtitle) {
      setSubtitle(subtitle.replace(/[ \t]{2,}/g, ' ').trim());
    }

    setContent(text.trim());
    setIsJustified(true);
    setFormatSuccess(true);
    setTimeout(() => setFormatSuccess(false), 3000);
  };

  // Word & Paragraph count metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const paragraphCount = content.trim() ? content.trim().split(/\n\s*\n/).filter(Boolean).length : 0;
  const estimatedReadMinutes = Math.max(1, Math.round(wordCount / 160));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const baseArticle: Article = {
      id: editingArticle?.id || `art-user-${Date.now()}`,
      title: title.trim(),
      hindiTitle: hindiTitle.trim() || undefined,
      subtitle: subtitle.trim() || title.trim(),
      category,
      author: author.trim() || 'Editorial Staff, The Hind Canadian Times',
      authorRole: editingArticle?.authorRole || 'Community Bureau Correspondent',
      location: location.trim() || 'Toronto, ON',
      publishedAt: editingArticle?.publishedAt || 'Today (Updated Edition)',
      readTime: `${estimatedReadMinutes} min read`,
      summary: subtitle.trim() || content.slice(0, 160) + '...',
      content: content.trim(),
      imageUrl: imageUrl || undefined,
      imageCaption: imageCaption.trim() || undefined,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      galleryCaptions: galleryCaptions.length > 0 ? galleryCaptions : undefined,
      isJustified,
      videoUrl: videoUrl.trim() || undefined,
      videoTitle: videoTitle.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
      pdfTitle: pdfTitle.trim() || undefined,
      isBreaking,
      isLeadStory,
      views: editingArticle?.views || 1,
      likes: editingArticle?.likes || 1,
      commentsCount: editingArticle?.commentsCount || 0,
      source: editingArticle?.source || 'Editorial Staff',
      timestamp: editingArticle?.timestamp || Date.now(),
    };

    onPublishArticle(baseArticle);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-4xl max-h-[94vh] rounded-2xl border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} shadow-2xl flex flex-col overflow-hidden my-auto`}>
        {/* Header */}
        <div className={`p-4 border-b ${theme.border} ${theme.canvasBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif">
                {editingArticle ? 'Edit Article & Manage Photographs' : 'Publish News Article & Multimedia (Images, Video, PDF)'}
              </h2>
              <p className="text-[11px] text-neutral-500 font-mono">
                The Hind Canadian Times &middot; International Multilingual Publishing Desk
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-neutral-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {success ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold font-serif text-emerald-800">
                {editingArticle ? 'Article Updated Successfully!' : 'Article Successfully Published to The Hind Canadian Times!'}
              </h3>
              <p className="text-neutral-500">Live instantly across all newspaper columns and digital archive portals.</p>
            </div>
          ) : (
            <>
              {/* Category, Location & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">News Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsCategory)}
                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.canvasBg} font-medium`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Author / Byline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaswinder K. Sidhu"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.canvasBg}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Filing Location / Bureau</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toronto, ON · London, U.K. · Chandigarh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.canvasBg}`}
                  />
                </div>
              </div>

              {/* Title & Hindi Title */}
              <div className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">Headline (English)</label>
                  <input
                    type="text"
                    required
                    placeholder="Lead headline for the newspaper..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border font-serif text-sm font-bold ${theme.border} ${theme.canvasBg}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Bilingual Headline (Hindi / Punjabi / Optional)</label>
                  <input
                    type="text"
                    placeholder="हिंदी या ਪੰਜਾਬੀ शीर्षक (वैकल्पिक)..."
                    value={hindiTitle}
                    onChange={(e) => setHindiTitle(e.target.value)}
                    className={`w-full p-2 rounded-lg border font-serif ${theme.border} ${theme.canvasBg}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Deck / Standfirst (Sub-headline)</label>
                  <input
                    type="text"
                    placeholder="Brief 1-2 sentence contextual summary..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className={`w-full p-2 rounded-lg border ${theme.border} ${theme.canvasBg}`}
                  />
                </div>
              </div>

              {/* Photographs & Multimedia Assets Grid */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-50/70 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <ImagePlus className="w-4 h-4 text-red-700" />
                    <span>Photographs &amp; Multimedia Attachments</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Attach unlimited photos</span>
                </div>

                {/* 1. Main Featured Photo */}
                <div className="space-y-2 p-3 bg-white rounded-lg border border-neutral-200">
                  <label className="font-semibold flex items-center gap-1.5 text-neutral-800">
                    <Image className="w-3.5 h-3.5 text-blue-600" />
                    <span>Primary Featured Cover Photo</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className={`flex-1 min-w-[200px] p-1.5 rounded-md border ${theme.border} text-xs`}
                    />
                  </div>
                  {imageUrl && (
                    <div className="flex items-center gap-3 pt-1">
                      <img src={imageUrl} alt="Cover Preview" className="w-16 h-12 object-cover rounded border border-neutral-300" />
                      <input
                        type="text"
                        placeholder="Cover caption & photo credit (e.g. Photo: Canadian Press / HCT)"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        className={`flex-1 p-1.5 rounded-md border ${theme.border} text-xs`}
                      />
                    </div>
                  )}
                </div>

                {/* 2. Additional Photographs Gallery (Attach More Photos) */}
                <div className="space-y-3 p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-semibold flex items-center gap-1.5 text-neutral-800">
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Additional Photographs (Photo Gallery)</span>
                      </label>
                      <p className="text-[11px] text-neutral-500">
                        Upload additional field photos, event pictures, or historical documents to display inside the article.
                      </p>
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer flex items-center gap-1 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Attach Photos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMultipleImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="p-2 rounded-lg border border-neutral-200 bg-neutral-50 flex items-start gap-2 relative group">
                          <img
                            src={img}
                            alt={`Gallery item ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded border border-neutral-300 shrink-0"
                          />
                          <div className="flex-1 space-y-1">
                            <span className="text-[10px] font-mono text-neutral-500">Photo {idx + 1}</span>
                            <input
                              type="text"
                              placeholder="Photo caption / credit..."
                              value={galleryCaptions[idx] || ''}
                              onChange={(e) => handleGalleryCaptionChange(idx, e.target.value)}
                              className="w-full p-1 text-xs border rounded bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="p-1 text-neutral-400 hover:text-red-600 transition-colors"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Video Coverage */}
                <div className="space-y-2 p-3 bg-white rounded-lg border border-neutral-200">
                  <label className="font-semibold flex items-center gap-1.5 text-neutral-800">
                    <Video className="w-3.5 h-3.5 text-red-600" />
                    <span>Embedded Video (YouTube, MP4, Vimeo)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-800 file:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Or paste video embed URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className={`flex-1 min-w-[200px] p-1.5 rounded-md border ${theme.border} text-xs`}
                    />
                  </div>
                </div>

                {/* 4. PDF Document / E-Paper Attachment */}
                <div className="space-y-2 p-3 bg-white rounded-lg border border-neutral-200">
                  <label className="font-semibold flex items-center gap-1.5 text-neutral-800">
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Document Attachment / E-Paper Gazette (PDF)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfFileChange}
                      className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-800 file:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Or paste PDF document URL"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className={`flex-1 min-w-[200px] p-1.5 rounded-md border ${theme.border} text-xs`}
                    />
                  </div>
                  {pdfTitle && (
                    <span className="text-[11px] text-emerald-700 font-mono block">
                      Attached Document: {pdfTitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Main Article Body & Paragraph Formatting Toolbar */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <label className="font-semibold text-neutral-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-red-700" />
                    <span>Article Body &amp; Paragraph Composition</span>
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Auto-Format & Justify Spacing Tool */}
                    <button
                      type="button"
                      onClick={handleCleanAndFormatSpacing}
                      className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-xs flex items-center gap-1 transition-colors"
                      title="Automatically clean up double spaces between words and standardize paragraph breaks"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Clean &amp; Justify Spacing</span>
                    </button>

                    {/* Text Alignment Toggle */}
                    <div className="flex items-center border border-neutral-300 rounded-md p-0.5 bg-neutral-100">
                      <button
                        type="button"
                        onClick={() => setIsJustified(true)}
                        className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors ${
                          isJustified ? 'bg-white font-bold text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-black'
                        }`}
                        title="Justify text: spaces words evenly across lines like printed newspaper columns"
                      >
                        <AlignJustify className="w-3.5 h-3.5 text-red-700" />
                        <span>Justified</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsJustified(false)}
                        className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 transition-colors ${
                          !isJustified ? 'bg-white font-bold text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-black'
                        }`}
                        title="Left-aligned: standard ragged-right text"
                      >
                        <AlignLeft className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Left</span>
                      </button>
                    </div>

                    {/* Preview Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className={`px-2 py-1 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                        showPreview ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-300 hover:bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Hide Preview' : 'Newspaper Preview'}</span>
                    </button>
                  </div>
                </div>

                {/* Spacing optimization banner */}
                {formatSuccess && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Spaces between words and paragraph breaks have been normalized for print &amp; digital broadsheet layout!</span>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  rows={9}
                  required
                  placeholder="Draft or paste the complete report, investigative findings, or dispatch..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full p-3 rounded-lg border font-serif text-sm leading-relaxed ${
                    isJustified ? 'text-justify' : 'text-left'
                  } ${theme.border} ${theme.canvasBg}`}
                />

                {/* Word metrics & spacing guidelines bar */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 font-mono px-1">
                  <div className="flex items-center gap-3">
                    <span>{wordCount} words</span>
                    <span>&middot;</span>
                    <span>{paragraphCount} paragraphs</span>
                    <span>&middot;</span>
                    <span>~{estimatedReadMinutes} min read</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {isJustified ? 'Alignment: Justified (Newspaper Columns)' : 'Alignment: Left-Aligned'}
                  </span>
                </div>

                {/* Live Newspaper Justification Preview */}
                {showPreview && (
                  <div className="mt-3 p-5 rounded-xl border border-neutral-300 bg-[#fffdfa] shadow-inner space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 text-xs font-serif text-neutral-600">
                      <span className="font-bold uppercase tracking-wider text-red-900">Live Typography &amp; Spacing Preview</span>
                      <span className="font-mono text-[10px]">{isJustified ? 'Justified Spacing Active' : 'Left Aligned'}</span>
                    </div>
                    <h3 className="font-serif font-black text-lg text-neutral-900 leading-tight">
                      {title || 'Article Headline Preview'}
                    </h3>
                    <p className="font-serif italic text-xs text-neutral-600 border-l-2 border-black pl-2">
                      {subtitle || 'Sub-headline preview text...'}
                    </p>
                    <div
                      className={`font-serif text-sm leading-relaxed text-neutral-900 whitespace-pre-line ${
                        isJustified ? 'text-justify' : 'text-left'
                      }`}
                    >
                      {content || 'Your paragraph text will appear here formatted with clean word spacing and paragraph indentation.'}
                    </div>
                  </div>
                )}
              </div>

              {/* Publication Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span className="font-semibold text-red-600">Flash as Breaking News Ribbon</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLeadStory}
                    onChange={(e) => setIsLeadStory(e.target.checked)}
                    className="accent-red-600 rounded"
                  />
                  <span className="font-semibold text-neutral-800">Pin to Hero Lead Story</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-300 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-bold text-white shadow-md transition-colors ${theme.accentBg}`}
                >
                  {editingArticle ? 'Save & Update Article' : 'Publish Article Live'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
