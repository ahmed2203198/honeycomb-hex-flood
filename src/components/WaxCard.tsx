import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
  tone?: 'light' | 'warm';
  padding?: number;
}

const LIGHT = ['#FFFEF8', '#FFFBEA', '#F7E8BE'];
const WARM = ['#F9EFD2', '#F0DEAC', '#E8D099'];

/**
 * Skeuomorph wax surface: warm multi-stop gradient, wax rim, outer honey
 * shadow and a 1px top bevel highlight.
 * The inner gradient uses flexGrow:1 so the card fills a parent with an
 * explicit height and hugs its content otherwise (never collapses).
 */
export function WaxCard({
  children,
  style,
  contentStyle,
  radius = theme.radius.lg,
  tone = 'light',
  padding = 14,
}: Props) {
  return (
    <View style={[styles.shadow, { borderRadius: radius }, style]}>
      <LinearGradient
        colors={tone === 'warm' ? WARM : LIGHT}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.card, { borderRadius: radius, padding }, contentStyle]}>
        <View
          style={[
            styles.bevel,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}
          pointerEvents="none"
        />
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: theme.shadows.card.shadowColor,
    shadowOpacity: theme.shadows.card.shadowOpacity,
    shadowRadius: theme.shadows.card.shadowRadius,
    shadowOffset: theme.shadows.card.shadowOffset,
    elevation: theme.shadows.card.elevation,
  },
  card: {
    flexGrow: 1,
    flexBasis: 'auto',
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  bevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
});
