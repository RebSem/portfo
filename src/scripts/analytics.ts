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

import posthog, { type CaptureOptions } from 'posthog-js';
import { isOwnerOptedOut } from '../lib/analytics-optout';
import {
  contactChannel,
  isCvPath,
  isInternal,
  outreachTag,
  projectDestination,
  projectSlugFromPath,
} from '../lib/analytics-links';
import {
  EngagementTracker,
  classifyBrowser,
  scrollDepthPercent,
  sectionKey,
  type VisitorKind,
} from '../lib/visitor-signals';

const DEFAULT_HOST = 'https://eu.i.posthog.com';

interface AnalyticsState {
  initialized: boolean;
  clicksBound: boolean;
  cvViewsBound: boolean;
  engagementBound: boolean;
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
  engagementBound: false,
};

/**
 * Stamped onto every event in before_send (see visitor-signals.ts for what the
 * labels mean). before_send rather than register(): the SDK captures the first
 * pageview during init, before any register() call could run, and that first
 * pageview is exactly the one a link scanner produces.
 */
const visit: {
  visitor_kind: VisitorKind;
  visitor_flags: string;
  client_tz: string;
  cv_src?: string;
} = {
  visitor_kind: 'unverified',
  visitor_flags: '',
  client_tz: '',
};

function readVisitorSignals(): void {
  const verdict = classifyBrowser({
    userAgent: navigator.userAgent,
    webdriver: navigator.webdriver === true,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  });
  visit.visitor_kind = verdict.kind;
  visit.visitor_flags = verdict.flags.join(',');

  // Read against PostHog's own $geoip_time_zone: a sandbox in an Amsterdam
  // datacenter rarely runs on Amsterdam time.
  try {
    visit.client_tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    visit.client_tz = '';
  }

  // The outreach tag used to live on cv:view only, so a recruiter who went on
  // from /cv to a case study left the attribution behind. Now the whole visit
  // carries it.
  const tag = outreachTag(window.location.search);
  if (tag) visit.cv_src = tag;
}

window.__portfolioAnalyticsState = state;

export function initAnalytics(token: string, host?: string): void {
  if (state.initialized) return;
  state.initialized = true;

  // The owner's own browsers (see analytics-optout.ts): stop before init, so
  // not a single request leaves the page. The accessor itself can throw when
  // site data is blocked, hence the guard around reading localStorage.
  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  if (isOwnerOptedOut(window.location.search, storage)) return;

  readVisitorSignals();

  posthog.init(token, {
    api_host: host || DEFAULT_HOST,

    // Event-level properties win, so an event can still state its own values.
    before_send: (event) => {
      if (event) event.properties = { ...visit, ...event.properties };
      return event;
    },

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
    // no sessionStorage. (The one exception is the owner's own opt-out flag,
    // which only he ever sets — see analytics-optout.ts.)
    // Because <ClientRouter /> never reloads the document,
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

    // Heatmaps: click, mouse-position and scroll-depth coordinates batched into
    // $$heatmap events, no page text, nothing stored. Part of the core bundle,
    // so it works with external loading disabled; set explicitly because with
    // flags disabled the remote "heatmaps" switch never arrives. Automation is
    // in this data too; filter on visitor_kind in SQL.
    capture_heatmaps: true,

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
    // Dead-click detection is a lazily fetched extension, which the setting
    // above forbids.
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_performance: false,
    opt_in_site_apps: false,
  });

  bindClickTracking();
  bindCvViewTracking();
  bindEngagementTracking();
}

/**
 * A dedicated event rather than relying on the pageview: the resume is the
 * one page whose views are the point, and a named event survives any future
 * change to pageview handling.
 *
 * cv:view means "the page was opened", by anyone: mail scanners open every
 * link in an application, so most cv:view events are machines. cv:read (see
 * bindEngagementTracking) is the one that means a person read it.
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

interface PageVisit {
  href: string;
  path: string;
  locale: string;
  tracker: EngagementTracker;
  /** performance.now() when the page last became visible; null while hidden. */
  visibleSince: number | null;
  maxScroll: number;
  clicks: number;
  sections: Set<string>;
  observer: IntersectionObserver | null;
  engaged: boolean;
  closed: boolean;
  timer: number | null;
}

let current: PageVisit | null = null;

/**
 * Human signal per page view, three events:
 *
 * - page:engaged, once, when the page has been on screen for a few seconds AND
 *   real input arrived (a mouse path, a touch, wheel scrolling, a key). This is
 *   also the moment the whole visit is relabelled visitor_kind: 'human',
 *   unless the browser was already identified as automation.
 * - cv:read, the same moment on /cv: the human counterpart of cv:view.
 * - page:summary, when the visitor leaves the page: seconds actually on screen
 *   (unlike $pageleave, which counts a tab forgotten in the background), max
 *   scroll, input counts and which sections came into view.
 *
 * Same lifecycle reasoning as bindCvViewTracking: an immediate start plus
 * astro:page-load, deduplicated on href. A page closes on
 * astro:before-preparation (soft navigation, location still the old page) or
 * pagehide (sent by beacon, since the page is going away).
 */
