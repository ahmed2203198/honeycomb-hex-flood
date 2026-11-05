/**
 * HoneycombHexFlood - WARM_EARTHY preset with the brief's honey-gold / plum accents.
 * The `name` field MUST stay exactly as in the preset file.
 */

export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#FFF6DA', // honey cream
      secondary: '#F7E8BE', // warm wax
      tertiary: '#E8D6A6',
      accent: '#E8C86A', // wax rim
    },
    surface: {
      card: '#FFFDF4', // wax white
      warm: '#F7E8BE',
      dark: '#4A3410',
      darker: '#1A1306',
    },
    accent: {
      gold: '#E0A100',
      goldDark: '#C98F00',
      goldLight: '#F5D97A',
      plum: '#5B3E96',
      plumLight: '#7557B3',
    },
    earth: {
      sage: '#5E8C4E',
      terracotta: '#D97B4D',
      mustard: '#D9B36C',
      walnut: '#6B5740',
      cream: '#FFF6DA',
    },
    text: {
      primary: '#33270B',
      secondary: '#5C4A1E',
      muted: '#8A7444',
      onDark: '#F5D97A',
      onDarkBody: 'rgba(255,246,218,0.72)',
      onDarkMuted: 'rgba(255,246,218,0.45)',
      onGold: '#FFF6DA',
    },
    ui: {
      border: '#E8C86A',
      borderStrong: '#C98F00',
      borderSoft: 'rgba(51,39,11,0.14)',
      divider: 'rgba(51,39,11,0.10)',
      glass: 'rgba(255,253,244,0.88)',
      glassSoft: 'rgba(255,246,218,0.55)',
      highlight: 'rgba(255,255,255,0.75)',
      track: 'rgba(51,39,11,0.10)',
      trackDark: 'rgba(255,246,218,0.12)',
    },
  },

  gradients: {
    primary: ['#E0A100', '#C98F00'],
    gloss: ['#E0A100', '#F5D97A'],
    surface: ['#FFFDF4', '#F7E8BE'],
    loader: ['rgba(51,39,11,0.92)', 'rgba(74,52,16,0.88)', 'rgba(26,19,6,0.95)'],
    menu: ['rgba(255,246,218,0.92)', 'rgba(245,217,122,0.80)', 'rgba(255,246,218,0.94)'],
    game: ['rgba(255,246,218,0.90)', 'rgba(232,214,166,0.86)', 'rgba(255,246,218,0.93)'],
    win: ['rgba(224,161,0,0.80)', 'rgba(245,217,122,0.88)', 'rgba(255,246,218,0.92)'],
    lose: ['rgba(91,62,150,0.78)', 'rgba(74,52,16,0.86)', 'rgba(51,39,11,0.90)'],
    pantry: ['rgba(255,246,218,0.94)', 'rgba(216,201,168,0.84)', 'rgba(247,232,190,0.92)'],
  },

  typography: {
    hero: { fontSize: 36, fontWeight: '900' as const, letterSpacing: 3 },
    title: { fontSize: 22, fontWeight: '800' as const, letterSpacing: 1.5 },
    subtitle: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 2 },
    body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.2 },
    caption: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 1.2 },
    button: { fontSize: 16, fontWeight: '900' as const, letterSpacing: 1.6 },
    value: { fontSize: 22, fontWeight: '900' as const, letterSpacing: 0.5 },
  },

  radius: { sm: 8, md: 14, lg: 20, xl: 26, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#8A7444',
      shadowOpacity: 0.3,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
    button: {
      shadowColor: '#C98F00',
      shadowOpacity: 0.45,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    tray: {
      shadowColor: '#8A7444',
      shadowOpacity: 0.3,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 12,
    },
    brand: {
      shadowColor: '#000000',
      shadowOpacity: 0.45,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
    },
  },

  animation: {
    press: { tension: 300, friction: 12 },
    entrance: { tension: 60, friction: 9 },
    pop: { tension: 70, friction: 6 },
  },
};

export interface Nectar {
  key: number;
  name: string;
  base: string;
  light: string;
  dark: string;
}

/** The 5 nectar colours. Index === colour key used by the board engine. */
export const NECTAR: Nectar[] = [
  { key: 0, name: 'GOLD', base: '#E0A100', light: '#F2BC3A', dark: '#C98F00' },
  { key: 1, name: 'PLUM', base: '#5B3E96', light: '#7557B3', dark: '#452E73' },
  { key: 2, name: 'SAGE', base: '#5E8C4E', light: '#7BA868', dark: '#466B39' },
  { key: 3, name: 'CLAY', base: '#D97B4D', light: '#E89468', dark: '#B55F36' },
  { key: 4, name: 'CORN', base: '#4F86C6', light: '#6FA2DB', dark: '#3A69A3' },
];

export const NECTAR_COUNT = NECTAR.length;

export const WALL_COLOR = '#C9A86B';
export const WALL_LIGHT = '#DCC08A';
export const WALL_DARK = '#A8884C';

export type Theme = typeof theme;
