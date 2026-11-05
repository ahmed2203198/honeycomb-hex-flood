/** mulberry32 - tiny deterministic PRNG so every frame/seed is reproducible. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: () => number, maxExclusive: number): number {
  return Math.floor(rng() * maxExclusive) % maxExclusive;
}

/** Seed for the "daily comb" - YYYYMMDD as an integer, no network, no account. */
export function dailySeed(date: Date = new Date()): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function dayLabel(date: Date = new Date()): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  return (d < 10 ? '0' + d : String(d)) + '.' + (m < 10 ? '0' + m : String(m));
}
