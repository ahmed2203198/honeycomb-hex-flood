import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RING_STAGGER_MS, UNDO_STACK_MAX } from '../constants/config';
import { generateBoard } from '../game/boardGenerator';
import { applyPour, computePour, countOwned, largestRegion } from '../game/floodEngine';
import { Cell } from '../game/hexGrid';

export type GameStatus = 'idle' | 'pouring' | 'won' | 'lost';

interface Snapshot {
  cells: Cell[];
  owned: boolean[];
  pours: number;
}

interface GameData {
  cells: Cell[];
  owned: boolean[];
  pours: number;
  ownedCount: number;
  status: GameStatus;
  lastDrops: number;
  pourCount: number;
}

export interface UseFloodGameOptions {
  seed: number;
  rows: number;
  cols: number;
  seasonIndex: number;
  slack: number;
  relax: boolean;
}

export function useFloodGame(options: UseFloodGameOptions) {
  const { seed, rows, cols, seasonIndex, slack, relax } = options;

  const board = useMemo(
    () => generateBoard(seed, rows, cols, seasonIndex, slack),
    [seed, rows, cols, seasonIndex, slack],
  );

  const makeInitial = useCallback(
    (): GameData => ({
      cells: board.cells,
      owned: board.owned,
      pours: board.limit,
      ownedCount: countOwned(board.owned),
      status: 'idle',
      lastDrops: 0,
      pourCount: 0,
    }),
    [board],
  );

  const dataRef = useRef<GameData>(makeInitial());
  const [data, setData] = useState<GameData>(dataRef.current);
  const undoRef = useRef<Snapshot[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const clearTimers = useCallback(() => {
    for (let i = 0; i < timersRef.current.length; i += 1) {
      clearTimeout(timersRef.current[i]);
    }
    timersRef.current = [];
  }, []);

  const commit = useCallback((next: GameData) => {
    dataRef.current = next;
    setData(next);
  }, []);

  // Fresh board whenever the seed/size changes.
  useEffect(() => {
    clearTimers();
    undoRef.current = [];
    setCanUndo(false);
    const fresh = makeInitial();
    dataRef.current = fresh;
    setData(fresh);
  }, [makeInitial, clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  const ownedColor = useMemo(() => {
    for (let i = 0; i < data.owned.length; i += 1) {
      if (data.owned[i]) {
        return data.cells[i].color;
      }
    }
    return -1;
  }, [data]);

  const pour = useCallback(
    (color: number) => {
      const cur = dataRef.current;
      if (cur.status !== 'idle') {
        return;
      }
      let currentColor = -1;
      for (let i = 0; i < cur.owned.length; i += 1) {
        if (cur.owned[i]) {
          currentColor = cur.cells[i].color;
          break;
        }
      }
      if (color === currentColor) {
        return;
      }
      if (!relax && cur.pours <= 0) {
        return;
      }

      const stack = undoRef.current.slice(-(UNDO_STACK_MAX - 1));
      stack.push({ cells: cur.cells, owned: cur.owned, pours: cur.pours });
      undoRef.current = stack;
      setCanUndo(true);

      const result = computePour(cur.cells, cur.owned, board.neighbors, color);

      // Ring 0 repaints instantly, every further ring lands RING_STAGGER_MS later -
      // that staggered sweep IS the flood animation (pure state, no Animated on Svg).
      let working: GameData = {
        ...cur,
        status: 'pouring',
        lastDrops: result.drops,
        pourCount: cur.pourCount + 1,
        pours: relax ? cur.pours : cur.pours - 1,
      };

      const applyRing = (ringIndex: number) => {
        const partial: typeof result = {
          rings: [result.rings[ringIndex]],
          absorbed: 0,
          drops: 0,
        };
        const applied = applyPour(working.cells, working.owned, partial, color);
        working = {
          ...working,
          cells: applied.cells,
          owned: applied.owned,
          ownedCount: countOwned(applied.owned),
        };
        commit(working);
      };

      applyRing(0);

      for (let k = 1; k < result.rings.length; k += 1) {
        const ringIndex = k;
        timersRef.current.push(
          setTimeout(() => {
            applyRing(ringIndex);
          }, ringIndex * RING_STAGGER_MS),
        );
      }

      const settleAt = Math.max(1, result.rings.length) * RING_STAGGER_MS + 120;
      timersRef.current.push(
        setTimeout(() => {
          const bonus = result.drops;
          const finalPours = relax ? working.pours : working.pours + bonus;
          const won = working.ownedCount >= board.totalCells;
          const lost = !won && !relax && finalPours <= 0;
          working = {
            ...working,
            pours: finalPours,
            status: won ? 'won' : lost ? 'lost' : 'idle',
          };
          commit(working);
        }, settleAt),
      );
    },
    [board, commit, relax],
  );

  const undo = useCallback(() => {
    const cur = dataRef.current;
    if (cur.status === 'pouring') {
      return;
    }
    const stack = undoRef.current.slice();
    const prev = stack.pop();
    if (!prev) {
      return;
    }
    undoRef.current = stack;
    setCanUndo(stack.length > 0);
    clearTimers();
    commit({
      cells: prev.cells,
      owned: prev.owned,
      pours: prev.pours,
      ownedCount: countOwned(prev.owned),
      status: 'idle',
      lastDrops: 0,
      pourCount: Math.max(0, cur.pourCount - 1),
    });
  }, [clearTimers, commit]);

  const bestRegion = useMemo(
    () => largestRegion(data.cells, data.owned, board.neighbors),
    [data, board],
  );

  return {
    cells: data.cells,
    owned: data.owned,
    pours: data.pours,
    status: data.status,
    ownedCount: data.ownedCount,
    lastDrops: data.lastDrops,
    pourCount: data.pourCount,
    ownedColor,
    canUndo,
    totalCells: board.totalCells,
    limit: board.limit,
    optimal: board.optimal,
    rows: board.rows,
    cols: board.cols,
    bestRegion,
    pour,
    undo,
  };
}
