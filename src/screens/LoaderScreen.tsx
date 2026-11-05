import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import {
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  LOADER_PROGRESS_MS,
  SCREEN_H,
  SCREEN_W,
} from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';

const BAR_W = 212;
const CARD = 196;

interface Props {
  onDone: () => void;
}

/**
 * Rule #14: this is the only DARK screen besides the lose result - Menu is
 * light cream, so Loader and Menu can never collide on the pHash gate.
 * Rule #13: it is on screen for exactly LOADER_DURATION_MS.
 */
export function LoaderScreen({ onDone }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0.82)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(rise, {
        toValue: 1,
        tension: 48,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(220),
        Animated.timing(titleFade, { toValue: 1, duration: 420, useNativeDriver: true }),
      ]),
    ]);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    // width animation -> native driver stays false
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });

    entrance.start();
    loop.start();
    bar.start();

    const outTimer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => {
        doneRef.current();
      });
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => {
      clearTimeout(outTimer);
      entrance.stop();
      loop.stop();
      bar.stop();
    };
  }, [fade, rise, breathe, titleFade, progress]);

  const breatheScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] });
  const barWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, BAR_W] });

  return (
    <AppShell variant="loader">
      <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="box-none">
        <View style={styles.blobA} pointerEvents="none" />
        <View style={styles.blobB} pointerEvents="none" />
        <View style={styles.blobC} pointerEvents="none" />

        <View style={styles.center}>
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.card,
              { transform: [{ scale: Animated.multiply(rise, breatheScale) }] },
            ]}>
            <View style={styles.cardBevel} pointerEvents="none" />
            <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          </Animated.View>

          <Animated.View style={[styles.titleBlock, { opacity: titleFade }]} pointerEvents="none">
            <Text style={styles.brand}>HONEYCOMB</Text>
            <Text style={styles.brandSub}>HEX FLOOD</Text>
            <Text style={styles.tagline}>FILL THE COMB IN TIME</Text>
          </Animated.View>
        </View>

        <View style={styles.bottom} pointerEvents="none">
          <View style={styles.track}>
            <Animated.View pointerEvents="none" style={[styles.barFill, { width: barWidth }]}>
              <LinearGradient
                colors={theme.gradients.gloss}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barGradient}>
                <View style={styles.barGloss} />
              </LinearGradient>
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blobA: {
    position: 'absolute',
    left: -40,
    top: 80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(224,161,0,0.18)',
  },
  blobB: {
    position: 'absolute',
    left: SCREEN_W - 60,
    top: 220,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(245,217,122,0.16)',
  },
  blobC: {
    position: 'absolute',
    left: 40,
    top: SCREEN_H - 160,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(224,161,0,0.14)',
  },
  center: { alignItems: 'center', justifyContent: 'center', gap: 26 },
  card: {
    width: CARD,
    height: CARD,
    borderRadius: 32,
    backgroundColor: 'rgba(255,246,218,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,217,122,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.shadows.brand.shadowColor,
    shadowOpacity: theme.shadows.brand.shadowOpacity,
    shadowRadius: theme.shadows.brand.shadowRadius,
    shadowOffset: theme.shadows.brand.shadowOffset,
    elevation: theme.shadows.brand.elevation,
  },
  cardBevel: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 2,
    backgroundColor: 'rgba(245,217,122,0.35)',
  },
  logo: { width: 148, height: 148 },
  titleBlock: { alignItems: 'center', gap: 4 },
  brand: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  brandSub: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 8,
    color: theme.colors.accent.gold,
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: 'rgba(255,246,218,0.62)',
  },
  bottom: {
    position: 'absolute',
    bottom: 76,
    alignItems: 'center',
    gap: 12,
  },
  track: {
    width: BAR_W,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ui.trackDark,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
  barGradient: { flex: 1, borderRadius: 4 },
  barGloss: {
    position: 'absolute',
    top: 1,
    left: 2,
    right: 2,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  loading: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.onDarkMuted,
  },
});
