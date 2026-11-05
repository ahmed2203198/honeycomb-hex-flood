import React from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { GlyphIcon, ICON_BOX } from './PrimaryButton';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface Props {
  label: string;
  onPress: () => void;
  Icon?: GlyphIcon;
  tone?: 'neutral' | 'plum' | 'danger';
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const TONES = {
  neutral: { bg: 'rgba(51,39,11,0.07)', border: 'rgba(51,39,11,0.18)', text: theme.colors.text.primary },
  plum: { bg: 'rgba(91,62,150,0.14)', border: theme.colors.accent.plum, text: theme.colors.accent.plum },
  danger: { bg: 'rgba(217,123,77,0.14)', border: theme.colors.earth.terracotta, text: theme.colors.earth.terracotta },
};

/** Same icon box (24) and gap (10) as PrimaryButton - rule #20, no drift. */
export function SecondaryButton({ label, onPress, Icon, tone = 'neutral', height = 48, style }: Props) {
  const press = usePressScale(0.95);
  const palette = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          {
            height,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            transform: [{ scale: press.scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={ICON_BOX} color={palette.text} strokeWidth={2.2} />
            </View>
          ) : null}
          <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', alignSelf: 'stretch' },
  fill: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: ICON_BOX,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
