// Cursor-following spotlight for the hero metric card.
// Writes the pointer position into --mx/--my and toggles --spot on enter/leave.
// CSS owns the look (radial gradient + opacity transition); this only feeds
// coordinates, rAF-throttled so we touch the DOM at most once per frame.

const state = window.__portfolioMetricSpotlightState ?? {
  bound: false,
};

window.__portfolioMetricSpotlightState = state;

// Pointer-driven motion is a fine-pointer, motion-safe enhancement only.
// Touch/coarse pointers and reduced-motion users keep the calm static card.
const spotlightAllowed = () => {
  if (!window.matchMedia) return false;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return finePointer && motionOk;
};

const bindCard = (card) => {
  if (card.dataset.spotlightBound === 'true') return;
  card.dataset.spotlightBound = 'true';

  let frame = 0;
  let pendingX = 0;
  let pendingY = 0;

  const paint = () => {
    frame = 0;
    card.style.setProperty('--mx', `${pendingX}px`);
    card.style.setProperty('--my', `${pendingY}px`);
  };

  const onPointerMove = (event) => {
    const rect = card.getBoundingClientRect();
    pendingX = event.clientX - rect.left;
    pendingY = event.clientY - rect.top;
    if (frame === 0) {
      frame = window.requestAnimationFrame(paint);
    }
  };

  const onPointerEnter = (event) => {
    onPointerMove(event);
    card.style.setProperty('--spot', '1');
  };

  const onPointerLeave = () => {
    if (frame !== 0) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    card.style.setProperty('--spot', '0');
  };

  // pointermove already covers mouse + pen; the (pointer: fine) guard keeps
  // touch out, so we don't need a separate touch path.
  card.addEventListener('pointerenter', onPointerEnter);
  card.addEventListener('pointermove', onPointerMove);
  card.addEventListener('pointerleave', onPointerLeave);
};

const initSpotlight = () => {
  if (!spotlightAllowed()) return;

  const cards = document.querySelectorAll('.hero-metric-card');
  cards.forEach((card) => {
    if (card instanceof HTMLElement) bindCard(card);
  });
};

document.addEventListener('astro:page-load', initSpotlight);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpotlight, { once: true });
} else {
  initSpotlight();
}
