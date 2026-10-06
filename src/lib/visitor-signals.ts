// Telling people from robots, without fingerprinting anyone.
//
// The resume link goes out inside job applications, and corporate mail
// security opens every link before a person does. Of the roughly 60 visits to
// rebsem.ru between July and early October 2026 that were not the author's
// own, about 35 were bots, mail-link scanners or other automation: Microsoft
// and AWS sandboxes that loaded /cv, scrolled it to the bottom and pressed
// both Copy buttons within half a second. On a site with about one real
// visitor a week, that noise was most of the signal.
//
// Two layers, both pure so the tests can feed them shapes seen in production:
//
// 1. classifyBrowser() reads what every analytics SDK already sends (user
//    agent, screen and window size) plus navigator.webdriver, and flags shapes
//    no ordinary browser has. A hard flag means automation; soft flags alone
//    mean "suspect", which real engagement can still overturn.
// 2. EngagementTracker counts visible time and real input. A visitor is only
//    called human once both are there.
//
// Nothing here is stored, and nothing is precise enough to recognise anyone:
// the output is a handful of coarse labels attached to events.

export type VisitorKind = 'automation' | 'suspect' | 'unverified' | 'human';

export interface BrowserShape {
  userAgent: string;
  webdriver: boolean;
  screenWidth: number;
  screenHeight: number;
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
}

export interface BrowserVerdict {
  kind: Extract<VisitorKind, 'automation' | 'suspect' | 'unverified'>;
  /** Hard flags first, then soft ones; empty for an ordinary browser. */
  flags: string[];
}

// Window sizes automation frameworks default to or are commonly set to. A
// person who resizes a window by hand essentially never lands on one exactly.
const CANONICAL_VIEWPORTS = new Set(['800x600', '1024x768', '1280x720', '1280x800', '1366x768', '1920x1080']);

function isMobileUa(ua: string): boolean {
  return /iPhone|iPod|Android|Mobile/i.test(ua);
}

function isDesktopUa(ua: string): boolean {
  return !isMobileUa(ua) && /Windows NT|Macintosh|X11|CrOS/.test(ua);
}

/**
 * Desktop Chrome has sent a reduced user agent since 2023: `Chrome/150.0.0.0`.
 * A full build number (`Chrome/142.0.7444.163`) on a desktop comes from
 * automation or an old embedded Chromium. Mobile is exempt on purpose: iOS
 * Chrome and Android WebViews (Telegram's in-app browser among them) still
 * send full builds, and recruiters open links there.
 */
function hasFullChromeBuild(ua: string): boolean {
  const match = ua.match(/Chrome\/\d+\.0\.(\d+)\.(\d+)/);
  return match !== null && !(match[1] === '0' && match[2] === '0');
}

/**
 * OS versions that real browsers never report: Windows 11 still says
 * "Windows NT 10.0", and both Safari and Chrome freeze macOS at 10_15_7.
 */
function hasImpossibleOs(ua: string): boolean {
  return /Windows NT 11\.0/.test(ua) || /Mac OS X (1[1-9]|[2-9]\d)[_.]/.test(ua);
}

export function classifyBrowser(shape: BrowserShape): BrowserVerdict {
  const ua = shape.userAgent;
  const desktop = isDesktopUa(ua);
  const hard: string[] = [];
  const soft: string[] = [];

  if (shape.webdriver) hard.push('webdriver');
  if (/HeadlessChrome|Electron|PhantomJS/i.test(ua)) hard.push('headless_ua');
  if (hasImpossibleOs(ua)) hard.push('impossible_os');
  if (desktop && hasFullChromeBuild(ua)) hard.push('chrome_full_build');
  if (shape.screenWidth === 800 && shape.screenHeight === 600) hard.push('legacy_screen');
  if (desktop && shape.screenWidth > 0 && shape.screenWidth < 600) hard.push('phone_screen_desktop_ua');
  // Desktop only: some mobile in-app browsers report a zero outer size.
  if (desktop && (shape.outerWidth === 0 || shape.outerHeight === 0)) hard.push('no_outer_window');

  if (desktop) {
    const viewport = `${shape.innerWidth}x${shape.innerHeight}`;
    if (shape.innerWidth === shape.screenWidth && shape.innerHeight === shape.screenHeight) {
      // No room left for tabs or an address bar: headless, kiosk, or a true
      // fullscreen window. Only the first is common on a CV site.
      soft.push('viewport_equals_screen');
    } else if (CANONICAL_VIEWPORTS.has(viewport)) {
      soft.push('canonical_viewport');
    }
  }

  const kind = hard.length > 0 ? 'automation' : soft.length > 0 ? 'suspect' : 'unverified';
  return { kind, flags: [...hard, ...soft] };
}

