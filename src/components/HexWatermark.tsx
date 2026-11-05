import React, { useMemo } from 'react';
import Svg, { Polygon } from 'react-native-svg';
import { SCREEN_H, SCREEN_W } from '../constants/config';
import { hexPoints } from '../game/hexGrid';

interface Props {
  stroke: string;
}

const HEX_W = 68;
const HEX_H = Math.round(HEX_W * 1.1547);
const ROW_STEP = Math.round(HEX_H * 0.75);

/** Decorative honeycomb layer - the third depth level under every screen. */
function HexWatermarkBase({ stroke }: Props) {
  const points = useMemo(() => {
    const rows = Math.ceil(SCREEN_H / ROW_STEP) + 2;
    const cols = Math.ceil(SCREEN_W / HEX_W) + 2;
    const out: string[] = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const offset = r % 2 === 1 ? HEX_W / 2 : 0;
        out.push(
          hexPoints(c * HEX_W + offset - HEX_W / 2, r * ROW_STEP - HEX_H / 2, HEX_W, HEX_H),
        );
      }
    }
    return out;
  }, []);

  return (
    <Svg width={SCREEN_W} height={SCREEN_H}>
      {points.map((p, i) => (
        <Polygon key={i} points={p} fill="none" stroke={stroke} strokeWidth={1.5} />
      ))}
    </Svg>
  );
}

export const HexWatermark = React.memo(HexWatermarkBase);
