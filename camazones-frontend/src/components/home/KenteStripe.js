import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

/**
 * Bande décorative inspirée du tissu kente africain.
 * Utilisée comme séparateur visuel ou accentuation.
 *
 * @param {number} height   - Hauteur de la bande (défaut: 4)
 * @param {array}  colors   - Couleurs des segments (défaut: palette kente)
 * @param {number} segments - Nombre de répétitions de la palette
 */
export default function KenteStripe({
  height   = 4,
  colors   = COLORS.kente,
  segments = 6,
  style,
}) {
  const allSegments = Array.from({ length: segments }, (_, i) =>
    colors.map((c, j) => ({ color: c, key: `${i}-${j}` }))
  ).flat();

  return (
    <View style={[styles.stripe, { height }, style]}>
      {allSegments.map(({ color, key }) => (
        <View key={key} style={[styles.segment, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stripe:  { flexDirection: 'row', overflow: 'hidden' },
  segment: { flex: 1 },
});
