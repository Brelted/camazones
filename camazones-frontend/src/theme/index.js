export const palette = {
  background: '#F6F1EA',
  surface: '#FFF8F0',
  text: '#1F1F1F',
  primary: '#2F3A56',
  secondary: '#B98C5A',
  orange: '#D8793A',
  green: '#3F7D5A',
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
  surface: 'rgba(255, 248, 240, 0.94)',
  soft: 'rgba(47, 58, 86, 0.08)',
  muted: 'rgba(31, 31, 31, 0.62)',
  line: 'rgba(31, 31, 31, 0.12)',
  primary: 'rgba(47, 58, 86, 0.9)',
  secondary: 'rgba(185, 140, 90, 0.16)',
  orange: 'rgba(216, 121, 58, 0.14)',
  green: 'rgba(63, 125, 90, 0.14)',
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
