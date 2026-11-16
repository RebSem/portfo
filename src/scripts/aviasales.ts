import { clamp01, clockFrom, gtaRibbon, ribbonTimerText, viewProgress } from '../lib/aviasales';
import { emitSignal } from '../lib/site-signals';

const REDUCED = '(prefers-reduced-motion: reduce)';
const CALM_KEY = 'av-calm';

const page = (): HTMLElement | null => document.querySelector<HTMLElement>('[data-aviasales]');
const isCalm = (root: HTMLElement): boolean => root.hasAttribute('data-av-calm');

/* ---------- calm mode ---------- */

function readCalm(): boolean {
  if (new URLSearchParams(location.search).get('calm') === '1') return true;
  try {
    return sessionStorage.getItem(CALM_KEY) === '1';
  } catch {
    return false;
  }
}

// A lit proof and a printed pass answered a click. Their animations would play again the moment
// their styles come back (av-motion returning, the page shown again after printing): clear them.
function settle(root: HTMLElement): void {
  for (const el of root.querySelectorAll('.is-pinged, .is-printed')) el.classList.remove('is-pinged', 'is-printed');
}

// Paper hides the jokes; shown again, every finished intro would start over. Printing ends them.
addEventListener('beforeprint', () => {
  const root = page();
  if (!root) return;
  root.classList.add('av-replayed');
  settle(root);
});

function setCalm(root: HTMLElement, calm: boolean, byUser = false): void {
  // Calm mode is the strict resume: every fold opens, and closes again when it is switched off.
  // Only on a real switch, so a reduced-motion change keeps the folds the visitor opened.
  if (calm !== isCalm(root)) for (const el of root.querySelectorAll<HTMLDetailsElement>('[data-av-more]')) el.open = calm;
  root.toggleAttribute('data-av-calm', calm);
  settle(root);
  root.classList.toggle('av-motion', !calm && !matchMedia(REDUCED).matches);
  for (const el of root.querySelectorAll<HTMLElement>('[data-av-plain]')) el.hidden = !calm;
  const button = root.querySelector<HTMLElement>('[data-av-calm-toggle]');
  button?.setAttribute('aria-pressed', String(calm));
  const label = button?.querySelector<HTMLElement>('[data-av-calm-label]');
  if (label) label.textContent = calm ? 'Авиарежим включён' : 'Авиарежим';
  if (calm) closeToast(root);
  if (!byUser) return;
  if (!calm) root.classList.add('av-replayed'); // one-shot intros play once per visit
  try {
    if (calm) sessionStorage.setItem(CALM_KEY, '1');
    else sessionStorage.removeItem(CALM_KEY);
  } catch {
    /* private mode: the choice lives until reload */
  }
  emitSignal('aviasales:calm', { on: calm });
  updateScroll();
}

/* ---------- scroll-linked variables ---------- */

let ticking = false;

// Reads before writes (no forced layouts); --av-scroll on the bar, not the root, so a scroll restyles one node.
function updateScroll(): void {
  const root = page();
  if (!root || !root.classList.contains('av-motion')) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  const els = [...root.querySelectorAll<HTMLElement>('[data-av-progress]')];
  const p = els.map((el) => {
    const rect = el.getBoundingClientRect();
    return viewProgress(rect.top, rect.height, innerHeight).toFixed(4);
  });
  root.querySelector<HTMLElement>('.av-progress')?.style.setProperty('--av-scroll', max > 0 ? clamp01(scrollY / max).toFixed(4) : '0');
  els.forEach((el, i) => el.style.setProperty('--av-p', p[i] ?? '0'));
}

function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateScroll();
    checkPriceToast();
  });
}

addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });

/* ---------- toasts ---------- */

const toasts = { shown: new Set<string>(), queue: [] as string[], bootAt: 0 };
const html = document.documentElement;
let lastFocus: HTMLElement | null = null;

// Closing a focused toast hands focus back here.
document.addEventListener('focusin', (event) => {
  const el = event.target;
  if (el instanceof HTMLElement && !el.closest('.av-toasts')) lastFocus = el;
});

// The band an open toast covers; the CSS turns it into room under the footer and scroll-padding-bottom.
function setToastRoom(host: HTMLElement | null): void {
  if (host?.querySelector('[data-av-toast]')) html.style.setProperty('--av-toast-room', `${Math.ceil(innerHeight - host.getBoundingClientRect().top) + 16}px`);
  else html.style.removeProperty('--av-toast-room');
}

