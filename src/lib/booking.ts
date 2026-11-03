import type { Locale } from '../types/content';

/**
 * Pure helpers for the /call/ booking page. The component (CallBooking.astro)
 * and the client module (src/scripts/call-booking.ts) use them; this file has no
 * DOM and no SDK imports, so tests/booking.test.ts can check every link and option.
 */

export const calOrigin = 'https://cal.com';

export type CalTheme = 'light' | 'dark';

// The calendar's brand colour, one per site theme. Light takes the darker
// accent (the --accent-text token): the selected day puts white text on this
// fill, and the bright accent would fail contrast.
export const calBrand: Record<CalTheme, string> = {
  light: '#006e49',
  dark: '#2dd692',
};

export const calThemeFor = (siteTheme: string | null | undefined): CalTheme =>
  siteTheme === 'dark' ? 'dark' : 'light';

export const callPagePath = (locale: Locale): string => (locale === 'ru' ? '/ru/call/' : '/call/');

export const callThanksPath = (locale: Locale): string => `${callPagePath(locale)}thanks/`;

// The embed events that mean a booking was confirmed. Cal.com sends the newer
// one; the older one is listened to as well, in case a version sends only that.
export const calBookedActions = ['bookingSuccessfulV2', 'bookingSuccessful'] as const;

// The embed names the calendar as "user/event" and builds its own iframe URL
// from it, so the user slug is passed unencoded: encoding it here would make
// the embed encode it a second time.
export const buildCalEmbedLink = (user: string, eventSlug: string): string => `${user}/${eventSlug}`;

// The public event page behind the fallback link. The user slug is
// percent-encoded, since it is Cyrillic.
export const buildCalPublicUrl = (user: string, eventSlug: string, locale: Locale): string => {
  const url = new URL(`${calOrigin}/${encodeURIComponent(user)}/${encodeURIComponent(eventSlug)}`);
  url.searchParams.set('language', locale);
  return url.toString();
};

export const buildCalInlineOptions = (
  user: string,
  eventSlug: string,
  locale: Locale,
  selector: string,
) => ({
  elementOrSelector: selector,
  calLink: buildCalEmbedLink(user, eventSlug),
  config: { layout: 'month_view', language: locale },
});

export const calUiOptions = (theme: CalTheme) => ({
  hideEventTypeDetails: true,
  layout: 'month_view',
  theme,
  cssVarsPerTheme: {
    light: { 'cal-brand': calBrand.light },
    dark: { 'cal-brand': calBrand.dark },
  },
});
