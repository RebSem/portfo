// Product analytics. Loaded lazily from src/components/Analytics.astro, which
// imports this module only when a token was present at build time.
//
// Pageviews are NOT captured here on purpose. `capture_pageview:
// 'history_change'` patches history.pushState / replaceState and listens for
// popstate — which is exactly how Astro's <ClientRouter /> navigates — so every
// soft navigation fires a pageview with no lifecycle wiring. The first one
// comes from the SDK's own idempotent path, so there is no double count.
// Capturing manually on astro:page-load would double every route.
//
// The click listener is bound to `document`, which survives ClientRouter swaps
// (<body> is replaced, the document is not), so it binds exactly once — the
// same reasoning as the MutationObserver in theme-images.js.

import posthog from 'posthog-js';

const DEFAULT_HOST = 'https://eu.i.posthog.com';

type ContactChannel = 'telegram' | 'email' | 'github' | 'linkedin';
type ProjectDestination = 'case' | 'repo' | 'demo';

interface AnalyticsState {
  initialized: boolean;
  clicksBound: boolean;
}

declare global {
  interface Window {
    __portfolioAnalyticsState?: AnalyticsState;
  }
}

const state: AnalyticsState = window.__portfolioAnalyticsState ?? {
  initialized: false,
  clicksBound: false,
};

window.__portfolioAnalyticsState = state;

export function initAnalytics(token: string, host?: string): void {
  if (state.initialized) return;
  state.initialized = true;

  posthog.init(token, {
    api_host: host || DEFAULT_HOST,

    // Dated snapshot of the SDK's starting values, so an SDK upgrade cannot
    // silently change behaviour. Everything we actually rely on is also set
    // explicitly below. Note the comparison is a raw string compare — only a
    // real date from the ConfigDefaults union is safe here.
    defaults: '2026-05-30',

    // --- pageviews ---------------------------------------------------
    capture_pageview: 'history_change',
    // The shipped default is the sentinel 'if_capture_pageview', not `true` as
    // the docs table claims. Pinned so it survives changes to capture_pageview.
    // Fires only on real pagehide, never on soft navigation — so this is one
    // event per visit, not per route. Do not build time-on-page on it.
    capture_pageleave: true,

    // --- identity ----------------------------------------------------
    // Nothing is written to the visitor's device: no cookie, no localStorage,
    // no sessionStorage. Because <ClientRouter /> never reloads the document,
    // an in-memory id still spans a whole visit; it resets on hard reload, new
    // tab, or any outbound round trip. Returning visitors are therefore not
    // recognisable — that is the accepted trade for needing no consent banner.
    //
    // Deliberately NOT cookieless_mode: 'always'. That mode moves the identity
    // to a server-side hash of IP + user agent, which strips the IP before
    // enrichment runs and kills GeoIP entirely — the one breakdown that matters
    // for a "remote, open to relocation" positioning.
    persistence: 'memory',
    // Already the default; explicit because it is the privacy-relevant choice.
    // Nothing on this site calls identify(), so no person profile is ever made.
    person_profiles: 'identified_only',
    respect_dnt: true,
    mask_personal_data_properties: true,

    // Autocapture is what makes the outbound-clicks and bounce-rate views work.
    // It survives advanced_disable_flags below.
    autocapture: true,

    // --- network diet ------------------------------------------------
    // Drops the /flags request, the remote-config fetch and its refresh timer.
    // Everything normally gated by remote config is pinned off explicitly below,
    // because with flags disabled an unset option can no longer be turned on.
    advanced_disable_flags: true,
    // No third-party script is ever fetched at runtime.
    disable_external_dependency_loading: true,

    // --- features we do not want -------------------------------------
    // Session replay is off deliberately: a private config needs
    // maskTextSelector: '*', which reduces a form-less CV site to a grey
    // wireframe — roughly what the free scroll-depth properties already tell
    // us — while adding ~35 KB and a continuous upload.
    disable_session_recording: true,
    disable_surveys: true,
    disable_web_experiments: true,
    capture_heatmaps: false,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_performance: false,
    opt_in_site_apps: false,
  });

  bindClickTracking();
}

