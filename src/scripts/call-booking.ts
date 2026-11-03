/**
 * The /call/ page's client side (CallBooking.astro). It shows the details of the
 * format picked and the time zone the times are in, draws the Cal.com calendar
 * inline for that format and draws it again when the format changes, follows
 * the site theme, reports the format's length (booking:select, booking:done) and
 * sends a confirmed booking to the thank-you page. Bundled with the page, so it
 * loads on the call pages only, together with Cal's embed script.
 *
 * The calendar stage fades in once Cal reports it ready, and a format switch
 * fades the old calendar out before the new one is drawn. Both fades are
 * instant under reduced motion. A calendar that cannot load (the embed script is
 * blocked, Cal reports a link it cannot find, or nothing draws in time) gives
 * way to a message with the links to Cal.com and Telegram.
 *
 * A soft navigation swaps the whole page, so every load of a call page gets its
 * own calendar (boot checks the page for one). The Cal.com loader and the theme
 * observer are set up once per document.
 */

import {
  type BookingMinutes,
  buildCalInlineOptions,
  buildCalPublicUrl,
  calBookedActions,
  calFailedAction,
  calOrigin,
  calReadyAction,
  callThanksPath,
  calThemeFor,
  calUiOptions,
  type CalTheme,
  isBookingMinutes,
} from '../lib/booking';
import { emitSignal } from '../lib/site-signals';
import type { Locale } from '../types/content';

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';
const NAMESPACE = 'call';
const STAGE_SELECTOR = '#call-stage';
// After this long without a drawn calendar the card shows the failed message,
// with the links to Cal.com and Telegram. A calendar that loads later still
// replaces it.
const LOAD_TIMEOUT_MS = 10000;
// The stage's fade, the --dur-base motion token in the stylesheet. A format
// switch waits this long for the old calendar to fade out before drawing the new.
const FADE_MS = 220;

type CalArgs = unknown[];

interface CalFunction {
  (...args: CalArgs): void;
  loaded?: boolean;
  q?: CalArgs[];
  ns?: Record<string, CalFunction>;
}

interface CalHost {
  Cal?: CalFunction;
}

let initialised = false;
let themeBound = false;
let bookingWatched = false;
let reportsWatched = false;
let thanksOpened = false;
let frameWatch: MutationObserver | undefined;
let drawTimer: number | undefined;
let loadTimer: number | undefined;
// Set when Cal reports the link as not found. Cal still draws its error page
// into the frame, and that frame's load event must not mark the calendar ready.
let linkBroken = false;
// Set when the embed script itself failed to load: no calendar can draw on this
// document, so later formats go straight to the failed message.
let scriptFailed = false;
// The length of the format on screen, read when a booking is confirmed.
let activeMinutes: BookingMinutes | undefined;

/**
 * Cal.com's loader, as its embed snippet writes it: the first call injects
 * embed.js, and calls made before the script arrives are queued on the
 * namespace and replayed by the script.
 */
const ensureCal = (): CalFunction => {
  const host = window as unknown as CalHost;
  if (host.Cal) return host.Cal;

  const root: CalFunction = (...args) => {
    if (!root.loaded) {
      root.ns = {};
      root.q ??= [];
      const script = document.createElement('script');
      script.src = EMBED_SRC;
      // A blocked or unreachable script never draws the calendar, so the failed
      // message shows now instead of after the timeout.
      script.addEventListener('error', () => {
        scriptFailed = true;
        markFailed();
      });
      document.head.append(script);
      root.loaded = true;
    }
    if (args[0] === 'init' && typeof args[1] === 'string') {
      const namespace = args[1];
      const ns = (root.ns ??= {});
      const api: CalFunction = (...apiArgs) => {
        (api.q ??= []).push(apiArgs);
      };
      const entry = ns[namespace] ?? api;
      ns[namespace] = entry;
      (entry.q ??= []).push(args);
      (root.q ??= []).push(['initNamespace', namespace]);
      return;
    }
    (root.q ??= []).push(args);
  };

  host.Cal = root;
  return root;
};

