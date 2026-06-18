import type { WATWord } from "./types.js";

export function createRandomWordOrder(params: {
  words: WATWord[];
  wordCount: number;
  seed: number;
}): string[] {
  const { words, wordCount, seed } = params;

  const filtered = words.slice();
  const withKeys = filtered.map((w) => ({
    id: w.id,
    key: hashFor(w.id, seed)
  }));

  withKeys.sort((a, b) => a.key - b.key);

  return withKeys.slice(0, wordCount).map((x) => x.id);
}

function hashFor(id: string, seed: number): number {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < id.length; i += 1) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
