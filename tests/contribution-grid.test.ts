import { describe, expect, it } from 'vitest';
import { buildContributionGrid, contributionLabel } from '../src/lib/contribution-grid';
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

describe('contributionLabel', () => {
  it('reads the count and the date in English', () => {
    expect(contributionLabel(3, '2026-03-04', 'en')).toBe('3 contributions • Mar 4, 2026');
  });

  it('reads the count and the date in Russian', () => {
    expect(contributionLabel(3, '2026-03-04', 'ru')).toMatch(/^3 вкладов • 4 мар\. 2026/);
  });

  it('keeps the UTC day for a midnight date, whatever the machine time zone', () => {
    expect(contributionLabel(1, '2026-01-01', 'en')).toBe('1 contributions • Jan 1, 2026');
  });
});
