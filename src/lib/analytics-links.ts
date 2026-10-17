// Pure link classification for analytics events. Kept free of DOM and SDK
// imports so it can be unit-tested — the ordering between "contact" and
// "project" is subtle enough that it earned a test suite.

export type ContactChannel = 'telegram' | 'email' | 'github' | 'linkedin';
export type ProjectDestination = 'case' | 'repo' | 'demo';

export function isInternal(url: URL, siteHost: string): boolean {
  return url.host === siteHost;
}

/**
 * A channel a visitor uses to reach out, or null when the link is something else.
 *
 * GitHub is the awkward one: the bare profile is a contact, but every deeper
 * path is a repository — the Repository fact on a case study, the merged-PRs
 * link in AgentOps, a repo cited in a post. Counting those as contact clicks
 * would drown the one number that actually signals hiring interest.
 */
export function contactChannel(url: URL): ContactChannel | null {
  if (url.protocol === 'mailto:') return 'email';
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const host = url.hostname.replace(/^www\./, '');
  // telegram.me is the working alias — see the note on telegramUrl in site-content.ts.
  if (host === 'telegram.me' || host === 't.me') return 'telegram';
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
  if (host === 'github.com') {
    return url.pathname.split('/').filter(Boolean).length <= 1 ? 'github' : null;
  }
  return null;
}

/** '/projects/foo' and '/ru/projects/foo' both yield 'foo'. Anything else is null. */
export function projectSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/(?:ru\/)?projects\/([^/]+)\/?$/);
  return match ? match[1] ?? null : null;
}

export function projectDestination(url: URL, siteHost: string): ProjectDestination {
  if (isInternal(url, siteHost)) return 'case';
  return url.hostname.replace(/^www\./, '') === 'github.com' ? 'repo' : 'demo';
}

/** The resume routes, both locales, with or without a trailing slash. */
export function isCvPath(pathname: string): boolean {
  return /^\/(?:ru\/)?cv\/?$/.test(pathname);
}

/**
 * The `?src=` tag on a resume link, e.g. /cv?src=exness. It records which
 * outreach a view came from, which is the only attribution this site can have:
 * every application goes out as a link in a direct message, and referrers do
 * not survive Telegram or a mail client.
 *
 * Sanitized rather than passed through. The value ends up in an analytics
 * property and anyone can put anything in a query string, so anything that is
 * not a short plain slug is dropped rather than recorded.
 */
export function outreachTag(search: string): string | null {
  return cleanKey(new URLSearchParams(search).get('src'));
}

/**
 * A short plain slug, or null. The one sanitizer for every value that ends
 * up in an analytics property from a query string or a data attribute.
 *
 * Rejected rather than truncated when it is too long: cutting to a fixed
 * length would collapse two different long tags into one identical value,
 * which is a worse failure for attribution than simply not recording it.
 */
export function cleanKey(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (cleaned.length > 40) return null;
  return /^[a-z0-9][a-z0-9._-]*$/.test(cleaned) ? cleaned : null;
}

/**
 * The href recorded for a contact click.
 *
 * A mailto with a prefilled subject and body (the home status block has one)
 * would otherwise land in `link_href` as a long percent-encoded template that
 * differs by locale and changes with every copy edit. The address is what
 * identifies the channel; whether the template was used is a flag.
 */
export function contactHref(url: URL): { href: string; prefilled: boolean } {
  if (url.protocol !== 'mailto:') return { href: url.href, prefilled: false };
  const params = new URLSearchParams(url.search);
  let address = url.pathname;
  try {
    address = decodeURIComponent(address);
  } catch {
    // A malformed escape is still an address worth counting as-is.
  }
  return {
    href: `mailto:${address.toLowerCase()}`,
    prefilled: params.has('subject') || params.has('body'),
  };
}
