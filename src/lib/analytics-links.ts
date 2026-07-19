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
