import { describe, expect, it } from 'vitest';
import { projects } from '../src/data/projects';
import { nextCaseProjectId } from '../src/lib/case-order';

describe('nextCaseProjectId', () => {
  it('loops the three flagship cases', () => {
    expect(nextCaseProjectId('zvonobot-ai')).toBe('obrabot');
    expect(nextCaseProjectId('obrabot')).toBe('cursivo');
    expect(nextCaseProjectId('cursivo')).toBe('zvonobot-ai');
  });

  it('points every other case back to the flagship', () => {
    for (const id of ['bazabot', 'Zodial', 'Slopiq', 'portfo']) {
      expect(nextCaseProjectId(id)).toBe('zvonobot-ai');
    }
  });

  it('only ever returns a project that exists and is not the case itself', () => {
    for (const { id } of projects) {
      const next = nextCaseProjectId(id);
      expect(next).not.toBe(id);
      expect(projects.some((project) => project.id === next)).toBe(true);
    }
  });
});
