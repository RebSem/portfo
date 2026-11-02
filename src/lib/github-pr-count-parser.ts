// Reads `total_count` from a GitHub search/issues response. Anything else (an
// error body served with a 200, a changed shape) gives undefined, so the caller
// keeps the cached number instead of printing a bad one.
export const parseMergedPrCount = (payload: unknown): number | undefined => {
  if (!payload || typeof payload !== 'object') return undefined;

  const total = (payload as { total_count?: unknown }).total_count;
  if (typeof total !== 'number' || !Number.isInteger(total) || total < 0) return undefined;

  return total;
};
