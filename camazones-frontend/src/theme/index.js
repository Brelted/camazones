import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6B35',
    accent: '#F7931E',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#E63946',
    success: '#06A77D',
    text: '#2C3E50',
    textSecondary: '#7F8C8D',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
