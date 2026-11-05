import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Droplet, Home } from 'lucide-react-native';
import { assets } from '../assets';
import { BEE_LOOP_MS, SWEEP_MS } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { WaxCard } from '../components/WaxCard';
import { StatCard } from '../components/StatCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { GameResult } from './GameScreen';

interface Props {
  result: GameResult;
  onPlayAgain: () => void;
  onMenu: () => void;
}

// Small hover arc - the bee always stays INSIDE the card's rounded bounds.
const BEE_PATH_X = [0, -30, -60, -30, 0];
const BEE_PATH_Y = [0, -26, -44, -26, 0];
const BEE_PATH_T = [0, 0.25, 0.5, 0.75, 1];

/** Rule #12: a discrete result screen, reached via onGameOver. */
export function GameOverScreen({ result, onPlayAgain, onMenu }: Props) {
  const win = result.win;

  const rise = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(0.6)).current;
  const sweep = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const seq = Animated.parallel([
      Animated.timing(rise, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(pop, {
        toValue: 1,
        tension: theme.animation.pop.tension,
        friction: theme.animation.pop.friction,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(sweep, {
          toValue: 1,
          duration: SWEEP_MS,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]);
    seq.start();

    let loop: Animated.CompositeAnimation | null = null;
    if (win) {
      orbit.setValue(0);
      loop = Animated.loop(
        Animated.timing(orbit, {
          toValue: 1,
          duration: BEE_LOOP_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        { iterations: 2 },
      );
      loop.start();
    }

    return () => {
      seq.stop();
      if (loop) {
        loop.stop();
      }
    };
  }, [rise, pop, sweep, orbit, win]);

  const slide = rise.interpolate({ inputRange: [0, 1], outputRange: [22, 0] });
  const sweepX = sweep.interpolate({ inputRange: [0, 1], outputRange: [-220, 320] });
  const beeX = orbit.interpolate({ inputRange: BEE_PATH_T, outputRange: BEE_PATH_X });
  const beeY = orbit.interpolate({ inputRange: BEE_PATH_T, outputRange: BEE_PATH_Y });

  const headline = win ? 'COMB FILLED' : 'OUT OF POURS';
  const accentText = win ? theme.colors.text.primary : theme.colors.accent.goldLight;

  return (
    <AppShell variant={win ? 'win' : 'lose'}>
      <ScreenHeader
        title={'HIVE FRAME ' + result.frame}
        subtitle={win ? 'FILLED' : 'TRY AGAIN'}
        tone={win ? 'light' : 'dark'}
        rightSlot={
          <View style={[styles.badge, win ? styles.badgeWin : styles.badgeLose]}>
            <Text style={[styles.badgeText, win ? styles.badgeTextWin : styles.badgeTextLose]}>
              {result.fillPct + '%'}
            </Text>
          </View>
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[styles.body, { opacity: rise, transform: [{ translateY: slide }] }]}>
        <Text style={[styles.headline, { color: accentText }]} numberOfLines={1}>
          {headline}
        </Text>
        <Text style={[styles.sub, win ? styles.subWin : styles.subLose]} numberOfLines={1}>
          {win ? 'THE WHOLE FRAME IS ONE COLOUR' : 'THE COMB IS STILL PATCHY'}
        </Text>

        <View style={styles.cardWrap}>
          <WaxCard style={styles.card} radius={theme.radius.xl} padding={16}>
            <Animated.View
              pointerEvents="none"
              style={[styles.sweep, { transform: [{ translateX: sweepX }, { rotate: '18deg' }] }]}
            />

            {win ? (
              <View style={styles.statRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    value={String(result.poursUsed)}
                    label="POURS USED"
                    accent={theme.colors.accent.gold}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    value={'+' + result.spare}
                    label="SPARE"
                    accent={theme.colors.accent.plum}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    value={result.tier}
                    label="JAR EARNED"
                    accent={theme.colors.earth.sage}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.statRow}>
                <View style={styles.statSlot}>
                  <StatCard
                    value={result.fillPct + '%'}
                    label="COMB FILLED"
                    accent={theme.colors.accent.gold}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    value={String(result.bestRegion)}
                    label="BEST REGION"
                    accent={theme.colors.accent.plum}
                  />
                </View>
                <View style={styles.statSlot}>
                  <StatCard
                    value={String(result.limit)}
                    label="POUR LIMIT"
                    accent={theme.colors.earth.terracotta}
                  />
                </View>
              </View>
            )}

            <View style={styles.rewardRow}>
              <View style={styles.glow} pointerEvents="none" />
              <Animated.View pointerEvents="none" style={{ transform: [{ scale: pop }] }}>
                <Image
                  source={win ? assets.sprite2 : assets.sprite5}
                  style={styles.reward}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>

            {win ? (
              <Animated.View
                pointerEvents="none"
                style={[styles.bee, { transform: [{ translateX: beeX }, { translateY: beeY }] }]}>
                <Image source={assets.sprite1} style={styles.beeImg} resizeMode="contain" />
              </Animated.View>
            ) : null}
          </WaxCard>
        </View>

        <Text style={[styles.ctaHint, win ? styles.subWin : styles.subLose]} numberOfLines={1}>
          {win ? 'NEXT FRAME UNLOCKED' : 'SAME FRAME, SAME SEED'}
        </Text>

        <PrimaryButton label="POUR AGAIN" onPress={onPlayAgain} Icon={Droplet} height={60} />
        <View style={styles.gap} />
        <SecondaryButton
          label="MENU"
          onPress={onMenu}
          Icon={Home}
          tone={win ? 'neutral' : 'plum'}
          height={48}
        />
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    height: 32,
    minWidth: 60,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badgeWin: {
    backgroundColor: 'rgba(255,253,244,0.75)',
    borderColor: theme.colors.accent.goldDark,
  },
  badgeLose: {
    backgroundColor: 'rgba(245,217,122,0.16)',
    borderColor: 'rgba(245,217,122,0.5)',
  },
  badgeText: { fontSize: 13, lineHeight: 17, fontWeight: '900' },
  badgeTextWin: { color: theme.colors.text.primary },
  badgeTextLose: { color: theme.colors.accent.goldLight },

  headline: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  sub: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
  subWin: { color: theme.colors.text.secondary },
  subLose: { color: 'rgba(255,246,218,0.72)' },

  cardWrap: { width: '100%' },
  card: { width: '100%' },
  sweep: {
    position: 'absolute',
    top: -60,
    left: 0,
    width: 120,
    height: 320,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  statRow: { flexDirection: 'row', gap: 8 },
  statSlot: { flex: 1 },
  rewardRow: {
    marginTop: 12,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'rgba(224,161,0,0.28)',
  },
  reward: { width: 92, height: 92 },
  bee: { position: 'absolute', right: 14, bottom: 14 },
  beeImg: { width: 46, height: 46 },

  ctaHint: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  gap: { height: 10 },
});
