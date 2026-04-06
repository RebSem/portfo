const state = window.__portfolioGithubSyncState ?? {
  activeLocale: document.documentElement.lang === 'ru' ? 'ru' : 'en',
  profile: null,
  repos: null,
  activeSyncStatus: 'loading',
  localeListenerBound: false,
};

window.__portfolioGithubSyncState = state;

let cachedNumberFormatLocale = '';
let cachedNumberFormat = null;
let cachedDateFormatLocale = '';
let cachedDateFormat = null;

const withLocale = (locale, ruValue, enValue) => (locale === 'ru' ? ruValue : enValue);

const updateSyncStatus = (kind) => {
  state.activeSyncStatus = kind;

  document.querySelectorAll('[data-github-sync-status]').forEach((node) => {
    node.setAttribute('data-state', kind);

    const ru = node.getAttribute(`data-${kind}-ru`) ?? '';
    const en = node.getAttribute(`data-${kind}-en`) ?? '';

    if (ru && en) {
      node.textContent = withLocale(state.activeLocale, ru, en);
    }
  });
};

const syncLocaleFromDocument = () => {
  state.activeLocale = document.documentElement.lang === 'ru' ? 'ru' : 'en';
};

const getUsername = () =>
  document.querySelector('[data-github-username]')?.getAttribute('data-github-username')?.trim() ?? '';

const getNumberFormatter = () => {
  const locale = state.activeLocale === 'ru' ? 'ru-RU' : 'en-US';
  if (!cachedNumberFormat || cachedNumberFormatLocale !== locale) {
    cachedNumberFormat = new Intl.NumberFormat(locale);
    cachedNumberFormatLocale = locale;
  }

  return cachedNumberFormat;
};

const getDateFormatter = () => {
  const locale = state.activeLocale === 'ru' ? 'ru-RU' : 'en-US';
  if (!cachedDateFormat || cachedDateFormatLocale !== locale) {
    cachedDateFormat = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    cachedDateFormatLocale = locale;
  }

  return cachedDateFormat;
};

const formatNumber = (value) => getNumberFormatter().format(value);

const formatDate = (value) => {
  if (!value) return withLocale(state.activeLocale, 'нет данных', 'n/a');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return withLocale(state.activeLocale, 'нет данных', 'n/a');
  return getDateFormatter().format(date);
};

const fetchJson = async (url, init) => {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json();
};

const mapProfile = (payload, username) => ({
  login: payload.login ?? username,
  name: payload.name ?? payload.login ?? username,
  avatarUrl: payload.avatar_url ?? payload.avatarUrl ?? '',
  followers: Number(payload.followers ?? 0),
  following: Number(payload.following ?? 0),
  publicRepos: Number(payload.public_repos ?? payload.publicRepos ?? 0),
  profileUrl: payload.html_url ?? payload.profileUrl ?? `https://github.com/${username}`,
  updatedAt: payload.updated_at ?? payload.updatedAt ?? '',
});

const mapRepo = (payload, username) => ({
  name: payload.name ?? '',
  repoUrl: payload.html_url ?? payload.repoUrl ?? `https://github.com/${username}/${payload.name ?? ''}`,
  language: payload.language ?? '',
  stargazersCount: Number(payload.stargazers_count ?? payload.stargazersCount ?? 0),
  updatedAt: payload.updated_at ?? payload.updatedAt ?? '',
  pushedAt: payload.pushed_at ?? payload.pushedAt ?? payload.updated_at ?? payload.updatedAt ?? '',
});

const fetchGithubProfile = async (username) => {
  try {
    const payload = await fetchJson(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    return mapProfile(payload, username);
  } catch {
    const payload = await fetchJson('/api/github/profile.json', {
      headers: {
        Accept: 'application/json',
      },
    });
    return mapProfile(payload, username);
  }
};

const fetchGithubRepos = async (username) => {
  try {
    const payload = await fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    return Array.isArray(payload) ? payload.map((repo) => mapRepo(repo, username)) : [];
  } catch {
    const payload = await fetchJson('/api/github/repos.json', {
      headers: {
        Accept: 'application/json',
      },
    });
    return Array.isArray(payload) ? payload.map((repo) => mapRepo(repo, username)) : [];
  }
};

const updateProfile = (profile) => {
  state.profile = profile;

  document.querySelectorAll('[data-github-profile]').forEach((node) => {
    const key = node.getAttribute('data-github-profile');
    if (!key) return;

    if (key === 'publicRepos') {
      node.textContent = formatNumber(profile.publicRepos);
      return;
    }

    if (key === 'followers') {
      node.textContent = formatNumber(profile.followers);
      return;
    }

    if (key === 'following') {
      node.textContent = formatNumber(profile.following);
      return;
    }

    if (key === 'updatedAt') {
      node.textContent = formatDate(profile.updatedAt);
    }
  });

  document.querySelectorAll('[data-github-profile-link]').forEach((profileLink) => {
    if (!(profileLink instanceof HTMLAnchorElement)) return;
    profileLink.href = profile.profileUrl;
    profileLink.textContent = profile.login ? `github.com/${profile.login}` : profile.profileUrl;
  });
};

const updateRepoCards = (repos) => {
  state.repos = repos;
  const repoMap = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));

  document.querySelectorAll('[data-github-repo]').forEach((card) => {
    const repoName = card.getAttribute('data-github-repo')?.trim().toLowerCase();
    if (!repoName) return;

    const repo = repoMap.get(repoName);
    if (!repo) return;

    const repoLink = card.querySelector('[data-github-repo-link]');
    if (repoLink instanceof HTMLAnchorElement) {
      repoLink.href = repo.repoUrl;
    }

    const languageNode = card.querySelector('[data-github-language]');
    if (languageNode) {
      languageNode.textContent = repo.language || withLocale(state.activeLocale, 'нет данных', 'n/a');
    }

    const starsNode = card.querySelector('[data-github-stars]');
    if (starsNode) {
      starsNode.textContent = formatNumber(repo.stargazersCount);
    }

    const updatedNode = card.querySelector('[data-github-updated]');
    if (updatedNode) {
      updatedNode.textContent = formatDate(repo.pushedAt || repo.updatedAt);
    }
  });
};

const renderFromState = () => {
  updateSyncStatus(state.activeSyncStatus);

  if (state.profile) {
    updateProfile(state.profile);
  }

  if (state.repos) {
    updateRepoCards(state.repos);
  }
};

const hydrateGithub = async () => {
  const username = getUsername();
  if (!username) return;

  try {
    updateSyncStatus('loading');
    const [profile, repos] = await Promise.all([
      fetchGithubProfile(username),
      fetchGithubRepos(username),
    ]);

    updateProfile(profile);
    updateRepoCards(repos);
    updateSyncStatus('ready');
  } catch {
    // Keep server-rendered fallback content if GitHub is unavailable.
    updateSyncStatus('error');
  }
};

const onLocaleChange = () => {
  syncLocaleFromDocument();
  renderFromState();
};

const initGithubSync = () => {
  if (!getUsername()) return;

  syncLocaleFromDocument();
  updateSyncStatus(state.activeSyncStatus);

  if (!state.localeListenerBound) {
    window.addEventListener('portfolio:locale-change', onLocaleChange);
    state.localeListenerBound = true;
  }

  renderFromState();
  void hydrateGithub();
};

document.addEventListener('astro:page-load', initGithubSync);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGithubSync, { once: true });
} else {
  initGithubSync();
}
