export const palette = {
  background: '#E8DCC8',
  surface: '#F1DFC0',
  card: '#F6E7CA',
  khaki: '#B7A37A',
  text: '#1F1F1F',
  primary: '#FF5A00',
  secondary: '#5468FF',
  purple: '#A100FF',
  orange: '#FF5A00',
  green: '#20C76A',
  blue: '#3478F6',
  dark: '#14161B',
  darkSurface: '#20242B',
};

export const darkPalette = {
  background: '#14161B',
  surface: '#20242B',
  text: '#F6F1EA',
  primary: '#C8A878',
  secondary: '#D8793A',
  orange: '#D8793A',
  green: '#74A57F',
  muted: 'rgba(246, 241, 234, 0.68)',
  line: 'rgba(246, 241, 234, 0.14)',
};

export const overlay = {
  surface: 'rgba(246, 231, 202, 0.96)',
  soft: 'rgba(183, 163, 122, 0.20)',
  muted: 'rgba(31, 31, 31, 0.62)',
  line: 'rgba(31, 31, 31, 0.10)',
  primary: 'rgba(255, 90, 0, 0.92)',
  secondary: 'rgba(84, 104, 255, 0.16)',
  purple: 'rgba(161, 0, 255, 0.18)',
  orange: 'rgba(255, 90, 0, 0.16)',
  green: 'rgba(32, 199, 106, 0.16)',
};

export const theme = {
  roundness: 12,
  colors: {
    primary: palette.primary,
    primaryContainer: palette.surface,
    secondary: palette.secondary,
    secondaryContainer: palette.surface,
    tertiary: palette.orange,
    tertiaryContainer: palette.surface,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surface,
    outline: palette.secondary,
    error: palette.orange,
    onPrimary: palette.background,
    onSecondary: palette.text,
    onTertiary: palette.text,
    onBackground: palette.text,
    onSurface: palette.text,
    onSurfaceVariant: palette.text,
    text: palette.text,
    textSecondary: palette.primary,
  },
  animation: {
    scale: 1,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