function showToast(root: HTMLElement, id: string): void {
  if (isCalm(root) || toasts.shown.has(id)) return;
  const host = root.querySelector<HTMLElement>('.av-toasts');
  const template = root.querySelector<HTMLTemplateElement>(`template[data-av-toast-tpl="${id}"]`);
  if (!host || !template) return;
  if (host.querySelector('[data-av-toast]')) {
    if (!toasts.queue.includes(id)) toasts.queue.push(id);
    return;
  }
  toasts.shown.add(id);
  host.append(template.content.cloneNode(true));
  setToastRoom(host);
  emitSignal('aviasales:toast', { id, action: 'shown' });
}

function closeToast(root: HTMLElement, byUser = false): void {
  const open = root.querySelector<HTMLElement>('.av-toasts [data-av-toast]');
  if (!open) return;
  const id = open.dataset.avToast ?? '';
  const hadFocus = open.contains(document.activeElement);
  open.remove();
  setToastRoom(null);
  // Removing the focused button would drop focus to <body>.
  if (hadFocus) (lastFocus?.isConnected ? lastFocus : root.querySelector<HTMLElement>('#main-content'))?.focus({ preventScroll: true });
  if (byUser) emitSignal('aviasales:toast', { id, action: 'closed' });
  const next = toasts.queue.shift();
  if (next && !isCalm(root)) showToast(root, next);
}

function checkPriceToast(): void {
  const root = page();
  if (!root || toasts.shown.has('price')) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  const depth = max > 0 ? scrollY / max : 0;
  if (depth >= 0.45 && performance.now() - toasts.bootAt >= 12_000) showToast(root, 'price');
}

/* ---------- GTA ribbon ---------- */

function tickRibbon(): void {
  const root = page();
  const bar = root?.querySelector<HTMLElement>('[data-av-ribbon]');
  if (!root || !bar) return;
  const state = gtaRibbon(clockFrom(location.search, new Date()));
  const line = (state.phase === 'after' ? bar.dataset.after : bar.dataset.before) ?? '';
  bar.hidden = state.phase === 'off' || line === '';
  const text = bar.querySelector<HTMLElement>('[data-av-ribbon-text]');
  const timer = bar.querySelector<HTMLElement>('[data-av-ribbon-timer]');
  if (text) text.textContent = line;
  if (timer) timer.textContent = ribbonTimerText(state);
}

setInterval(tickRibbon, 30_000);

/* ---------- one-shot observers ---------- */

let observers: IntersectionObserver[] = [];

// Soft navigation swaps the DOM: let go of the old page's nodes.
document.addEventListener('astro:before-swap', () => {
  for (const observer of observers) observer.disconnect();
  observers = [];
  setToastRoom(null);
  lastFocus = null;
});

function observe(root: HTMLElement): void {
  const once = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-in');
        if (el.matches('.av-tickets')) dropPrices(el);
        once.unobserve(el);
      }
    },
    { threshold: 0.35 },
  );
  for (const el of root.querySelectorAll('[data-av-once]')) once.observe(el);

  const hero = root.querySelector('.av-hero');
  const booking = root.querySelector('.av-booking');
  const sticky = root.querySelector<HTMLElement>('.av-sticky');
  const seen = { hero: true, booking: false };
  const sync = (): void => {
    sticky?.classList.toggle('is-shown', !seen.hero && !seen.booking);
  };
  const watch = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.target === hero) seen.hero = entry.isIntersecting;
        if (entry.target === booking) {
          seen.booking = entry.isIntersecting;
          if (entry.intersectionRatio >= 0.5) showToast(root, 'mission');
        }
      }
      sync();
    },
    { threshold: [0, 0.5] },
  );
  if (hero) watch.observe(hero);
  if (booking) watch.observe(booking);
  observers = [once, watch];
}

/* ---------- animations and easter eggs (the catalogue) ---------- */

