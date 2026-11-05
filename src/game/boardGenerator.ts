import {
  CLUSTER_CHANCE,
  DROP_CHANCE,
  MAX_SEED_ATTEMPTS,
  SOLVER_CAP,
  WALL_CHANCE,
} from '../constants/config';
import { NECTAR_COUNT } from '../constants/theme';
import { mulberry32, randInt } from '../utils/rng';
import { applyPour, computePour, countPlayable } from './floodEngine';
import { buildNeighborTable, Cell, cellIndex, KIND_DROP, KIND_NORMAL, KIND_WALL } from './hexGrid';

export interface GeneratedBoard {
  rows: number;
  cols: number;
  cells: Cell[];
  owned: boolean[];
  neighbors: number[][];
  totalCells: number;
  optimal: number;
  limit: number;
  seed: number;
}

function paint(
  rows: number,
  cols: number,
  seasonIndex: number,
  rng: () => number,
  neighbors: number[][],
): { cells: Cell[]; owned: boolean[]; starts: number[] } {
  const total = rows * cols;
  const cells: Cell[] = new Array(total);
  const wallChance = WALL_CHANCE[Math.min(seasonIndex, WALL_CHANCE.length - 1)];

  const starts: number[] = [cellIndex(rows - 1, 0, cols)];
  if (seasonIndex >= 3) {
    starts.push(cellIndex(0, cols - 1, cols));
  }

  for (let i = 0; i < total; i += 1) {
    // Clustering pass: copy a random already-painted neighbour so the board
    // grows real regions instead of random noise.
    let color = randInt(rng, NECTAR_COUNT);
    if (i > 0 && rng() < CLUSTER_CHANCE) {
      const adj = neighbors[i];
      const painted: number[] = [];
      for (let n = 0; n < adj.length; n += 1) {
        if (adj[n] < i) {
          painted.push(adj[n]);
        }
      }
      if (painted.length > 0) {
        color = cells[painted[randInt(rng, painted.length)]].color;
      }
    }

    let kind = KIND_NORMAL;
    const isStart = starts.indexOf(i) >= 0;
    if (!isStart) {
      if (wallChance > 0 && rng() < wallChance) {
        kind = KIND_WALL;
      } else if (seasonIndex >= 1 && rng() < DROP_CHANCE) {
        kind = KIND_DROP;
      }
    }
    cells[i] = { color, kind };
  }

  const owned = new Array<boolean>(total).fill(false);
  for (let s = 0; s < starts.length; s += 1) {
    owned[starts[s]] = true;
  }
  return { cells, owned, starts };
}

/**
 * Greedy-with-lookahead solver. Its move count is the board's `optimal`
 * reference - the pour limit is derived from it, so every shipped board is
 * guaranteed to be finishable.
 */
function solve(
  cells: Cell[],
  owned: boolean[],
  neighbors: number[][],
  playable: number,
): number {
  let curCells = cells;
  let curOwned = owned;
  let ownedCount = 0;
  for (let i = 0; i < curOwned.length; i += 1) {
    if (curOwned[i]) {
      ownedCount += 1;
    }
  }

  let moves = 0;
  while (ownedCount < playable && moves < SOLVER_CAP) {
    let bestColor = -1;
    let bestGain = -1;
    for (let c = 0; c < NECTAR_COUNT; c += 1) {
      const probe = computePour(curCells, curOwned, neighbors, c);
      if (probe.absorbed > bestGain) {
        bestGain = probe.absorbed;
        bestColor = c;
      }
    }
    if (bestColor < 0 || bestGain <= 0) {
      break;
    }
    const result = computePour(curCells, curOwned, neighbors, bestColor);
    const next = applyPour(curCells, curOwned, result, bestColor);
    curCells = next.cells;
    curOwned = next.owned;
    ownedCount += result.absorbed;
    moves += 1;
  }

  return ownedCount >= playable ? moves : SOLVER_CAP + 1;
}

export function generateBoard(
  baseSeed: number,
  rows: number,
  cols: number,
  seasonIndex: number,
  slack: number,
): GeneratedBoard {
  const neighbors = buildNeighborTable(rows, cols);
  const softCap = Math.max(12, Math.round((rows * cols) / 3));

  let attempt = 0;
  let fallback: GeneratedBoard | null = null;

  while (attempt < MAX_SEED_ATTEMPTS) {
    const seed = baseSeed + attempt;
    const rng = mulberry32(seed * 2654435761);
    const painted = paint(rows, cols, seasonIndex, rng, neighbors);
    const playable = countPlayable(painted.cells);
    const optimal = solve(painted.cells, painted.owned, neighbors, playable);

    const board: GeneratedBoard = {
      rows,
      cols,
      cells: painted.cells,
      owned: painted.owned,
      neighbors,
      totalCells: playable,
      optimal,
      limit: optimal + slack,
      seed,
    };

    if (optimal <= SOLVER_CAP) {
      if (optimal <= softCap) {
        return board;
      }
      if (fallback === null || optimal < fallback.optimal) {
        fallback = board;
      }
    }
    attempt += 1;
  }

  if (fallback !== null) {
    return fallback;
  }

  // Last resort: a plain board with a generous limit. Never ships unsolvable.
  const rng = mulberry32(baseSeed);
  const painted = paint(rows, cols, 0, rng, neighbors);
  const playable = countPlayable(painted.cells);
  const optimal = solve(painted.cells, painted.owned, neighbors, playable);
  return {
    rows,
    cols,
    cells: painted.cells,
    owned: painted.owned,
    neighbors,
    totalCells: playable,
    optimal,
    limit: Math.max(optimal, 20) + slack,
    seed: baseSeed,
  };
}
