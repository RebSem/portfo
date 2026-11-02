/**
 * The case study a reader is sent to after this one, by projectId (see
 * src/data/projects.ts). The three flagship cases hand over to each other,
 * so a reader who finishes one always has a next case; every other case
 * points back to the flagship. Pure, so the loop is unit-tested.
 */
const NEXT_CASE: ReadonlyMap<string, string> = new Map([
  ['zvonobot-ai', 'cursivo'],
  ['cursivo', 'obrabot'],
  ['obrabot', 'zvonobot-ai'],
]);

const FLAGSHIP = 'zvonobot-ai';

export function nextCaseProjectId(projectId: string): string {
  return NEXT_CASE.get(projectId) ?? FLAGSHIP;
}
