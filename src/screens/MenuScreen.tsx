import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { assets } from '../assets';
import {
  ENTER_MS,
  HEADER_CONTENT_H,
  HEADER_PAD_TOP,
  SCREEN_H,
  TOTAL_FRAMES,
} from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { WaxCard } from '../components/WaxCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { SeasonChips } from '../components/SeasonChips';
import { usePressScale } from '../hooks/usePressScale';
import { firstFrameOfSeason, seasonIndexOfFrame, seasonName } from '../game/progression';
import { dayLabel } from '../utils/rng';

const SIDE = 16;
const GAP = 12;
const CHIPS_H = 40;
const MODE_H = 96;
const FOOT_H = 48;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

const AVAILABLE = SCREEN_H - (HEADER_PAD_TOP + HEADER_CONTENT_H) - SIDE * 2;
const FIXED = CHIPS_H + MODE_H + FOOT_H + GAP * 3;
const BENTO_H = Math.max(156, Math.min(252, AVAILABLE - FIXED));
const TILE_H = Math.floor((BENTO_H - GAP) / 2);

interface Props {
  frame: number;
  jars: number;
  streak: number;
  season: number;
  unlockedSeason: number;
  onSelectSeason: (index: number) => void;
  onPlay: () => void;
  onRelax: () => void;
  onDaily: () => void;
  onPantry: () => void;
  onTips: () => void;
  onSettings: () => void;
}

function ModeTile({
  title,
  caption,
  sprite,
  accent,
  onPress,
  children,
}: {
  title: string;
  caption: string;
  sprite: number;
  accent: string;
  onPress: () => void;
  children?: React.ReactNode;
}) {
  const press = usePressScale(0.96);
  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={styles.modePress}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.modeAnim, { transform: [{ scale: press.scale }] }]}>
        <WaxCard
          style={styles.modeCard}
          contentStyle={styles.modeContent}
          radius={theme.radius.lg}
          padding={12}>
          <View style={styles.modeRow}>
            <Image source={sprite} style={styles.modeSprite} resizeMode="contain" />
            <View style={styles.modeText}>
              <Text style={[styles.modeTitle, { color: accent }]} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.modeCaption} numberOfLines={1}>
                {caption}
              </Text>
            </View>
          </View>
          {children ?? null}
        </WaxCard>
      </Animated.View>
    </Pressable>
  );
}

