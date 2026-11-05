import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { JarTier, jarTierColor } from '../game/progression';
import { theme } from '../constants/theme';

interface Props {
  frame: number;
  tier?: JarTier;
}

const SLOT = 72;

/** One pantry cell. Earned slots show the jar sprite, empty ones a dashed rim. */
export function JarSlot({ frame, tier }: Props) {
  if (!tier) {
    return (
      <View style={[styles.slot, styles.empty]}>
        <View style={styles.hexHint} />
        <Text style={styles.frameMuted}>{frame}</Text>
      </View>
    );
  }

  const accent = jarTierColor(tier);
  return (
    <View style={[styles.slot, { borderColor: accent }]}>
      <Image source={assets.sprite2} style={styles.jar} resizeMode="contain" />
      <View style={[styles.tierBar, { backgroundColor: accent }]} />
      <Text style={[styles.frame, { color: accent }]}>{frame}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: SLOT,
    height: SLOT,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(255,253,244,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empty: {
    borderStyle: 'dashed',
    borderColor: 'rgba(51,39,11,0.18)',
    backgroundColor: 'rgba(255,253,244,0.45)',
  },
  hexHint: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(51,39,11,0.16)',
    transform: [{ rotate: '30deg' }],
  },
  jar: { width: 42, height: 42 },
  tierBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  frame: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  frameMuted: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
});
