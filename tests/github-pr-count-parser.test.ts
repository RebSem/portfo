import { describe, expect, it } from 'vitest';
import { parseMergedPrCount } from '../src/lib/github-pr-count-parser';

describe('parseMergedPrCount', () => {
  it('reads total_count from a search/issues response', () => {
    const payload = { total_count: 31, incomplete_results: false, items: [] };

    expect(parseMergedPrCount(payload)).toBe(31);
  });

  it('keeps zero, which is a real count and not a missing value', () => {
    expect(parseMergedPrCount({ total_count: 0, items: [] })).toBe(0);
  });

  it('rejects an error body that GitHub serves without a total', () => {
    expect(parseMergedPrCount({ message: 'API rate limit exceeded' })).toBeUndefined();
  });

  it('rejects counts that are not non-negative integers', () => {
    expect(parseMergedPrCount({ total_count: '31' })).toBeUndefined();
    expect(parseMergedPrCount({ total_count: -1 })).toBeUndefined();
    expect(parseMergedPrCount({ total_count: 31.5 })).toBeUndefined();
    expect(parseMergedPrCount({ total_count: Number.NaN })).toBeUndefined();
  });

  it('rejects anything that is not an object', () => {
    expect(parseMergedPrCount(null)).toBeUndefined();
    expect(parseMergedPrCount(undefined)).toBeUndefined();
    expect(parseMergedPrCount('31')).toBeUndefined();
    expect(parseMergedPrCount(31)).toBeUndefined();
  });
});
