/**
 * The /call/ page's client side (CallBooking.astro). It draws the Cal.com
 * calendar inline for the format picked, draws it again when the format
 * changes, follows the site theme, and sends a confirmed booking to the
 * thank-you page. Bundled with the page, so it loads on the call pages only,
 * together with Cal's embed script.
 *
 * A soft navigation swaps the whole page, so every load of a call page gets its
 * own calendar (boot checks the page for one). The Cal.com loader and the theme
 * observer are set up once per document.
 */

import {
  buildCalInlineOptions,
  buildCalPublicUrl,
  calBookedActions,
  calOrigin,
  callThanksPath,
  calThemeFor,
  calUiOptions,
  type CalTheme,
} from '../lib/booking';
import type { Locale } from '../types/content';

const EMBED_SRC = 'https://app.cal.com/embed/embed.js';
const NAMESPACE = 'call';
const STAGE_SELECTOR = '#call-stage';
// After this long without a loaded frame the loading line gives way. The link
// to Cal.com stays on the page either way.
const LOAD_TIMEOUT_MS = 20000;

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
let thanksOpened = false;
let frameWatch: MutationObserver | undefined;
let loadTimer: number | undefined;

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

const setState = (embed: HTMLElement, state: 'loading' | 'ready' | 'failed') => {
  embed.dataset.state = state;
};

// Cal draws its iframe into the stage at once, but the calendar inside it
// loads later. The loading line stays until that frame has loaded.
const watchFrame = (embed: HTMLElement, stage: HTMLElement): MutationObserver => {
  const observer = new MutationObserver(() => {
    const frame = stage.querySelector('iframe');
    if (!frame) return;
    observer.disconnect();
    frame.addEventListener(
      'load',
      () => {
        // A frame that a later format switch replaced must not mark the new one ready.
        if (stage.querySelector('iframe') === frame) setState(embed, 'ready');
      },
      { once: true },
    );
  });
  observer.observe(stage, { childList: true, subtree: true });
  return observer;
};

const renderFormat = (section: HTMLElement, eventSlug: string) => {
  const embed = section.querySelector<HTMLElement>('[data-call-embed]');
  const stage = section.querySelector<HTMLElement>(STAGE_SELECTOR);
  const fallback = section.querySelector<HTMLAnchorElement>('[data-call-open]');
  if (!embed || !stage || !fallback) return;

  const user = section.dataset.callUser ?? '';
  const locale = localeOf(section);
  fallback.href = buildCalPublicUrl(user, eventSlug, locale);

  frameWatch?.disconnect();
  window.clearTimeout(loadTimer);
  stage.replaceChildren();
  setState(embed, 'loading');
  frameWatch = watchFrame(embed, stage);
  loadTimer = window.setTimeout(() => {
    if (embed.dataset.state === 'loading') setState(embed, 'failed');
  }, LOAD_TIMEOUT_MS);

  callCal('inline', buildCalInlineOptions(user, eventSlug, locale, STAGE_SELECTOR));
  callCal('ui', calUiOptions(currentTheme()));
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
  watchBookings();

  section.querySelector<HTMLElement>('[data-call-formats]')?.addEventListener('change', (event) => {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.checked) renderFormat(section, input.value);
  });

  const picked =
    section.querySelector<HTMLInputElement>('input[name="call-format"]:checked') ??
    section.querySelector<HTMLInputElement>('input[name="call-format"]');
  if (picked) renderFormat(section, picked.value);

  bindThemeSync();
};

document.addEventListener('astro:page-load', boot);
boot();
