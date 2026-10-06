import { describe, expect, it } from 'vitest';
import {
  ENGAGEMENT_RULES,
  EngagementTracker,
  classifyBrowser,
  scrollDepthPercent,
  sectionKey,
  type BrowserShape,
} from '../src/lib/visitor-signals';

// User agents below are copied from real sessions in PostHog (July-October
// 2026), so each case pins down a shape the classifier actually met.
const CHROME_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit';

function shape(overrides: Partial<BrowserShape>): BrowserShape {
  return {
    userAgent: `${CHROME_WIN} Chrome/152.0.0.0 Safari/537.36`,
    webdriver: false,
    screenWidth: 1920,
    screenHeight: 1080,
    innerWidth: 1910,
    innerHeight: 912,
    outerWidth: 1920,
    outerHeight: 1040,
    ...overrides,
  };
}

describe('classifyBrowser: automation seen in production', () => {
  it('flags the Microsoft mail scanners that read /cv for nebius and telq-telecom', () => {
    const verdict = classifyBrowser(
      shape({
        userAgent: `${CHROME_WIN} Chrome/142.0.7444.163 Safari/537.36`,
        innerWidth: 1920,
        innerHeight: 1080,
        outerWidth: 1920,
        outerHeight: 1080,
      }),
    );
    expect(verdict.kind).toBe('automation');
    expect(verdict.flags).toEqual(['chrome_full_build', 'viewport_equals_screen']);
  });

  it('flags an operating system no real browser reports', () => {
    expect(
      classifyBrowser(shape({ userAgent: 'Mozilla/5.0 (Windows NT 11.0; Win64; x64) Chrome/134.0.0.0 Safari/537.36' }))
        .flags,
    ).toContain('impossible_os');
    expect(
      classifyBrowser(shape({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) Chrome/142.0.0.0 Safari/537.36' }))
        .kind,
    ).toBe('automation');
  });

  it('flags screens that cannot belong to the claimed device', () => {
    // A "Mac" with an iPhone 8 screen (Dallas, Montreal).
    expect(
      classifyBrowser(
        shape({ userAgent: `${MAC} Chrome/114.0.0.0 Safari/537.36`, screenWidth: 375, screenHeight: 667 }),
      ).flags,
    ).toContain('phone_screen_desktop_ua');
    // An "iPhone" with an 800x600 screen (Nuremberg).
    expect(
      classifyBrowser(
        shape({
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
          screenWidth: 800,
          screenHeight: 600,
          innerWidth: 500,
          innerHeight: 828,
        }),
      ).kind,
    ).toBe('automation');
  });

  it('flags webdriver, headless and Electron user agents, and a zero-size outer window', () => {
    expect(classifyBrowser(shape({ webdriver: true })).flags).toContain('webdriver');
    expect(classifyBrowser(shape({ userAgent: `${CHROME_WIN} HeadlessChrome/150.0.0.0` })).kind).toBe('automation');
    expect(classifyBrowser(shape({ outerWidth: 0, outerHeight: 0 })).flags).toContain('no_outer_window');
  });

  it('calls one shape across three countries suspect: an exact 1366x768 window', () => {
    const verdict = classifyBrowser(
      shape({ userAgent: `${CHROME_WIN} Chrome/150.0.0.0 Safari/537.36`, innerWidth: 1366, innerHeight: 768 }),
    );
    expect(verdict).toEqual({ kind: 'suspect', flags: ['canonical_viewport'] });
  });
});

describe('classifyBrowser: ordinary browsers stay unverified', () => {
  it('leaves a real desktop Chrome alone', () => {
    expect(classifyBrowser(shape({}))).toEqual({ kind: 'unverified', flags: [] });
  });

  it("leaves the owner's Safari alone, browser zoom included", () => {
    const safari = `${MAC} AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Safari/605.1.15`;
    expect(
      classifyBrowser(
        shape({ userAgent: safari, screenWidth: 1440, screenHeight: 900, innerWidth: 1440, innerHeight: 810 }),
      ).kind,
    ).toBe('unverified');
    // Zoomed out to 85%: the viewport is wider than the screen, which is fine.
    expect(
      classifyBrowser(
        shape({ userAgent: safari, screenWidth: 1440, screenHeight: 900, innerWidth: 1694, innerHeight: 952 }),
      ).kind,
    ).toBe('unverified');
  });

  // Recruiters open links from Telegram and LinkedIn on phones. Those in-app
  // browsers send full Chrome builds and sometimes a zero outer size, so
  // neither rule may apply to them.
  it('does not flag mobile in-app browsers', () => {
    const telegramWebView =
      'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 Telegram-Android/11.2.3';
    expect(
      classifyBrowser(
        shape({
          userAgent: telegramWebView,
          screenWidth: 412,
          screenHeight: 915,
          innerWidth: 412,
          innerHeight: 780,
          outerWidth: 0,
          outerHeight: 0,
        }),
      ),
    ).toEqual({ kind: 'unverified', flags: [] });

    const iosChrome =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.7339.122 Mobile/15E148 Safari/604.1';
    expect(
      classifyBrowser(shape({ userAgent: iosChrome, screenWidth: 393, screenHeight: 852, innerWidth: 393, innerHeight: 659 }))
        .kind,
    ).toBe('unverified');
  });

  it('leaves Yandex Browser and Firefox alone', () => {
    expect(
      classifyBrowser(shape({ userAgent: `${CHROME_WIN} Chrome/148.0.0.0 YaBrowser/26.6.0.0 Safari/537.36` })).kind,
    ).toBe('unverified');
    expect(
      classifyBrowser(
        shape({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:152.0) Gecko/20100101 Firefox/152.0' }),
      ).kind,
    ).toBe('unverified');
  });
});

describe('EngagementTracker', () => {
  const moves = (tracker: EngagementTracker, count: number, spanMs: number) => {
    for (let i = 0; i < count; i += 1) {
      tracker.input('pointer', (spanMs / Math.max(1, count - 1)) * i, 100 + i * 10, 200 + i * 5);
    }
  };

  it('is not engaged by time alone: a tab left open is not a reader', () => {
    const tracker = new EngagementTracker();
    tracker.addVisible(60_000);
    expect(tracker.engaged).toBe(false);
  });

  // The scanners clicked both Copy buttons within half a second: a synthetic
  // click arrives with a move or two, not a path.
  it('is not engaged by a short burst of pointer events', () => {
    const tracker = new EngagementTracker();
    tracker.addVisible(25_000);
    moves(tracker, 3, 100);
    expect(tracker.evidence).toBeNull();
    expect(tracker.engaged).toBe(false);
  });

  it('is engaged by a real mouse path once the page has been on screen long enough', () => {
    const tracker = new EngagementTracker();
    moves(tracker, 12, 1500);
    tracker.addVisible(ENGAGEMENT_RULES.minVisibleMs - 1);
    expect(tracker.engaged).toBe(false);
    tracker.addVisible(1);
    expect(tracker.engaged).toBe(true);
    expect(tracker.evidence).toBe('pointer');
  });

  it('ignores jitter: repeated positions do not count as moves', () => {
    const tracker = new EngagementTracker();
    for (let i = 0; i < 20; i += 1) tracker.input('pointer', i * 100, 300, 300);
    expect(tracker.pointerMoves).toBe(1);
  });

  it('accepts a touch, a key or two wheel ticks as human input', () => {
    const touch = new EngagementTracker();
    touch.input('touch', 0);
    touch.addVisible(5000);
    expect(touch.evidence).toBe('touch');
    expect(touch.engaged).toBe(true);

    const wheel = new EngagementTracker();
    wheel.input('wheel', 0);
    wheel.addVisible(5000);
    expect(wheel.engaged).toBe(false);
    wheel.input('wheel', 50);
    expect(wheel.engaged).toBe(true);

    const key = new EngagementTracker();
    key.input('key', 0);
    key.addVisible(5000);
    expect(key.evidence).toBe('key');
  });
});

describe('helpers', () => {
  it('computes scroll depth as the furthest point the viewport bottom reached', () => {
    expect(scrollDepthPercent(0, 800, 4000)).toBe(20);
    expect(scrollDepthPercent(3200, 800, 4000)).toBe(100);
    expect(scrollDepthPercent(5000, 800, 4000)).toBe(100);
    expect(scrollDepthPercent(0, 800, 0)).toBe(0);
  });

  it('shortens section ids', () => {
    expect(sectionKey('currently-title')).toBe('currently');
    expect(sectionKey('cv-contact-title')).toBe('cv-contact');
    expect(sectionKey('footer')).toBe('footer');
  });
});
