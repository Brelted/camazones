import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ORANGE = '#FF6B35';
const PLACEHOLDER = 'https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Camazones';

/**
 * Carte produit réutilisable.
 * Affichée dans ProductsScreen, HomeScreen, SellerScreen.
 */
export default function ProductCard({ product, onPress }) {
  const imageUri = product.primaryImageUrl || PLACEHOLDER;
  const price    = new Intl.NumberFormat('fr-CM').format(product.price) + ' XAF';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* Image */}
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

      {/* Badge négociable */}
      {product.negotiable && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Négociable</Text>
        </View>
      )}

      {/* Infos */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

        <Text style={styles.price}>{price}</Text>

        <View style={styles.footer}>
          {/* Vendeur */}
          <Text style={styles.seller} numberOfLines={1}>
            👤 {product.seller?.firstName} {product.seller?.lastName}
          </Text>
          {/* Ville */}
          {product.city && (
            <Text style={styles.city}>📍 {product.city}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    width: 170,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: '#f0f0f0',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: ORANGE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seller: {
    fontSize: 11,
    color: '#7F8C8D',
    flex: 1,
  },
  city: {
    fontSize: 11,
    color: '#7F8C8D',
  },
});
