import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lock } from 'lucide-react-native';
import { SEASONS } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const CHIP_H = 40;

interface ChipProps {
  index: number;
  label: string;
  active: boolean;
  locked: boolean;
  onSelect: (index: number) => void;
}

function Chip({ index, label, active, locked, onSelect }: ChipProps) {
  const press = usePressScale(0.95);
  const handlePress = useCallback(() => {
    onSelect(index);
  }, [onSelect, index]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={locked}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chipWrap, { transform: [{ scale: press.scale }] }]}>
        {active ? (
          <LinearGradient
            colors={theme.gradients.gloss}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.chip, styles.chipActive]}>
            <Text style={[styles.label, styles.labelActive]} numberOfLines={1}>
              {label}
            </Text>
          </LinearGradient>
        ) : (
          <View style={[styles.chip, locked ? styles.chipLocked : styles.chipIdle]}>
            {locked ? (
              <View style={styles.lockBox}>
                <Lock size={13} color={theme.colors.text.muted} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

interface Props {
  season: number;
  unlockedUpTo: number;
  onSelect: (index: number) => void;
}

export function SeasonChips({ season, unlockedUpTo, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {SEASONS.map((name, i) => (
        <Chip
          key={name}
          index={i}
          label={name}
          active={i === season}
          locked={i > unlockedUpTo}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  press: {
    flex: 1,
    height: CHIP_H,
  },
  chipWrap: {
    width: '100%',
    height: CHIP_H,
  },
  chip: {
    width: '100%',
    height: CHIP_H,
    borderRadius: CHIP_H / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
    borderWidth: 1,
  },
  chipIdle: {
    backgroundColor: 'rgba(51,39,11,0.06)',
    borderColor: 'rgba(51,39,11,0.14)',
  },
  chipLocked: {
    backgroundColor: 'rgba(51,39,11,0.04)',
    borderColor: 'rgba(51,39,11,0.10)',
  },
  chipActive: {
    borderColor: theme.colors.accent.goldDark,
  },
  lockBox: {
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 1.1,
    color: theme.colors.text.muted,
  },
  labelActive: {
    color: theme.colors.text.primary,
  },
});
