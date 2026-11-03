import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { calBooking, uiCopy } from '../src/data/site-content';
import {
  bookingLengths,
  buildCalEmbedLink,
  buildCalInlineOptions,
  buildCalPublicUrl,
  calBookedActions,
  calBrand,
  calFailedAction,
  calReadyAction,
  calThemeFor,
  calUiOptions,
  callPagePath,
  callThanksPath,
  isBookingMinutes,
} from '../src/lib/booking';

const DIST = path.resolve('dist');
const describeBuilt = existsSync(path.join(DIST, 'call', 'thanks', 'index.html')) ? describe : describe.skip;

// The value of a site colour token in global.css, for the light (first) block
// and the dark one that follows the data-theme switch.
const siteCss = readFileSync(path.resolve('src/styles/global.css'), 'utf8');
const darkStart = siteCss.indexOf("html[data-theme='dark'] {");
const siteToken = (name: string, dark: boolean): string | undefined => {
  const block = dark ? siteCss.slice(darkStart) : siteCss.slice(0, darkStart);
  return block.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1]?.toLowerCase();
};

// Every {ru, en} pair in an object tree, however deep it nests.
const localizedStrings = (node: unknown): { ru?: string; en?: string }[] => {
  if (!node || typeof node !== 'object') return [];
  if ('ru' in node && 'en' in node) return [node as { ru?: string; en?: string }];
  return Object.values(node).flatMap(localizedStrings);
};

describe('call page paths', () => {
  it('serves the booking page at /call/ and /ru/call/, with a thanks page beside each', () => {
    expect(callPagePath('en')).toBe('/call/');
    expect(callPagePath('ru')).toBe('/ru/call/');
    expect(callThanksPath('en')).toBe('/call/thanks/');
    expect(callThanksPath('ru')).toBe('/ru/call/thanks/');
  });
});

describe('cal links', () => {
  it('names the embedded calendar as user/event', () => {
    expect(buildCalEmbedLink(calBooking.user, '30min')).toBe(`${calBooking.user}/30min`);
  });

  it('builds the public page with a percent-encoded user and the locale', () => {
    const url = new URL(buildCalPublicUrl(calBooking.user, '15min', 'ru'));
    expect(url.origin).toBe('https://cal.com');
    expect(url.pathname).toBe(`/${encodeURIComponent(calBooking.user)}/15min`);
    expect(url.searchParams.get('language')).toBe('ru');
    expect(url.href).not.toMatch(/[А-Яа-яЁё]/);
    expect(new URL(buildCalPublicUrl(calBooking.user, '30min', 'en')).searchParams.get('language')).toBe('en');
  });

  it('links all three event types under the Latin user slug', () => {
    const paths = Object.values(calBooking.events).map(
      (slug) => new URL(buildCalPublicUrl(calBooking.user, slug, 'en')).pathname,
    );
    expect(calBooking.user).toBe('michael-semenov');
    expect(paths).toEqual(['/michael-semenov/15min', '/michael-semenov/30min', '/michael-semenov/60min']);
  });
});

describe('embed options', () => {
  it('points the inline calendar at the chosen event, the locale and the page element', () => {
    for (const slug of Object.values(calBooking.events)) {
      const options = buildCalInlineOptions(calBooking.user, slug, 'en', '#call-stage');
      expect(options.calLink).toBe(`${calBooking.user}/${slug}`);
      expect(options.elementOrSelector).toBe('#call-stage');
      expect(options.config).toEqual({ layout: 'month_view', language: 'en' });
    }
  });

  it('themes the calendar with the site brand in each theme and hides the event details', () => {
    const light = calUiOptions('light');
    const dark = calUiOptions('dark');
    expect(light.theme).toBe('light');
    expect(dark.theme).toBe('dark');
    expect(light.hideEventTypeDetails).toBe(true);
    expect(light.cssVarsPerTheme.light['cal-brand']).toBe(calBrand.light);
    expect(light.cssVarsPerTheme.dark['cal-brand']).toBe(calBrand.dark);
    expect(dark.cssVarsPerTheme.light['cal-brand']).toBe(calBrand.light);
    expect(dark.cssVarsPerTheme.dark['cal-brand']).toBe(calBrand.dark);
  });

  it('gives the booker the site surfaces, borders and text in each theme, and no border of its own', () => {
    const { light, dark } = calUiOptions('light').cssVarsPerTheme;
    expect(light['cal-bg']).toBe(siteToken('surface', false));
    expect(light['cal-border']).toBe(siteToken('border', false));
    expect(light['cal-text']).toBe(siteToken('foreground', false));
    expect(dark['cal-bg']).toBe(siteToken('surface', true));
    expect(dark['cal-border']).toBe(siteToken('border', true));
    expect(dark['cal-text']).toBe(siteToken('foreground', true));
    expect(light['cal-border-booker']).toBe('transparent');
    expect(dark['cal-border-booker']).toBe('transparent');
  });
});

describe('site theme names', () => {
  it('maps the site theme to the calendar theme, light unless dark is set', () => {
    expect(calThemeFor('dark')).toBe('dark');
    expect(calThemeFor('light')).toBe('light');
    expect(calThemeFor(null)).toBe('light');
    expect(calThemeFor(undefined)).toBe('light');
    expect(calThemeFor('')).toBe('light');
  });
});

describe('booking event types', () => {
  it('offers the 15, 30 and 60 minute public event types, 15 by default, and never the hidden default one', () => {
    expect(calBooking.events).toEqual({ intro: '15min', product: '30min', deepDive: '60min' });
    expect(calBooking.events.intro).toBe('15min');
    expect(Object.values(calBooking.events)).not.toContain('secret');
  });
});

