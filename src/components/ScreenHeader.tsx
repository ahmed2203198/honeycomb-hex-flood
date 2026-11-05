import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { HEADER_CONTENT_H, HEADER_PAD_TOP } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
}

/**
 * The ONE header used by Menu / Game / GameOver / Pantry / Settings.
 * Rule #6: paddingTop 44 so nothing slides under the status bar.
 */
export function ScreenHeader({ title, subtitle, leftSlot, rightSlot, tone = 'light' }: Props) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.header,
        dark ? styles.headerDark : styles.headerLight,
      ]}>
      <View style={styles.side}>{leftSlot ?? null}</View>
      <View style={styles.center}>
        <Text
          style={[styles.title, dark ? styles.titleDark : null]}
          numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, dark ? styles.subtitleDark : null]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]}>{rightSlot ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_PAD_TOP,
    height: HEADER_PAD_TOP + HEADER_CONTENT_H,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerLight: {
    backgroundColor: theme.colors.ui.glassSoft,
    borderBottomColor: theme.colors.ui.divider,
  },
  headerDark: {
    backgroundColor: 'rgba(26,19,6,0.40)',
    borderBottomColor: 'rgba(245,217,122,0.20)',
  },
  side: {
    width: 98,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  titleDark: { color: theme.colors.text.onDark },
  subtitle: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  subtitleDark: { color: theme.colors.text.onDarkMuted },
});
