import { describe, expect, it } from 'vitest';
import { calBooking, uiCopy } from '../src/data/site-content';
import {
  buildCalEmbedLink,
  buildCalInlineOptions,
  buildCalPublicUrl,
  calBrand,
  calThemeFor,
  calUiOptions,
  callPagePath,
  callThanksPath,
} from '../src/lib/booking';

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
});

describe('embed options', () => {
  it('points the inline calendar at the chosen event, the locale and the page element', () => {
    const options = buildCalInlineOptions(calBooking.user, '30min', 'en', '#call-stage');
    expect(options.calLink).toBe(`${calBooking.user}/30min`);
    expect(options.elementOrSelector).toBe('#call-stage');
    expect(options.config).toEqual({ layout: 'month_view', language: 'en' });
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
  it('offers the two public event types, and never the hidden default one', () => {
    expect(calBooking.events).toEqual({ intro: '15min', product: '30min' });
    expect(Object.values(calBooking.events)).not.toContain('secret');
  });
});

describe('call page copy', () => {
  it('contains no em dash or en dash in either locale', () => {
    expect(JSON.stringify(uiCopy.call)).not.toMatch(/[—–]/);
  });

  it('gives each format a title, a time and a note in both locales', () => {
    for (const format of [uiCopy.call.formats.intro, uiCopy.call.formats.product]) {
      for (const field of [format.time, format.title, format.note]) {
        expect(field.ru).toBeTruthy();
        expect(field.en).toBeTruthy();
      }
    }
  });
});
