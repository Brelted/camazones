import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../../theme';

const PLACEHOLDER = 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Camazones';

/**
 * ProductCard — Carte produit réutilisable
 * Utilisée sur HomeScreen, ProductsScreen, SellerScreen.
 *
 * @param {object}   product  - Objet produit (id, title, price, primaryImageUrl, negotiable, seller, city)
 * @param {function} onPress  - Callback tap sur la carte
 * @param {boolean}  compact  - Mode compact (colonnes serrées)
 */
export default function ProductCard({ product, onPress, compact = false }) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  }
  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40 }).start();
  }

  const imageUri = product.primaryImageUrl || PLACEHOLDER;
  const price    = new Intl.NumberFormat('fr-CM').format(product.price) + ' XAF';

  return (
    <Animated.View style={[styles.wrapper, compact && styles.wrapperCompact, { transform: [{ scale }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />

          {/* Badge Négociable */}
          {product.negotiable && (
            <View style={styles.negotiableBadge}>
              <MaterialCommunityIcons name="handshake-outline" size={10} color="#fff" />
              <Text style={styles.negotiableText}>Négociable</Text>
            </View>
          )}

          {/* Badge Catégorie */}
          {product.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{CATEGORY_ICONS[product.category] || '🛍️'}</Text>
            </View>
          )}
        </View>

        {/* Infos */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
          <Text style={styles.price}>{price}</Text>

          <View style={styles.footer}>
            <View style={styles.sellerRow}>
              <MaterialCommunityIcons name="account-circle-outline" size={12} color={COLORS.textLight} />
              <Text style={styles.seller} numberOfLines={1}>
                {product.seller?.firstName} {product.seller?.lastName}
              </Text>
            </View>
            {product.city && (
              <View style={styles.cityRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={12} color={COLORS.textLight} />
                <Text style={styles.city}>{product.city}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const CATEGORY_ICONS = {
  electronics: '📱',
  fashion:     '👗',
  food:        '🥗',
  crafts:      '🎨',
  agriculture: '🌾',
  home:        '🏠',
};

const styles = StyleSheet.create({
  wrapper: {
    width: 170,
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  wrapperCompact: { width: 148 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.md,
  },

  // Image
  imageContainer: { position: 'relative' },
  image:          { width: '100%', height: 130, backgroundColor: COLORS.border },

  // Badges sur image
  negotiableBadge: {
    position: 'absolute', top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm, paddingHorizontal: 7, paddingVertical: 3,
  },
  negotiableText: { color: '#fff', fontSize: 9, fontWeight: FONTS.weights.bold },
  categoryBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.sm, padding: 4,
  },
  categoryText: { fontSize: 12 },

  // Infos
  info:    { padding: SPACING.sm + 2 },
  title:   { fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold, color: COLORS.text, marginBottom: 4, lineHeight: 18 },
  price:   { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.black, color: COLORS.primary, marginBottom: 6 },

  // Footer
  footer:    { gap: 3 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cityRow:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seller:    { fontSize: 11, color: COLORS.textLight, flex: 1 },
  city:      { fontSize: 11, color: COLORS.textLight },
});
