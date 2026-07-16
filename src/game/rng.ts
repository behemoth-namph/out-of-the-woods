// Deterministic seeded PRNG (mulberry32) — same seed ⇒ same event stream.
// The event-order doc mandates a seeded stub whose draws are appended at fixed
// positions; this is that stub.

export interface Rng {
  /** uniform float in [0, 1) */
  next(): number;
  /** integer in [min, max] inclusive */
  int(min: number, max: number): number;
  /** weighted pick over entries [value, weight] */
  pick<T>(entries: [T, number][]): T;
}

export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  const next = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick<T>(entries: [T, number][]): T {
      const total = entries.reduce((s, [, w]) => s + w, 0);
      let r = next() * total;
      for (const [v, w] of entries) {
        r -= w;
        if (r < 0) return v;
      }
      return entries[entries.length - 1][0];
    },
  };
}

/** A convenience seed source that is deterministic per-call-count but varied. */
export function seedFrom(base: number, counter: number): number {
  // xor-fold so consecutive counters spread across the state space
  return (Math.imul(base ^ 0x9e3779b9, 2654435761) ^ (counter * 0x85ebca77)) >>> 0;
}