const callCal = (...args: CalArgs) => {
  const api = (window as unknown as CalHost).Cal?.ns?.[NAMESPACE];
  api?.(...args);
};

const currentTheme = (): CalTheme =>
  calThemeFor(document.documentElement.getAttribute('data-theme'));

const localeOf = (section: HTMLElement): Locale => (section.dataset.locale === 'ru' ? 'ru' : 'en');

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setState = (embed: HTMLElement, state: 'loading' | 'ready' | 'failed') => {
  embed.dataset.state = state;
};

// Cal reports a calendar ready once it has drawn. A report that arrives while
// the next format still waits to be drawn belongs to the old calendar, so it is
// ignored; the new one reports its own. A link Cal reported as broken stays
// failed, whatever its frame does afterwards.
const markReady = () => {
  const embed = document.querySelector<HTMLElement>('[data-call-embed]');
  if (!embed || drawTimer !== undefined || linkBroken) return;
  window.clearTimeout(loadTimer);
  setState(embed, 'ready');
};

// The failed message takes the card's place. It is used for a blocked embed
// script, a link Cal cannot find and a calendar that does not draw in time.
const markFailed = () => {
  const embed = document.querySelector<HTMLElement>('[data-call-embed]');
  if (!embed) return;
  window.clearTimeout(loadTimer);
  setState(embed, 'failed');
};

// Cal's linkFailed report. Like the ready report, one for a format that is still
// waiting to be drawn belongs to the old calendar and is ignored.
const onLinkFailed = () => {
  if (drawTimer !== undefined) return;
  linkBroken = true;
  markFailed();
};

// The frame's own load event is the fallback for the ready report. It only
// counts for the frame on screen: a frame a later format switch replaced must
// not mark the new one ready. Cal titles its frame in English on both locales,
// so the frame gets the page's own title, set in the markup.
const watchFrame = (stage: HTMLElement): MutationObserver => {
  const observer = new MutationObserver(() => {
    const frame = stage.querySelector('iframe');
    if (!frame) return;
    observer.disconnect();
    if (stage.dataset.frameTitle) frame.title = stage.dataset.frameTitle;
    frame.addEventListener(
      'load',
      () => {
        if (stage.querySelector('iframe') === frame) markReady();
      },
      { once: true },
    );
  });
  observer.observe(stage, { childList: true, subtree: true });
  return observer;
};

// The format's length, from the data-minutes the page renders on each option.
const minutesOf = (input: HTMLInputElement): BookingMinutes | undefined => {
  const minutes = Number(input.dataset.minutes);
  return isBookingMinutes(minutes) ? minutes : undefined;
};

// The panel's title, note and facts follow the format picked: one detail block
// is shown, the others stay hidden.
const showDetail = (section: HTMLElement, eventSlug: string) => {
  for (const detail of section.querySelectorAll<HTMLElement>('[data-call-detail]')) {
    detail.hidden = detail.dataset.callDetail !== eventSlug;
  }
};

const drawCalendar = (
  embed: HTMLElement,
  stage: HTMLElement,
  user: string,
  eventSlug: string,
  locale: Locale,
) => {
  drawTimer = undefined;
  // The page may have been swapped out by a soft navigation while the timer ran.
  if (!stage.isConnected) return;
  stage.replaceChildren();
  linkBroken = false;
  if (scriptFailed) {
    setState(embed, 'failed');
    return;
  }
  frameWatch = watchFrame(stage);
  loadTimer = window.setTimeout(() => {
    if (embed.dataset.state === 'loading') setState(embed, 'failed');
  }, LOAD_TIMEOUT_MS);

  callCal('inline', buildCalInlineOptions(user, eventSlug, locale, STAGE_SELECTOR));
  callCal('ui', calUiOptions(currentTheme()));
};

