/**
 * The bridge between small UI modules and analytics.
 *
 * UI code never imports posthog: analytics can be compiled out (no token),
 * blocked, or skipped by the owner's ?me=1 opt-out, and the UI has to work
 * the same in every case. So a module announces what happened with a DOM
 * event, and src/scripts/analytics.ts, when it is running, records only the
 * signals and the property values allowed here. Nothing a visitor types and
 * no DOM text ever reaches a property.
 */

export const SIGNAL_EVENT = 'rebsem:signal';

export type HiddenBucket = 'under-1m' | '1-10m' | 'over-10m';

type Validator = (value: unknown) => boolean;

const SIGNALS = {
  // First return to a tab after the away title was shown, bucketed. A
  // human coming back after 1-10 minutes is someone comparing candidates.
  'tab:return': {
    hidden_bucket: (value: unknown) => value === 'under-1m' || value === '1-10m' || value === 'over-10m',
  },
} satisfies Record<string, Record<string, Validator>>;

export type SignalName = keyof typeof SIGNALS;

export interface Signal {
  name: SignalName;
  props: Record<string, string | number | boolean>;
}

const isSignalName = (value: unknown): value is SignalName =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(SIGNALS, value);

/** The allowed part of an event detail, or null when the name is unknown. */
export function sanitizeSignal(detail: unknown): Signal | null {
  if (!detail || typeof detail !== 'object') return null;
  const { name, props } = detail as { name?: unknown; props?: unknown };
  if (!isSignalName(name)) return null;

  const allowed: Record<string, Validator> = SIGNALS[name];
  const clean: Signal['props'] = {};
  if (props && typeof props === 'object') {
    for (const [key, value] of Object.entries(props as Record<string, unknown>)) {
      // Own keys only: a plain lookup reads through the prototype, and
      // "constructor" or "toString" would pass any value.
      const valid = Object.prototype.hasOwnProperty.call(allowed, key) ? allowed[key] : undefined;
      if (valid && valid(value)) clean[key] = value as string | number | boolean;
    }
  }
  return { name, props: clean };
}

export function hiddenBucket(ms: number): HiddenBucket {
  if (ms < 60_000) return 'under-1m';
  if (ms <= 600_000) return '1-10m';
  return 'over-10m';
}

/** UI-side helper. Safe to call when analytics is absent: nobody listens. */
export function emitSignal(name: SignalName, props: Signal['props'] = {}): void {
  document.dispatchEvent(new CustomEvent(SIGNAL_EVENT, { detail: { name, props } }));
}
