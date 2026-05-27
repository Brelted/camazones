import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, RefreshControl, FlatList, StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CamazonesLogo   from '../../components/home/CamazonesLogo';
import KenteStripe     from '../../components/home/KenteStripe';
import HeroBanner      from '../../components/home/HeroBanner';
import CategoryBar     from '../../components/home/CategoryBar';
import GlobalSearchBar from '../../components/search/GlobalSearchBar';
import ProductCard     from '../../components/products/ProductCard';
import Badge           from '../../components/ui/Badge';
import { fetchProducts, setFilters } from '../../store/slices/productsSlice';
import useLocation     from '../../hooks/useLocation';
import { COLORS, FONTS, SHADOW, SPACING, RADIUS } from '../../theme';

// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { products, isLoading, filters } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { location, refresh: refreshLocation, permission } = useLocation();

  const [refreshing, setRefreshing] = useState(false);
  const [nearMe,     setNearMe]     = useState(false);

  // ── Animations d'entrée ───────────────────────────────────────────────────
  const headerY   = useRef(new Animated.Value(-60)).current;
  const headerO   = useRef(new Animated.Value(0)).current;
  const contentO  = useRef(new Animated.Value(0)).current;
  const contentY  = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY,  { toValue: 0, tension: 70, friction: 10, useNativeDriver: true }),
      Animated.timing(headerO,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(contentO, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.spring(contentY, { toValue: 0, tension: 50, friction: 8, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Chargement produits ───────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: 1, limit: 8 }));
  }, [filters]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchProducts({ ...filters, page: 1, limit: 8 }));
    setRefreshing(false);
  }, [filters]);

  // ── Géolocalisation "Près de moi" ─────────────────────────────────────────
  async function toggleNearMe() {
    if (!nearMe) {
      await refreshLocation();
      setNearMe(true);
      if (location?.city) {
        dispatch(setFilters({ city: location.city }));
      }
    } else {
      setNearMe(false);
      dispatch(setFilters({ city: null }));
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  function onProductPress(product) {
    navigation.navigate('ProductDetail', { productId: product.id });
  }

  function onSearchSubmit(text) {
    dispatch(setFilters({ search: text || null }));
    navigation.navigate('Products');
  }

  function onCategorySelect(category) {
    dispatch(setFilters({ category }));
    navigation.navigate('Products');
  }

  function onSeeAllProducts() {
    navigation.navigate('Products');
  }

  // ── Section Header ────────────────────────────────────────────────────────
  const SectionHeader = ({ title, icon, onSeeAll }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        {icon && (
          <View style={styles.sectionIconBg}>
            <MaterialCommunityIcons name={icon} size={18} color={COLORS.primary} />
          </View>
        )}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {onSeeAll && (
        <TouchableOpacity style={styles.seeAllBtn} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>Tout voir</Text>
          <MaterialCommunityIcons name="arrow-right" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Rendu ─────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── Header Orange ── */}
      <Animated.View style={[
        styles.header,
        { transform: [{ translateY: headerY }], opacity: headerO },
      ]}>
        <KenteStripe height={3} />
        <View style={styles.headerContent}>
          <CamazonesLogo color="white" size="md" tagline />

          <View style={styles.headerActions}>
            {/* Bouton Près de moi */}
            <TouchableOpacity
              style={[styles.nearMeBtn, nearMe && styles.nearMeBtnActive]}
              onPress={toggleNearMe}
            >
              <MaterialCommunityIcons
                name={nearMe ? 'map-marker' : 'map-marker-outline'}
                size={18}
                color={nearMe ? COLORS.primary : '#fff'}
              />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity style={styles.headerIconBtn}>
              <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>

            {/* Avatar profil */}
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barre de recherche dans le header */}
        <GlobalSearchBar
          onSearch={onSearchSubmit}
          style={styles.searchInHeader}
          placeholder="Rechercher sur Camazones..."
        />
      </Animated.View>

      {/* ── Contenu scrollable ── */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: contentO }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Catégories */}
        <Animated.View style={{ transform: [{ translateY: contentY }] }}>
          <SectionHeader title="Catégories" icon="shape-outline" />
          <CategoryBar
            activeCategory={filters.category}
            onSelect={onCategorySelect}
          />
        </Animated.View>

        {/* Bannière Hero */}
        <Animated.View style={[styles.bannerSection, { transform: [{ translateY: contentY }] }]}>
          <HeroBanner
            onSlidePress={(slide) => {
              if (slide.id === '1') onCategorySelect('electronics');
              if (slide.id === '2') onCategorySelect('fashion');
              if (slide.id === '3') onCategorySelect('crafts');
            }}
          />
        </Animated.View>

        {/* Géolocalisation info */}
        {nearMe && location && (
          <View style={styles.locationBanner}>
            <MaterialCommunityIcons name="map-marker-check" size={16} color={COLORS.forest} />
            <Text style={styles.locationText}>
              Produits près de <Text style={{ fontWeight: '700' }}>{location.city ?? 'vous'}</Text>
            </Text>
            <TouchableOpacity onPress={toggleNearMe}>
              <MaterialCommunityIcons name="close" size={16} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        )}

        {/* Produits récents */}
        <SectionHeader
          title="Produits récents"
          icon="fire"
          onSeeAll={onSeeAllProducts}
        />

        {isLoading && products.length === 0 ? (
          // Skeleton loading
          <View style={styles.skeletonRow}>
            {[1, 2].map((i) => <SkeletonCard key={i} />)}
          </View>
        ) : products.length === 0 ? (
          <EmptyState onAction={onSeeAllProducts} />
        ) : (
          <FlatList
            data={products.slice(0, 8)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => onProductPress(item)} />
            )}
          />
        )}

        {/* Bloc pub "Vendez sur Camazones" */}
        <TouchableOpacity
          style={styles.sellBanner}
          onPress={() => navigation.navigate('Seller')}
          activeOpacity={0.85}
        >
          <View style={styles.sellLeft}>
            <Text style={styles.sellTitle}>🏪 Vous vendez ?</Text>
            <Text style={styles.sellSub}>Créez votre boutique gratuitement</Text>
          </View>
          <View style={styles.sellArrow}>
            <MaterialCommunityIcons name="arrow-right-circle" size={28} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </Animated.ScrollView>
    </View>
  );
}

