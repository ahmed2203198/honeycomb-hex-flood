import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Droplets } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface Props {
  pours: number;
  limit: number;
  relax: boolean;
}

/** The plum "pours remaining" pill. Pulses when the supply runs low. */
export function PourCounter({ pours, limit, relax }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const low = !relax && pours <= 2;

  useEffect(() => {
    // transform-only pulse -> native driver is safe
    scale.setValue(1);
    const anim = Animated.sequence([
      Animated.timing(scale, { toValue: 1.1, duration: 110, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        tension: theme.animation.pop.tension,
        friction: theme.animation.pop.friction,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => {
      anim.stop();
    };
  }, [pours, scale]);

  const accent = low ? theme.colors.earth.terracotta : theme.colors.accent.plum;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pill,
        {
          borderColor: accent,
          backgroundColor: low ? 'rgba(217,123,77,0.14)' : 'rgba(91,62,150,0.12)',
          transform: [{ scale }],
        },
      ]}>
      <View style={styles.iconBox}>
        <Droplets size={18} color={accent} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color: accent }]} numberOfLines={1}>
        {relax ? 'RELAX' : pours + '/' + limit}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: 40,
    minWidth: 86,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconBox: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
