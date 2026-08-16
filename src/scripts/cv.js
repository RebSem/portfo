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

  const paint = () => {
    // Topmost visible section wins, so scrolling past a short section does not
    // leave two entries highlighted at once.
    const active = sections.find((section) => visible.has(section.id));
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
};

const init = () => {
  initCopyButtons();
  initTocHighlight();
};

document.addEventListener('astro:page-load', init);
init();
