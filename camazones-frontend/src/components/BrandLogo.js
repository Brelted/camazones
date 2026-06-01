import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from './ui';
import { overlay, palette } from '../theme';

const logoCircle = require('../../assets/brand/camazone-logo-circle.png');

export default function BrandLogo({ compact = false, caption = 'Marketplace premium', colors = palette, muted = overlay.muted, centered = false }) {
  return (
    <View style={[styles.container, compact && styles.compactContainer, centered && styles.centeredContainer]}>
      <View style={[styles.mark, { borderColor: colors.green ?? palette.green }, compact && styles.compactMark]}>
        <Image source={logoCircle} style={styles.logoImage} resizeMode="cover" />
      </View>
      <View style={centered && styles.centeredCopy}>
        <Text style={[styles.name, { color: colors.text }, compact && styles.compactName]}>Camazones</Text>
        {!compact ? <Text style={[styles.caption, { color: muted }]}>{caption}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compactContainer: {
    gap: 8,
  },
  centeredContainer: {
    justifyContent: 'center',
  },
  centeredCopy: {
    alignItems: 'center',
  },
  mark: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: palette.card,
  },
  compactMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  compactName: {
    fontSize: 16,
  },
  caption: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
});