// A1. One clock drives the whole flight: where the plane is, how high it is (its size and how far
// its shadow has slid out from under it) and how much of the route is drawn behind it.
function flyPlane(root: HTMLElement): void {
  const plane = root.querySelector<SVGGElement>('[data-av-plane]');
  const route = root.querySelector<SVGPathElement>('.av-flight__route');
  const sky = plane?.ownerSVGElement;
  // No flight where the band does not show it (narrow phones): the picture stays as drawn.
  if (!plane || !route || !sky?.getBoundingClientRect().width || !root.classList.contains('av-motion')) return;
  const shadow = plane.previousElementSibling;
  const reveal = root.querySelector<SVGPathElement>('.av-flight__reveal');
  const rest = plane.getAttribute('transform') ?? '';
  const length = route.getTotalLength();
  const startAt = performance.now() + 400;
  sky.classList.add('is-flying');
  // The pin answers the landing once. Without this it would answer again whenever the band is
  // shown anew (a phone turned on its side).
  sky.addEventListener('animationend', (event) => {
    if (event.animationName === 'av-ring') sky.classList.remove('is-landed');
  });
  const frame = (now: number): void => {
    // Leaving motion mid-flight (calm mode, a reduced-motion switch, another page) lands the plane at once.
    const k = plane.isConnected && root.classList.contains('av-motion') ? clamp01((now - startAt) / 2600) : 1;
    if (k === 1) {
      // The markup is the resting picture: put it back to the letter.
      plane.setAttribute('transform', rest);
      shadow?.setAttribute('transform', rest);
      reveal?.style.removeProperty('stroke-dashoffset');
      sky.classList.replace('is-flying', 'is-landed');
      return;
    }
    // Smoothstep: a ground roll, an even cruise, a soft touchdown.
    const at = k * k * (3 - 2 * k) * length;
    const p = route.getPointAtLength(at);
    // The heading is a chord around the plane, clamped to the route, so it never snaps at either end.
    const a = route.getPointAtLength(Math.max(0, at - 8));
    const b = route.getPointAtLength(Math.min(length, at + 8));
    const turn = `rotate(${((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI).toFixed(1)})`;
    const height = Math.sin(Math.PI * k) ** 2; // 0 on the ground, 1 at the top of the arc
    const size = `scale(${(2 + height * 0.5).toFixed(3)})`;
    plane.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) ${turn} ${size}`);
    shadow?.setAttribute('transform', `translate(${(p.x + height * 10).toFixed(1)} ${(p.y + height * 18).toFixed(1)}) ${turn} ${size}`);
    reveal?.style.setProperty('stroke-dashoffset', (1 - at / length).toFixed(4));
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const FLAP = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789';

function initBoard(root: HTMLElement): void {
  const el = root.querySelector<HTMLElement>('[data-av-board]');
  if (!el || el.dataset.split) return;
  el.dataset.split = '1';
  const sentence = (el.textContent ?? '').trim();

  // Screen readers get the sentence once; the cells are decoration.
  const sr = document.createElement('span');
  sr.className = 'av-sr';
  sr.textContent = sentence;
  const row = document.createElement('span');
  row.className = 'av-board__row';
  row.setAttribute('aria-hidden', 'true');

  const cells: Array<{ node: HTMLElement; target: string }> = [];
  for (const word of sentence.split(' ')) {
    // Cells wrap only between words.
    const group = document.createElement('span');
    group.className = 'av-board__word';
    for (const ch of word) {
      const node = document.createElement('span');
      node.className = 'av-board__cell';
      node.textContent = ch;
      group.append(node);
      cells.push({ node, target: ch });
    }
    row.append(group);
  }
  el.replaceChildren(sr, row);

  // The board turns as one machine: on every beat each cell still in play drops one flap, through
  // the alphabet in order, and comes to rest on its own letter. Cells settle left to right.
  const last = 4 + ((cells.length - 1) >> 1); // the beat on which the last cell settles
  let running = false;
  const run = (): void => {
    // offsetParent: on a low laptop window the board is not shown, so there is nothing to turn.
    if (running || !el.offsetParent || !root.classList.contains('av-motion')) return;
    running = true;
    const startedAt = performance.now();
    let beat = -1;
    const frame = (now: number): void => {
      const at = Math.floor((now - startedAt) / 80);
      if (at !== beat) {
        beat = at;
        cells.forEach((cell, i) => {
          // max: a beat missed in a background tab still ends on the right letter.
          const left = Math.max(0, 4 + (i >> 1) - at);
          const next = left ? FLAP.charAt((FLAP.indexOf(cell.target) - left + FLAP.length * 9) % FLAP.length) : cell.target;
          const was = cell.node.textContent ?? '';
          // One beat after the last flap: a flap left armed would turn again when the board is shown anew.
          if (at > last) delete cell.node.dataset.flip;
          else if (was !== next) {
            cell.node.dataset.was = was; // the two flaps of the flip carry the old letter
            cell.node.dataset.flip = at % 2 ? 'a' : 'b'; // a new value restarts the flip
          }
          if (was !== next) cell.node.textContent = next;
        });
      }
      // isConnected: the visitor went to another page mid-turn.
      if (at > last || !el.isConnected) running = false;
      else requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  run();
  el.addEventListener('click', run);
}

// A4. The price rolls down a reel of markdowns and stops on the server-rendered string, which also
// stays in the flow unseen the whole time: the box keeps its size, the ticket never reflows.
function dropPrices(section: HTMLElement): void {
  if (!section.closest('.av-page')?.classList.contains('av-motion')) return;
  for (const el of section.querySelectorAll<HTMLElement>('[data-av-drop]')) {
    const from = Number(el.dataset.from);
    const to = Number(el.dataset.to);
    const finalText = el.textContent ?? '';
    if (Number.isNaN(from) || Number.isNaN(to)) continue;
    const hold = document.createElement('span');
    hold.textContent = finalText;
    const reel = document.createElement('span');
    reel.className = 'av-reel';
    reel.setAttribute('aria-hidden', 'true');
    // Top line first: the final string, then ever higher prices. The reel starts on the last line.
    for (const part of [0, 0.07, 0.18, 0.36, 0.6]) {
      const line = document.createElement('i');
      line.textContent = part ? `${Math.round(to + (from - to) * part).toLocaleString('ru-RU')}${el.dataset.suffix ?? ''}` : finalText;
      reel.append(line);
    }
    // The server-rendered string always wins, also when calm mode cuts the roll short.
    reel.onanimationend = reel.onanimationcancel = (): void => {
      el.classList.remove('is-rolling');
      el.textContent = finalText;
    };
    el.classList.add('is-rolling');
    el.replaceChildren(hold, reel);
  }
}

function lightProof(root: HTMLElement, filter: HTMLAnchorElement): void {
  const id = filter.dataset.avFilter ?? '';
  const proof = root.querySelector<HTMLElement>(`#av-proof-${id}`);
  if (!proof) return;
  for (const el of root.querySelectorAll('.is-pinged')) el.classList.remove('is-pinged');
  // Before the scroll: the open fold sets the height that centring works with.
  const more = proof.querySelector<HTMLDetailsElement>('[data-av-more]');
  if (more) more.open = true;
  // 'auto' would follow the site's smooth scroll-behavior.
  proof.scrollIntoView({ behavior: root.classList.contains('av-motion') ? 'smooth' : 'instant', block: 'center' });
  proof.focus({ preventScroll: true });
  void proof.offsetWidth; // restart the keyframes
  filter.classList.add('is-pinged');
  proof.classList.add('is-pinged');
  emitSignal('aviasales:filter', { req: id });
}

