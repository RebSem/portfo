import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseGithubContributionsHtml } from './github-contributions-parser';
import type { GithubContributionsResponse, GithubProfileResponse, GithubRepoResponse } from '../types/github';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STALE_TTL_MS = 72 * 60 * 60 * 1000;
const CACHE_FILE_PATH = process.env.GITHUB_CACHE_FILE ?? '.cache/github-cache.json';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleUntil: number;
}

interface PersistedCacheShape {
  profile?: Record<string, CacheEntry<GithubProfileResponse>>;
  repos?: Record<string, CacheEntry<GithubRepoResponse[]>>;
  contributions?: Record<string, CacheEntry<GithubContributionsResponse>>;
}

const profileCache = new Map<string, CacheEntry<GithubProfileResponse>>();
const reposCache = new Map<string, CacheEntry<GithubRepoResponse[]>>();
const contributionsCache = new Map<string, CacheEntry<GithubContributionsResponse>>();

let cacheLoaded = false;
let cacheLoadPromise: Promise<void> | null = null;
let cacheWritePromise: Promise<void> = Promise.resolve();

const githubToken = process.env.GITHUB_TOKEN?.trim();

const GITHUB_HEADERS = {
  'User-Agent': 'rebsem-portfolio/1.0',
  Accept: 'application/vnd.github+json',
};

const PROFILE_HEADERS = githubToken
  ? {
      ...GITHUB_HEADERS,
      Authorization: `Bearer ${githubToken}`,
    }
  : GITHUB_HEADERS;

const now = () => Date.now();

const isValidCacheEntry = <T>(value: unknown): value is CacheEntry<T> => {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Partial<CacheEntry<T>>;
  return (
    typeof entry.expiresAt === 'number' &&
    typeof entry.staleUntil === 'number' &&
    Object.prototype.hasOwnProperty.call(entry, 'value')
  );
};

const readEntries = <T>(raw: unknown): Array<[string, CacheEntry<T>]> => {
  if (!raw || typeof raw !== 'object') return [];

  const entries: Array<[string, CacheEntry<T>]> = [];
  for (const [key, value] of Object.entries(raw)) {
    if (!isValidCacheEntry<T>(value)) continue;
    entries.push([key, value]);
  }

  return entries;
};

const loadCacheFromDisk = async () => {
  try {
    const raw = await readFile(CACHE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as PersistedCacheShape;

    for (const [key, entry] of readEntries<GithubProfileResponse>(parsed.profile)) {
      profileCache.set(key, entry);
    }

    for (const [key, entry] of readEntries<GithubRepoResponse[]>(parsed.repos)) {
      reposCache.set(key, entry);
    }

    for (const [key, entry] of readEntries<GithubContributionsResponse>(parsed.contributions)) {
      contributionsCache.set(key, entry);
    }
  } catch {
    // Cold start or malformed cache file should not fail requests.
  } finally {
    cacheLoaded = true;
  }
};

const ensureCacheLoaded = async () => {
  if (cacheLoaded) return;

  if (!cacheLoadPromise) {
    cacheLoadPromise = loadCacheFromDisk();
  }

  await cacheLoadPromise;
};

const persistCacheToDisk = async () => {
  const payload: PersistedCacheShape = {
    profile: Object.fromEntries(profileCache.entries()),
    repos: Object.fromEntries(reposCache.entries()),
    contributions: Object.fromEntries(contributionsCache.entries()),
  };

  const directory = path.dirname(CACHE_FILE_PATH);
  await mkdir(directory, { recursive: true });

  const tempPath = `${CACHE_FILE_PATH}.tmp`;
  await writeFile(tempPath, JSON.stringify(payload), 'utf8');
  await rename(tempPath, CACHE_FILE_PATH);
};

const schedulePersist = () => {
  cacheWritePromise = cacheWritePromise
    .catch(() => undefined)
    .then(() => persistCacheToDisk())
    .catch(() => undefined);
};

const getFresh = <T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (now() < entry.expiresAt) return entry.value;
  return undefined;
};

const getStale = <T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (now() < entry.staleUntil) return entry.value;
  return undefined;
};