const showFormat = (section: HTMLElement, format: HTMLInputElement) => {
  const embed = section.querySelector<HTMLElement>('[data-call-embed]');
  const stage = section.querySelector<HTMLElement>(STAGE_SELECTOR);
  if (!embed || !stage) return;

  const eventSlug = format.value;
  const user = section.dataset.callUser ?? '';
  const locale = localeOf(section);
  // Every link to Cal.com for this format: the one under the card and the one
  // in the failed message.
  const publicUrl = buildCalPublicUrl(user, eventSlug, locale);
  for (const link of section.querySelectorAll<HTMLAnchorElement>('[data-call-open], [data-call-open-inline]')) {
    link.href = publicUrl;
  }
  activeMinutes = minutesOf(format);
  showDetail(section, eventSlug);

  // A switch fades the old calendar out before the new one is drawn. The first
  // draw on the page has no calendar to fade.
  const replacing = stage.querySelector('iframe') !== null && !reducedMotion();

  frameWatch?.disconnect();
  window.clearTimeout(drawTimer);
  window.clearTimeout(loadTimer);
  setState(embed, 'loading');
  drawTimer = window.setTimeout(
    () => drawCalendar(embed, stage, user, eventSlug, locale),
    replacing ? FADE_MS : 0,
  );
};

// Cal's embed reports the calendar ready, or a link it cannot find. The
// subscriptions live on the Cal namespace, so they are made once per document.
const watchReports = () => {
  if (reportsWatched) return;
  reportsWatched = true;
  callCal('on', { action: calReadyAction, callback: markReady });
  callCal('on', { action: calFailedAction, callback: onLinkFailed });
};

// The time zone the calendar draws its times in, named in the details panel.
// Read from the browser on the page; nothing is stored or sent.
const showZone = (section: HTMLElement) => {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!zone) return;
  for (const el of section.querySelectorAll<HTMLElement>('[data-call-zone]')) {
    el.textContent = `${zone}, ${el.dataset.zoneLabel ?? ''}`;
  }
};

// A confirmed booking moves the visitor to the thank-you page of their locale.
// Only the plain path goes into the URL, never the booking itself.
//
// For bookings made on cal.com directly, the owner sets each event type's
// "Redirect on booking" to https://rebsem.ru/call/thanks/ in Cal.com, with
// parameter forwarding off, so the booking details never reach the address.
const watchBookings = () => {
  if (bookingWatched) return;
  bookingWatched = true;

  const onBooked = () => {
    // The page may have been swapped out by a soft navigation since the
    // subscription; the callback then has no call page to answer for.
    const section = document.querySelector<HTMLElement>('[data-call-booking]');
    if (!section || thanksOpened) return;
    thanksOpened = true;
    // Reported before the redirect; only the length goes out with it.
    if (activeMinutes) emitSignal('booking:done', { minutes: activeMinutes });
    window.location.assign(callThanksPath(localeOf(section)));
  };

  for (const action of calBookedActions) callCal('on', { action, callback: onBooked });
};

// Cal's ui call re-themes a calendar already on the page, so a theme toggle
// changes the colours without drawing the calendar again.
const bindThemeSync = () => {
  if (themeBound) return;
  themeBound = true;
  new MutationObserver(() => {
    if (document.querySelector('[data-call-embed]')) callCal('ui', calUiOptions(currentTheme()));
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
};

const boot = () => {
  const section = document.querySelector<HTMLElement>('[data-call-booking]');
  // The module runs once at load and again on astro:page-load; one call page
  // gets one set-up, whichever of the two comes first.
  if (!section || section.dataset.callBooted !== undefined) return;
  section.dataset.callBooted = '';

  if (!initialised) {
    ensureCal()('init', NAMESPACE, { origin: calOrigin });
    initialised = true;
  }
  watchReports();
  watchBookings();
  showZone(section);

  section.querySelector<HTMLElement>('[data-call-formats]')?.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.checked) return;
    showFormat(section, input);
    // Only a switch the visitor makes is reported, not the format the page opens on.
    const minutes = minutesOf(input);
    if (minutes) emitSignal('booking:select', { minutes });
  });

  const picked =
    section.querySelector<HTMLInputElement>('input[name="call-format"]:checked') ??
    section.querySelector<HTMLInputElement>('input[name="call-format"]');
  if (picked) showFormat(section, picked);

  bindThemeSync();
};

document.addEventListener('astro:page-load', boot);
boot();
