import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../../theme';

const CATEGORIES = [
  { label: 'Tout',         value: null,          icon: '🛍️', color: COLORS.primary  },
  { label: 'Électronique', value: 'electronics', icon: '📱', color: '#3498DB'      },
  { label: 'Mode',         value: 'fashion',     icon: '👗', color: '#9B59B6'      },
  { label: 'Alimentation', value: 'food',        icon: '🥗', color: COLORS.success },
  { label: 'Artisanat',    value: 'crafts',      icon: '🎨', color: COLORS.earth   },
  { label: 'Agricole',     value: 'agriculture', icon: '🌾', color: COLORS.forest  },
  { label: 'Maison',       value: 'home',        icon: '🏠', color: COLORS.accent  },
];

/**
 * CategoryBar — version enrichie pour HomeScreen
 * Chips horizontaux avec animation scale au tap.
 *
 * @param {string}   activeCategory - Valeur de la catégorie active
 * @param {function} onSelect       - Callback (category: string | null)
 */
export default function CategoryBar({ activeCategory = null, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.value ?? 'all'}
            cat={cat}
            isActive={activeCategory === cat.value}
            onPress={() => onSelect?.(cat.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CategoryChip({ cat, isActive, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.90, useNativeDriver: true, speed: 40 }).start();
  }
  function handlePressOut() {
    Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 40 }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.chip,
          isActive && { backgroundColor: cat.color, ...SHADOW.colored(cat.color) },
          !isActive && styles.chipInactive,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Icône dans un cercle coloré (inactif) ou blanc (actif) */}
        <View style={[
          styles.iconBubble,
          isActive ? styles.iconBubbleActive : { backgroundColor: `${cat.color}18` },
        ]}>
          <Text style={styles.icon}>{cat.icon}</Text>
        </View>
        <Text style={[
          styles.label,
          isActive ? styles.labelActive : { color: COLORS.text },
        ]}>
          {cat.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.sm + 2,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  chip: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical:    7,
  },
  chipInactive: {
    backgroundColor: COLORS.background,
    borderWidth:     1,
    borderColor:     COLORS.border,
  },
  iconBubble: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  iconBubbleActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  icon:  { fontSize: 14 },
  label: { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },
  labelActive: { color: '#fff', fontWeight: FONTS.weights.bold },
});
