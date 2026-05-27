import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOW, SPACING } from '../../theme';

/**
 * Card réutilisable
 *
 * @param {function} onPress    - Rend la carte cliquable si fourni
 * @param {string}   padding    - 'none' | 'sm' | 'md' | 'lg'
 * @param {string}   radius     - 'sm' | 'md' | 'lg'
 * @param {string}   shadow     - 'none' | 'sm' | 'md' | 'lg'
 * @param {string}   bg         - Couleur de fond (défaut: blanc)
 */
export default function Card({
  children,
  onPress,
  padding = 'md',
  radius  = 'lg',
  shadow  = 'sm',
  bg      = COLORS.surface,
  style,
}) {
  const containerStyle = [
    styles.base,
    { backgroundColor: bg, borderRadius: RADIUS[radius] || RADIUS.lg },
    SHADOW_MAP[shadow],
    PADDING_MAP[padding],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const SHADOW_MAP = {
  none: {},
  sm:   SHADOW.sm,
  md:   SHADOW.md,
  lg:   SHADOW.lg,
};

const PADDING_MAP = {
  none: { padding: 0 },
  sm:   { padding: SPACING.sm },
  md:   { padding: SPACING.md },
  lg:   { padding: SPACING.lg },
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
});
