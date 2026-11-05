import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import {
  BOARD_PAD,
  ENTER_MS,
  GameMode,
  HEADER_CONTENT_H,
  HEADER_PAD_TOP,
  RESULT_DELAY_MS,
  SCREEN_H,
  TRAY_RESERVE,
} from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconButton } from '../components/IconButton';
import { PourCounter } from '../components/PourCounter';
import { FillMeter } from '../components/FillMeter';
import { HexBoard } from '../components/HexBoard';
import { PotTray } from '../components/PotTray';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { WaxCard } from '../components/WaxCard';
import { useFloodGame } from '../hooks/useFloodGame';
import { boardGeometry } from '../game/hexGrid';
import { fillPercent, jarTier, seasonName } from '../game/progression';

export interface GameResult {
  win: boolean;
  frame: number;
  mode: GameMode;
  poursUsed: number;
  limit: number;
  spare: number;
  tier: ReturnType<typeof jarTier>;
  fillPct: number;
  bestRegion: number;
}

interface Props {
  frame: number;
  mode: GameMode;
  seed: number;
  rows: number;
  cols: number;
  seasonIndex: number;
  slack: number;
  colorblind: boolean;
  onExit: () => void;
  onGameOver: (result: GameResult) => void;
}

const METER_ROW_H = 34;

