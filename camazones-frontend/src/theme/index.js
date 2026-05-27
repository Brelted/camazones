/**
 * Camazones Design System — Thème Africain
 *
 * Inspiré des textiles kente, de la nature africaine et des marchés colorés.
 * Palette chaude : orange, or, vert forêt, terre brûlée, crème.
 */

import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

// ── Palette de couleurs ────────────────────────────────────────────────────────
export const COLORS = {
  // Identité Camazones
  primary:   '#FF6B35',   // Orange signature
  secondary: '#F7C948',   // Or kente (croissant de lune)
  accent:    '#F7931E',   // Orange doré

  // Palette africaine
  earth:     '#C17F24',   // Terre brûlée
  forest:    '#2D6A4F',   // Forêt africaine
  night:     '#1A1A2E',   // Nuit africaine (dark navy)
  savanna:   '#E8B84B',   // Savane
  clay:      '#A0522D',   // Argile rouge

  // Surfaces & Fonds
  background: '#FFF8F0',  // Crème chaud (au lieu du gris froid)
  surface:    '#FFFFFF',
  surfaceWarm:'#FFF3E6',  // Surface teintée orange clair
  card:       '#FFFFFF',

  // Feedback
  error:     '#E63946',
  success:   '#06A77D',
  warning:   '#F4A261',
  info:      '#457B9D',

  // Texte
  text:        '#2C3E50',
  textLight:   '#7F8C8D',
  textInverse: '#FFFFFF',
  textMuted:   '#B0BEC5',

  // Bordures
  border:      '#EDE8DF',  // Bordure chaude
  borderLight: '#F5F0E8',

  // Motif Kente (bandes décoratives)
  kente: ['#FF6B35', '#F7C948', '#2D6A4F', '#C0392B', '#F7931E'],
};

// ── Typographie ───────────────────────────────────────────────────────────────
export const FONTS = {
  sizes: {
    xs:   11,
    sm:   13,
    md:   15,
    lg:   17,
    xl:   20,
    xxl:  24,
    hero: 32,
  },
  weights: {
    regular: '400',
    medium:  '500',
    semibold:'600',
    bold:    '700',
    black:   '800',
  },
};

// ── Espacement ────────────────────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ── Rayons de bordure ─────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  full: 999,
};

// ── Ombres ─────────────────────────────────────────────────────────────────────
export const SHADOW = {
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  colored: (color = COLORS.primary) => ({
    elevation: 5,
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  }),
};

// ── Thème React Native Paper ──────────────────────────────────────────────────
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary:          COLORS.primary,
    secondary:        COLORS.secondary,
    background:       COLORS.background,
    surface:          COLORS.surface,
    error:            COLORS.error,
    onPrimary:        COLORS.textInverse,
    onBackground:     COLORS.text,
    onSurface:        COLORS.text,
    outline:          COLORS.border,
  },
  fonts: DefaultTheme.fonts,
};

export default theme;
