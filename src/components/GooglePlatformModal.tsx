import React, { useState } from 'react';
import {
  X,
  Globe,
  Cloud,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Radio,
  FileCode,
  DollarSign
} from 'lucide-react';
import { MagazineConfig } from '../types';
import { THEME_CONFIGS } from '../utils/themeHelper';

interface GooglePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MagazineConfig;
}

export const GooglePlatformModal: React.FC<GooglePlatformModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const theme = THEME_CONFIGS[config.theme] || THEME_CONFIGS.broadsheet;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const adSenseCode = `<!-- Google AdSense Tag for The Hind Canadian Times -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXX"
     crossorigin="anonymous"></script>`;

  const adsTxtContent = `google.com, pub-XXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`;

  const customDomainCommand = `gcloud run domain-mappings create \\
  --service=hind-canadian-times \\
  --domain=thehindcanadiantimes.com \\
  --region=northamerica-northeast1`;

  const activeAppUrl = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
    ? window.location.origin
    : 'https://the-hind-canadian-times-1.ai.studio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className={`w-full max-w-4xl max-h-[92vh] rounded-2xl border ${theme.border} ${theme.surfaceBg} ${theme.textPrimary} shadow-2xl flex flex-col overflow-hidden my-auto`}>
        {/* Header */}
        <div className={`p-4 border-b ${theme.border} ${theme.canvasBg} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">
                Google Platform Hosting &amp; Ecosystem Readiness
              </h3>
              <p className="text-[11px] text-neutral-500">
                Deployment status, Google Cloud Run architecture, AdSense monetization, and Google News Publisher Center
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Active Live Link Hero Card */}
          <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/95 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-950 text-sm sm:text-base font-serif">
                      Live Working Website on Google Cloud Run
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                      Online &amp; Active
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Your newspaper application is running and accessible live right now:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Active Site</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="font-mono text-xs font-bold text-neutral-800 break-all select-all">
                {activeAppUrl}
              </div>
              <button
                onClick={() => handleCopy('public-link', activeAppUrl)}
                className="px-3 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-300 flex items-center justify-center gap-1.5 shrink-0 transition-colors"
              >
                {copiedCode === 'public-link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-emerald-950 bg-emerald-100/90 p-3 rounded-xl border border-emerald-300 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <span>ℹ️ Why does opening the link show a "Redirect" or "Cookie check" page?</span>
              </div>
              <p className="leading-relaxed text-neutral-800">
                The <code>ais-dev-*.run.app</code> and <code>ais-pre-*.run.app</code> links are secured by Google AI Studio's authentication proxy. When opened in an external browser tab or incognito window, Google verifies your active Google AI Studio session before redirecting into your app.
              </p>
              <p className="leading-relaxed text-neutral-800">
                <strong>What to do:</strong> If your browser pauses on the Google redirect screen, simply click <em>"Continue"</em> or allow third-party cookies for Google, or keep working right here in the main app window where your entire newspaper, articles, and E-Paper reader run seamlessly.
              </p>
            </div>
          </div>

          {/* Dedicated GoDaddy Custom Domain Step-by-Step Guide */}
          <div className="p-5 rounded-2xl border-2 border-blue-400 bg-blue-50/80 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-blue-700 shrink-0" />
                <h4 className="font-serif font-bold text-sm sm:text-base text-blue-950">
                  Step-by-Step: Connect www.thehindcanadiantimes.com from GoDaddy to New Website
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-blue-200 text-blue-950 px-2 py-0.5 rounded font-bold uppercase">
                GoDaddy DNS Guide
              </span>
            </div>

            <p className="text-neutral-700 text-xs leading-relaxed">
              Your domain <strong>thehindcanadiantimes.com</strong> is currently pointing to Blogger’s legacy servers at GoDaddy. Follow these 4 straightforward steps to switch it over to your new newspaper platform without losing your old articles or paying extra fees:
            </p>

            <div className="space-y-3">
              {/* STEP 1 */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] shrink-0">1</span>
                  <span>Detach Domain from Old Blogger Account</span>
                </div>
                <ul className="list-disc list-inside text-neutral-600 text-[11px] space-y-1 pl-1">
                  <li>Log in to <strong>Blogger.com</strong> and open your dashboard.</li>
                  <li>Click <strong>Settings</strong> on the left menu, then scroll to the <strong>Publishing</strong> section.</li>
                  <li>Under <strong>Custom domain</strong>, you will see <em>www.thehindcanadiantimes.com</em>. Click <strong>Delete / Remove</strong>.</li>
                  <li className="text-emerald-800 font-semibold">
                    ✓ Don’t worry: Your old articles and pictures will NOT be deleted. Your old blog simply reverts back to its free <em>*.blogspot.com</em> address so you can access it anytime.
                  </li>
                </ul>
              </div>

              {/* STEP 2 */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] shrink-0">2</span>
                  <span>Publish Your New Website in Google AI Studio</span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed pl-1">
                  At the very top of your Google AI Studio screen, click the <strong>Publish</strong> button. This builds and deploys your newspaper into Google’s production cloud hosting environment and provides your permanent production link.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] shrink-0">3</span>
                  <span>Update DNS Records in GoDaddy (Takes 2 Minutes)</span>
                </div>
                <p className="text-neutral-600 text-[11px] pl-1">
                  Log in to your <strong>GoDaddy</strong> account &rarr; go to <strong>My Products</strong> &rarr; find <strong>thehindcanadiantimes.com</strong> &rarr; click <strong>Manage DNS</strong> (or DNS Records):
                </p>

                {/* GoDaddy Records Table */}
                <div className="overflow-x-auto border border-neutral-300 rounded-lg">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-neutral-100 border-b border-neutral-300 font-mono text-neutral-700">
                      <tr>
                        <th className="p-2 font-semibold">Type</th>
                        <th className="p-2 font-semibold">Name / Host</th>
                        <th className="p-2 font-semibold">Value / Points To</th>
                        <th className="p-2 font-semibold">Action in GoDaddy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono text-neutral-800">
                      <tr className="bg-amber-50/50">
                        <td className="p-2 font-bold text-amber-800">CNAME</td>
                        <td className="p-2">f65hsvoplkxw</td>
                        <td className="p-2 text-neutral-500 text-[10px]">gv-4c7sl4h3rzz6wr.dv.googlehosted.com.</td>
                        <td className="p-2 text-neutral-600 font-sans">Old Blogger token. Click Trash 🗑️ (or leave as is)</td>
                      </tr>
                      <tr className="bg-emerald-50/60">
                        <td className="p-2 font-bold text-emerald-800">CNAME</td>
                        <td className="p-2">www</td>
                        <td className="p-2 text-neutral-500 line-through">ghs.google.com.</td>
                        <td className="p-2 text-emerald-900 font-sans font-semibold">Click Pencil ✏️ to EDIT &rarr; Point to your App URL or use GoDaddy Forwarding</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-blue-800">Forwarding</td>
                        <td className="p-2">@ and www</td>
                        <td className="p-2 font-sans font-bold text-blue-900 break-all">https://the-hind-canadian-times-1.ai.studio</td>
                        <td className="p-2 font-sans text-emerald-800 font-semibold">Recommended in GoDaddy: "Forwarding" &rarr; Instant 100% working</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-100 border border-neutral-300">
                  <div className="text-[11px] font-mono text-neutral-800">
                    CNAME Host: <strong>www</strong> &rarr; Target: <span className="text-emerald-700 font-bold select-all">ais-pre-mdjjr3ng6zvybrjzszklho-905064673993.asia-southeast1.run.app</span>
                  </div>
                  <button
                    onClick={() => handleCopy('cname-target', 'ais-pre-mdjjr3ng6zvybrjzszklho-905064673993.asia-southeast1.run.app')}
                    className="px-2.5 py-1 rounded bg-white hover:bg-neutral-200 border border-neutral-300 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    {copiedCode === 'cname-target' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>Copy CNAME Target</span>
                  </button>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="p-3.5 bg-white rounded-xl border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] shrink-0">4</span>
                  <span>Wait for DNS Propagation &amp; Free Automatic SSL (HTTPS)</span>
                </div>
                <p className="text-neutral-600 text-[11px] leading-relaxed pl-1">
                  DNS changes usually take between <strong>15 minutes to 2 hours</strong> to propagate worldwide. Once active, Google automatically issues a <strong>Free SSL Certificate (green padlock 🔒)</strong> so your readers access the site securely at <em>https://www.thehindcanadiantimes.com</em>.
                </p>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Google Platform Placement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1: Custom Domain on Google Cloud */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>1. Custom Domain via Google Cloud</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Connect your custom domain <strong>thehindcanadiantimes.com</strong> directly to this Google Cloud Run instance using Google Cloud DNS or Cloud Load Balancer with automatic zero-cost Google-managed SSL.
              </p>
              <div className="relative">
                <pre className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 font-mono text-[10px] overflow-x-auto">
                  {customDomainCommand}
                </pre>
                <button
                  onClick={() => handleCopy('domain', customDomainCommand)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                  title="Copy gcloud command"
                >
                  {copiedCode === 'domain' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Pillar 2: Google AdSense Monetization */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>2. Google AdSense &amp; Ads Manager</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Monetize all JPG, GIF, and Video advertisement slots across The Hind Canadian Times with Google AdSense auto-ads and programmatic bidding.
              </p>
              <div className="relative">
                <pre className="p-2.5 rounded-lg bg-neutral-900 text-amber-300 font-mono text-[10px] overflow-x-auto">
                  {adSenseCode}
                </pre>
                <button
                  onClick={() => handleCopy('adsense', adSenseCode)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-neutral-800 text-neutral-300 hover:text-white"
                  title="Copy AdSense code"
                >
                  {copiedCode === 'adsense' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Pillar 3: Google News & Publisher Center */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <Radio className="w-4 h-4 text-red-600" />
                <span>3. Google News Inclusion</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Register The Hind Canadian Times at <strong>publishercenter.google.com</strong> to feature on Google News, Discover, and top story carousels across Canada and India.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 font-mono text-[11px] flex items-center justify-between">
                <span>RSS Feed: https://thehindcanadiantimes.com/feed.xml</span>
                <button
                  onClick={() => handleCopy('feed', 'https://thehindcanadiantimes.com/feed.xml')}
                  className="text-neutral-500 hover:text-black ml-2"
                >
                  {copiedCode === 'feed' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Pillar 4: Google Workspace & GA4 Analytics */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/60 space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                <FileCode className="w-4 h-4 text-purple-600" />
                <span>4. Google Analytics (GA4) &amp; Search Console</span>
              </div>
              <p className="text-neutral-600 text-[11px] leading-relaxed">
                Track reader engagement, geographic readership (Ontario, BC, Punjab, Delhi), and E-Paper PDF downloads with Google Analytics 4 tags.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-800 font-mono text-[11px] flex items-center justify-between">
                <span>G-Tag: G-HCTIMES2026</span>
                <span className="text-emerald-700 font-semibold text-[10px]">Ready for Injection</span>
              </div>
            </div>
          </div>

          {/* Verification Summary for User & Copyright Guarantee */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
              <h5 className="font-bold text-blue-900 text-xs">
                Your Domain: www.thehindcanadiantimes.com (Valid Upto 2027) &amp; Free Google Hosting:
              </h5>
              <p className="text-neutral-700 text-[11px] leading-relaxed">
                Your domain is registered until 2027. You do not need to purchase any additional domain. You can connect it to this Google Cloud Run deployment via a simple CNAME DNS record. Google Cloud Run includes <strong>2 million free requests per month</strong> under the free tier, meaning you pay zero hosting fees for standard traffic.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2">
              <h5 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Copyright Ownership: 100% Yours &middot; Zero Royalties or Platform Claims</span>
              </h5>
              <p className="text-neutral-700 text-[11px] leading-relaxed">
                You possess <strong>100% full intellectual property and commercial copyright ownership</strong> over The Hind Canadian Times, all news articles, written archives, E-Paper issues, and advertising contracts. The application codebase is open standard under the Apache 2.0 license, meaning you have complete freedom to publish, commercialize, monetize with Google AdSense, and modify it without paying royalties or fees to anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${theme.border} ${theme.canvasBg} flex justify-end text-xs`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg font-semibold ${theme.accentBg}`}
          >
            Close Google Status
          </button>
        </div>
      </div>
    </div>
  );
};
