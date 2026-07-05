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
  bindObserver();
};

// Re-sync after each swap: the new page's images arrive with the light src.
document.addEventListener('astro:page-load', init);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
