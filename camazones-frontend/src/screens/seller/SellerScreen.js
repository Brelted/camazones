import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchShopProducts } from '../../store/slices/productsSlice';
import ProductCard from '../../components/products/ProductCard';
import apiClient from '../../services/apiClient';

const ORANGE = '#FF6B35';

// ─────────────────────────────────────────────────────────────────────────────
// SellerScreen — "Ma Boutique"
// Affiche la boutique du vendeur connecté + la liste de ses produits.
// Requiert : GET /api/shops/mine  (à ajouter côté backend si absent)
// ─────────────────────────────────────────────────────────────────────────────

export default function SellerScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user }                     = useSelector((s) => s.auth);
  const { products, isLoading }      = useSelector((s) => s.products);

  const [shop,        setShop]        = useState(null);
  const [shopLoading, setShopLoading] = useState(true);
  const [shopError,   setShopError]   = useState(null);

  // ── Chargement boutique ───────────────────────────────────────────────────

  const loadShop = useCallback(async () => {
    setShopLoading(true);
    setShopError(null);
    try {
      // TODO Backend: assurer que GET /api/shops/mine renvoie la boutique du user connecté
      const data = await apiClient.get('/shops/mine');
      setShop(data);
      dispatch(fetchShopProducts({ shopId: data.id, page: 1 }));
    } catch (err) {
      // 404 = pas encore de boutique, autre = erreur réseau
      if (err?.response?.status !== 404) {
        setShopError('Impossible de charger votre boutique.');
      }
      // shop reste null → on affiche le CTA "Créer ma boutique"
    } finally {
      setShopLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadShop();
  }, [loadShop]);

  // ── Actions ───────────────────────────────────────────────────────────────

  function onProductPress(product) {
    navigation.navigate('ProductDetail', { productId: product.id });
  }

  async function onCreateShop() {
    Alert.prompt(
      'Nom de votre boutique',
      'Choisissez un nom pour votre boutique :',
      async (name) => {
        if (!name?.trim()) return;
        try {
          const newShop = await apiClient.post('/shops', { name: name.trim() });
          setShop(newShop);
        } catch {
          Alert.alert('Erreur', 'Impossible de créer la boutique pour l\'instant.');
        }
      },
      'plain-text',
    );
  }

  // ── États de chargement ───────────────────────────────────────────────────

  if (shopLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  if (shopError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>⚠️ {shopError}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadShop}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Pas de boutique → invite à en créer une ───────────────────────────────

  if (!shop) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🏪</Text>
        <Text style={styles.emptyTitle}>Vous n'avez pas encore de boutique</Text>
        <Text style={styles.emptySubtitle}>
          Créez votre boutique gratuitement et commencez à vendre sur Camazones !
        </Text>
        <TouchableOpacity style={styles.createBtn} onPress={onCreateShop}>
          <MaterialCommunityIcons name="store-plus-outline" size={22} color="#fff" />
          <Text style={styles.createBtnText}>Créer ma boutique</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Boutique existante → header + liste produits ──────────────────────────

  const ShopHeader = (
    <View style={styles.shopHeader}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        {shop.logoUrl ? (
          <Image source={{ uri: shop.logoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Text style={styles.logoInitial}>
              {shop.name?.[0]?.toUpperCase() ?? '🏪'}
            </Text>
          </View>
        )}
      </View>

      {/* Nom & description */}
      <Text style={styles.shopName}>{shop.name}</Text>
      {!!shop.description && (
        <Text style={styles.shopDesc}>{shop.description}</Text>
      )}

      {/* Statistiques */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Ventes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>⭐ N/A</Text>
          <Text style={styles.statLabel}>Note</Text>
        </View>
      </View>

      {/* Bouton modifier boutique */}
      <TouchableOpacity style={styles.editShopBtn}>
        <MaterialCommunityIcons name="pencil-outline" size={16} color={ORANGE} />
        <Text style={styles.editShopText}>Modifier la boutique</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mes produits</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => onProductPress(item)} />
        )}
        ListHeaderComponent={ShopHeader}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyProducts}>
              <Text style={styles.emptyProductsIcon}>📦</Text>
              <Text style={styles.emptyProductsText}>Vous n'avez pas encore de produits</Text>
              <Text style={styles.emptyProductsSub}>
                Appuyez sur + pour ajouter votre premier produit
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoading ? <ActivityIndicator color={ORANGE} style={{ margin: 20 }} /> : null
        }
        refreshControl={
          <RefreshControl
            refreshing={shopLoading || isLoading}
            onRefresh={loadShop}
            colors={[ORANGE]}
          />
        }
      />

      {/* FAB : ajouter un produit */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PublishProduct')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },

  // Header boutique
  shopHeader:    { backgroundColor: '#fff', alignItems: 'center', padding: 20, marginBottom: 8 },
  logoWrapper:   { marginBottom: 14 },
  logo:          { width: 96, height: 96, borderRadius: 48 },
  logoPlaceholder: {
    backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center',
  },
  logoInitial:   { color: '#fff', fontSize: 44, fontWeight: 'bold' },
  shopName:      { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center' },
  shopDesc:      { fontSize: 13, color: '#7F8C8D', textAlign: 'center', marginTop: 6, marginBottom: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8F8F8', borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 8,
    marginVertical: 14, width: '100%',
  },
  stat:        { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  statLabel:   { fontSize: 11, color: '#7F8C8D', marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: '#e0e0e0' },

  // Edit bouton
  editShopBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: ORANGE, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6, marginBottom: 16,
  },
  editShopText: { color: ORANGE, fontSize: 13, fontWeight: '600' },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50', alignSelf: 'flex-start' },

  // Liste
  list: { paddingBottom: 90 },
  row:  { justifyContent: 'space-evenly' },

  // Vide
  emptyProducts:     { alignItems: 'center', paddingVertical: 40 },
  emptyProductsIcon: { fontSize: 52, marginBottom: 12 },
  emptyProductsText: { fontSize: 16, color: '#555', fontWeight: '600', marginBottom: 6 },
  emptyProductsSub:  { fontSize: 13, color: '#aaa', textAlign: 'center' },

  // Pas de boutique
  emptyIcon:     { fontSize: 72, marginBottom: 20 },
  emptyTitle:    { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: ORANGE, borderRadius: 14,
    paddingHorizontal: 24, paddingVertical: 14,
    elevation: 4, shadowColor: ORANGE, shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
  },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Erreur
  errorText: { fontSize: 15, color: '#E63946', marginBottom: 16, textAlign: 'center' },
  retryBtn:  { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: ORANGE, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: ORANGE, width: 56, height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: ORANGE, shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
  },
});
