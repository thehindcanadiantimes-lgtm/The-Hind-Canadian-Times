import React from 'react';
import { ExternalLink, Video, Sparkles, Info } from 'lucide-react';
import { Advertisement } from '../types';

interface AdBannerProps {
  ad: Advertisement;
  onOpenAdKit: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, onOpenAdKit }) => {
  if (!ad || !ad.isActive) return null;

  const isLeaderboard = ad.slot === 'leaderboard';
  const isSidebar = ad.slot === 'sidebar_mpu';
  const isInFeed = ad.slot === 'in_feed';

  return (
    <aside
      aria-label={`Advertisement: ${ad.advertiser}`}
      className={`relative w-full rounded-xl overflow-hidden border border-neutral-300 bg-neutral-50 shadow-xs my-4 group ${
        isLeaderboard ? 'max-w-5xl mx-auto py-2 px-3' : isSidebar ? 'p-3' : 'p-4'
      }`}
    >
      {/* Ad Label & Advertiser Info */}
      <div className="flex items-center justify-between text-[10px] text-neutral-600 uppercase font-mono tracking-wider mb-2">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Sponsored &middot; {ad.format.toUpperCase()} Ad Slot
        </span>
        <button
          onClick={onOpenAdKit}
          className="hover:text-neutral-700 flex items-center gap-1 transition-colors"
          title="Advertise with The Hind Canadian Times"
        >
          <Info className="w-3 h-3" />
          <span>Ad Rates & Info</span>
        </button>
      </div>

      {/* Media Rendering Based on Format */}
      {ad.format === 'video' && ad.mediaUrl ? (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-16/9 mb-2">
          <video
            src={ad.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
            <Video className="w-3 h-3 text-red-400" />
            <span>Video Ad</span>
          </div>
        </div>
      ) : ad.format === 'gif' ? (
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-red-900 via-rose-900 to-amber-900 p-4 text-white mb-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono bg-white/20 px-1.5 py-0.5 rounded text-amber-200">
              Animated Flash Special
            </span>
            <div className="text-sm font-bold">{ad.advertiser}</div>
            <p className="text-xs text-neutral-200">{ad.headline}</p>
          </div>
          <div className="animate-pulse text-amber-300 font-bold text-xs shrink-0 pl-2">
            Special Offer &rarr;
          </div>
        </div>
      ) : (
        /* JPG / Standard Display format */
        <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-amber-900 tracking-wide">
              {ad.advertiser}
            </div>
            <div className="text-xs font-semibold text-neutral-900">
              {ad.headline}
            </div>
            {ad.subtext && (
              <p className="text-[11px] text-neutral-600 line-clamp-2">
                {ad.subtext}
              </p>
            )}
          </div>
          <button
            onClick={onOpenAdKit}
            className="shrink-0 px-3 py-1.5 rounded-md bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span>{ad.ctaText}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Bottom Ad Disclosures */}
      <div className="flex items-center justify-between text-[10px] text-neutral-600 pt-1">
        <span>Verified Corporate Sponsor: {ad.advertiser}</span>
        <button onClick={onOpenAdKit} className="hover:underline">
          Book This Space (${isLeaderboard ? '450/wk' : isSidebar ? '280/wk' : '350/wk'})
        </button>
      </div>
    </aside>
  );
};
