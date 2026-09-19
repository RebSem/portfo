import { describe, expect, it } from 'vitest';
import { OPT_OUT_KEY, isOwnerOptedOut, ownerFlag } from '../src/lib/analytics-optout';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  };
}

const blocked = () => {
  throw new Error('site data blocked');
};
const throwingStorage = { getItem: blocked, setItem: blocked, removeItem: blocked };

describe('ownerFlag', () => {
  it('reads ?me=1 as opt-out and ?me=0 as opt back in', () => {
    expect(ownerFlag('?me=1')).toBe('on');
    expect(ownerFlag('?me=true')).toBe('on');
    expect(ownerFlag('?me')).toBe('on');
    expect(ownerFlag('?me=0')).toBe('off');
    expect(ownerFlag('?me=no')).toBe('off');
  });

  it('ignores everything else, including the outreach tag', () => {
    expect(ownerFlag('')).toBeNull();
    expect(ownerFlag('?src=exness')).toBeNull();
    expect(ownerFlag('?me=maybe')).toBeNull();
  });
});

describe('isOwnerOptedOut', () => {
  // The privacy promise of the site: an ordinary visit writes nothing.
  it('is off for an ordinary visitor and writes nothing', () => {
    const storage = fakeStorage();
    expect(isOwnerOptedOut('?src=exness', storage)).toBe(false);
    expect(storage.map.size).toBe(0);
  });

  it('remembers ?me=1 for later visits without the flag', () => {
    const storage = fakeStorage();
    expect(isOwnerOptedOut('?me=1', storage)).toBe(true);
    expect(storage.getItem(OPT_OUT_KEY)).toBe('1');
    expect(isOwnerOptedOut('?src=exness', storage)).toBe(true);
    expect(isOwnerOptedOut('', storage)).toBe(true);
  });

  it('forgets on ?me=0', () => {
    const storage = fakeStorage({ [OPT_OUT_KEY]: '1' });
    expect(isOwnerOptedOut('?me=0', storage)).toBe(false);
    expect(storage.getItem(OPT_OUT_KEY)).toBeNull();
  });

  it('still honours the flag for this page load when storage is unavailable', () => {
    expect(isOwnerOptedOut('?me=1', null)).toBe(true);
    expect(isOwnerOptedOut('', null)).toBe(false);
    expect(isOwnerOptedOut('?me=1', throwingStorage)).toBe(true);
    expect(isOwnerOptedOut('?src=x', throwingStorage)).toBe(false);
  });
});