function bindEngagementTracking(): void {
  if (state.engagementBound) return;
  state.engagementBound = true;

  const passive = { passive: true } as const;

  document.addEventListener(
    'pointermove',
    (event) => {
      if (event.isTrusted) current?.tracker.input('pointer', event.timeStamp, event.clientX, event.clientY);
    },
    passive,
  );
  document.addEventListener('touchstart', (event) => {
    if (event.isTrusted) current?.tracker.input('touch', event.timeStamp);
  }, passive);
  document.addEventListener('wheel', (event) => {
    if (event.isTrusted) current?.tracker.input('wheel', event.timeStamp);
  }, passive);
  document.addEventListener('keydown', (event) => {
    if (event.isTrusted) current?.tracker.input('key', event.timeStamp);
  });
  // Capture phase: a click on an internal link makes ClientRouter close the
  // page (astro:before-preparation) before a bubbling listener would run, and
  // that click belongs to the page it was made on.
  document.addEventListener('click', () => {
    if (current) current.clicks += 1;
  }, { capture: true, passive: true });

  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      recordScroll();
    });
  }, passive);

  document.addEventListener('visibilitychange', () => {
    if (!current || current.closed) return;
    if (document.visibilityState === 'visible') current.visibleSince = performance.now();
    else syncVisible(current);
  });

  document.addEventListener('astro:page-load', startPage);
  document.addEventListener('astro:before-preparation', () => closePage());
  window.addEventListener('pagehide', () => closePage({ transport: 'sendBeacon', send_instantly: true }));
  // Back/forward cache: the page that was closed on pagehide is alive again.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) startPage();
  });

  startPage();
}

function startPage(): void {
  if (current && !current.closed && current.href === window.location.href) return;
  if (current && !current.closed) closePage();

  const page: PageVisit = {
    href: window.location.href,
    path: window.location.pathname,
    locale: pageLocale(),
    tracker: new EngagementTracker(),
    visibleSince: document.visibilityState === 'visible' ? performance.now() : null,
    maxScroll: 0,
    clicks: 0,
    sections: new Set(),
    observer: null,
    engaged: false,
    closed: false,
    timer: null,
  };
  current = page;
  recordScroll();

  if (typeof IntersectionObserver === 'function') {
    // A section counts as seen once its top has come up into the upper part
    // of the screen, so a section merely peeking in at the bottom does not.
    page.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) page.sections.add(sectionName(entry.target));
        }
      },
      { rootMargin: '0px 0px -35% 0px' },
    );
    document.querySelectorAll('main section[aria-labelledby], footer').forEach((element) => {
      page.observer?.observe(element);
    });
  }

  page.timer = window.setInterval(checkEngaged, 1000);
}

function sectionName(element: Element): string {
  const labelledBy = element.getAttribute('aria-labelledby');
  return labelledBy ? sectionKey(labelledBy) : element.tagName.toLowerCase();
}

function recordScroll(): void {
  if (!current || current.closed) return;
  const depth = scrollDepthPercent(
    window.scrollY,
    window.innerHeight,
    document.documentElement.scrollHeight,
  );
  if (depth > current.maxScroll) current.maxScroll = depth;
}

function syncVisible(page: PageVisit): void {
  if (page.visibleSince === null) return;
  const now = performance.now();
  page.tracker.addVisible(now - page.visibleSince);
  page.visibleSince = document.visibilityState === 'visible' ? now : null;
}

function stopTimer(page: PageVisit): void {
  if (page.timer !== null) {
    window.clearInterval(page.timer);
    page.timer = null;
  }
}

function checkEngaged(): void {
  const page = current;
  if (!page || page.closed || page.engaged) return;
  syncVisible(page);
  if (!page.tracker.engaged) return;

  page.engaged = true;
  stopTimer(page);
  if (visit.visitor_kind !== 'automation') visit.visitor_kind = 'human';

  const props = {
    ...baseProps(),
    engaged_after_s: Math.round(page.tracker.visibleMs / 1000),
    input_evidence: page.tracker.evidence ?? 'none',
    max_scroll_pct: page.maxScroll,
  };
  posthog.capture('page:engaged', props);

  if (isCvPath(page.path)) {
    const tag = outreachTag(window.location.search);
    posthog.capture('cv:read', { ...props, ...(tag ? { cv_src: tag } : {}) });
  }
}

function closePage(options?: CaptureOptions): void {
  const page = current;
  if (!page || page.closed) return;
  syncVisible(page);
  page.closed = true;
  stopTimer(page);
  page.observer?.disconnect();

  posthog.capture(
    'page:summary',
    {
      page_locale: page.locale,
      page_path: page.path,
      active_s: Math.round(page.tracker.visibleMs / 1000),
      max_scroll_pct: page.maxScroll,
      engaged: page.engaged,
      input_evidence: page.tracker.evidence ?? 'none',
      pointer_moves: page.tracker.pointerMoves,
      touches: page.tracker.touches,
      wheels: page.tracker.wheels,
      keys: page.tracker.keys,
      clicks: page.clicks,
      sections_seen: [...page.sections],
    },
    options,
  );
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
