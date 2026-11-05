import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  value: string;
  label: string;
  accent: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Rule #21 / #15: no raster icons here. Colour + an 8px accent dot carry the
 * semantics, so every pill in a row is pixel-identical in shape.
 * Rule #19a: width:'100%' - never flex:1 inside a flex:1 parent.
 */
export function StatCard({ value, label, accent, style }: Props) {
  return (
    <View style={[styles.card, { borderColor: accent + '55' }, style]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: theme.colors.ui.glass,
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
});
