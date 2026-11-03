/**
 * The /call/ page's client side (CallBooking.astro). It shows the details of the
 * format picked, draws the Cal.com calendar inline for that format and draws it
 * again when the format changes, follows the site theme, reports the format's
 * length (booking:select, booking:done) and sends a confirmed booking to the
 * thank-you page. Bundled with the page, so it loads on the call pages only,
 * together with Cal's embed script.
 *
 * The calendar stage fades in once Cal reports it ready, and a format switch
 * fades the old calendar out before the new one is drawn. Both fades are
 * instant under reduced motion.
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
// After this long without a loaded frame the loading line gives way. The link
// to Cal.com stays on the page either way.
const LOAD_TIMEOUT_MS = 20000;
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
let readyWatched = false;
let thanksOpened = false;
let frameWatch: MutationObserver | undefined;
let drawTimer: number | undefined;
let loadTimer: number | undefined;
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
// ignored; the new one reports its own.
const markReady = () => {
  const embed = document.querySelector<HTMLElement>('[data-call-embed]');
  if (!embed || drawTimer !== undefined) return;
  window.clearTimeout(loadTimer);
  setState(embed, 'ready');
};

// The frame's own load event is the fallback for the ready report. It only
// counts for the frame on screen: a frame a later format switch replaced must
// not mark the new one ready.
const watchFrame = (stage: HTMLElement): MutationObserver => {
  const observer = new MutationObserver(() => {
    const frame = stage.querySelector('iframe');
    if (!frame) return;
    observer.disconnect();
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
  const fallback = section.querySelector<HTMLAnchorElement>('[data-call-open]');
  if (!embed || !stage || !fallback) return;

  const eventSlug = format.value;
  const user = section.dataset.callUser ?? '';
  const locale = localeOf(section);
  fallback.href = buildCalPublicUrl(user, eventSlug, locale);
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

// Cal's embed reports the calendar ready. The subscription lives on the Cal
// namespace, so it is made once per document.
const watchReady = () => {
  if (readyWatched) return;
  readyWatched = true;
  callCal('on', { action: calReadyAction, callback: markReady });
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
  watchReady();
  watchBookings();

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
