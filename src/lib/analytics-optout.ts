// Owner opt-out for analytics.
//
// The author opens his own site constantly: checking a deploy, copying the
// resume link into an application, reading a case study before an interview.
// He does it through a VPN whose exits sit in Estonia, Finland, the
// Netherlands and Germany, so in PostHog those visits look like real visitors
// from abroad — the one audience the site exists to measure. Over the first
// six months roughly 40% of all sessions were his own.
//
// Opening any page once with `?me=1` remembers the opt-out in localStorage for
// that browser; `?me=0` forgets it. With the flag set, analytics is never
// initialised, so no request leaves the page at all.
//
// This is the only thing the site ever writes to a visitor's device, and it is
// written only when a visitor adds the flag by hand — an ordinary visit reads
// the key and writes nothing. Kept free of DOM and SDK imports so it can be
// unit-tested with a fake storage.

export const OPT_OUT_KEY = 'rebsem:analytics-off';

export type OptOutStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * The `?me=` flag from the query string: `1`, `true`, `yes` or a bare `?me`
 * opt out, `0`, `false`, `no` opt back in, anything else changes nothing.
 */
export function ownerFlag(search: string): 'on' | 'off' | null {
  const raw = new URLSearchParams(search).get('me');
  if (raw === null) return null;

  const value = raw.trim().toLowerCase();
  if (value === '' || value === '1' || value === 'true' || value === 'yes') return 'on';
  if (value === '0' || value === 'false' || value === 'no') return 'off';
  return null;
}

/**
 * Applies the query flag to storage and says whether analytics must stay off.
 *
 * Storage access is wrapped rather than assumed: Safari in private mode and
 * browsers set to block site data throw on the accessor itself, and analytics
 * must never break the page. Without storage the flag still counts for this
 * one page load, so a `?me=1` link works even where nothing can be remembered.
 */
export function isOwnerOptedOut(search: string, storage: OptOutStorage | null): boolean {
  const flag = ownerFlag(search);
  if (!storage) return flag === 'on';

  try {
    if (flag === 'on') storage.setItem(OPT_OUT_KEY, '1');
    if (flag === 'off') storage.removeItem(OPT_OUT_KEY);
    return storage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return flag === 'on';
  }
}
