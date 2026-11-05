import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg from 'react-native-svg';
import { NECTAR } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { FlowerGlyph } from './FlowerGlyph';

export const POT_SIZE = 56;
const GLYPH = 24;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

interface Props {
  colorKey: number;
  disabled: boolean;
  onPress: (colorKey: number) => void;
}

/** A waxy honey pot. Explicit width AND height - never intrinsic sizing. */
function ColorPotBase({ colorKey, disabled, onPress }: Props) {
  const press = usePressScale(0.9);
  const nectar = NECTAR[colorKey];

  const handlePress = useCallback(() => {
    onPress(colorKey);
  }, [onPress, colorKey]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={'Pour ' + nectar.name}
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          { opacity: disabled ? 0.42 : 1, transform: [{ scale: press.scale }] },
        ]}>
        <LinearGradient
          colors={[nectar.light, nectar.base, nectar.dark]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.pot}>
          <View style={styles.gloss} pointerEvents="none" />
          <Svg width={GLYPH} height={GLYPH}>
            <FlowerGlyph
              kind={colorKey}
              cx={GLYPH / 2}
              cy={GLYPH / 2}
              size={GLYPH}
              fill="rgba(51,39,11,0.6)"
            />
          </Svg>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: POT_SIZE,
    height: POT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    width: POT_SIZE,
    height: POT_SIZE,
    borderRadius: POT_SIZE / 2,
    shadowColor: '#8A7444',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pot: {
    width: POT_SIZE,
    height: POT_SIZE,
    borderRadius: POT_SIZE / 2,
    borderWidth: 2,
    borderColor: 'rgba(51,39,11,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gloss: {
    position: 'absolute',
    top: 5,
    left: 9,
    width: POT_SIZE * 0.45,
    height: POT_SIZE * 0.2,
    borderRadius: POT_SIZE * 0.25,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});

export const ColorPot = React.memo(ColorPotBase);
