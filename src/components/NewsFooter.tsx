import React from 'react';
import { 
  Building2, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  DollarSign, 
  Scale, 
  ArrowUp,
  Globe
} from 'lucide-react';
import { MagazineConfig } from '../types';

interface NewsFooterProps {
  config: MagazineConfig;
  onOpenEPaper: () => void;
  onOpenAdvertise: () => void;
}

export const NewsFooter: React.FC<NewsFooterProps> = ({
  config,
  onOpenEPaper,
  onOpenAdvertise,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t-4 border-neutral-900 bg-neutral-100 text-neutral-800 text-xs font-sans print:hidden">
      {/* Top Colophon Bar */}
      <div className="border-b border-neutral-300 bg-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black tracking-wider text-base text-neutral-900 uppercase">
              {config.name}
            </span>
            <span className="text-neutral-400">|</span>
            <span className="text-neutral-500 font-serif italic text-xs">
              {config.tagline}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-neutral-100 transition-colors text-neutral-700 font-medium"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Newspaper Information & Portals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Editorial Leadership & Mandate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-sm border-b border-neutral-300 pb-1">
            <Building2 className="w-4 h-4 text-red-700" />
            <span>Editorial Board &amp; Publisher</span>
          </div>
          <div className="space-y-1.5 text-neutral-600 font-serif leading-relaxed">
            <p className="font-bold text-neutral-900">{config.editorInChief}</p>
            <p className="italic text-[11px] text-neutral-500">{config.publisher}</p>
            <p className="text-[11px] text-neutral-600">
              An independent, multilingual broadsheet serving the Indian diaspora in Canada, India, and worldwide.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-neutral-500 space-y-1 font-sans">
            <p className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Established {config.foundedYear}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{config.cityOrRegion}</span>
            </p>
          </div>
        </div>

        {/* Col 2: Circulation & Bureaus */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-sm border-b border-neutral-300 pb-1">
            <Globe className="w-4 h-4 text-neutral-700" />
            <span>Circulation &amp; Bureaus</span>
          </div>
          <ul className="space-y-1.5 text-neutral-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-neutral-800">Ontario:</span>
              <span>Greater Toronto Area, Brampton, Mississauga</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-neutral-800">British Columbia:</span>
              <span>Metro Vancouver, Surrey, Richmond</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-neutral-800">Alberta:</span>
              <span>Calgary &amp; Edmonton Regional Desks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-neutral-800">India:</span>
              <span>New Delhi &amp; Punjab Editorial Correspondents</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Public Digital Editions & Advertising (Clean for Readers) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-sm border-b border-neutral-300 pb-1">
            <FileText className="w-4 h-4 text-neutral-700" />
            <span>Digital Editions &amp; Circulation</span>
          </div>
          <div className="space-y-2 pt-1">
            <button
              onClick={onOpenEPaper}
              className="w-full text-left p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-neutral-800 transition-colors shadow-xs"
            >
              <span className="flex items-center gap-2 font-medium">
                <FileText className="w-4 h-4 text-red-600" />
                <span>Digital E-Paper (PDF Editions)</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase">Read</span>
            </button>

            <button
              onClick={onOpenAdvertise}
              className="w-full text-left p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50 flex items-center justify-between text-neutral-800 transition-colors shadow-xs"
            >
              <span className="flex items-center gap-2 font-medium">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Advertising Rates &amp; Media Kit</span>
              </span>
              <span className="text-[10px] font-mono text-amber-600 uppercase">Rates</span>
            </button>
          </div>
        </div>

        {/* Col 4: Contact & Newsroom Desk */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-serif font-bold text-sm border-b border-neutral-300 pb-1">
            <Mail className="w-4 h-4 text-neutral-700" />
            <span>Newsroom &amp; Submissions</span>
          </div>
          <div className="space-y-2 text-neutral-600">
            <p className="text-[11px] leading-relaxed font-serif">
              Letters to the Editor, press releases, community announcements, and advertising inquiries:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-neutral-200 text-neutral-800 font-mono text-[11px] break-all">
              <a href={`mailto:${config.contactEmail}`} className="hover:text-red-700 hover:underline">
                {config.contactEmail}
              </a>
            </div>
            <p className="text-[10px] text-neutral-400">
              Published weekly in print and updated continuously online.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Copyright & E-Paper */}
      <div className="border-t border-neutral-300 bg-neutral-200/60 py-4 px-4 sm:px-6 text-[11px] text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-3.5 h-3.5 text-neutral-400" />
            <span>{config.copyrightNotice}</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenAdvertise} className="text-neutral-600 hover:underline">
              Advertise
            </button>
            <span>&middot;</span>
            <button onClick={onOpenEPaper} className="text-neutral-600 hover:underline">
              E-Paper
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
