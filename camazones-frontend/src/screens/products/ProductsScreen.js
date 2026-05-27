import React, { useEffect, useCallback, useState } from 'react';
import {
  View, FlatList, StyleSheet, TextInput,
  ActivityIndicator, Text, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductCard from '../../components/products/ProductCard';
import FilterBar from '../../components/products/FilterBar';
import { fetchProducts, setFilters, clearFilters } from '../../store/slices/productsSlice';

const ORANGE = '#FF6B35';

export default function ProductsScreen({ navigation }) {
  const dispatch   = useDispatch();
  const { products, isLoading, isLoadingMore, filters, currentPage, totalPages, error }
    = useSelector((state) => state.products);

  const [searchText, setSearchText] = useState('');

  // Chargement initial
  useEffect(() => {
    loadProducts(1);
  }, [filters]);

  function loadProducts(page = 1) {
    dispatch(fetchProducts({ ...filters, page, limit: 20 }));
  }

  // Recherche (déclenche après 500ms sans frappe)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchText || null }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Pull-to-refresh
  const onRefresh = useCallback(() => loadProducts(1), [filters]);

  // Load more (pagination infinie)
  function onEndReached() {
    if (!isLoadingMore && currentPage < totalPages) {
      loadProducts(currentPage + 1);
    }
  }

  function onCategorySelect(category) {
    dispatch(setFilters({ category }));
  }

  function onProductPress(product) {
    navigation.navigate('ProductDetail', { productId: product.id });
  }

  // ── Rendu ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres catégories */}
      <FilterBar activeCategory={filters.category} onSelect={onCategorySelect} />

      {/* Erreur */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Liste produits */}
      {isLoading && products.length === 0 ? (
        <ActivityIndicator size="large" color={ORANGE} style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => onProductPress(item)} />
          )}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[ORANGE]} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator color={ORANGE} style={{ margin: 16 }} /> : null
          }
          ListEmptyComponent={
            !isLoading && (
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🛍️</Text>
                <Text style={styles.emptyText}>Aucun produit trouvé</Text>
                <TouchableOpacity onPress={() => dispatch(clearFilters())}>
                  <Text style={styles.clearLink}>Effacer les filtres</Text>
                </TouchableOpacity>
              </View>
            )
          }
        />
      )}

      {/* Bouton publier */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PublishProduct')}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F5F5F5' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', margin: 12, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#2C3E50' },
  errorBanner: { backgroundColor: '#FFE8E8', padding: 10, marginHorizontal: 12, borderRadius: 8 },
  errorText:   { color: '#E63946', fontSize: 13 },
  loader:      { flex: 1, marginTop: 60 },
  list:        { padding: 8, paddingBottom: 80 },
  row:         { justifyContent: 'space-evenly' },
  empty:       { alignItems: 'center', marginTop: 60 },
  emptyIcon:   { fontSize: 48, marginBottom: 12 },
  emptyText:   { fontSize: 16, color: '#999', marginBottom: 12 },
  clearLink:   { color: ORANGE, fontSize: 14, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: ORANGE, width: 56, height: 56,
    borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: ORANGE, shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
  },
});