function runSearch(root: HTMLElement, event: Event): void {
  const loader = root.querySelector<HTMLElement>('[data-av-loader]');
  const target = root.querySelector<HTMLElement>('#av-results');
  if (!loader || !target || !root.classList.contains('av-motion') || loader.classList.contains('is-busy')) return;
  event.preventDefault();
  const lines = JSON.parse(loader.dataset.lines ?? '[]') as string[];
  loader.classList.add('is-busy');
  let i = 0;
  const next = (): void => {
    if (!loader.isConnected) return; // the visitor navigated away mid-search
    const line = lines[i];
    if (line !== undefined) {
      // A new node for every caption: its small entrance plays again.
      const caption = document.createElement('span');
      caption.textContent = line;
      loader.replaceChildren(caption);
      i += 1;
      setTimeout(next, 450);
      return;
    }
    loader.classList.remove('is-busy');
    loader.textContent = '';
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    emitSignal('aviasales:egg', { id: 'search' });
  };
  next();
}

const planeClicks: number[] = [];

function planeClick(root: HTMLElement): void {
  const now = performance.now();
  planeClicks.push(now);
  while (planeClicks.length > 0 && now - (planeClicks[0] ?? now) > 3000) planeClicks.shift();
  if (planeClicks.length < 5) return;
  planeClicks.length = 0;
  emitSignal('aviasales:egg', { id: 'turbulence' });
  const main = root.querySelector<HTMLElement>('main');
  if (!main || !root.classList.contains('av-motion')) return;
  root.classList.remove('is-turbulent');
  void root.offsetWidth;
  root.classList.add('is-turbulent');
  const done = (event: AnimationEvent): void => {
    if (event.animationName !== 'av-shake-big') return; // other animations bubble up here too
    root.classList.remove('is-turbulent');
    main.removeEventListener('animationend', done);
  };
  main.addEventListener('animationend', done);
}

/* ---------- small handlers ---------- */

function printPass(root: HTMLElement): void {
  const pass = root.querySelector<HTMLElement>('[data-av-pass]');
  if (!pass || isCalm(root)) return;
  pass.classList.remove('is-printed');
  void pass.offsetWidth;
  pass.classList.add('is-printed');
}

function sortReply(root: HTMLElement, select: HTMLSelectElement): void {
  const reply = root.querySelector<HTMLElement>('[data-av-sort-reply]');
  if (reply) reply.textContent = select.selectedOptions[0]?.dataset.reply ?? '';
}

