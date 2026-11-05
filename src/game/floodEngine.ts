import { Cell, KIND_DROP, KIND_WALL } from './hexGrid';

export interface PourResult {
  /** rings[0] = the cells already owned (they just repaint), rings[k>0] = absorbed at BFS depth k. */
  rings: number[][];
  absorbed: number;
  drops: number;
}

/**
 * Classic flood-it on a hex grid: everything owned turns `color`, then every
 * adjacent cell that already carries `color` is swallowed, repeatedly.
 * Pure function - it never mutates the inputs.
 */
export function computePour(
  cells: Cell[],
  owned: boolean[],
  neighbors: number[][],
  color: number,
): PourResult {
  const taken = owned.slice();
  const seed: number[] = [];
  for (let i = 0; i < taken.length; i += 1) {
    if (taken[i]) {
      seed.push(i);
    }
  }

  const rings: number[][] = [seed];
  let frontier = seed;
  let absorbed = 0;
  let drops = 0;

  for (;;) {
    const next: number[] = [];
    for (let f = 0; f < frontier.length; f += 1) {
      const adj = neighbors[frontier[f]];
      for (let n = 0; n < adj.length; n += 1) {
        const id = adj[n];
        if (taken[id]) {
          continue;
        }
        const cell = cells[id];
        if (cell.kind === KIND_WALL || cell.color !== color) {
          continue;
        }
        taken[id] = true;
        next.push(id);
        absorbed += 1;
        if (cell.kind === KIND_DROP) {
          drops += 1;
        }
      }
    }
    if (next.length === 0) {
      break;
    }
    rings.push(next);
    frontier = next;
  }

  return { rings, absorbed, drops };
}

/** Applies a pour to fresh copies of the grid cells and the owned mask. */
export function applyPour(
  cells: Cell[],
  owned: boolean[],
  result: PourResult,
  color: number,
): { cells: Cell[]; owned: boolean[] } {
  const nextCells = cells.slice();
  const nextOwned = owned.slice();
  for (let r = 0; r < result.rings.length; r += 1) {
    const ring = result.rings[r];
    for (let i = 0; i < ring.length; i += 1) {
      const id = ring[i];
      nextOwned[id] = true;
      nextCells[id] = { color, kind: nextCells[id].kind };
    }
  }
  return { cells: nextCells, owned: nextOwned };
}

export function countOwned(owned: boolean[]): number {
  let n = 0;
  for (let i = 0; i < owned.length; i += 1) {
    if (owned[i]) {
      n += 1;
    }
  }
  return n;
}

/** Playable cells = everything that is not a wax wall. */
export function countPlayable(cells: Cell[]): number {
  let n = 0;
  for (let i = 0; i < cells.length; i += 1) {
    if (cells[i].kind !== KIND_WALL) {
      n += 1;
    }
  }
  return n;
}

/** Largest contiguous unowned region - shown on the lose screen. */
export function largestRegion(
  cells: Cell[],
  owned: boolean[],
  neighbors: number[][],
): number {
  const seen = new Array<boolean>(cells.length).fill(false);
  let best = 0;
  for (let i = 0; i < cells.length; i += 1) {
    if (seen[i] || owned[i] || cells[i].kind === KIND_WALL) {
      continue;
    }
    let size = 0;
    const stack = [i];
    seen[i] = true;
    while (stack.length > 0) {
      const cur = stack.pop() as number;
      size += 1;
      const adj = neighbors[cur];
      for (let n = 0; n < adj.length; n += 1) {
        const id = adj[n];
        if (
          !seen[id] &&
          !owned[id] &&
          cells[id].kind !== KIND_WALL &&
          cells[id].color === cells[cur].color
        ) {
          seen[id] = true;
          stack.push(id);
        }
      }
    }
    if (size > best) {
      best = size;
    }
  }
  return best;
}
