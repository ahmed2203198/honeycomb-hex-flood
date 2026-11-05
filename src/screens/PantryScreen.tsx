import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Eye, Lightbulb, Route, Sparkles, Target } from 'lucide-react-native';
import { assets } from '../assets';
import { TOTAL_FRAMES } from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatCard } from '../components/StatCard';
import { JarSlot } from '../components/JarSlot';
import { MiniChip } from '../components/SettingRow';
import { WaxCard } from '../components/WaxCard';
import { ProgressState } from '../hooks/useProgress';
import { JarTier } from '../game/progression';

export type PantrySection = 'JARS' | 'STATS' | 'TIPS';

interface Props {
  progress: ProgressState;
  avgSpare: string;
  initialSection: PantrySection;
  onMenu: () => void;
}

const SECTIONS: PantrySection[] = ['JARS', 'STATS', 'TIPS'];
const GRID_FRAMES = 40;

const TIPS = [
  {
    Icon: Eye,
    title: 'LOOK AT THE BORDER',
    body: 'Pick the colour that touches the largest unowned border, not the largest patch.',
  },
  {
    Icon: Route,
    title: 'OPEN A LANE',
    body: 'Two cheap pours that join two regions often beat one greedy pour.',
  },
  {
    Icon: Target,
    title: 'FINISH THE EDGES',
    body: 'Corners cost the most. Reach them before the comb narrows down.',
  },
  {
    Icon: Sparkles,
    title: 'CHASE THE DROPS',
    body: 'A honey drop gives a pour back - detour for it while it is still cheap.',
  },
  {
    Icon: Lightbulb,
    title: 'UNDO IS FREE',
    body: 'Undo costs nothing and always returns the pour. Experiment on every frame.',
  },
];

function SegChip({
  name,
  active,
  onSelect,
}: {
  name: PantrySection;
  active: boolean;
  onSelect: (s: PantrySection) => void;
}) {
  const handlePress = useCallback(() => {
    onSelect(name);
  }, [onSelect, name]);
  return <MiniChip label={name} active={active} onPress={handlePress} />;
}