/* ---------- card slides: dots follow the snap container ---------- */

let dialogOpener: HTMLElement | null = null;

function goToSlide(root: HTMLElement, index: number): void {
  const track = root.querySelector<HTMLElement>('[data-av-slides]');
  if (!track || Number.isNaN(index)) return;
  const smooth = root.classList.contains('av-motion');
  track.scrollTo({ left: index * track.clientWidth, behavior: smooth ? 'smooth' : 'instant' });
}

function initSlides(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>('[data-av-slides]');
  const dots = root.querySelector<HTMLElement>('[data-av-dots]');
  if (!track || !dots) return;
  dots.hidden = false;
  const sync = (): void => {
    const active = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    dots.querySelectorAll<HTMLElement>('[data-av-dot]').forEach((dot, i) => {
      if (i === active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  track.addEventListener('scroll', sync, { passive: true });
}

/* ---------- delegated events, attached once ---------- */

// Capture phase: ClientRouter takes over in-page anchors unless the click is already defaultPrevented.
document.addEventListener('click', (event) => {
  const root = page();
  const target = event.target;
  if (!root || !(target instanceof Element)) return;

  if (target.closest('[data-av-toast-close]')) {
    closeToast(root, true);
    return;
  }
  if (target.closest('[data-av-calm-toggle]')) {
    setCalm(root, !isCalm(root), true);
    return;
  }
  // A modified click means "open in a new tab": leave the link alone.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

  const filter = target.closest<HTMLAnchorElement>('[data-av-filter]');
  if (filter) {
    event.preventDefault();
    lightProof(root, filter);
    return;
  }

  const dot = target.closest<HTMLElement>('[data-av-dot]');
  if (dot) {
    goToSlide(root, Number(dot.dataset.avDot));
    return;
  }

  if (target.closest('[data-av-search-go]')) {
    runSearch(root, event);
    return;
  }
  if (target.closest('[data-av-book]')) {
    printPass(root);
    return;
  }
  const badge = target.closest<HTMLElement>('[data-av-direct-open]');
  if (badge) {
    const dialog = root.querySelector<HTMLDialogElement>('[data-av-direct]');
    if (!dialog || isCalm(root)) return; // the badge then stays a plain Telegram link
    event.preventDefault();
    // Not a Telegram click: keep it from the site's contact tracking.
    event.stopPropagation();
    dialogOpener = badge;
    dialog.showModal();
    return;
  }
  if (target.closest('[data-av-direct-close]')) {
    root.querySelector<HTMLDialogElement>('[data-av-direct]')?.close();
    return;
  }

  if (target.closest('[data-av-egg="baroness"]')) {
    showToast(root, 'baroness');
    emitSignal('aviasales:egg', { id: 'baroness' });
    return;
  }
  if (target.closest('[data-av-plane]')) planeClick(root);
}, true);

document.addEventListener('keydown', (event) => {
  const root = page();
  // An open dialog handles Escape itself: do not close the toast behind it too.
  if (root && event.key === 'Escape' && !root.querySelector('dialog[open]')) closeToast(root, true);
});

matchMedia(REDUCED).addEventListener('change', () => {
  const root = page();
  if (!root) return;
  setCalm(root, isCalm(root));
  // Motion coming back mid-visit must not replay the one-shot intros.
  if (root.classList.contains('av-motion')) root.classList.add('av-replayed');
  updateScroll();
});

/* ---------- boot ---------- */

function boot(): void {
  const root = page();
  if (!root || root.dataset.ready) return;
  root.dataset.ready = '1';
  root.classList.add('av-js');
  root.querySelector('[data-av-calm-toggle]')?.removeAttribute('hidden');

  toasts.shown.clear();
  toasts.queue.length = 0;
  toasts.bootAt = performance.now();

  setCalm(root, readCalm());
  tickRibbon();
  observe(root);
  initBoard(root);
  flyPlane(root);

  const dialog = root.querySelector<HTMLDialogElement>('[data-av-direct]');
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  // Not every browser hands focus back to the opener on close.
  dialog?.addEventListener('close', () => {
    if (dialogOpener && document.activeElement !== dialogOpener) dialogOpener.focus();
    dialogOpener = null;
  });
  initSlides(root);
  root.querySelector<HTMLSelectElement>('[data-av-sort]')?.addEventListener('change', (event) => {
    sortReply(root, event.currentTarget as HTMLSelectElement);
  });

  setTimeout(checkPriceToast, 12_100);
  updateScroll();
}

document.addEventListener('astro:page-load', boot);
