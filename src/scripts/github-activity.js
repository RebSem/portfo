const state = window.__portfolioGithubState ?? {
  contributionPayload: null,
  activeContributionPoint: null,
  activeLocale: document.documentElement.lang === 'ru' ? 'ru' : 'en',
  activeStatus: 'loading',
  localeListenerBound: false,
};

window.__portfolioGithubState = state;

const withLocale = (locale, ruValue, enValue) => (locale === 'ru' ? ruValue : enValue);

const syncLocaleFromDocument = () => {
  state.activeLocale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
};

const setHeroStatus = (kind) => {
  state.activeStatus = kind;

  const statusNode = document.getElementById('hero-status');
  if (!statusNode) return;

  const ru = statusNode.getAttribute(`data-${kind}-ru`) ?? '';
  const en = statusNode.getAttribute(`data-${kind}-en`) ?? '';
  if (ru && en) {
    statusNode.textContent = withLocale(state.activeLocale, ru, en);
  }
};

const formatMetric = (value) => new Intl.NumberFormat(state.activeLocale === 'ru' ? 'ru-RU' : 'en-US').format(value);

const formatLocalizedDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(state.activeLocale === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatContributionLabel = (count, isoDate) =>
  withLocale(
    state.activeLocale,
    `${count} вкладов • ${formatLocalizedDate(isoDate)}`,
    `${count} contributions • ${formatLocalizedDate(isoDate)}`,
  );

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

const updateProfile = (profile) => {
  const heroAvatar = document.getElementById('hero-avatar');
  if (heroAvatar) {
    heroAvatar.src = profile.avatarUrl;
    heroAvatar.alt = `${profile.name || profile.login} avatar`;
  }
};

const dateToIso = (date) => date.toISOString().slice(0, 10);

const renderContributionGrid = (days) => {
  const grid = document.getElementById('contribution-grid');
  if (!grid) return;

  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  if (sortedDays.length === 0) {
    grid.innerHTML = '';
    return;
  }

  const map = new Map(sortedDays.map((day) => [day.date, day]));
  const firstDate = new Date(`${sortedDays[0].date}T00:00:00.000Z`);
  const lastDate = new Date(`${sortedDays[sortedDays.length - 1].date}T00:00:00.000Z`);

  const start = new Date(firstDate);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const end = new Date(lastDate);
  end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

  const daysCount = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
  const weeks = Math.ceil(daysCount / 7);

  grid.innerHTML = '';
  grid.style.setProperty('--weeks', String(weeks));

  const fragment = document.createDocumentFragment();

  for (let week = 0; week < weeks; week += 1) {
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
      const currentDate = new Date(start);
      currentDate.setUTCDate(start.getUTCDate() + week * 7 + dayOfWeek);
      const isoDate = dateToIso(currentDate);
      const current = map.get(isoDate);

      const cell = document.createElement('div');
      const level = current?.level ?? 0;
      const count = current?.count ?? 0;
      const label = formatContributionLabel(count, isoDate);

      cell.className = `contribution-cell level-${level}`;
      cell.style.gridColumn = String(week + 1);
      cell.style.gridRow = String(dayOfWeek + 1);
      cell.dataset.date = isoDate;
      cell.dataset.count = String(count);
      cell.tabIndex = 0;
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', label);
      cell.title = label;

      fragment.appendChild(cell);
    }
  }

  grid.appendChild(fragment);
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

  grid.addEventListener('focusin', (event) => {
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

  grid.addEventListener('focusout', (event) => {
    const related = event.relatedTarget;
    if (!(related instanceof Node) || !grid.contains(related)) {
      state.activeContributionPoint = null;
      renderContributionTooltip();
    }
  });

  grid.dataset.tooltipBound = 'true';
};

const updateContributions = (payload) => {
  state.contributionPayload = payload;

  const totalNode = document.getElementById('contributions-total');
  if (totalNode) {
    totalNode.textContent = formatMetric(payload.totalLastYear);
  }

  renderContributionGrid(payload.days);
  bindContributionTooltip();
  renderContributionTooltip();
};

const hideGithubError = () => {
  const errorNode = document.getElementById('github-error');
  if (errorNode) {
    errorNode.classList.add('hidden');
  }
};

const showGithubError = () => {
  const errorNode = document.getElementById('github-error');
  if (errorNode) {
    errorNode.classList.remove('hidden');
  }
};

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.json();
};

const hydrateGithub = async () => {
  setHeroStatus('loading');

  try {
    const [profile, contributions] = await Promise.all([
      fetchJson('/api/github/profile.json'),
      fetchJson('/api/github/contributions.json'),
    ]);

    updateProfile(profile);
    updateContributions(contributions);
    hideGithubError();
    setHeroStatus('ready');
  } catch {
    showGithubError();
    setHeroStatus('error');
  }
};

const onLocaleChange = () => {
  if (!document.getElementById('contribution-grid')) return;

  syncLocaleFromDocument();

  if (state.contributionPayload) {
    updateContributions(state.contributionPayload);
  } else {
    renderContributionTooltip();
  }

  setHeroStatus(state.activeStatus);
};

const initGithubActivity = () => {
  if (!document.getElementById('contribution-grid')) {
    return;
  }

  if (!state.localeListenerBound) {
    window.addEventListener('portfolio:locale-change', onLocaleChange);
    state.localeListenerBound = true;
  }

  syncLocaleFromDocument();

  if (state.contributionPayload) {
    updateContributions(state.contributionPayload);
    hideGithubError();
    setHeroStatus('ready');
  }

  renderContributionTooltip();
  void hydrateGithub();
};

document.addEventListener('astro:page-load', initGithubActivity);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGithubActivity, { once: true });
} else {
  initGithubActivity();
}
