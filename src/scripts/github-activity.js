// The grid and its counts are printed at build (AboutContent.astro). This script
// only adds the hover hint and keeps the mobile grid scrolled to the latest weeks,
// so a page transition never waits on a fetch or a layout pass over 371 cells.
const state = window.__portfolioGithubState ?? {
  activeContributionPoint: null,
  activeLocale: document.documentElement.lang === 'ru' ? 'ru' : 'en',
  viewportListenerBound: false,
};

window.__portfolioGithubState = state;

let cachedDateFormatLocale = '';
let cachedDateFormat = null;

const withLocale = (locale, ruValue, enValue) => (locale === 'ru' ? ruValue : enValue);

const syncLocaleFromDocument = () => {
  state.activeLocale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
};

const getDateFormatter = () => {
  const locale = state.activeLocale === 'ru' ? 'ru-RU' : 'en-US';
  if (!cachedDateFormat || cachedDateFormatLocale !== locale) {
    cachedDateFormat = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    cachedDateFormatLocale = locale;
  }

  return cachedDateFormat;
};

const formatLocalizedDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return getDateFormatter().format(date);
};

// Mirrors contributionWord in src/lib/contribution-grid.ts: this file is served
// as-is, so it cannot import from src/lib. Keep the two tables in step.
const CONTRIBUTION_WORDS = {
  en: { one: 'contribution', other: 'contributions' },
  ru: { one: 'вклад', few: 'вклада', many: 'вкладов', other: 'вкладов' },
};

const PLURAL_RULES = {
  en: new Intl.PluralRules('en-US'),
  ru: new Intl.PluralRules('ru-RU'),
};

const contributionWord = (count, locale) => {
  const forms = CONTRIBUTION_WORDS[locale];
  return forms[PLURAL_RULES[locale].select(count)] ?? forms.other;
};

const formatContributionLabel = (count, isoDate) =>
  `${count} ${contributionWord(count, state.activeLocale)} • ${formatLocalizedDate(isoDate)}`;

const renderContributionTooltip = () => {
  const tooltip = document.getElementById('contribution-tooltip');
  if (!tooltip) return;

  if (state.activeContributionPoint) {
    tooltip.textContent = formatContributionLabel(state.activeContributionPoint.count, state.activeContributionPoint.date);
    return;
  }

  const hintRu = tooltip.dataset.hintRu ?? '';
  const hintEn = tooltip.dataset.hintEn ?? '';
  tooltip.textContent = withLocale(state.activeLocale, hintRu, hintEn);
};

const alignHeatmapToLatest = () => {
  const grid = document.getElementById('contribution-grid');
  if (!(grid instanceof HTMLElement)) return;
  if (!window.matchMedia('(max-width: 720px)').matches) return;

  const maxScrollLeft = Math.max(0, grid.scrollWidth - grid.clientWidth);
  grid.scrollLeft = maxScrollLeft;
};

const requestHeatmapAlignment = () => {
  window.requestAnimationFrame(() => {
    alignHeatmapToLatest();
    window.setTimeout(alignHeatmapToLatest, 80);
  });
};

const bindContributionTooltip = () => {
  const grid = document.getElementById('contribution-grid');
  if (!grid || grid.dataset.tooltipBound === 'true') return;

  const activate = (cell) => {
    const date = cell.dataset.date;
    const countRaw = Number(cell.dataset.count ?? '0');
    if (!date) return;

    state.activeContributionPoint = {
      date,
      count: Number.isFinite(countRaw) ? countRaw : 0,
    };
    renderContributionTooltip();
  };

  grid.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const cell = target.closest('.contribution-cell');
    if (!(cell instanceof HTMLElement)) return;
    activate(cell);
  });

  grid.addEventListener('mouseleave', () => {
    state.activeContributionPoint = null;
    renderContributionTooltip();
  });

  grid.dataset.tooltipBound = 'true';
};

const initGithubActivity = () => {
  if (!document.getElementById('contribution-grid')) {
    return;
  }

  if (!state.viewportListenerBound) {
    window.addEventListener('resize', requestHeatmapAlignment, { passive: true });
    state.viewportListenerBound = true;
  }

  syncLocaleFromDocument();
  // A point hovered on the previous visit belongs to a grid that is gone.
  state.activeContributionPoint = null;
  bindContributionTooltip();
  renderContributionTooltip();
  requestHeatmapAlignment();
};

// astro:page-load fires on the initial load too, so this is the whole bootstrap;
// see the note in github-sync.js about the double-init this replaces.
document.addEventListener('astro:page-load', initGithubActivity);
