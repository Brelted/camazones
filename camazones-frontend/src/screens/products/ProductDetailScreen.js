import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ActivityIndicator, Share, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchProductById, deleteProduct, clearSelectedProduct } from '../../store/slices/productsSlice';

const ORANGE = '#FF6B35';
const PLACEHOLDER = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Camazones';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const dispatch = useDispatch();

  const { selectedProduct: product, isLoading, error } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    return () => dispatch(clearSelectedProduct());
  }, [productId]);

  // ── Actions ──────────────────────────────────────────────────────────────

  function onShare() {
    if (!product) return;
    Share.share({
      message: `🛍️ ${product.title} — ${formatPrice(product.price)} XAF\nDécouvre Camazones, le marché africain dans ta poche !`,
    });
  }

  function onContact() {
    Alert.alert(
      'Contacter le vendeur',
      `Envoyer un message à ${product.seller?.firstName} ${product.seller?.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: () => { /* TODO: navigate to Chat */ } },
      ],
    );
  }

  function onDelete() {
    Alert.alert(
      'Supprimer le produit',
      'Cette action est irréversible. Confirmer la suppression ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            const res = await dispatch(deleteProduct(productId));
            if (!res.error) navigation.goBack();
          },
        },
      ],
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function formatPrice(value) {
    return new Intl.NumberFormat('fr-CM').format(value);
  }

  // ── États de chargement / erreur ─────────────────────────────────────────

  if (isLoading || (!product && !error)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMsg}>⚠️ {error ?? 'Produit introuvable'}</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === product.seller?.id;
  const imageUri = product.primaryImageUrl || PLACEHOLDER;

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Image principale */}
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

        {/* Badges (négociable + catégorie) */}
        <View style={styles.badgesRow}>
          {product.negotiable && (
            <View style={[styles.badge, { backgroundColor: ORANGE }]}>
              <Text style={styles.badgeText}>💬 Négociable</Text>
            </View>
          )}
          {product.category && (
            <View style={[styles.badge, { backgroundColor: '#2C3E50' }]}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
          )}
        </View>

        {/* Carte infos principales */}
        <View style={styles.card}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.price)} XAF</Text>

          {product.city && (
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#7F8C8D" />
              <Text style={styles.metaText}>{product.city}</Text>
            </View>
          )}
          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="eye-outline" size={16} color="#7F8C8D" />
            <Text style={styles.metaText}>{product.viewCount ?? 0} vues</Text>
          </View>
          {product.stock != null && (
            <View style={styles.metaRow}>
              <MaterialCommunityIcons name="package-variant-closed" size={16} color="#7F8C8D" />
              <Text style={styles.metaText}>Stock : {product.stock} unité(s)</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {!!product.description && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {/* Carte vendeur (cliquable → SellerDetail) */}
        <TouchableOpacity
          style={styles.sellerCard}
          activeOpacity={0.8}
          onPress={() =>
            product.seller?.id &&
            navigation.navigate('SellerDetail', { sellerId: product.seller.id })
          }
        >
          {/* Avatar initial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {product.seller?.firstName?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.sellerName}>
              {product.seller?.firstName} {product.seller?.lastName}
            </Text>
            {product.shop && (
              <Text style={styles.shopName}>🏪 {product.shop.name}</Text>
            )}
          </View>

          <MaterialCommunityIcons name="chevron-right" size={22} color="#ccc" />
        </TouchableOpacity>

        {/* Espacement pour la barre d'actions */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Barre d'actions en bas */}
      <View style={styles.actionsBar}>
        {isOwner ? (
          <TouchableOpacity style={[styles.mainBtn, styles.deleteBtn]} onPress={onDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#fff" />
            <Text style={styles.mainBtnText}>Supprimer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.mainBtn} onPress={onContact}>
            <MaterialCommunityIcons name="message-text-outline" size={20} color="#fff" />
            <Text style={styles.mainBtnText}>Contacter le vendeur</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.shareBtn} onPress={onShare}>
          <MaterialCommunityIcons name="share-variant-outline" size={22} color={ORANGE} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  scroll:    { paddingBottom: 24 },

  // Image
  image: { width: '100%', height: 280, backgroundColor: '#f0f0f0' },

  // Badges
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 12, paddingTop: 12 },
  badge:     { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Cards
  card: {
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12,
    borderRadius: 14, padding: 16,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  title:        { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginBottom: 6 },
  price:        { fontSize: 26, fontWeight: 'bold', color: ORANGE, marginBottom: 10 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  metaText:     { fontSize: 13, color: '#7F8C8D' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
  description:  { fontSize: 14, color: '#555', lineHeight: 22 },

  // Vendeur
  sellerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', marginHorizontal: 12, marginTop: 12,
    borderRadius: 14, padding: 14,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  avatar:      { width: 48, height: 48, borderRadius: 24, backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center' },
  avatarText:  { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  sellerName:  { fontSize: 15, fontWeight: '600', color: '#2C3E50' },
  shopName:    { fontSize: 12, color: '#7F8C8D', marginTop: 2 },

  // Barre d'actions
  actionsBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#f0f0f0',
  },
  mainBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 14,
  },
  mainBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  deleteBtn:   { backgroundColor: '#E63946' },
  shareBtn: {
    width: 50, height: 50, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: ORANGE,
  },

  // Erreur
  errorMsg:   { fontSize: 15, color: '#E63946', textAlign: 'center', marginBottom: 16 },
  goBackBtn:  { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: ORANGE, borderRadius: 10 },
  goBackText: { color: '#fff', fontWeight: '700' },
});
