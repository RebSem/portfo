import { describe, expect, it } from 'vitest';
import { parseGithubContributionsHtml } from '../src/lib/github-contributions-parser';

describe('parseGithubContributionsHtml', () => {
  it('parses days, sorts by date, uses tooltip fallback, and clamps level', () => {
    const html = `
      <table>
        <tr>
          <td class="ContributionCalendar-day" id="contrib-day-2" data-date="2026-02-21" data-level="7"></td>
          <td class="ContributionCalendar-day" id="contrib-day-1" data-date="2026-02-20" data-level="2" data-count="3"></td>
          <td class="ContributionCalendar-day" id="contrib-day-3" data-date="2026-02-22" data-level="-1"></td>
        </tr>
      </table>
      <tool-tip for="contrib-day-2"><strong>12 contributions</strong> on Feb 21</tool-tip>
      <tool-tip for="contrib-day-3"><strong>0 contributions</strong> on Feb 22</tool-tip>
      <h2 id="js-contribution-activity-description">1,234 contributions in the last year</h2>
    `;

    const result = parseGithubContributionsHtml(html);

    expect(result.days).toEqual([
      { date: '2026-02-20', level: 2, count: 3 },
      { date: '2026-02-21', level: 4, count: 12 },
      { date: '2026-02-22', level: 0, count: 0 },
    ]);
    expect(result.totalLastYear).toBe(1234);
  });

  it('falls back to sum of parsed days when heading is missing', () => {
    const html = `
      <td class="ContributionCalendar-day" data-date="2026-02-20" data-level="1" data-count="2"></td>
      <td class="ContributionCalendar-day" data-date="2026-02-21" data-level="3" data-count="5"></td>
    `;

    const result = parseGithubContributionsHtml(html);

    expect(result.totalLastYear).toBe(7);
    expect(result.days).toHaveLength(2);
  });

  it('ignores malformed day cells without required attributes', () => {
    const html = `
      <td class="ContributionCalendar-day" data-date="2026-02-20"></td>
      <td class="ContributionCalendar-day" data-level="2" data-count="5"></td>
      <td class="ContributionCalendar-day" data-date="2026-02-22" data-level="1" data-count="1"></td>
    `;

    const result = parseGithubContributionsHtml(html);

    expect(result.days).toEqual([{ date: '2026-02-22', level: 1, count: 1 }]);
    expect(result.totalLastYear).toBe(1);
  });
});