export function PantryScreen({ progress, avgSpare, initialSection, onMenu }: Props) {
  const [section, setSection] = useState<PantrySection>(initialSection);

  const tierByFrame = useMemo(() => {
    const map: Record<number, JarTier> = {};
    for (let i = 0; i < progress.jars.length; i += 1) {
      map[progress.jars[i].frame] = progress.jars[i].tier;
    }
    return map;
  }, [progress.jars]);

  const frames = useMemo(() => {
    const out: number[] = [];
    for (let i = 1; i <= Math.min(GRID_FRAMES, TOTAL_FRAMES); i += 1) {
      out.push(i);
    }
    return out;
  }, []);

  const renderJar = useCallback(
    ({ item }: { item: number }) => (
      <View style={styles.jarCell}>
        <JarSlot frame={item} tier={tierByFrame[item]} />
      </View>
    ),
    [tierByFrame],
  );

  const keyExtractor = useCallback((item: number) => String(item), []);

  // Rule #21: never render a pill with an empty value - build the list first.
  const stats = useMemo(() => {
    const out: { value: string; label: string; accent: string }[] = [];
    if (progress.combsFilled > 0) {
      out.push({
        value: String(progress.combsFilled),
        label: 'COMBS FILLED',
        accent: theme.colors.accent.gold,
      });
      out.push({ value: avgSpare, label: 'AVG SPARE', accent: theme.colors.accent.plum });
    }
    if (progress.bestStreak > 0) {
      out.push({
        value: String(progress.bestStreak),
        label: 'BEST STREAK',
        accent: theme.colors.earth.sage,
      });
    }
    if (progress.bestSpare > 0) {
      out.push({
        value: '+' + progress.bestSpare,
        label: 'BEST SPARE',
        accent: theme.colors.earth.terracotta,
      });
    }
    if (progress.relaxBoards > 0) {
      out.push({
        value: String(progress.relaxBoards),
        label: 'RELAX BOARDS',
        accent: theme.colors.accent.goldDark,
      });
    }
    // Keep the count even so no row ever ends with a single orphaned pill.
    return out.length % 2 === 0 ? out : out.slice(0, out.length - 1);
  }, [progress, avgSpare]);

  const statRows = useMemo(() => {
    const rows: { value: string; label: string; accent: string }[][] = [];
    for (let i = 0; i < stats.length; i += 2) {
      rows.push(stats.slice(i, i + 2));
    }
    return rows;
  }, [stats]);

  return (
    <AppShell variant="pantry">
      <ScreenHeader
        title="HONEY PANTRY"
        subtitle={progress.jars.length + ' JARS'}
        leftSlot={<Image source={assets.sprite2} style={styles.headerJar} resizeMode="contain" />}
      />

      <View style={styles.body}>
        <View style={styles.segment}>
          {SECTIONS.map(s => (
            <View key={s} style={styles.segSlot}>
              <SegChip name={s} active={s === section} onSelect={setSection} />
            </View>
          ))}
        </View>

        <View style={styles.content}>
          {section === 'JARS' ? (
            <FlatList
              data={frames}
              renderItem={renderJar}
              keyExtractor={keyExtractor}
              numColumns={4}
              columnWrapperStyle={styles.jarRow}
              contentContainerStyle={styles.jarGrid}
              showsVerticalScrollIndicator={false}
              initialNumToRender={16}
              windowSize={5}
            />
          ) : null}

          {section === 'STATS' ? (
            statRows.length > 0 ? (
              <View style={styles.statList}>
                {statRows.map((row, i) => (
                  <View key={i} style={styles.statRow}>
                    {row.map(s => (
                      <View key={s.label} style={styles.statSlot}>
                        <StatCard value={s.value} label={s.label} accent={s.accent} />
                      </View>
                    ))}
                    {row.length === 1 ? <View style={styles.statSlot} /> : null}
                  </View>
                ))}
              </View>
            ) : (
              <WaxCard style={styles.emptyCard} radius={theme.radius.lg} padding={18}>
                <Image source={assets.sprite4} style={styles.emptySprite} resizeMode="contain" />
                <Text style={styles.emptyTitle}>NO COMBS YET</Text>
                <Text style={styles.emptyBody}>
                  Fill your first hive frame and the pantry starts counting.
                </Text>
              </WaxCard>
            )
          ) : null}

          {section === 'TIPS' ? (
            <View style={styles.tipList}>
              {TIPS.map(tip => (
                <View key={tip.title} style={styles.tipCard}>
                  <View style={styles.tipIcon}>
                    <tip.Icon size={20} color={theme.colors.accent.goldDark} strokeWidth={2.2} />
                  </View>
                  <View style={styles.tipText}>
                    <Text style={styles.tipTitle} numberOfLines={1}>
                      {tip.title}
                    </Text>
                    <Text style={styles.tipBody} numberOfLines={2}>
                      {tip.body}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <SecondaryButton label="MENU" onPress={onMenu} height={48} />
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerJar: { width: 30, height: 30 },
  body: { flex: 1, paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  segment: { flexDirection: 'row', gap: 8, height: 34 },
  segSlot: { flex: 1 },
  content: { flex: 1 },

  jarGrid: { paddingBottom: 8, gap: 10 },
  jarRow: { justifyContent: 'space-between' },
  jarCell: { width: 72, alignItems: 'center' },

  statList: { gap: 10 },
  statRow: { flexDirection: 'row', gap: 10 },
  statSlot: { flex: 1 },

  emptyCard: { width: '100%', alignItems: 'center' },
  emptySprite: { width: 54, height: 54 },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 1.8,
    color: theme.colors.text.primary,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  tipList: { gap: 10 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,253,244,0.90)',
    borderWidth: 1,
    borderColor: 'rgba(224,161,0,0.32)',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(224,161,0,0.16)',
  },
  tipText: { flex: 1, gap: 3 },
  tipTitle: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
});
