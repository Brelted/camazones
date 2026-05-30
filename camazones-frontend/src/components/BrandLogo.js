import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './ui';
import { palette, overlay } from '../theme';

export default function BrandLogo({ compact = false, caption = 'Marketplace premium', colors = palette, muted = overlay.muted }) {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={[styles.mark, { backgroundColor: colors.primary, borderColor: colors.secondary }, compact && styles.compactMark]}>
        <View style={[styles.markGlow, { backgroundColor: colors.orange ?? palette.orange }]} />
        <Text style={[styles.markText, { color: colors.background }, compact && styles.compactMarkText]}>C</Text>
      </View>
      <View>
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
  mark: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  compactMark: {
    width: 34,
    height: 34,
  },
  markText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
  },
  markGlow: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  compactMarkText: {
    fontSize: 20,
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