export function GameScreen(props: Props) {
  const {
    frame,
    mode,
    seed,
    rows,
    cols,
    seasonIndex,
    slack,
    colorblind,
    onExit,
    onGameOver,
  } = props;

  const relax = mode === 'relax';
  const game = useFloodGame({ seed, rows, cols, seasonIndex, slack, relax });
  const [paused, setPaused] = useState(false);

  const enter = useRef(new Animated.Value(0)).current;
  const dropPop = useRef(new Animated.Value(0)).current;
  const overRef = useRef(onGameOver);
  overRef.current = onGameOver;

  const geo = useMemo(() => boardGeometry(rows, cols), [rows, cols]);

  const areaH =
    SCREEN_H -
    (HEADER_PAD_TOP + HEADER_CONTENT_H) -
    TRAY_RESERVE -
    METER_ROW_H -
    40;
  const boardScale = Math.min(1, areaH / Math.max(1, geo.boardH));

  useEffect(() => {
    const a = Animated.parallel([
      Animated.timing(enter, {
        toValue: 1,
        duration: ENTER_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    a.start();
    return () => {
      a.stop();
    };
  }, [enter]);

  // honey-drop reward pop
  const drops = game.lastDrops;
  const pourCount = game.pourCount;
  useEffect(() => {
    if (drops <= 0) {
      return;
    }
    dropPop.setValue(0);
    const a = Animated.sequence([
      Animated.timing(dropPop, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.delay(360),
      Animated.timing(dropPop, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]);
    a.start();
    return () => {
      a.stop();
    };
  }, [drops, pourCount, dropPop]);

  const status = game.status;
  const ownedCount = game.ownedCount;
  const totalCells = game.totalCells;
  const pours = game.pours;
  const limit = game.limit;
  const bestRegion = game.bestRegion;

  useEffect(() => {
    if (status !== 'won' && status !== 'lost') {
      return;
    }
    const win = status === 'won';
    const spare = Math.max(0, pours);
    const timer = setTimeout(() => {
      overRef.current({
        win,
        frame,
        mode,
        poursUsed: Math.max(0, limit - pours),
        limit,
        spare,
        tier: jarTier(spare),
        fillPct: fillPercent(ownedCount, totalCells),
        bestRegion,
      });
    }, RESULT_DELAY_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [status, pours, limit, frame, mode, ownedCount, totalCells, bestRegion]);

  const handlePause = useCallback(() => {
    setPaused(true);
  }, []);
  const handleResume = useCallback(() => {
    setPaused(false);
  }, []);

  const ratio = totalCells > 0 ? ownedCount / totalCells : 0;
  const pct = fillPercent(ownedCount, totalCells);
  const busy = status !== 'idle' || paused;

  const slide = enter.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });
  const dropY = dropPop.interpolate({ inputRange: [0, 1], outputRange: [10, -18] });

  const subtitle = relax ? 'RELAX' : seasonName(frame);

  // The board keeps its own layout box and is visually scaled to fit the area.
  const boardSlotStyle = useMemo(
    () => ({
      width: Math.round(geo.boardW * boardScale),
      height: Math.round(geo.boardH * boardScale),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    }),
    [geo.boardW, geo.boardH, boardScale],
  );
  const boardScaleStyle = useMemo(
    () => ({ transform: [{ scale: boardScale }] }),
    [boardScale],
  );
  const boardCardStyle = useMemo(() => ({ width: geo.boardW }), [geo.boardW]);
  const meterStyle = useMemo(() => ({ width: geo.boardW }), [geo.boardW]);

  return (
    <AppShell variant="game">
      <ScreenHeader
        title={'HIVE FRAME ' + frame}
        subtitle={subtitle}
        leftSlot={
          <>
            <IconButton source={assets.iconHome} label="Back to menu" onPress={onExit} />
            <IconButton source={assets.iconPause} label="Pause" onPress={handlePause} />
          </>
        }
        rightSlot={<PourCounter pours={pours} limit={limit} relax={relax} />}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.area, { opacity: enter, transform: [{ translateY: slide }] }]}>
        <View style={[styles.meterRow, meterStyle]}>
          <Image source={assets.sprite5} style={styles.meterSprite} resizeMode="contain" />
          <View style={styles.meterWrap}>
            <FillMeter ratio={ratio} width={geo.boardW - 34 - 52} />
          </View>
          <Text style={styles.pct}>{pct + '%'}</Text>
        </View>

        <View style={boardSlotStyle}>
          <View style={boardScaleStyle}>
            <WaxCard
              style={boardCardStyle}
              contentStyle={styles.boardContent}
              radius={theme.radius.lg}
              padding={BOARD_PAD}>
              <HexBoard
                cells={game.cells}
                owned={game.owned}
                cols={cols}
                geo={geo}
                colorblind={colorblind}
              />
            </WaxCard>
          </View>
        </View>

        <Animated.View
          pointerEvents="none"
          style={[styles.dropBadge, { opacity: dropPop, transform: [{ translateY: dropY }] }]}>
          <Text style={styles.dropText}>{'+' + drops + ' POUR'}</Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.tray} pointerEvents="box-none">
        <PotTray
          currentColor={game.ownedColor}
          busy={busy}
          canUndo={game.canUndo}
          onPour={game.pour}
          onUndo={game.undo}
        />
      </View>

      {paused ? (
        <View style={styles.pauseLayer}>
          <WaxCard style={styles.pauseCard} radius={theme.radius.xl} padding={18}>
            <Text style={styles.pauseTitle}>PAUSED</Text>
            <Text style={styles.pauseHint}>TAP A POT TO FLOOD THE COMB</Text>
            <PrimaryButton label="RESUME" onPress={handleResume} height={56} />
            <View style={styles.pauseGap} />
            <SecondaryButton label="MENU" onPress={onExit} height={48} />
          </WaxCard>
        </View>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: TRAY_RESERVE,
    gap: 10,
  },
  meterRow: {
    height: METER_ROW_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meterSprite: { width: 26, height: 26 },
  meterWrap: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
  pct: {
    width: 44,
    textAlign: 'right',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
  },
  boardContent: { alignItems: 'center', justifyContent: 'center' },
  dropBadge: {
    position: 'absolute',
    bottom: TRAY_RESERVE + 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(94,140,78,0.92)',
    borderWidth: 1,
    borderColor: '#466B39',
  },
  dropText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#FFF6DA',
  },
  tray: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 28,
  },
  pauseLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(51,39,11,0.55)',
  },
  pauseCard: { width: '100%' },
  pauseTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  pauseHint: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  pauseGap: { height: 10 },
});
