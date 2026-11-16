export type RibbonPhase = 'before' | 'after' | 'off';

export interface RibbonState {
  phase: RibbonPhase;
  days: number;
  hours: number;
  minutes: number;
}

/** The game unlocks at 00:00 local time on 19 November 2026, so the reader's own midnight is the mark. */
export const gtaRelease = (): Date => new Date(2026, 10, 19, 0, 0, 0, 0);

/** Three weeks after release the joke is stale and the ribbon goes away. */
export const gtaRibbonOff = (): Date => new Date(2026, 11, 10, 0, 0, 0, 0);

export function gtaRibbon(now: Date): RibbonState {
  const none = { days: 0, hours: 0, minutes: 0 };
  if (now.getTime() >= gtaRibbonOff().getTime()) return { phase: 'off', ...none };
  const left = gtaRelease().getTime() - now.getTime();
  if (left <= 0) return { phase: 'after', ...none };
  const total = Math.floor(left / 60_000);
  return {
    phase: 'before',
    days: Math.floor(total / 1440),
    hours: Math.floor((total % 1440) / 60),
    minutes: total % 60,
  };
}

export function ribbonTimerText(state: RibbonState): string {
  if (state.phase !== 'before') return '';
  return ` · до релиза ${state.days} д ${state.hours} ч ${String(state.minutes).padStart(2, '0')} мин`;
}

export interface AvMeme {
  id: string;
  text: string;
  /** Only the owner flips this. Unapproved lines never reach the page. */
  approved: boolean;
  /** ISO date, inclusive. After it the line is dropped at build time. */
  showUntil?: string;
}

export function memeIsLive(meme: AvMeme, now: Date): boolean {
  if (!meme.approved) return false;
  if (!meme.showUntil) return true;
  return now.getTime() <= new Date(`${meme.showUntil}T23:59:59`).getTime();
}

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/** 0 when the element's top touches the viewport bottom, 1 when its bottom leaves the top. */
export const viewProgress = (top: number, height: number, viewport: number): number =>
  clamp01((viewport - top) / (viewport + height));

export const easeOutCubic = (k: number): number => 1 - (1 - clamp01(k)) ** 3;

export const easeInOutCubic = (k: number): number => {
  const x = clamp01(k);
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
};

/** `?av-now=2026-11-20T10:00` previews date-dependent states during QA. */
export function clockFrom(search: string, fallback: Date): Date {
  const raw = new URLSearchParams(search).get('av-now');
  if (!raw) return fallback;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}
