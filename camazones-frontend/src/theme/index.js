export const palette = {
  background: '#E7D8BC',
  surface: '#F2DFBB',
  card: '#FAEACB',
  khaki: '#A89262',
  text: '#1F1F1F',
  primary: '#E7551B',
  secondary: '#2F3A56',
  purple: '#8C5A9E',
  orange: '#E7551B',
  green: '#A77944',
  blue: '#3478F6',
  dark: '#14161B',
  darkSurface: '#20242B',
};

export const darkPalette = {
  background: '#0F0D09',
  surface: '#1A160F',
  text: '#FFF3DD',
  primary: '#F0782A',
  secondary: '#D0A968',
  orange: '#F0782A',
  green: '#D0A968',
  muted: 'rgba(255, 243, 221, 0.76)',
  line: 'rgba(255, 243, 221, 0.16)',
};

export const overlay = {
  surface: 'rgba(250, 234, 203, 0.96)',
  soft: 'rgba(168, 146, 98, 0.20)',
  muted: 'rgba(31, 31, 31, 0.62)',
  line: 'rgba(31, 31, 31, 0.10)',
  primary: 'rgba(255, 90, 0, 0.92)',
  secondary: 'rgba(84, 104, 255, 0.16)',
  purple: 'rgba(161, 0, 255, 0.18)',
  orange: 'rgba(255, 90, 0, 0.16)',
  green: 'rgba(167, 121, 68, 0.16)',
};

export const theme = {
  roundness: 18,
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