const setCache = <T>(cache: Map<string, CacheEntry<T>>, key: string, value: T): T => {
  const current = now();
  cache.set(key, {
    value,
    expiresAt: current + CACHE_TTL_MS,
    staleUntil: current + STALE_TTL_MS,
  });
  schedulePersist();
  return value;
};

const fetchGithubProfile = async (username: string): Promise<GithubProfileResponse> => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: PROFILE_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`GitHub profile request failed with status ${response.status}`);
  }

  const payload = await response.json();

  return {
    login: payload.login ?? username,
    name: payload.name ?? payload.login ?? username,
    avatarUrl: payload.avatar_url ?? '',
    followers: Number(payload.followers ?? 0),
    following: Number(payload.following ?? 0),
    publicRepos: Number(payload.public_repos ?? 0),
    profileUrl: payload.html_url ?? `https://github.com/${username}`,
    updatedAt: payload.updated_at ?? '',
  };
};

const fetchGithubRepos = async (username: string): Promise<GithubRepoResponse[]> => {
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: PROFILE_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`GitHub repos request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as Array<Record<string, unknown>>;
  if (!Array.isArray(payload)) return [];

  return payload
    .map((repo) => {
      const repoName = typeof repo.name === 'string' ? repo.name : '';
      const visibility: GithubRepoResponse['visibility'] = repo.private ? 'private' : 'public';

      return {
        name: repoName,
        fullName: typeof repo.full_name === 'string' ? repo.full_name : `${username}/${repoName}`,
        description: typeof repo.description === 'string' ? repo.description : '',
        repoUrl: typeof repo.html_url === 'string' ? repo.html_url : `https://github.com/${username}/${repoName}`,
        homepageUrl: typeof repo.homepage === 'string' ? repo.homepage : '',
        language: typeof repo.language === 'string' ? repo.language : '',
        stargazersCount: Number(repo.stargazers_count ?? 0),
        forksCount: Number(repo.forks_count ?? 0),
        openIssuesCount: Number(repo.open_issues_count ?? 0),
        updatedAt: typeof repo.updated_at === 'string' ? repo.updated_at : '',
        pushedAt: typeof repo.pushed_at === 'string' ? repo.pushed_at : typeof repo.updated_at === 'string' ? repo.updated_at : '',
        visibility,
        topics: Array.isArray(repo.topics)
          ? repo.topics.filter((topic: unknown): topic is string => typeof topic === 'string')
          : [],
      };
    })
    .sort((left, right) => right.pushedAt.localeCompare(left.pushedAt));
};

const fetchGithubContributions = async (username: string): Promise<GithubContributionsResponse> => {
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      ...GITHUB_HEADERS,
      Accept: 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub contributions request failed with status ${response.status}`);
  }

  const html = await response.text();
  return parseGithubContributionsHtml(html);
};

export const getGithubProfile = async (username: string): Promise<GithubProfileResponse> => {
  await ensureCacheLoaded();

  const cached = getFresh(profileCache, username);
  if (cached) return cached;

  try {
    const value = await fetchGithubProfile(username);
    return setCache(profileCache, username, value);
  } catch (error) {
    const stale = getStale(profileCache, username);
    if (stale) return stale;
    throw error;
  }
};

export const getGithubRepos = async (username: string): Promise<GithubRepoResponse[]> => {
  await ensureCacheLoaded();

  const cached = getFresh(reposCache, username);
  if (cached) return cached;

  try {
    const value = await fetchGithubRepos(username);
    return setCache(reposCache, username, value);
  } catch (error) {
    const stale = getStale(reposCache, username);
    if (stale) return stale;
    throw error;
  }
};

export const getGithubContributions = async (username: string): Promise<GithubContributionsResponse> => {
  await ensureCacheLoaded();

  const cached = getFresh(contributionsCache, username);
  if (cached) return cached;

  try {
    const value = await fetchGithubContributions(username);
    return setCache(contributionsCache, username, value);
  } catch (error) {
    const stale = getStale(contributionsCache, username);
    if (stale) return stale;
    throw error;
  }
};
