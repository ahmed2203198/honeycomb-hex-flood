import React, { useMemo } from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Polygon,
  Stop,
} from 'react-native-svg';
import { NECTAR, WALL_DARK, WALL_LIGHT } from '../constants/theme';
import {
  BoardGeometry,
  Cell,
  hexCenter,
  hexPoints,
  KIND_DROP,
  KIND_WALL,
} from '../game/hexGrid';
import { FlowerGlyph } from './FlowerGlyph';

interface Props {
  cells: Cell[];
  owned: boolean[];
  cols: number;
  geo: BoardGeometry;
  colorblind: boolean;
}

const WALL_ID = 'waxWall';

/**
 * One single <Svg> holds every hexagon - no per-cell Views, so nothing can
 * overflow the wax frame and the whole board repaints in one pass.
 */
function HexBoardBase({ cells, owned, cols, geo, colorblind }: Props) {
  const outlines = useMemo(() => {
    const out: string[] = new Array(cells.length);
    for (let i = 0; i < cells.length; i += 1) {
      const c = hexCenter(i, cols, geo);
      out[i] = hexPoints(c.cx, c.cy, geo.hexW - 1.5, geo.hexH - 1.5);
    }
    return out;
  }, [cells.length, cols, geo]);

  const inners = useMemo(() => {
    const out: string[] = new Array(cells.length);
    for (let i = 0; i < cells.length; i += 1) {
      const c = hexCenter(i, cols, geo);
      out[i] = hexPoints(c.cx, c.cy, geo.hexW - 9, geo.hexH - 9);
    }
    return out;
  }, [cells.length, cols, geo]);

  const glyphSize = Math.max(9, Math.round(geo.hexW * 0.34));

  const body: React.ReactNode[] = [];
  for (let i = 0; i < cells.length; i += 1) {
    const cell = cells[i];
    const isWall = cell.kind === KIND_WALL;
    const isOwned = owned[i];
    const center = hexCenter(i, cols, geo);

    body.push(
      <Polygon
        key={'h' + i}
        points={outlines[i]}
        fill={isWall ? 'url(#' + WALL_ID + ')' : 'url(#wax' + cell.color + ')'}
        stroke="rgba(51,39,11,0.22)"
        strokeWidth={1}
      />,
    );

    if (!isWall && cell.kind === KIND_DROP && !isOwned) {
      // honey drop: absorbing it gives one pour back
      body.push(
        <Circle
          key={'d' + i}
          cx={center.cx}
          cy={center.cy}
          r={glyphSize * 0.62}
          fill="rgba(255,253,244,0.92)"
          stroke="#33270B"
          strokeWidth={1.2}
        />,
      );
      body.push(
        <Circle
          key={'dc' + i}
          cx={center.cx}
          cy={center.cy}
          r={glyphSize * 0.3}
          fill="#E0A100"
        />,
      );
    } else if (!isWall && colorblind) {
      body.push(
        <FlowerGlyph
          key={'g' + i}
          kind={cell.color}
          cx={center.cx}
          cy={center.cy}
          size={glyphSize}
          fill="rgba(51,39,11,0.42)"
        />,
      );
    }

    if (isOwned) {
      body.push(
        <Polygon
          key={'o' + i}
          points={inners[i]}
          fill="none"
          stroke="#33270B"
          strokeWidth={1.8}
        />,
      );
      body.push(
        <Polygon
          key={'ow' + i}
          points={hexPoints(center.cx, center.cy, geo.hexW - 16, geo.hexH - 16)}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={1.2}
        />,
      );
    }
  }

  return (
    <Svg width={geo.svgW} height={geo.svgH}>
      <Defs>
        {NECTAR.map(n => (
          <SvgGradient key={n.key} id={'wax' + n.key} x1="0" y1="0" x2="0.3" y2="1">
            <Stop offset="0" stopColor={n.light} />
            <Stop offset="0.55" stopColor={n.base} />
            <Stop offset="1" stopColor={n.dark} />
          </SvgGradient>
        ))}
        <SvgGradient id={WALL_ID} x1="0" y1="0" x2="0.4" y2="1">
          <Stop offset="0" stopColor={WALL_LIGHT} />
          <Stop offset="1" stopColor={WALL_DARK} />
        </SvgGradient>
      </Defs>
      {body}
    </Svg>
  );
}

export const HexBoard = React.memo(HexBoardBase);
