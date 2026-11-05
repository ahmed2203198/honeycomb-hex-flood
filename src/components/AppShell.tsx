import React from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';
import { HexWatermark } from './HexWatermark';

export type ShellVariant = 'loader' | 'menu' | 'game' | 'win' | 'lose' | 'pantry';

const GRADIENTS: Record<ShellVariant, string[]> = {
  loader: theme.gradients.loader,
  menu: theme.gradients.menu,
  game: theme.gradients.game,
  win: theme.gradients.win,
  lose: theme.gradients.lose,
  pantry: theme.gradients.pantry,
};

const WATERMARK: Record<ShellVariant, string> = {
  loader: 'rgba(245,217,122,0.14)',
  menu: 'rgba(224,161,0,0.12)',
  game: 'rgba(51,39,11,0.08)',
  win: 'rgba(255,253,244,0.22)',
  lose: 'rgba(245,217,122,0.12)',
  pantry: 'rgba(224,161,0,0.10)',
};

interface Props {
  variant: ShellVariant;
  children: React.ReactNode;
}

/**
 * The single background stack for every screen: bg_game -> gradient overlay ->
 * hex watermark -> content. Screens differ by the overlay only (rule #14).
 */
export function AppShell({ variant, children }: Props) {
  const dark = variant === 'loader' || variant === 'lose';
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={dark ? 'light-content' : 'dark-content'}
      />
      <ImageBackground source={assets.bgGame} style={styles.bg} resizeMode="cover">
        <LinearGradient
          colors={GRADIENTS[variant]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <HexWatermark stroke={WATERMARK[variant]} />
        </View>
        <View style={styles.content}>{children}</View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
  bg: { flex: 1 },
  content: { flex: 1 },
});
