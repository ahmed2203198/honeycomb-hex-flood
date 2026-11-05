import React from 'react';
import { Circle, Polygon } from 'react-native-svg';

interface Props {
  kind: number;
  cx: number;
  cy: number;
  size: number;
  fill: string;
}

function poly(cx: number, cy: number, size: number, pts: number[][]): string {
  const out: string[] = [];
  for (let i = 0; i < pts.length; i += 1) {
    out.push(cx + pts[i][0] * size + ',' + (cy + pts[i][1] * size));
  }
  return out.join(' ');
}

const LEAF = [
  [0, -0.5],
  [0.26, -0.14],
  [0.2, 0.26],
  [0, 0.5],
  [-0.2, 0.26],
  [-0.26, -0.14],
];

const TULIP = [
  [-0.38, 0.4],
  [-0.38, -0.16],
  [-0.15, 0.08],
  [0, -0.32],
  [0.15, 0.08],
  [0.38, -0.16],
  [0.38, 0.4],
];

const BELL = [
  [-0.32, -0.12],
  [-0.18, -0.4],
  [0.18, -0.4],
  [0.32, -0.12],
  [0.15, 0.1],
  [0, 0.44],
  [-0.15, 0.1],
];

/**
 * Colourblind-safe marks: five distinct silhouettes, one per nectar colour, so
 * colour is never the only channel. Pure SVG primitives with absolute
 * coordinates - no emoji, no special glyphs (rules #15/#16).
 */
function FlowerGlyphBase({ kind, cx, cy, size, fill }: Props) {
  if (kind === 0) {
    // daisy - five petals around a core
    const petals: React.ReactNode[] = [];
    for (let i = 0; i < 5; i += 1) {
      const a = (-90 + i * 72) * (Math.PI / 180);
      petals.push(
        <Circle
          key={i}
          cx={cx + Math.cos(a) * size * 0.3}
          cy={cy + Math.sin(a) * size * 0.3}
          r={size * 0.17}
          fill={fill}
        />,
      );
    }
    return (
      <>
        {petals}
        <Circle cx={cx} cy={cy} r={size * 0.13} fill={fill} />
      </>
    );
  }

  if (kind === 1) {
    // clover - three lobes
    const lobes: React.ReactNode[] = [];
    for (let i = 0; i < 3; i += 1) {
      const a = (-90 + i * 120) * (Math.PI / 180);
      lobes.push(
        <Circle
          key={i}
          cx={cx + Math.cos(a) * size * 0.25}
          cy={cy + Math.sin(a) * size * 0.25}
          r={size * 0.24}
          fill={fill}
        />,
      );
    }
    return <>{lobes}</>;
  }

  if (kind === 2) {
    return <Polygon points={poly(cx, cy, size, LEAF)} fill={fill} />;
  }

  if (kind === 3) {
    return <Polygon points={poly(cx, cy, size, TULIP)} fill={fill} />;
  }

  return <Polygon points={poly(cx, cy, size, BELL)} fill={fill} />;
}

export const FlowerGlyph = React.memo(FlowerGlyphBase);
