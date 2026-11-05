import React from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Undo2 } from 'lucide-react-native';
import { NECTAR, theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { ColorPot } from './ColorPot';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const UNDO_SIZE = 52;

interface Props {
  currentColor: number;
  busy: boolean;
  canUndo: boolean;
  onPour: (colorKey: number) => void;
  onUndo: () => void;
}

function UndoButton({ canUndo, onUndo }: { canUndo: boolean; onUndo: () => void }) {
  const press = usePressScale(0.9);
  return (
    <Pressable
      onPress={onUndo}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={!canUndo}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="Undo last pour"
      style={styles.undoPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.undo,
          { opacity: canUndo ? 1 : 0.35, transform: [{ scale: press.scale }] },
        ]}>
        <Undo2 size={24} color={theme.colors.accent.plum} strokeWidth={2.4} />
      </Animated.View>
    </Pressable>
  );
}

/** The floating G2 control bar: undo + the five nectar pots. */
export function PotTray({ currentColor, busy, canUndo, onPour, onUndo }: Props) {
  return (
    <View style={styles.row} pointerEvents="box-none">
      <UndoButton canUndo={canUndo && !busy} onUndo={onUndo} />
      <View style={styles.tray}>
        <View style={styles.bevel} pointerEvents="none" />
        {NECTAR.map(n => (
          <ColorPot
            key={n.key}
            colorKey={n.key}
            disabled={busy || n.key === currentColor}
            onPress={onPour}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  undoPress: {
    width: UNDO_SIZE,
    height: UNDO_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undo: {
    width: UNDO_SIZE,
    height: UNDO_SIZE,
    borderRadius: UNDO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(91,62,150,0.14)',
    borderWidth: 1.5,
    borderColor: theme.colors.accent.plum,
  },
  tray: {
    flex: 1,
    height: 84,
    borderRadius: theme.radius.xl,
    backgroundColor: 'rgba(255,253,244,0.94)',
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    shadowColor: theme.shadows.tray.shadowColor,
    shadowOpacity: theme.shadows.tray.shadowOpacity,
    shadowRadius: theme.shadows.tray.shadowRadius,
    shadowOffset: theme.shadows.tray.shadowOffset,
    elevation: theme.shadows.tray.elevation,
  },
  bevel: {
    position: 'absolute',
    top: 0,
    left: 14,
    right: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.ui.highlight,
  },
});
