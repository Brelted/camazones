import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, Animated,
  ActivityIndicator, View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../../theme';

/**
 * Bouton réutilisable Camazones
 *
 * @param {string}  variant    - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string}  size       - 'sm' | 'md' | 'lg'
 * @param {string}  icon       - Nom d'icône MaterialCommunityIcons (optionnel)
 * @param {string}  iconRight  - Icône à droite (optionnel)
 * @param {boolean} loading    - Affiche un spinner
 * @param {boolean} fullWidth  - Prend toute la largeur
 * @param {boolean} disabled
 */
export default function Button({
  children,
  onPress,
  variant  = 'primary',
  size     = 'md',
  icon,
  iconRight,
  loading  = false,
  fullWidth = false,
  disabled = false,
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  }

  const cfg = CONFIG[variant] || CONFIG.primary;
  const sz  = SIZES[size]    || SIZES.md;

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, fullWidth && styles.fullWidth]}>
      <TouchableOpacity
        style={[
          styles.base,
          cfg.container,
          sz.container,
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
      >
        {loading ? (
          <ActivityIndicator color={cfg.textColor} size="small" />
        ) : (
          <View style={styles.inner}>
            {icon && (
              <MaterialCommunityIcons
                name={icon}
                size={sz.iconSize}
                color={cfg.textColor}
                style={styles.iconLeft}
              />
            )}
            <Text style={[styles.label, cfg.text, sz.text]}>
              {children}
            </Text>
            {iconRight && (
              <MaterialCommunityIcons
                name={iconRight}
                size={sz.iconSize}
                color={cfg.textColor}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Config par variant ────────────────────────────────────────────────────────

const CONFIG = {
  primary: {
    container: {
      backgroundColor: COLORS.primary,
      ...SHADOW.colored(COLORS.primary),
    },
    text:      { color: '#fff' },
    textColor: '#fff',
  },
  secondary: {
    container: {
      backgroundColor: COLORS.secondary,
      ...SHADOW.colored(COLORS.secondary),
    },
    text:      { color: COLORS.night },
    textColor: COLORS.night,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: COLORS.primary,
    },
    text:      { color: COLORS.primary },
    textColor: COLORS.primary,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text:      { color: COLORS.primary },
    textColor: COLORS.primary,
  },
  danger: {
    container: {
      backgroundColor: COLORS.error,
      ...SHADOW.colored(COLORS.error),
    },
    text:      { color: '#fff' },
    textColor: '#fff',
  },
  dark: {
    container: {
      backgroundColor: COLORS.night,
      ...SHADOW.md,
    },
    text:      { color: '#fff' },
    textColor: '#fff',
  },
};

// ── Tailles ───────────────────────────────────────────────────────────────────

const SIZES = {
  sm: {
    container: { paddingVertical: 8,  paddingHorizontal: 16, borderRadius: RADIUS.md },
    text:      { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
    iconSize:  16,
  },
  md: {
    container: { paddingVertical: 13, paddingHorizontal: 22, borderRadius: RADIUS.lg },
    text:      { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold },
    iconSize:  18,
  },
  lg: {
    container: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: RADIUS.lg },
    text:      { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.black },
    iconSize:  22,
  },
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base:      { alignItems: 'center', justifyContent: 'center' },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.5 },
  inner:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  label:     { letterSpacing: 0.3 },
  iconLeft:  { marginRight: SPACING.sm },
  iconRight: { marginLeft: SPACING.sm },
});
