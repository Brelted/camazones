import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './ui';
import { palette, overlay } from '../theme';

export default function BrandLogo({ compact = false, caption = 'Marketplace premium' }) {
  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <View style={[styles.mark, compact && styles.compactMark]}>
        <View style={styles.markGlow} />
        <Text style={[styles.markText, compact && styles.compactMarkText]}>C</Text>
      </View>
      <View>
        <Text style={[styles.name, compact && styles.compactName]}>Camazones</Text>
        {!compact ? <Text style={styles.caption}>{caption}</Text> : null}
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
    backgroundColor: palette.primary,
    borderWidth: 1,
    borderColor: palette.secondary,
    overflow: 'hidden',
  },
  compactMark: {
    width: 34,
    height: 34,
  },
  markText: {
    color: palette.background,
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
    backgroundColor: palette.orange,
  },
  compactMarkText: {
    fontSize: 20,
  },
  name: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  compactName: {
    fontSize: 16,
  },
  caption: {
    color: overlay.muted,
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
});