export type InputKind = 'pointer' | 'touch' | 'wheel' | 'key';

/** Thresholds, exported so the summary event can say what "engaged" meant. */
export const ENGAGEMENT_RULES = {
  minVisibleMs: 4000,
  minPointerMoves: 8,
  minPointerSpanMs: 500,
  minWheels: 2,
  /** Pointer positions closer than this count as the same position. */
  minPointerStepPx: 2,
} as const;

/**
 * Counts what a reading person produces and a link scanner does not: time
 * with the page actually on screen, and input spread over that time. A
 * scanner's synthetic click arrives with at most a move or two; a person
 * moving a mouse produces dozens of distinct positions, a phone produces
 * touches, a trackpad produces wheel events.
 */
export class EngagementTracker {
  visibleMs = 0;
  pointerMoves = 0;
  touches = 0;
  wheels = 0;
  keys = 0;

  private firstMoveAt: number | null = null;
  private lastMoveAt: number | null = null;
  private lastX: number | null = null;
  private lastY: number | null = null;

  addVisible(ms: number): void {
    if (ms > 0) this.visibleMs += ms;
  }

  input(kind: InputKind, at: number, x?: number, y?: number): void {
    if (kind === 'touch') this.touches += 1;
    else if (kind === 'wheel') this.wheels += 1;
    else if (kind === 'key') this.keys += 1;
    else this.pointerMove(at, x, y);
  }

  private pointerMove(at: number, x?: number, y?: number): void {
    if (x === undefined || y === undefined) return;
    if (this.lastX !== null && this.lastY !== null) {
      const step = Math.hypot(x - this.lastX, y - this.lastY);
      if (step < ENGAGEMENT_RULES.minPointerStepPx) return;
    }
    this.lastX = x;
    this.lastY = y;
    this.pointerMoves += 1;
    this.firstMoveAt ??= at;
    this.lastMoveAt = at;
  }

  /** The strongest kind of human input seen so far, or null if none counts. */
  get evidence(): InputKind | null {
    if (this.touches > 0) return 'touch';
    if (this.keys > 0) return 'key';
    if (this.wheels >= ENGAGEMENT_RULES.minWheels) return 'wheel';
    const span = this.firstMoveAt !== null && this.lastMoveAt !== null ? this.lastMoveAt - this.firstMoveAt : 0;
    if (this.pointerMoves >= ENGAGEMENT_RULES.minPointerMoves && span >= ENGAGEMENT_RULES.minPointerSpanMs) {
      return 'pointer';
    }
    return null;
  }

  get engaged(): boolean {
    return this.visibleMs >= ENGAGEMENT_RULES.minVisibleMs && this.evidence !== null;
  }
}

/** How far down the page the bottom of the viewport has ever been, 0-100. */
export function scrollDepthPercent(scrollY: number, viewportHeight: number, documentHeight: number): number {
  if (documentHeight <= 0) return 0;
  const reached = ((scrollY + viewportHeight) / documentHeight) * 100;
  return Math.max(0, Math.min(100, Math.round(reached)));
}

/** `currently-title` → `currently`; the section names in events stay short. */
export function sectionKey(labelledBy: string): string {
  return labelledBy.replace(/-title$/, '');
}
