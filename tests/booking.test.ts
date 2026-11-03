import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { calBooking, uiCopy } from '../src/data/site-content';
import {
  buildCalEmbedLink,
  buildCalInlineOptions,
  buildCalPublicUrl,
  calBookedActions,
  calBrand,
  calThemeFor,
  calUiOptions,
  callPagePath,
  callThanksPath,
} from '../src/lib/booking';

const DIST = path.resolve('dist');
const describeBuilt = existsSync(path.join(DIST, 'call', 'thanks', 'index.html')) ? describe : describe.skip;

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

describe('booking confirmation', () => {
  it('listens to the current Cal.com success event and to the older one', () => {
    expect(calBookedActions).toContain('bookingSuccessfulV2');
    expect(calBookedActions).toContain('bookingSuccessful');
  });
});

describe('call page copy', () => {
  it('contains no em dash or en dash in either locale', () => {
    expect(JSON.stringify(uiCopy.call)).not.toMatch(/[—–]/);
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
