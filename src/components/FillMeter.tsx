import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { METER_MS } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  ratio: number;
  width: number;
}

/**
 * Width animation -> useNativeDriver MUST stay false (rule: native driver is
 * transform/opacity only).
 */
export function FillMeter({ ratio, width }: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(1, ratio));

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: clamped,
      duration: METER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    a.start();
    return () => {
      a.stop();
    };
  }, [clamped, anim]);

  const w = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(0, width)],
  });

  return (
    <View style={[styles.track, { width }]} pointerEvents="none">
      <Animated.View pointerEvents="none" style={[styles.fill, { width: w }]}>
        <LinearGradient
          colors={theme.gradients.gloss}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}>
          <View style={styles.gloss} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ui.track,
    borderWidth: 1,
    borderColor: 'rgba(51,39,11,0.12)',
    overflow: 'hidden',
  },
  fill: { height: '100%' },
  gradient: { flex: 1, borderRadius: 4 },
  gloss: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
