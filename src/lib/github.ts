import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { ContributionDay, GithubContributionsResponse, GithubProfileResponse } from '../types/github';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STALE_TTL_MS = 72 * 60 * 60 * 1000;
const CACHE_FILE_PATH = process.env.GITHUB_CACHE_FILE ?? '/app/data/github-cache.json';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleUntil: number;
}

interface PersistedCacheShape {
  profile?: Record<string, CacheEntry<GithubProfileResponse>>;
  contributions?: Record<string, CacheEntry<GithubContributionsResponse>>;
}

const profileCache = new Map<string, CacheEntry<GithubProfileResponse>>();
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

const clampLevel = (value: number): 0 | 1 | 2 | 3 | 4 => {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
};

const getAttribute = (tag: string, name: string): string | undefined => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1];
};

const stripTags = (raw: string): string => raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const parseTooltipCounts = (html: string): Map<string, number> => {
  const counts = new Map<string, number>();
  const tooltipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;

  for (const match of html.matchAll(tooltipRegex)) {
    const id = match[1];
    const text = stripTags(match[2]);
    const countMatch = text.match(/([0-9][0-9,]*)\s+contributions?/i);
    const count = countMatch ? Number.parseInt(countMatch[1].replace(/,/g, ''), 10) : 0;
    counts.set(id, Number.isFinite(count) ? count : 0);
  }

  return counts;
};

const parseContributionDays = (html: string): ContributionDay[] => {
  const tooltipCounts = parseTooltipCounts(html);
  const dayTags = html.match(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g) ?? [];
  const days: ContributionDay[] = [];

  for (const tag of dayTags) {
    const id = getAttribute(tag, 'id');
    const date = getAttribute(tag, 'data-date');
    const levelRaw = getAttribute(tag, 'data-level');
    const countRaw = getAttribute(tag, 'data-count');

    if (!date || !levelRaw) {
      continue;
    }

    const parsedLevel = Number.parseInt(levelRaw, 10);
    const fallbackCount = id ? tooltipCounts.get(id) ?? 0 : 0;
    const parsedCount = countRaw ? Number.parseInt(countRaw, 10) : fallbackCount;

    days.push({
      date,
      level: clampLevel(Number.isFinite(parsedLevel) ? parsedLevel : 0),
      count: Number.isFinite(parsedCount) ? parsedCount : 0,
    });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
};

const parseTotalContributions = (html: string, days: ContributionDay[]): number => {
  const heading = html.match(/id="js-contribution-activity-description"[\s\S]*?<\/h2>/i)?.[0];
  if (heading) {
    const text = stripTags(heading);
    const amountMatch = text.match(/([0-9][0-9,]*)\s+contributions?/i);
    if (amountMatch) {
      const parsed = Number.parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return days.reduce((acc, day) => acc + day.count, 0);
};

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
  };
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
  const days = parseContributionDays(html);

  return {
    totalLastYear: parseTotalContributions(html, days),
    days,
  };
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
