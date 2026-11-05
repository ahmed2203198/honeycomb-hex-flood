import React, { useCallback, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import {
  BOARD_SIZES,
  BOARD_SIZE_LABEL,
  BOARD_SIZE_ORDER,
  BoardSizeKey,
} from '../constants/config';
import { theme } from '../constants/theme';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { MiniChip, SettingRow, WaxToggle } from '../components/SettingRow';

export interface Settings {
  colorblind: boolean;
  sound: boolean;
  haptics: boolean;
  boardSize: BoardSizeKey;
}

interface Props {
  settings: Settings;
  onChange: (next: Settings) => void;
  onResetProgress: () => void;
  onMenu: () => void;
}

function SizeChip({
  size,
  active,
  onSelect,
}: {
  size: BoardSizeKey;
  active: boolean;
  onSelect: (s: BoardSizeKey) => void;
}) {
  const handlePress = useCallback(() => {
    onSelect(size);
  }, [onSelect, size]);
  return <MiniChip label={BOARD_SIZE_LABEL[size]} active={active} onPress={handlePress} />;
}

export function SettingsScreen({ settings, onChange, onResetProgress, onMenu }: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  const setColorblind = useCallback(
    (v: boolean) => onChange({ ...settings, colorblind: v }),
    [onChange, settings],
  );
  const setSound = useCallback(
    (v: boolean) => onChange({ ...settings, sound: v }),
    [onChange, settings],
  );
  const setHaptics = useCallback(
    (v: boolean) => onChange({ ...settings, haptics: v }),
    [onChange, settings],
  );
  const setSize = useCallback(
    (v: BoardSizeKey) => onChange({ ...settings, boardSize: v }),
    [onChange, settings],
  );

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onResetProgress();
    setConfirmReset(false);
  }, [confirmReset, onResetProgress]);

  return (
    <AppShell variant="pantry">
      <ScreenHeader
        title="SETTINGS"
        subtitle="HONEYCOMB HEX FLOOD"
        leftSlot={<Image source={assets.sprite3} style={styles.headerSprite} resizeMode="contain" />}
      />

      <View style={styles.body}>
        <View style={styles.list}>
          <SettingRow label="Colourblind flower marks">
            <WaxToggle
              value={settings.colorblind}
              onToggle={setColorblind}
              accessibilityLabel="Colourblind flower marks"
            />
          </SettingRow>

          <SettingRow label="Sound">
            <WaxToggle value={settings.sound} onToggle={setSound} accessibilityLabel="Sound" />
          </SettingRow>

          <SettingRow label="Haptics">
            <WaxToggle value={settings.haptics} onToggle={setHaptics} accessibilityLabel="Haptics" />
          </SettingRow>

          <View style={styles.sizeCard}>
            <View style={styles.sizeHead}>
              <Text style={styles.sizeLabel}>Board size</Text>
              <Text style={styles.sizeDims}>
                {BOARD_SIZES[settings.boardSize].cols +
                  ' x ' +
                  BOARD_SIZES[settings.boardSize].rows +
                  ' CELLS'}
              </Text>
            </View>
            <View style={styles.sizeRow}>
              {BOARD_SIZE_ORDER.map(s => (
                <View key={s} style={styles.sizeSlot}>
                  <SizeChip size={s} active={s === settings.boardSize} onSelect={setSize} />
                </View>
              ))}
            </View>
          </View>

          <SecondaryButton
            label={confirmReset ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
            onPress={handleReset}
            tone="danger"
            height={56}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FREE TO PLAY · NO ADS, NO PURCHASES</Text>
          <SecondaryButton label="MENU" onPress={onMenu} height={48} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerSprite: { width: 28, height: 28 },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  list: { gap: 10 },
  sizeCard: {
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,253,244,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(51,39,11,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  sizeLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  sizeHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sizeDims: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  sizeRow: { flexDirection: 'row', gap: 8 },
  sizeSlot: { flex: 1 },
  footer: { gap: 12 },
  footerText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});
