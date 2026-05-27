import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../../theme';

/**
 * Logo Camazones
 * Croissant de lune or (🌙) + texte "CAMAZONES" + tagline
 *
 * @param {string}  color    - 'white' | 'dark' | 'primary'
 * @param {string}  size     - 'sm' | 'md' | 'lg'
 * @param {boolean} tagline  - Affiche "Le marché africain"
 * @param {boolean} animated - Animation d'entrée (scale + fade)
 */
export default function CamazonesLogo({
  color    = 'white',
  size     = 'md',
  tagline  = false,
  animated = false,
}) {
  const scale   = useRef(new Animated.Value(animated ? 0.5 : 1)).current;
  const opacity = useRef(new Animated.Value(animated ? 0   : 1)).current;

  useEffect(() => {
    if (!animated) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1, useNativeDriver: true,
        tension: 80, friction: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const cfg = COLOR_CONFIG[color] || COLOR_CONFIG.white;
  const sz  = SIZE_CONFIG[size]   || SIZE_CONFIG.md;

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ scale }] }]}>
      <View style={styles.logoRow}>
        {/* Croissant de lune — icône signature */}
        <View style={[styles.moonContainer, { backgroundColor: cfg.moonBg }, sz.moonContainer]}>
          <MaterialCommunityIcons
            name="weather-night"
            size={sz.moonIcon}
            color={COLORS.secondary}  // Or kente #F7C948
          />
        </View>

        {/* Texte */}
        <View style={styles.textBlock}>
          <Text style={[styles.brand, cfg.brand, sz.brand]}>
            CAMA<Text style={[styles.brandAccent, sz.brand]}>ZONES</Text>
          </Text>
          {tagline && (
            <Text style={[styles.tagline, cfg.tagline, sz.tagline]}>
              Le marché africain
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// ── Config couleurs ────────────────────────────────────────────────────────────

const COLOR_CONFIG = {
  white: {
    moonBg:  'rgba(255,255,255,0.15)',
    brand:   { color: '#fff' },
    tagline: { color: 'rgba(255,255,255,0.8)' },
  },
  dark: {
    moonBg:  COLORS.surfaceWarm || '#FFF3E6',
    brand:   { color: COLORS.text },
    tagline: { color: COLORS.textLight },
  },
  primary: {
    moonBg:  'rgba(255,107,53,0.12)',
    brand:   { color: COLORS.primary },
    tagline: { color: COLORS.textLight },
  },
};

// ── Config tailles ─────────────────────────────────────────────────────────────

const SIZE_CONFIG = {
  sm: {
    moonContainer: { width: 28, height: 28, borderRadius: 8 },
    moonIcon:  16,
    brand:     { fontSize: 15, letterSpacing: 1.5 },
    tagline:   { fontSize: 10 },
  },
  md: {
    moonContainer: { width: 38, height: 38, borderRadius: 11 },
    moonIcon:  22,
    brand:     { fontSize: 20, letterSpacing: 2 },
    tagline:   { fontSize: 12 },
  },
  lg: {
    moonContainer: { width: 56, height: 56, borderRadius: 16 },
    moonIcon:  34,
    brand:     { fontSize: 30, letterSpacing: 3 },
    tagline:   { fontSize: 14 },
  },
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper:    {},
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock:  { justifyContent: 'center' },
  brand: {
    fontWeight: FONTS.weights.black,
    letterSpacing: 2,
  },
  brandAccent: {
    color: COLORS.secondary,  // "ZONES" en or
  },
  tagline: {
    fontWeight: FONTS.weights.medium,
    marginTop: 1,
  },
});
