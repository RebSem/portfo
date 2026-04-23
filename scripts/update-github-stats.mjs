import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_FILE = process.env.GITHUB_CACHE_FILE?.trim() || join(ROOT, '.cache', 'github-cache.json');
const USERNAME = process.env.GITHUB_USERNAME?.trim() || 'RebSem';
const githubToken = process.env.GITHUB_TOKEN?.trim();

const GITHUB_HEADERS = {
  'User-Agent': 'rebsem-portfolio-updater/1.0',
  Accept: 'application/vnd.github+json',
};

const PROFILE_HEADERS = githubToken
  ? {
      ...GITHUB_HEADERS,
      Authorization: `Bearer ${githubToken}`,
    }
  : GITHUB_HEADERS;

const clampLevel = (value) => {
  if (value <= 0) return 0;
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  return 4;
};

const getAttribute = (tag, name) => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match?.[1];
};

const stripTags = (raw) => raw.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const parseTooltipCounts = (html) => {
  const counts = new Map();
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

const parseGithubContributionsHtml = (html) => {
  const tooltipCounts = parseTooltipCounts(html);
  const dayTags = html.match(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g) ?? [];
  const days = [];

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

  days.sort((left, right) => left.date.localeCompare(right.date));

  const heading = html.match(/id="js-contribution-activity-description"[\s\S]*?<\/h2>/i)?.[0];
  if (heading) {
    const text = stripTags(heading);
    const amountMatch = text.match(/([0-9][0-9,]*)\s+contributions?/i);
    if (amountMatch) {
      const parsed = Number.parseInt(amountMatch[1].replace(/,/g, ''), 10);
      if (Number.isFinite(parsed)) {
        return {
          totalLastYear: parsed,
          days,
        };
      }
    }
  }

  return {
    totalLastYear: days.reduce((acc, day) => acc + day.count, 0),
    days,
  };
};

async function fetchGithubProfile(username) {
  console.log(`Fetching profile for ${username}...`);
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: PROFILE_HEADERS,
  });
  if (!response.ok) throw new Error(`Profile fetch failed: ${response.status}`);
  const payload = await response.json();
  return {
    login: payload.login,
    name: payload.name || payload.login,
    avatarUrl: payload.avatar_url,
    followers: payload.followers,
    following: payload.following,
    publicRepos: payload.public_repos,
    profileUrl: payload.html_url,
    updatedAt: payload.updated_at,
  };
}

async function fetchGithubRepos(username) {
  console.log(`Fetching repos for ${username}...`);
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
    headers: PROFILE_HEADERS,
  });
  if (!response.ok) throw new Error(`Repos fetch failed: ${response.status}`);

  const payload = await response.json();
  if (!Array.isArray(payload)) return [];

  return payload.map((repo) => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    repoUrl: repo.html_url,
    homepageUrl: repo.homepage || '',
    language: repo.language || '',
    stargazersCount: repo.stargazers_count || 0,
    forksCount: repo.forks_count || 0,
    openIssuesCount: repo.open_issues_count || 0,
    updatedAt: repo.updated_at || '',
    pushedAt: repo.pushed_at || repo.updated_at || '',
    visibility: repo.private ? 'private' : 'public',
    topics: Array.isArray(repo.topics) ? repo.topics : [],
  }));
}

async function fetchGithubContributions(username) {
  console.log(`Fetching contributions for ${username}...`);
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      ...GITHUB_HEADERS,
      'Accept': 'text/html',
    },
  });
  if (!response.ok) throw new Error(`Contributions fetch failed: ${response.status}`);
  const html = await response.text();
  return parseGithubContributionsHtml(html);
}

async function main() {
  try {
    const [profile, repos, contributions] = await Promise.all([
      fetchGithubProfile(USERNAME),
      fetchGithubRepos(USERNAME),
      fetchGithubContributions(USERNAME),
    ]);
    
    console.log('GitHub data fetched successfully.');
    
    const now = Date.now();
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const STALE_TTL_MS = 72 * 60 * 60 * 1000;

    const cachePayload = {
      profile: {
        [USERNAME]: {
          value: profile,
          expiresAt: now + CACHE_TTL_MS,
          staleUntil: now + STALE_TTL_MS,
        }
      },
      repos: {
        [USERNAME]: {
          value: repos,
          expiresAt: now + CACHE_TTL_MS,
          staleUntil: now + STALE_TTL_MS,
        }
      },
      contributions: {
        [USERNAME]: {
          value: contributions,
          expiresAt: now + CACHE_TTL_MS,
          staleUntil: now + STALE_TTL_MS,
        }
      }
    };

    await mkdir(dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(cachePayload, null, 2));
    console.log(`Cache updated at ${CACHE_FILE}`);
  } catch (error) {
    console.error('Error updating GitHub stats:', error);
    process.exitCode = 1;
  }
}

main();
