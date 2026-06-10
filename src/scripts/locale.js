const THEME_STORAGE_KEY = 'portfolio-theme';

const state = window.__portfolioLocaleState ?? {
  activeTheme: 'light',
  themeManuallySet: false,
  initialized: false,
  mediaBound: false,
  delegatedClicksBound: false,
};

window.__portfolioLocaleState = state;

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const readTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      state.themeManuallySet = true;
      return stored;
    }
  } catch {
    return detectSystemTheme();
  }

  return detectSystemTheme();
};

const writeTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable in private mode or strict browser settings.
  }
};

const syncThemeButton = (theme) => {
  const button = document.getElementById('theme-btn');
  if (!button) return;

  const label = theme === 'dark' ? button.dataset.labelToLight : button.dataset.labelToDark;
  if (label) button.setAttribute('aria-label', label);
  button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
};

const syncThemeColorMeta = (theme) => {
  // Manual toggles can disagree with prefers-color-scheme, so the static
  // media-keyed metas stop matching — pin both to the active theme color.
  const color = theme === 'dark' ? '#0c0d0e' : '#f4f4f1';
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', color);
  });
};

const applyTheme = (theme, options = { manual: false }) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  if (document.body) {
    document.body.style.colorScheme = theme;
  }

  state.activeTheme = theme;
  syncThemeButton(theme);

  if (options.manual) {
    state.themeManuallySet = true;
    writeTheme(theme);
    syncThemeColorMeta(theme);
  }
};

const toggleTheme = () => {
  const nextTheme = state.activeTheme === 'dark' ? 'light' : 'dark';
  const setTheme = () => applyTheme(nextTheme, { manual: true });

  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(setTheme);
  } else {
    setTheme();
  }
};

const bindDelegatedClicks = () => {
  if (state.delegatedClicksBound) return;

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const themeToggle = target.closest('#theme-btn');
    if (themeToggle instanceof HTMLButtonElement) {
      event.preventDefault();
      toggleTheme();
      return;
    }
  });

  state.delegatedClicksBound = true;
};

const bindSystemThemeSync = () => {
  if (state.mediaBound) return;

  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (!media) return;

  const syncWithSystemTheme = (event) => {
    if (state.themeManuallySet) return;
    applyTheme(event.matches ? 'dark' : 'light');
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', syncWithSystemTheme);
    state.mediaBound = true;
    return;
  }

  /** @type {{ addListener?: (listener: (event: MediaQueryListEvent) => void) => void }} */
  const legacyMedia = media;
  if (typeof legacyMedia.addListener === 'function') {
    legacyMedia.addListener(syncWithSystemTheme);
    state.mediaBound = true;
  }
};

const initTheme = () => {
  if (!state.initialized) {
    state.activeTheme = readTheme();
    state.initialized = true;
    bindSystemThemeSync();
  }

  applyTheme(state.activeTheme);
  bindDelegatedClicks();
};

document.addEventListener('astro:page-load', initTheme);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme, { once: true });
} else {
  initTheme();
}
