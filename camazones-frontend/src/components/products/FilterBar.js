import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const CATEGORIES = [
  { label: 'Tout',         value: null,          icon: '🛍️' },
  { label: 'Électronique', value: 'electronics', icon: '📱' },
  { label: 'Mode',         value: 'fashion',     icon: '👗' },
  { label: 'Alimentation', value: 'food',        icon: '🥗' },
  { label: 'Artisanat',    value: 'crafts',      icon: '🎨' },
  { label: 'Agricole',     value: 'agriculture', icon: '🌾' },
  { label: 'Maison',       value: 'home',        icon: '🏠' },
];

/**
 * Barre de filtres par catégorie — défilement horizontal.
 */
export default function FilterBar({ activeCategory, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <TouchableOpacity
              key={cat.value ?? 'all'}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(cat.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  icon: { fontSize: 14 },
  label: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  labelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
