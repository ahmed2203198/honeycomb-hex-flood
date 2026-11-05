import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.control}>{children}</View>
    </View>
  );
}

/** A chunky wax toggle - explicit width and height, no intrinsic sizing. */
export function WaxToggle({
  value,
  onToggle,
  accessibilityLabel,
}: {
  value: boolean;
  onToggle: (next: boolean) => void;
  accessibilityLabel: string;
}) {
  const press = usePressScale(0.94);
  const handlePress = useCallback(() => {
    onToggle(!value);
  }, [onToggle, value]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      style={styles.togglePress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.toggle,
          value ? styles.toggleOn : styles.toggleOff,
          { transform: [{ scale: press.scale }] },
        ]}>
        <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
      </Animated.View>
    </Pressable>
  );
}

/** Small segmented chip used for board size. */
export function MiniChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const press = usePressScale(0.94);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.chipPress}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.chip,
          active ? styles.chipActive : styles.chipIdle,
          { transform: [{ scale: press.scale }] },
        ]}>
        <Text style={[styles.chipLabel, active ? styles.chipLabelActive : null]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,253,244,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(51,39,11,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    gap: 10,
  },
  label: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: theme.colors.text.primary,
  },
  control: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  togglePress: { width: 60, height: 34, alignItems: 'center', justifyContent: 'center' },
  toggle: {
    width: 56,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: 'rgba(224,161,0,0.28)',
    borderColor: theme.colors.accent.goldDark,
    alignItems: 'flex-end',
  },
  toggleOff: {
    backgroundColor: 'rgba(51,39,11,0.08)',
    borderColor: 'rgba(51,39,11,0.18)',
    alignItems: 'flex-start',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  knobOn: { backgroundColor: theme.colors.accent.gold, borderColor: '#A97700' },
  knobOff: { backgroundColor: theme.colors.surface.card, borderColor: 'rgba(51,39,11,0.2)' },
  chipPress: { height: 34, minWidth: 68 },
  chip: {
    height: 34,
    minWidth: 68,
    paddingHorizontal: 10,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: 'rgba(51,39,11,0.06)',
    borderColor: 'rgba(51,39,11,0.14)',
  },
  chipActive: {
    backgroundColor: 'rgba(224,161,0,0.26)',
    borderColor: theme.colors.accent.goldDark,
  },
  chipLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: theme.colors.text.muted,
  },
  chipLabelActive: { color: theme.colors.text.primary },
});
