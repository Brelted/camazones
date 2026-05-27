import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

/**
 * Badge / Chip réutilisable
 *
 * @param {string}  variant - 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'dark' | 'outline'
 * @param {string}  size    - 'sm' | 'md'
 * @param {string}  icon    - Icône MaterialCommunityIcons (optionnel)
 * @param {boolean} dot     - Affiche un petit point coloré
 */
export default function Badge({
  children,
  variant = 'primary',
  size    = 'md',
  icon,
  dot     = false,
  style,
}) {
  const cfg = CONFIG[variant] || CONFIG.primary;
  const sz  = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  return (
    <View style={[styles.base, cfg.container, sz.container, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: cfg.dotColor }]} />}
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={sz.iconSize}
          color={cfg.textColor}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, cfg.text, sz.text]}>{children}</Text>
    </View>
  );
}

const CONFIG = {
  primary: {
    container: { backgroundColor: COLORS.primary },
    text:      { color: '#fff' },
    textColor: '#fff',
    dotColor:  '#fff',
  },
  secondary: {
    container: { backgroundColor: COLORS.secondary },
    text:      { color: COLORS.night },
    textColor: COLORS.night,
    dotColor:  COLORS.night,
  },
  success: {
    container: { backgroundColor: '#E8F8F2' },
    text:      { color: COLORS.success },
    textColor: COLORS.success,
    dotColor:  COLORS.success,
  },
  warning: {
    container: { backgroundColor: '#FFF8E6' },
    text:      { color: COLORS.earth },
    textColor: COLORS.earth,
    dotColor:  COLORS.earth,
  },
  error: {
    container: { backgroundColor: '#FFE8E8' },
    text:      { color: COLORS.error },
    textColor: COLORS.error,
    dotColor:  COLORS.error,
  },
  dark: {
    container: { backgroundColor: COLORS.night },
    text:      { color: '#fff' },
    textColor: '#fff',
    dotColor:  '#fff',
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    text:      { color: COLORS.primary },
    textColor: COLORS.primary,
    dotColor:  COLORS.primary,
  },
  forest: {
    container: { backgroundColor: COLORS.forest },
    text:      { color: '#fff' },
    textColor: '#fff',
    dotColor:  '#fff',
  },
};

const SIZE_CONFIG = {
  sm: {
    container: { paddingHorizontal: 8,  paddingVertical: 2,  borderRadius: RADIUS.sm  },
    text:      { fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.semibold },
    iconSize:  12,
  },
  md: {
    container: { paddingHorizontal: 12, paddingVertical: 5,  borderRadius: RADIUS.xl  },
    text:      { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
    iconSize:  14,
  },
};

const styles = StyleSheet.create({
  base:  { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  dot:   { width: 6, height: 6, borderRadius: 3, marginRight: SPACING.xs },
  icon:  { marginRight: 4 },
  text:  {},
});
