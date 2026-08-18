// Theme-aware screenshot sources. Each shot renders a single <img> whose
// src follows [data-theme] on <html>, so only the active variant downloads
// (the old twin light+dark <img> pair fetched both: display:none does not
// stop the browser). A <picture media="prefers-color-scheme"> can't do this
// job here because the theme is a manual localStorage-backed toggle that can
// disagree with the OS preference.

const state = window.__portfolioThemeImagesState ?? {
  observerBound: false,
};

window.__portfolioThemeImagesState = state;

const syncThemeImages = () => {
  const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  document.querySelectorAll('img[data-light-src][data-dark-src]').forEach((img) => {
    const want = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
    if (want && img.getAttribute('src') !== want) {
      img.setAttribute('src', want);
    }
    // srcset wins over src when both are present, so an image served through
    // srcset would silently keep the light variant unless this is swapped too.
    const wantSet = theme === 'dark' ? img.dataset.darkSrcset : img.dataset.lightSrcset;
    if (wantSet && img.getAttribute('srcset') !== wantSet) {
      img.setAttribute('srcset', wantSet);
    }
  });
};

const bindObserver = () => {
  if (state.observerBound) return;

  // <html> survives view transitions, so one observer covers the whole visit.
  new MutationObserver(syncThemeImages).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  state.observerBound = true;
};

const init = () => {
  syncThemeImages();

  // Only 8 of the ~30 built pages carry theme-aware screenshots, and the
  // resume is not one of them. Binding a document-wide MutationObserver on a
  // page with nothing to observe is pure overhead. init() runs again after
  // every ClientRouter swap, so navigating to a page that does have them
  // still binds it then.
  if (!document.querySelector('img[data-light-src][data-dark-src]')) return;

  bindObserver();
};

// Re-sync after each swap: the new page's images arrive with the light src.
// This also covers the initial load, so no separate bootstrap is needed.
document.addEventListener('astro:page-load', init);
