// Progressive enhancement for the resume page. Everything here is optional:
// the copy buttons ship hidden and are only revealed once this runs, and the
// table of contents works as plain anchors without any of it.

const initCopyButtons = () => {
  const buttons = document.querySelectorAll('[data-cv-copy]');
  if (!buttons.length) return;

  // No clipboard API (older browser, or a non-secure context) means the button
  // would look live and do nothing, so it stays hidden instead.
  if (!navigator.clipboard?.writeText) return;

  buttons.forEach((button) => {
    button.hidden = false;

    button.addEventListener('click', async () => {
      const value = button.dataset.cvCopy;
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        return;
      }

      button.dataset.copied = 'true';
      window.setTimeout(() => {
        delete button.dataset.copied;
      }, 1600);
    });
  });
};

const initTocHighlight = () => {
  const links = document.querySelectorAll('[data-cv-toc-link]');
  if (!links.length || typeof IntersectionObserver !== 'function') return;

  const linkById = new Map();
  links.forEach((link) => {
    const id = link.dataset.cvTocLink;
    if (id) linkById.set(id, link);
  });

  const sections = [...linkById.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const visible = new Set();

  // Within 2px of the bottom, allowing for fractional device pixel ratios.
  const atDocumentEnd = () =>
    Math.ceil(window.scrollY + window.innerHeight) >=
    document.documentElement.scrollHeight - 2;

  const paint = () => {
    // Topmost section in the detection band wins, so scrolling past a short
    // section does not leave two entries highlighted at once.
    //
    // Except at the very bottom. The band is a thin strip in the upper third
    // of the viewport, and the last sections can never enter it: the page runs
    // out of scroll first. That left "Contact" and "Where I am a weaker fit"
    // permanently unhighlightable, with an earlier entry stuck lit for the
    // whole bottom third of the page, and it got worse the taller the window.
    const active = atDocumentEnd()
      ? sections[sections.length - 1]
      : sections.find((section) => visible.has(section.id));

    linkById.forEach((link, id) => {
      if (id === active?.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      paint();
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));

  // Parked at the bottom, no observer entry ever fires again, so the end-of-
  // document case needs its own trigger. Passive and rAF-throttled: it reads
  // scroll position and toggles one attribute, never layout.
  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        paint();
      });
    },
    { passive: true },
  );
};

const init = () => {
  initCopyButtons();
  initTocHighlight();
};

// astro:page-load fires on the initial load as well as after every swap, so
// this is the whole bootstrap. Calling init() directly here too would double
// it on a cold load: two IntersectionObservers, and two clipboard writes per
// click because every copy button ended up with two listeners.
document.addEventListener('astro:page-load', init);
