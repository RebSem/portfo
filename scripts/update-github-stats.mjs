import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_FILE = join(ROOT, '.cache', 'github-cache.json');
const USERNAME = 'RebSem';

async function fetchGithubProfile(username) {
  console.log(`Fetching profile for ${username}...`);
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'User-Agent': 'rebsem-portfolio-updater/1.0',
    },
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
  };
}

async function fetchGithubContributions(username) {
  console.log(`Fetching contributions for ${username}...`);
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      'User-Agent': 'rebsem-portfolio-updater/1.0',
      'Accept': 'text/html',
    },
  });
  if (!response.ok) throw new Error(`Contributions fetch failed: ${response.status}`);
  const html = await response.text();
  return parseContributions(html);
}

function parseContributions(html) {
  const getAttribute = (tag, name) => {
    const match = tag.match(new RegExp(`${name}="([^"]*)"`));
    return match?.[1];
  };

  const dayTags = html.match(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g) ?? [];
  const days = [];

  for (const tag of dayTags) {
    const date = getAttribute(tag, 'data-date');
    const levelRaw = getAttribute(tag, 'data-level');
    const countRaw = getAttribute(tag, 'data-count');

    if (!date || levelRaw === undefined) continue;

    days.push({
      date,
      level: parseInt(levelRaw, 10) || 0,
      count: parseInt(countRaw, 10) || 0,
    });
  }

  const totalMatch = html.match(/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i);
  const totalLastYear = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : days.reduce((acc, d) => acc + d.count, 0);

  return {
    totalLastYear,
    days,
  };
}

async function main() {
  try {
    const [profile, contributions] = await Promise.all([
      fetchGithubProfile(USERNAME),
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
  }
}

main();
