import { describe, expect, it } from 'vitest';
import { buildContributionGrid, contributionWord } from '../src/lib/contribution-grid';
import type { ContributionDay } from '../src/types/github';

describe('buildContributionGrid', () => {
  it('pads the days to whole Sunday-first weeks and places each day in its cell', () => {
    // 2026-02-22 is a Sunday and 2026-03-07 a Saturday, so the range is two weeks.
    const days: ContributionDay[] = [
      { date: '2026-03-03', level: 1, count: 1 },
      { date: '2026-02-25', level: 2, count: 4 },
    ];

    const grid = buildContributionGrid(days);

    expect(grid.weeks).toBe(2);
    expect(grid.cells).toHaveLength(14);
    expect(grid.cells[0]).toEqual({ date: '2026-02-22', level: 0, count: 0 });
    expect(grid.cells[3]).toEqual({ date: '2026-02-25', level: 2, count: 4 });
    expect(grid.cells[9]).toEqual({ date: '2026-03-03', level: 1, count: 1 });
    expect(grid.cells[13].date).toBe('2026-03-07');
  });

  it('returns an empty grid when there are no days', () => {
    expect(buildContributionGrid([])).toEqual({ weeks: 0, cells: [] });
  });
});

describe('contributionWord', () => {
  it('uses the singular only for exactly one in English', () => {
    expect(contributionWord(1, 'en')).toBe('contribution');
    expect(contributionWord(2, 'en')).toBe('contributions');
    expect(contributionWord(0, 'en')).toBe('contributions');
  });

  it('follows the Russian plural rule: one, few, many', () => {
    expect(contributionWord(1, 'ru')).toBe('вклад');
    expect(contributionWord(2, 'ru')).toBe('вклада');
    expect(contributionWord(5, 'ru')).toBe('вкладов');
    expect(contributionWord(21, 'ru')).toBe('вклад');
    expect(contributionWord(22, 'ru')).toBe('вклада');
    expect(contributionWord(11, 'ru')).toBe('вкладов');
    expect(contributionWord(0, 'ru')).toBe('вкладов');
  });
});
