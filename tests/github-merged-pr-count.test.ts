import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

const REPO = 'RebSem/portfo';
const originalCacheFile = process.env.GITHUB_CACHE_FILE;
const tempDirs: string[] = [];

// src/lib/github.ts reads its cache path once, at import, so every case gets a
// fresh module graph that points at its own cache file.
const loadGithub = async (mergedPrCounts?: Record<string, unknown>) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'github-merged-pr-count-'));
  tempDirs.push(dir);

  const file = path.join(dir, 'github-cache.json');
  if (mergedPrCounts) {
    await writeFile(file, JSON.stringify({ mergedPrCounts }), 'utf8');
  }

  process.env.GITHUB_CACHE_FILE = file;
  vi.resetModules();
  return import('../src/lib/github');
};

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalCacheFile === undefined) {
    delete process.env.GITHUB_CACHE_FILE;
  } else {
    process.env.GITHUB_CACHE_FILE = originalCacheFile;
  }
});

afterAll(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('getMergedPrCount', () => {
  it('fetches the count from the search API and returns it', async () => {
    const fetchMock = vi.fn(async (_url: string) => Response.json({ total_count: 66, items: [] }));
    vi.stubGlobal('fetch', fetchMock);
    const { getMergedPrCount } = await loadGithub();

    await expect(getMergedPrCount(REPO)).resolves.toBe(66);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('search/issues?q=repo:RebSem/portfo+is:pr+is:merged');
  });

  it('serves a fresh cached count, including zero, without calling GitHub', async () => {
    const fetchMock = vi.fn(async (_url: string) => Response.json({ total_count: 99 }));
    vi.stubGlobal('fetch', fetchMock);
    const now = Date.now();
    const { getMergedPrCount } = await loadGithub({
      [REPO]: { value: 0, expiresAt: now + 60_000, staleUntil: now + 120_000 },
    });

    await expect(getMergedPrCount(REPO)).resolves.toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('falls back to a stale cached count, including zero, when GitHub fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async (_url: string) => new Response('', { status: 503 })));
    const now = Date.now();
    const { getMergedPrCount } = await loadGithub({
      [REPO]: { value: 0, expiresAt: now - 1_000, staleUntil: now + 60_000 },
    });

    await expect(getMergedPrCount(REPO)).resolves.toBe(0);
  });

  it('returns undefined instead of throwing when the request fails and nothing is cached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string): Promise<Response> => {
        throw new TypeError('fetch failed');
      }),
    );
    const { getMergedPrCount } = await loadGithub();

    await expect(getMergedPrCount(REPO)).resolves.toBeUndefined();
  });

  it('returns undefined for a rate-limited response when nothing is cached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string) => new Response('{"message":"API rate limit exceeded"}', { status: 403 })),
    );
    const { getMergedPrCount } = await loadGithub();

    await expect(getMergedPrCount(REPO)).resolves.toBeUndefined();
  });
});
