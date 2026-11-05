import React from 'react';
import { Animated, Image, Pressable, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SIZE = 44;

interface Props {
  source: number;
  label: string;
  onPress: () => void;
}

/** 44x44 wax plate with a 24x24 PNG glyph. Explicit width AND height. */
export function IconButton({ source, label, onPress }: Props) {
  const press = usePressScale(0.92);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.plate, { transform: [{ scale: press.scale }] }]}>
        <Image source={source} style={styles.glyph} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' },
  plate: {
    width: SIZE,
    height: SIZE,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,246,218,0.70)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: { width: 24, height: 24 },
});
