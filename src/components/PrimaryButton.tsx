import React from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

/** Matches lucide-react-native's icon signature. */
export type GlyphIcon = LucideIcon;

export const ICON_BOX = 24;

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface Props {
  label: string;
  onPress: () => void;
  Icon?: GlyphIcon;
  disabled?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Rule #20: the icon is ALWAYS a 24x24 box, the label's lineHeight equals 24
 * and the row gap is 10 - identical on every primary button in the app.
 */
export function PrimaryButton({ label, onPress, Icon, disabled = false, height = 56, style }: Props) {
  const press = usePressScale(0.94);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.animated,
          { height, opacity: disabled ? 0.5 : 1, transform: [{ scale: press.scale }] },
        ]}>
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.fill, { height }]}>
          <View style={styles.gloss} pointerEvents="none" />
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={ICON_BOX} color={theme.colors.text.onGold} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    alignSelf: 'stretch',
  },
  animated: {
    width: '100%',
    borderRadius: 18,
    shadowColor: theme.shadows.button.shadowColor,
    shadowOpacity: theme.shadows.button.shadowOpacity,
    shadowRadius: theme.shadows.button.shadowRadius,
    shadowOffset: theme.shadows.button.shadowOffset,
    elevation: theme.shadows.button.elevation,
  },
  fill: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A97700',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
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
    fontSize: 16,
    lineHeight: ICON_BOX,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: theme.colors.text.onGold,
  },
});
