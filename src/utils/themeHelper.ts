import { ThemePreset, FontMode } from '../types';

export const THEME_CONFIGS: Record<ThemePreset, {
  name: string;
  badge: string;
  canvasBg: string;
  surfaceBg: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentRed: string;
  accentBg: string;
  accentBorder: string;
  mastheadBorder: string;
}> = {
  broadsheet: {
    name: 'The Royal Broadsheet (Classic Newsprint)',
    badge: 'Paper Alabaster',
    canvasBg: 'bg-[#faf8f4]',
    surfaceBg: 'bg-[#ffffff]',
    surfaceHover: 'hover:bg-[#f6f2e9]',
    border: 'border-[#e5dfd3]',
    borderStrong: 'border-[#1f1d1a]',
    textPrimary: 'text-[#1c1917]',
    textSecondary: 'text-[#44403c]',
    textMuted: 'text-[#78716c]',
    accentRed: 'text-[#b91c1c]',
    accentBg: 'bg-[#b91c1c] text-white hover:bg-[#991b1b]',
    accentBorder: 'border-[#b91c1c]',
    mastheadBorder: 'border-b-4 border-double border-[#1c1917]',
  },
  crimson_maple: {
    name: 'Canadian Maple Crimson',
    badge: 'Maple Red & Ivory',
    canvasBg: 'bg-[#fcfbf9]',
    surfaceBg: 'bg-[#ffffff]',
    surfaceHover: 'hover:bg-[#fff5f5]',
    border: 'border-[#f0e3e3]',
    borderStrong: 'border-[#b91c1c]',
    textPrimary: 'text-[#18181b]',
    textSecondary: 'text-[#3f3f46]',
    textMuted: 'text-[#71717a]',
    accentRed: 'text-[#dc2626]',
    accentBg: 'bg-[#dc2626] text-white hover:bg-[#b91c1c]',
    accentBorder: 'border-[#dc2626]',
    mastheadBorder: 'border-b-4 border-[#dc2626]',
  },
  royal_navy: {
    name: 'Imperial Dominion Navy',
    badge: 'Navy & Parchment',
    canvasBg: 'bg-[#f8f9fa]',
    surfaceBg: 'bg-[#ffffff]',
    surfaceHover: 'hover:bg-[#f1f5f9]',
    border: 'border-[#e2e8f0]',
    borderStrong: 'border-[#0f172a]',
    textPrimary: 'text-[#0f172a]',
    textSecondary: 'text-[#334155]',
    textMuted: 'text-[#64748b]',
    accentRed: 'text-[#0369a1]',
    accentBg: 'bg-[#0f172a] text-white hover:bg-[#1e293b]',
    accentBorder: 'border-[#0284c7]',
    mastheadBorder: 'border-b-4 border-[#0f172a]',
  },
  dark_newsroom: {
    name: 'Midnight Editorial Desk',
    badge: 'Deep Carbon',
    canvasBg: 'bg-[#0f1115]',
    surfaceBg: 'bg-[#181b22]',
    surfaceHover: 'hover:bg-[#202530]',
    border: 'border-[#262c38]',
    borderStrong: 'border-[#dc2626]',
    textPrimary: 'text-[#f3f4f6]',
    textSecondary: 'text-[#d1d5db]',
    textMuted: 'text-[#9ca3af]',
    accentRed: 'text-[#f87171]',
    accentBg: 'bg-[#dc2626] text-white hover:bg-[#ef4444]',
    accentBorder: 'border-[#ef4444]',
    mastheadBorder: 'border-b-4 border-[#dc2626]',
  },
  forest_dispatch: {
    name: 'Pacific Heritage Green',
    badge: 'Cedar & Pine',
    canvasBg: 'bg-[#f7f9f7]',
    surfaceBg: 'bg-[#ffffff]',
    surfaceHover: 'hover:bg-[#edf2ee]',
    border: 'border-[#dde5de]',
    borderStrong: 'border-[#14532d]',
    textPrimary: 'text-[#14281d]',
    textSecondary: 'text-[#2d4a39]',
    textMuted: 'text-[#52735f]',
    accentRed: 'text-[#15803d]',
    accentBg: 'bg-[#14532d] text-white hover:bg-[#166534]',
    accentBorder: 'border-[#15803d]',
    mastheadBorder: 'border-b-4 border-[#14532d]',
  },
};

export const FONT_CONFIGS: Record<FontMode, {
  name: string;
  headlineFont: string;
  bodyFont: string;
  description: string;
}> = {
  editorial_serif: {
    name: 'Times Editorial Broadsheet',
    headlineFont: 'font-serif font-bold tracking-tight',
    bodyFont: 'font-serif leading-relaxed',
    description: 'High-contrast historic broadsheet type inspired by The Times and The Hindu',
  },
  modern_grotesk: {
    name: 'Modern Metro Daily',
    headlineFont: 'font-sans font-extrabold tracking-tight',
    bodyFont: 'font-sans leading-relaxed',
    description: 'Crisp contemporary Scandinavian & North American newsroom aesthetic',
  },
  classic_broadsheet: {
    name: 'Heritage Archival Monograph',
    headlineFont: 'font-["Cinzel",serif] font-bold tracking-tight',
    bodyFont: 'font-serif leading-relaxed',
    description: 'Architectural chiseled masthead serif with classical column margins',
  },
};