// ── Sous-composants ────────────────────────────────────────────────────────────

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.skeleton, { opacity }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
    </Animated.View>
  );
}

function EmptyState({ onAction }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🛍️</Text>
      <Text style={styles.emptyText}>Aucun produit pour l'instant</Text>
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.emptyLink}>Recharger</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: SPACING.sm,
    ...SHADOW.md,
    zIndex: 10,
  },
  headerContent: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop:      SPACING.md,
    paddingBottom:   SPACING.sm,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  headerIconBtn: { position: 'relative', padding: 4 },
  notifDot: {
    position: 'absolute', top: 2, right: 2,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.secondary, borderWidth: 1.5, borderColor: COLORS.primary,
  },
  nearMeBtn: {
    padding: 6, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
  },
  nearMeBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  avatarBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: 15, fontWeight: FONTS.weights.black, color: COLORS.night },
  searchInHeader: {
    marginHorizontal: SPACING.md,
    marginTop: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },

  // Scroll
  scroll:        { flex: 1 },
  scrollContent: { paddingTop: SPACING.sm, paddingBottom: SPACING.xl },

  // Section header
  sectionHeader: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingHorizontal: SPACING.md,
    paddingTop:      SPACING.md + 4,
    paddingBottom:   SPACING.sm,
  },
  sectionLeft:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  sectionIconBg: {
    width: 30, height: 30, borderRadius: RADIUS.sm,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: FONTS.weights.bold, color: COLORS.text },
  seeAllBtn:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:   { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: FONTS.weights.semibold },

  // Banner
  bannerSection: { marginTop: SPACING.sm },

  // Location
  locationBanner: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: `${COLORS.forest}12`,
    marginHorizontal: SPACING.md, marginTop: SPACING.sm,
    borderRadius: RADIUS.md, padding: SPACING.sm + 2,
    borderLeftWidth: 3, borderLeftColor: COLORS.forest,
  },
  locationText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.forest },

  // Produits
  productsRow: { paddingHorizontal: SPACING.sm, paddingBottom: SPACING.sm },
  skeletonRow: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm },
  skeleton: {
    width: 160, backgroundColor: COLORS.border,
    borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md,
  },
  skeletonImage: { height: 120, backgroundColor: '#ddd' },
  skeletonLine:  { height: 12, backgroundColor: '#ddd', margin: SPACING.sm, borderRadius: 4 },

  // Empty
  empty:      { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyIcon:  { fontSize: 48, marginBottom: SPACING.sm },
  emptyText:  { fontSize: FONTS.sizes.md, color: COLORS.textLight, marginBottom: SPACING.sm },
  emptyLink:  { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: FONTS.weights.semibold },

  // Bannière vendeur
  sellBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: COLORS.night,
    marginHorizontal: SPACING.md,
    marginTop:       SPACING.lg,
    borderRadius:    RADIUS.xl,
    padding:         SPACING.md + 4,
    ...SHADOW.md,
  },
  sellLeft:  {},
  sellTitle: { fontSize: FONTS.sizes.md, fontWeight: FONTS.weights.bold, color: '#fff', marginBottom: 4 },
  sellSub:   { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.7)' },
  sellArrow: {},
});
