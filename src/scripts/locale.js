const LOCALE_STORAGE_KEY = 'portfolio-locale';
const THEME_STORAGE_KEY = 'portfolio-theme';
const LOCALE_EVENT_NAME = 'portfolio:locale-change';

let activeLocale = 'ru';
let activeTheme = 'light';
let themeManuallySet = false;

const withLocale = (locale, ruValue, enValue) => (locale === 'ru' ? ruValue : enValue);

const detectSystemLocale = () => {
  const language = navigator.language.toLowerCase();
  return language.startsWith('ru') ? 'ru' : 'en';
};

const detectSystemTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const readLocale = () => {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') {
      return stored;
    }
  } catch {
    return detectSystemLocale();
  }

  return detectSystemLocale();
};

const readTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      themeManuallySet = true;
      return stored;
    }
  } catch {
    return detectSystemTheme();
  }

  return detectSystemTheme();
};

const writeLocale = (locale) => {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage may be unavailable in private mode or strict browser settings.
  }
};

const writeTheme = (theme) => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable in private mode or strict browser settings.
  }
};

const localizeTextNodes = (locale) => {
  const nodes = document.querySelectorAll('[data-i18n-ru][data-i18n-en]');
  nodes.forEach((node) => {
    const ruValue = node.dataset.i18nRu;
    const enValue = node.dataset.i18nEn;
    if (!ruValue || !enValue) return;

    node.textContent = withLocale(locale, ruValue, enValue);
  });
};

const localizeAriaLabels = (locale) => {
  const nodes = document.querySelectorAll('[data-i18n-aria-ru][data-i18n-aria-en]');
  nodes.forEach((node) => {
    const ruValue = node.dataset.i18nAriaRu;
    const enValue = node.dataset.i18nAriaEn;
    if (!ruValue || !enValue) return;

    node.setAttribute('aria-label', withLocale(locale, ruValue, enValue));
  });
};

const localizeAltText = (locale) => {
  const nodes = document.querySelectorAll('[data-i18n-alt-ru][data-i18n-alt-en]');
  nodes.forEach((node) => {
    const ruValue = node.dataset.i18nAltRu;
    const enValue = node.dataset.i18nAltEn;
    if (!ruValue || !enValue) return;

    node.setAttribute('alt', withLocale(locale, ruValue, enValue));
  });
};

const localizeMeta = (locale) => {
  const main = document.getElementById('main-content');
  if (!main) return;

  const ruTitle = main.dataset.titleRu;
  const enTitle = main.dataset.titleEn;
  if (ruTitle && enTitle) {
    document.title = withLocale(locale, ruTitle, enTitle);
  }

  const ruDescription = main.dataset.descriptionRu;
  const enDescription = main.dataset.descriptionEn;
  if (!ruDescription || !enDescription) return;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', withLocale(locale, ruDescription, enDescription));
  }
};

const updateLocaleToggle = (locale) => {
  const localeToggle = document.getElementById('locale-toggle');
  if (!localeToggle) return;

  const ruToggle = localeToggle.dataset.toggleRu ?? 'EN';
  const enToggle = localeToggle.dataset.toggleEn ?? 'RU';
  const ruLabel = localeToggle.dataset.labelRu ?? 'Switch to English';
  const enLabel = localeToggle.dataset.labelEn ?? 'Switch to Russian';

  localeToggle.textContent = withLocale(locale, ruToggle, enToggle);
  localeToggle.setAttribute('aria-label', withLocale(locale, ruLabel, enLabel));
};

const updateThemeToggleLabel = () => {
  const themeToggle = document.getElementById('theme-btn');
  if (!themeToggle) return;

  const darkRu = themeToggle.dataset.themeDarkLabelRu ?? 'Включить тёмную тему';
  const darkEn = themeToggle.dataset.themeDarkLabelEn ?? 'Switch to dark theme';
  const lightRu = themeToggle.dataset.themeLightLabelRu ?? 'Включить светлую тему';
  const lightEn = themeToggle.dataset.themeLightLabelEn ?? 'Switch to light theme';

  const targetIsLight = activeTheme === 'dark';
  const ruLabel = targetIsLight ? lightRu : darkRu;
  const enLabel = targetIsLight ? lightEn : darkEn;

  themeToggle.setAttribute('aria-label', withLocale(activeLocale, ruLabel, enLabel));
};

const emitLocaleChange = (locale) => {
  window.dispatchEvent(
    new CustomEvent(LOCALE_EVENT_NAME, {
      detail: { locale },
    }),
  );
};

const applyTheme = (theme, options = { manual: false }) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (document.body) {
    document.body.style.colorScheme = theme;
  }

  activeTheme = theme;

  if (options.manual) {
    themeManuallySet = true;
    writeTheme(theme);
  }

  updateThemeToggleLabel();
};

const applyLocale = (locale) => {
  document.documentElement.lang = locale;
  document.body.dataset.locale = locale;

  localizeTextNodes(locale);
  localizeAriaLabels(locale);
  localizeAltText(locale);
  localizeMeta(locale);
  updateLocaleToggle(locale);

  activeLocale = locale;
  updateThemeToggleLabel();
  emitLocaleChange(locale);
};

const initLocale = () => {
  const initialLocale = readLocale();
  const initialTheme = readTheme();

  applyTheme(initialTheme);
  applyLocale(initialLocale);

  const localeToggle = document.getElementById('locale-toggle');
  if (localeToggle) {
    localeToggle.addEventListener('click', () => {
      const nextLocale = activeLocale === 'ru' ? 'en' : 'ru';
      applyLocale(nextLocale);
      writeLocale(nextLocale);
    });
  }

  const themeToggle = document.getElementById('theme-btn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      const setTheme = () => applyTheme(nextTheme, { manual: true });

      if (typeof document.startViewTransition === 'function') {
        document.startViewTransition(setTheme);
      } else {
        setTheme();
      }
    });
  }

  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (!media) return;

  const syncWithSystemTheme = (event) => {
    if (themeManuallySet) return;
    applyTheme(event.matches ? 'dark' : 'light');
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', syncWithSystemTheme);
    return;
  }

  if (typeof media.addListener === 'function') {
    media.addListener(syncWithSystemTheme);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLocale, { once: true });
} else {
  initLocale();
}
