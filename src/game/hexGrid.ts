import { BOARD_FRAME, BOARD_MAX_W } from '../constants/config';

export const KIND_NORMAL = 0;
export const KIND_WALL = 1;
export const KIND_DROP = 2;

export interface Cell {
  color: number;
  kind: number;
}

export interface Grid {
  rows: number;
  cols: number;
  cells: Cell[];
}

export const cellIndex = (row: number, col: number, cols: number): number => row * cols + col;

/**
 * Pointy-top hexes, odd-row offset (odd rows pushed right by half a hex).
 * Six neighbours: E, W, NE, NW, SE, SW.
 */
export function hexNeighbors(index: number, rows: number, cols: number): number[] {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const odd = row % 2 === 1;
  const dx = odd ? 0 : -1;
  const candidates: number[][] = [
    [row, col - 1],
    [row, col + 1],
    [row - 1, col + dx],
    [row - 1, col + dx + 1],
    [row + 1, col + dx],
    [row + 1, col + dx + 1],
  ];
  const out: number[] = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const r = candidates[i][0];
    const c = candidates[i][1];
    if (r >= 0 && r < rows && c >= 0 && c < cols) {
      out.push(cellIndex(r, c, cols));
    }
  }
  return out;
}

/** Pre-computed adjacency so the flood/solver never recomputes it. */
export function buildNeighborTable(rows: number, cols: number): number[][] {
  const table: number[][] = new Array(rows * cols);
  for (let i = 0; i < rows * cols; i += 1) {
    table[i] = hexNeighbors(i, rows, cols);
  }
  return table;
}

export interface BoardGeometry {
  hexW: number;
  hexH: number;
  rowStep: number;
  boardW: number;
  boardH: number;
  svgW: number;
  svgH: number;
}

/**
 * Rule #4 - the parent's padding+border is subtracted BEFORE the tile size is
 * derived, so the hexes can never stick out of the wax frame.
 */
export function boardGeometry(rows: number, cols: number): BoardGeometry {
  const inner = BOARD_MAX_W - 2 * BOARD_FRAME;
  const hexW = Math.floor(inner / (cols + 0.5));
  const hexH = Math.floor(hexW * 1.1547);
  const rowStep = Math.floor(hexH * 0.75);
  const svgW = hexW * cols + Math.floor(hexW / 2);
  const svgH = hexH + rowStep * (rows - 1);
  return {
    hexW,
    hexH,
    rowStep,
    svgW,
    svgH,
    boardW: svgW + 2 * BOARD_FRAME,
    boardH: svgH + 2 * BOARD_FRAME,
  };
}

export function hexCenter(
  index: number,
  cols: number,
  geo: BoardGeometry,
): { cx: number; cy: number } {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const offset = row % 2 === 1 ? geo.hexW / 2 : 0;
  return {
    cx: col * geo.hexW + geo.hexW / 2 + offset,
    cy: row * geo.rowStep + geo.hexH / 2,
  };
}

/** Polygon points of a pointy-top hexagon centred on (cx, cy). */
export function hexPoints(cx: number, cy: number, w: number, h: number): string {
  const hw = w / 2;
  const q = h / 4;
  const hh = h / 2;
  return (
    cx + ',' + (cy - hh) + ' ' +
    (cx + hw) + ',' + (cy - q) + ' ' +
    (cx + hw) + ',' + (cy + q) + ' ' +
    cx + ',' + (cy + hh) + ' ' +
    (cx - hw) + ',' + (cy + q) + ' ' +
    (cx - hw) + ',' + (cy - q)
  );
}