describe('booking lengths', () => {
  it('accepts exactly the 15, 30 and 60 minute formats', () => {
    expect(bookingLengths).toEqual([15, 30, 60]);
    for (const minutes of bookingLengths) expect(isBookingMinutes(minutes)).toBe(true);
    for (const value of [45, 0, '15', '30', null, undefined, NaN]) {
      expect(isBookingMinutes(value)).toBe(false);
    }
  });
});

describe('booking confirmation', () => {
  it('listens to the current Cal.com success event and to the older one', () => {
    expect(calBookedActions).toContain('bookingSuccessfulV2');
    expect(calBookedActions).toContain('bookingSuccessful');
  });

  it('fades the calendar in on the embed ready event', () => {
    expect(calReadyAction).toBe('linkReady');
  });

  it('shows the failed message on the embed event for a link Cal cannot find', () => {
    expect(calFailedAction).toBe('linkFailed');
    expect(calFailedAction).not.toBe(calReadyAction);
  });
});

describe('call page copy', () => {
  it('contains no em dash or en dash in either locale', () => {
    expect(JSON.stringify(uiCopy.call)).not.toMatch(/[—–]/);
  });

  it('gives every string of the page both locales', () => {
    const strings = localizedStrings(uiCopy.call);
    expect(strings.length).toBeGreaterThan(20);
    for (const { ru, en } of strings) {
      expect(ru, 'ru').toBeTruthy();
      expect(en, 'en').toBeTruthy();
    }
  });

  it('names the failed message, its links and the frame in both locales', () => {
    for (const field of [
      uiCopy.call.failed,
      uiCopy.call.openCalLink,
      uiCopy.call.openCal,
      uiCopy.call.noscript,
      uiCopy.call.frameTitle,
      uiCopy.call.preferWrite,
      uiCopy.call.facts.zone,
    ]) {
      expect(field.ru).toBeTruthy();
      expect(field.en).toBeTruthy();
    }
  });

  it('gives each format a title, a time and a note in both locales', () => {
    for (const format of [uiCopy.call.formats.intro, uiCopy.call.formats.product, uiCopy.call.formats.deepDive]) {
      for (const field of [format.time, format.title, format.note]) {
        expect(field.ru).toBeTruthy();
        expect(field.en).toBeTruthy();
      }
    }
  });
});

describe('thank-you page copy', () => {
  it('has the title, the invitation, the lead-in and the three links in both locales, with no dashes', () => {
    const copy = uiCopy.callThanks;
    for (const field of [copy.title, copy.invite, copy.prepare, copy.caseLink, copy.telegram]) {
      expect(field.ru).toBeTruthy();
      expect(field.en).toBeTruthy();
    }
    expect(JSON.stringify(copy)).not.toMatch(/[—–]/);
  });
});

describeBuilt('built thank-you pages', () => {
  const thanksPages = [
    path.join(DIST, 'call', 'thanks', 'index.html'),
    path.join(DIST, 'ru', 'call', 'thanks', 'index.html'),
  ];

  it('clears the address before any module script runs', () => {
    for (const file of thanksPages) {
      const html = readFileSync(file, 'utf8');
      const clean = html.search(/history\.replaceState\(null,\s*'',\s*location\.pathname\)/);
      const firstModule = html.indexOf('<script type="module"');
      expect(clean, `${file} has no address-cleaning script`).toBeGreaterThan(-1);
      expect(firstModule === -1 || clean < firstModule, `${file} runs a module before cleaning the address`).toBe(true);
    }
  });

  it('keeps the thank-you pages out of the index, the sitemap and llms.txt', () => {
    for (const file of thanksPages) {
      const robots = readFileSync(file, 'utf8').match(/<meta name="robots" content="([^"]*)"/)?.[1];
      expect(robots, `${file} robots`).toBe('noindex,follow');
    }
    expect(readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')).not.toContain('/call/');
    expect(readFileSync(path.join(DIST, 'llms.txt'), 'utf8')).not.toContain('/call/');
  });
});

describeBuilt('built booking page', () => {
  const pages = [
    { file: path.join(DIST, 'call', 'index.html'), locale: 'en', image: '/og/call-en.png' },
    { file: path.join(DIST, 'ru', 'call', 'index.html'), locale: 'ru', image: '/og/call-ru.png' },
  ] as const;

  it('offers each format with its length, in a section marked for analytics', () => {
    for (const { file } of pages) {
      const html = readFileSync(file, 'utf8');
      expect(html, `${file} section placement`).toContain('data-analytics-placement="call"');
      for (const [slug, minutes] of [['15min', 15], ['30min', 30], ['60min', 60]] as const) {
        expect(html, `${file} ${slug} length`).toMatch(new RegExp(`value="${slug}" data-minutes="${minutes}"`));
      }
    }
  });

  it('shows the loading state before the script runs, with the failed message and its links in the card', () => {
    for (const { file } of pages) {
      const html = readFileSync(file, 'utf8');
      expect(html, `${file} loading state`).toContain('data-state="loading"');
      expect(html, `${file} failed link`).toContain('data-call-open-inline');
      expect(html, `${file} zone row`).toMatch(/data-call-zone data-zone-label="[^"]+"/);
      expect(html, `${file} frame title`).toMatch(/data-frame-title="[^"]+"/);
    }
  });

  it('previews with its own link card in each locale, with the card described', () => {
    for (const { file, image } of pages) {
      const html = readFileSync(file, 'utf8');
      const src = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? '';
      expect(src, `${file} og:image`).toMatch(new RegExp(`${image.replace('.', '\\.')}\\?v=`));
      expect(html.match(/<meta property="og:image:alt" content="([^"]*)"/)?.[1], `${file} alt`).toBeTruthy();
      expect(existsSync(path.join(DIST, image))).toBe(true);
    }
  });
});