/** M3 Bento-Hub: hive frames as tiles with one oversized START tile. */
export function MenuScreen(props: Props) {
  const {
    frame,
    jars,
    streak,
    season,
    unlockedSeason,
    onSelectSeason,
    onPlay,
    onRelax,
    onDaily,
    onPantry,
    onTips,
    onSettings,
  } = props;

  const stagger = useRef(new Animated.Value(0)).current;
  const bee = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    stagger.setValue(0);
    const enter = Animated.timing(stagger, {
      toValue: 1,
      duration: ENTER_MS + 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(bee, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bee, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    enter.start();
    drift.start();
    return () => {
      enter.stop();
      drift.stop();
    };
  }, [stagger, bee]);

  const handleSeason = useCallback(
    (index: number) => {
      onSelectSeason(index);
    },
    [onSelectSeason],
  );

  const displayFrame = Math.max(frame, firstFrameOfSeason(season));
  const shownSeason =
    seasonIndexOfFrame(displayFrame) === season ? seasonName(displayFrame) : seasonName(frame);

  const slideA = stagger.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const slideB = stagger.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
  const beeX = bee.interpolate({ inputRange: [0, 1], outputRange: [0, 7] });
  const beeR = bee.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '5deg'] });

  const dots: React.ReactNode[] = [];
  for (let i = 0; i < 7; i += 1) {
    dots.push(
      <View
        key={i}
        style={[styles.dot, i < Math.min(streak, 7) ? styles.dotOn : styles.dotOff]}
      />,
    );
  }

  return (
    <AppShell variant="menu">
      <ScreenHeader
        title="HONEYCOMB"
        subtitle="HEX FLOOD"
        leftSlot={<Image source={assets.logo} style={styles.headerLogo} resizeMode="contain" />}
        rightSlot={
          <View style={styles.jarBadge}>
            <View style={styles.badgeIcon}>
              <Droplet size={16} color={theme.colors.accent.gold} strokeWidth={2.6} />
            </View>
            <Text style={styles.badgeValue}>{jars}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={{ opacity: stagger, transform: [{ translateY: slideA }] }}>
          <SeasonChips season={season} unlockedUpTo={unlockedSeason} onSelect={handleSeason} />
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.bentoRow, { opacity: stagger, transform: [{ translateY: slideA }] }]}>
          <View style={styles.startCol}>
            <WaxCard style={styles.startCard} radius={theme.radius.xl} padding={14}>
              <View style={styles.startTop}>
                <Animated.View
                  pointerEvents="none"
                  style={{ transform: [{ translateX: beeX }, { rotate: beeR }] }}>
                  <Image source={assets.sprite1} style={styles.bee} resizeMode="contain" />
                </Animated.View>
                <View style={styles.startLabels}>
                  <Text style={styles.frameLabel} numberOfLines={1}>
                    {'HIVE FRAME ' + displayFrame}
                  </Text>
                  <Text style={styles.frameProgress} numberOfLines={1}>
                    {jars + '/' + TOTAL_FRAMES + ' COMBS'}
                  </Text>
                </View>
              </View>
              <Text style={styles.startHint} numberOfLines={1}>
                ONE TAP FLOOD PUZZLE
              </Text>
              <PrimaryButton label="START POURING" onPress={onPlay} Icon={Droplet} height={56} />
            </WaxCard>
          </View>

          <View style={styles.sideCol}>
            <View style={styles.sideSlot}>
              <StatCard value={String(displayFrame)} label="HIVE FRAME" accent={theme.colors.accent.gold} />
            </View>
            <View style={styles.sideSlot}>
              <StatCard value={shownSeason} label="SEASON" accent={theme.colors.accent.plum} />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.modeRowWrap, { opacity: stagger, transform: [{ translateY: slideB }] }]}>
          <ModeTile
            title="RELAX MODE"
            caption="NO POUR LIMIT"
            sprite={assets.sprite4}
            accent={theme.colors.earth.sage}
            onPress={onRelax}
          />
          <ModeTile
            title="DAILY COMB"
            caption={dayLabel()}
            sprite={assets.sprite3}
            accent={theme.colors.accent.goldDark}
            onPress={onDaily}>
            <View style={styles.dotRow}>{dots}</View>
          </ModeTile>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[styles.footRow, { opacity: stagger, transform: [{ translateY: slideB }] }]}>
          <View style={styles.footSlot}>
            <SecondaryButton label="PANTRY" onPress={onPantry} height={FOOT_H} />
          </View>
          <View style={styles.footSlot}>
            <SecondaryButton label="TIPS" onPress={onTips} height={FOOT_H} />
          </View>
          <View style={styles.footSlot}>
            <SecondaryButton label="SETTINGS" onPress={onSettings} height={FOOT_H} />
          </View>
        </Animated.View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerLogo: { width: 34, height: 34 },
  jarBadge: {
    height: 36,
    minWidth: 62,
    paddingHorizontal: 10,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(224,161,0,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(224,161,0,0.40)',
  },
  badgeIcon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeValue: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    color: theme.colors.accent.gold,
  },

  body: {
    flex: 1,
    paddingHorizontal: SIDE,
    paddingVertical: SIDE,
    justifyContent: 'space-between',
    gap: GAP,
  },

  bentoRow: {
    height: BENTO_H,
    flexDirection: 'row',
    gap: GAP,
  },
  startCol: { flex: 62, height: BENTO_H },
  startCard: { width: '100%', height: BENTO_H },
  startTop: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bee: { width: 48, height: 48 },
  startLabels: { flex: 1, gap: 3 },
  frameLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  frameProgress: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: theme.colors.accent.plum,
  },
  startHint: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.muted,
    marginBottom: 8,
  },

  sideCol: { flex: 38, height: BENTO_H, gap: GAP },
  sideSlot: {
    width: '100%',
    height: TILE_H,
    justifyContent: 'center',
  },

  modeRowWrap: {
    height: MODE_H,
    flexDirection: 'row',
    gap: GAP,
  },
  modePress: { flex: 1, height: MODE_H },
  modeAnim: { width: '100%', height: MODE_H },
  modeCard: { width: '100%', height: MODE_H },
  modeContent: { justifyContent: 'center' },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeSprite: { width: 34, height: 34 },
  modeText: { flex: 1, gap: 2 },
  modeTitle: { fontSize: 13, lineHeight: 17, fontWeight: '800', letterSpacing: 0.6 },
  modeCaption: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  dotRow: { flexDirection: 'row', gap: 5, marginTop: 10, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotOn: { backgroundColor: theme.colors.accent.gold },
  dotOff: { backgroundColor: 'rgba(51,39,11,0.14)' },

  footRow: { height: FOOT_H, flexDirection: 'row', gap: 10 },
  footSlot: { flex: 1, height: FOOT_H },
});