function pageLocale(): string {
  return document.documentElement.getAttribute('data-locale') ?? 'en';
}

function baseProps(): Record<string, string> {
  return {
    page_locale: pageLocale(),
    page_path: window.location.pathname,
  };
}

function isInternal(url: URL): boolean {
  return url.host === window.location.host;
}

function contactChannel(url: URL): ContactChannel | null {
  if (url.protocol === 'mailto:') return 'email';
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

  const host = url.hostname.replace(/^www\./, '');
  // telegram.me is the working alias — see the note on telegramUrl in site-content.ts.
  if (host === 'telegram.me' || host === 't.me') return 'telegram';
  if (host === 'github.com') return 'github';
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin';
  return null;
}

/** '/projects/foo' and '/ru/projects/foo' both yield 'foo'. */
function projectSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/(?:ru\/)?projects\/([^/]+)\/?$/);
  return match ? match[1] ?? null : null;
}

/**
 * Repo and demo links carry no slug of their own, so read it off the sibling
 * case-study link. Every card variant (.project-card, .project-card-pet,
 * .featured-case) is an <article>, so that is the reliable container.
 */
function projectSlugFromCard(anchor: HTMLAnchorElement): string | null {
  const card = anchor.closest('article');
  const caseLink = card?.querySelector<HTMLAnchorElement>('a[href*="/projects/"]');
  if (!caseLink) return null;

  try {
    return projectSlugFromPath(new URL(caseLink.href, window.location.href).pathname);
  } catch {
    return null;
  }
}

function projectDestination(url: URL): ProjectDestination {
  if (isInternal(url)) return 'case';
  return url.hostname.replace(/^www\./, '') === 'github.com' ? 'repo' : 'demo';
}

// Autocapture keys events on DOM text, which on a bilingual site splits every
// CTA into a Russian and an English event and breaks history on any copy edit.
// The handful of clicks that actually mean something get stable names here.
function bindClickTracking(): void {
  if (state.clicksBound) return;
  state.clicksBound = true;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a');
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const raw = anchor.getAttribute('href');
    if (!raw || raw.startsWith('#')) return;

    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }

    // Order matters: a project's GitHub link would otherwise be counted as a
    // contact click, since both live on github.com.

    if (anchor.id === 'locale-switcher') {
      const from = pageLocale();
      posthog.capture('locale:toggle_click', {
        ...baseProps(),
        locale_from: from,
        locale_to: from === 'ru' ? 'en' : 'ru',
      });
      return;
    }

    // Catches the CV as soon as it is served from a .pdf path; the data
    // attribute is the escape hatch if it ever lands on a prettier URL.
    if (url.pathname.toLowerCase().endsWith('.pdf') || anchor.dataset.analytics === 'cv-download') {
      posthog.capture('cv:pdf_download', {
        ...baseProps(),
        link_href: url.pathname,
      });
      return;
    }

    const projectSlug = projectSlugFromPath(url.pathname) ?? projectSlugFromCard(anchor);
    if (projectSlug) {
      posthog.capture('project:card_click', {
        ...baseProps(),
        project_slug: projectSlug,
        link_destination: projectDestination(url),
        link_href: url.href,
      });
      return;
    }

    const channel = contactChannel(url);
    if (channel) {
      posthog.capture('contact:link_click', {
        ...baseProps(),
        contact_channel: channel,
        link_href: url.href,
      });
      return;
    }

    if (!isInternal(url) && (url.protocol === 'http:' || url.protocol === 'https:')) {
      posthog.capture('outbound:link_click', {
        ...baseProps(),
        link_host: url.hostname,
        link_href: url.href,
      });
    }
  });
}
