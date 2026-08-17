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
import {
  contactChannel,
  isCvPath,
  isInternal,
  outreachTag,
  projectDestination,
  projectSlugFromPath,
} from '../lib/analytics-links';

const DEFAULT_HOST = 'https://eu.i.posthog.com';

interface AnalyticsState {
  initialized: boolean;
  clicksBound: boolean;
  cvViewsBound: boolean;
}

declare global {
  interface Window {
    __portfolioAnalyticsState?: AnalyticsState;
  }
}

const state: AnalyticsState = window.__portfolioAnalyticsState ?? {
  initialized: false,
  clicksBound: false,
  cvViewsBound: false,
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
  bindCvViewTracking();
}

/**
 * A dedicated event rather than relying on the pageview: the resume is the
 * one page whose views are the point, and a named event survives any future
 * change to pageview handling.
 *
 * Both an immediate call and an astro:page-load listener are needed, and they
 * would otherwise double-count. This module is imported dynamically, so it can
 * finish loading either before or after astro:page-load fires on the initial
 * load; whichever happens, exactly one of the two paths has to record the
 * view. Hence the dedupe on href, cleared when the visitor leaves the page so
 * that navigating away and back counts again.
 */
function bindCvViewTracking(): void {
  if (state.cvViewsBound) return;
  state.cvViewsBound = true;

  let capturedHref: string | null = null;

  const capture = () => {
    if (!isCvPath(window.location.pathname)) return;
    if (capturedHref === window.location.href) return;
    capturedHref = window.location.href;

    const tag = outreachTag(window.location.search);
    posthog.capture('cv:view', {
      ...baseProps(),
      ...(tag ? { cv_src: tag } : {}),
    });
  };

  document.addEventListener('astro:page-load', capture);
  document.addEventListener('astro:before-swap', () => {
    capturedHref = null;
  });
  capture();
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

/**
 * Repo and demo links on a card carry no slug of their own, so read it off the
 * sibling case-study link.
 *
 * The selector must name the card classes rather than just <article>: blog posts
 * and case studies wrap their whole body in <article class="post-shell">, so a
 * bare closest('article') matched there too and handed every link in a post the
 * slug of the first case study the prose happened to link to.
 */
const CARD_SELECTOR = 'article.project-card, article.project-card-pet, article.featured-case';

function projectSlugFromCard(anchor: HTMLAnchorElement): string | null {
  const card = anchor.closest(CARD_SELECTOR);
  const caseLink = card?.querySelector<HTMLAnchorElement>('a[href*="/projects/"]');
  if (!caseLink) return null;

  try {
    return projectSlugFromPath(new URL(caseLink.href, window.location.href).pathname);
  } catch {
    return null;
  }
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
      // The outreach tag rides along so a download can be attributed to the
      // message that produced it, not just counted.
      const tag = outreachTag(window.location.search);
      posthog.capture('cv:pdf_download', {
        ...baseProps(),
        link_href: url.pathname,
        ...(tag ? { cv_src: tag } : {}),
      });
      return;
    }

    // Contact is checked before projects: now that github only matches the bare
    // profile, no contact channel can also be a project link, so the two no
    // longer compete for the same click.
    const channel = contactChannel(url);
    if (channel) {
      posthog.capture('contact:link_click', {
        ...baseProps(),
        contact_channel: channel,
        link_href: url.href,
      });
      return;
    }

    // A project link is the case-study URL itself, a sibling link inside a card,
    // or a link the case-study page explicitly tags as belonging to the project
    // it describes (the "Repository" quick fact, which sits outside any card).
    //
    // That last case is opt-in via data-project-link rather than "any outbound
    // link while on a case page": the loose version also claimed the footer's
    // link to this site's own source on all 16 case pages, plus every
    // third-party repo credited in the prose.
    const projectSlug =
      projectSlugFromPath(url.pathname) ??
      projectSlugFromCard(anchor) ??
      (anchor.dataset.projectLink ? projectSlugFromPath(window.location.pathname) : null);

    if (projectSlug) {
      posthog.capture('project:card_click', {
        ...baseProps(),
        project_slug: projectSlug,
        link_destination: projectDestination(url, window.location.host),
        link_href: url.href,
      });
      return;
    }

    if (!isInternal(url, window.location.host) && (url.protocol === 'http:' || url.protocol === 'https:')) {
      posthog.capture('outbound:link_click', {
        ...baseProps(),
        link_host: url.hostname,
        link_href: url.href,
      });
    }
  });
}
