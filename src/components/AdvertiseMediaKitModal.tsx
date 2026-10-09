import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Image,
  Video,
  Sparkles,
  Calculator,
  Send,
  CheckCircle2,
  Check,
  Eye
} from 'lucide-react';
import { AdFormat, AdSlot, MagazineConfig } from '../types';
import { THEME_CONFIGS } from '../utils/themeHelper';

interface AdvertiseMediaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MagazineConfig;
}

export const AdvertiseMediaKitModal: React.FC<AdvertiseMediaKitModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<AdSlot>('leaderboard');
  const [selectedFormat, setSelectedFormat] = useState<AdFormat>('jpg');
  const [weeksDuration, setWeeksDuration] = useState(4);
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [previewHeadline, setPreviewHeadline] = useState('Your Premier Business Brand Here');
  const [previewSubtext, setPreviewSubtext] = useState('Reaching over 85,000 affluent Indo-Canadian readers weekly across Ontario, BC & Alberta');

  if (!isOpen) return null;

  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;

  // Rate calculations
  const baseWeeklyRates: Record<AdSlot, number> = {
    leaderboard: 450,
    sidebar_mpu: 280,
    in_feed: 350,
    super_footer: 220,
  };

  const formatMultiplier: Record<AdFormat, number> = {
    jpg: 1.0,
    gif: 1.2,
    video: 1.45,
  };

  const weeklyRate = Math.round(baseWeeklyRates[selectedSlot] * formatMultiplier[selectedFormat]);
  const totalCost = weeklyRate * weeksDuration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-4xl max-h-[92vh] rounded-2xl border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} shadow-2xl flex flex-col overflow-hidden my-auto`}>
        {/* Header */}
        <div className={`p-4 border-b ${theme.border} ${theme.canvasBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Media Kit, Ad Rate Card &amp; Interactive Simulator
              </h3>
              <p className="text-[11px] text-neutral-500">
                Advertise in JPG, Animated GIF, or Video format across digital editions &amp; print E-Paper
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Rate Card & Demographics Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-center space-y-1">
              <span className="font-mono text-xl font-bold text-red-800 tabular-nums">85,000+</span>
              <p className="text-[11px] text-neutral-600 font-semibold">Weekly Readers (GTA &amp; Metro Vancouver)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-center space-y-1">
              <span className="font-mono text-xl font-bold text-blue-800 tabular-nums">74%</span>
              <p className="text-[11px] text-neutral-600 font-semibold">Homeowners &amp; Business Operators</p>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-center space-y-1">
              <span className="font-mono text-xl font-bold text-emerald-800 tabular-nums">14,000+</span>
              <p className="text-[11px] text-neutral-600 font-semibold">Weekly PDF E-Paper Downloads</p>
            </div>
          </div>

          {/* Ad Calculator & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Campaign Cost Calculator */}
            <div className="lg:col-span-6 p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Interactive Campaign Rate Calculator</span>
              </div>

              {/* Slot Selector */}
              <div>
                <label className="font-semibold block mb-1">Ad Placement Slot</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'leaderboard', label: 'Top Leaderboard (728x90)' },
                    { id: 'sidebar_mpu', label: 'Sidebar MPU (300x250)' },
                    { id: 'in_feed', label: 'In-Feed Native Banner' },
                    { id: 'super_footer', label: 'Footer Super Board' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSlot(s.id as AdSlot)}
                      className={`p-2 rounded-lg border text-left text-[11px] transition-colors ${
                        selectedSlot === s.id
                          ? 'border-red-600 bg-red-50 text-red-900 font-bold'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selector: JPG, GIF, Video */}
              <div>
                <label className="font-semibold block mb-1">Ad Creative Format</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'jpg', label: 'JPG / PNG Image', icon: Image },
                    { id: 'gif', label: 'Animated GIF', icon: Sparkles },
                    { id: 'video', label: 'Video (MP4 / WebM)', icon: Video },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFormat(f.id as AdFormat)}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center text-center gap-1 transition-colors ${
                          selectedFormat === f.id
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                            : 'border-neutral-200 bg-white hover:border-neutral-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[10px]">{f.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Slider */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Campaign Duration: {weeksDuration} Weeks</span>
                  <span className="font-mono text-neutral-500">${weeklyRate}/week</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={weeksDuration}
                  onChange={(e) => setWeeksDuration(parseInt(e.target.value))}
                  className="w-full accent-red-700 cursor-pointer"
                />
              </div>

              {/* Rate Result */}
              <div className="p-3.5 rounded-xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 font-mono block">Estimated Investment</span>
                  <span className="text-xl font-mono font-bold text-amber-400 tabular-nums">
                    ${totalCost.toLocaleString()}.00 CAD
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
                  Includes E-Paper Print Replica
                </span>
              </div>
            </div>

            {/* Right: Live Mockup Simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Live Creative Mockup Simulator</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Brand Headline"
                  value={previewHeadline}
                  onChange={(e) => setPreviewHeadline(e.target.value)}
                  className="w-full p-2 rounded-lg border border-neutral-300 text-xs font-semibold"
                />
                <input
                  type="text"
                  placeholder="Offer subtext / Call to action"
                  value={previewSubtext}
                  onChange={(e) => setPreviewSubtext(e.target.value)}
                  className="w-full p-2 rounded-lg border border-neutral-300 text-xs"
                />
              </div>

              {/* Mockup Frame */}
              <div className="p-4 rounded-xl border border-neutral-300 bg-neutral-100 space-y-2">
                <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                  Rendering: {selectedSlot.toUpperCase()} &middot; {selectedFormat.toUpperCase()} Format
                </span>

                {selectedFormat === 'video' ? (
                  <div className="relative rounded-lg overflow-hidden bg-black aspect-16/9 flex items-center justify-center text-white">
                    <Video className="w-8 h-8 text-red-500 animate-pulse" />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 p-2 rounded text-[11px]">
                      <div className="font-bold text-amber-300">{previewHeadline}</div>
                      <p className="text-[10px] text-neutral-300 truncate">{previewSubtext}</p>
                    </div>
                  </div>
                ) : selectedFormat === 'gif' ? (
                  <div className="rounded-lg bg-gradient-to-r from-red-900 via-rose-900 to-amber-900 p-4 text-white space-y-1">
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono text-amber-200">
                      ANIMATED GIF PREVIEW
                    </span>
                    <div className="text-sm font-bold">{previewHeadline}</div>
                    <p className="text-xs text-neutral-200">{previewSubtext}</p>
                    <button className="mt-1 px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[10px] animate-pulse">
                      Special Promotion &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 flex flex-col justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-amber-900">{previewHeadline}</div>
                      <p className="text-[11px] text-neutral-600">{previewSubtext}</p>
                    </div>
                    <button className="self-start px-3 py-1 rounded bg-amber-800 text-white font-semibold text-[10px]">
                      Contact Now &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Booking Request Form */}
              <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/40 space-y-2.5">
                <span className="font-bold text-neutral-900 text-xs block">
                  Reserve This Space
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Company / Legal Entity"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="p-2 rounded-lg border border-neutral-300 text-xs"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Representative Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="p-2 rounded-lg border border-neutral-300 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs ${theme.accentBg}`}
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Reservation Inquired!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Space Reservation (${totalCost} CAD)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} ${theme.canvasBg} flex justify-between items-center text-xs`}>
          <span className="text-neutral-500 font-mono text-[11px]">
            Direct Advertising Bureau: {config.contactEmail || 'thehindcanadiantimes@gmail.com'}
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-semibold ${theme.accentBg}`}
          >
            Close Media Kit
          </button>
        </div>
      </div>
    </div>
  );
};
