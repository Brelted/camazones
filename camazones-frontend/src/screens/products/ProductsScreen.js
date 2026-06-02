import React, { useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, TextInput } from '../../components/ui';
import { Badge, EmptyState, ProductCard, SectionHeader } from '../../components/MarketplaceCards';
import { categories } from '../../data/marketplace';
import { useMarketplaceData, useShopSearch } from '../../services/marketplaceService';
import { darkPalette, overlay, palette } from '../../theme';

export default function ProductsScreen({ navigation, appSettings }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const { shops, rankedProducts, isOffline, error } = useMarketplaceData();
  const baseShopResults = useShopSearch(shops, query);
  const categoryMeta = categories.find((category) => category.id === selectedCategory) ?? categories[0];
  const categoryMatch = categoryMeta?.match?.toLowerCase?.() ?? null;
  const productMatchesCategory = (product) => !categoryMatch || product.category?.toLowerCase?.() === categoryMatch;
  const shopResults = useMemo(
    () => baseShopResults.filter((shop) => shop.products.some(productMatchesCategory)),
    [baseShopResults, categoryMatch]
  );
  const productResults = useMemo(() => {
    const byCategory = rankedProducts.filter(({ product }) => productMatchesCategory(product));
    if (!normalizedQuery) {
      return byCategory.slice(0, 8);
    }

    return byCategory.filter(({ product, seller }) =>
      `${product.title} ${product.category} ${product.description} ${seller.name}`.toLowerCase().includes(normalizedQuery)
    );
  }, [categoryMatch, normalizedQuery, rankedProducts]);

  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : palette.surface;
  const t = appSettings?.t ?? ((key) => key);

  const openMessages = (sellerName) => navigation.navigate('Messages', { sellerName });
  const openPayment = (productTitle) => navigation.navigate('Wallet', { productTitle });

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('globalSearch')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('searchTitle')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('searchSubtitle')}</Text>
        </View>

        <TextInput value={query} onChangeText={setQuery} placeholder={t('searchExample')} style={styles.input} autoCapitalize="none" />

        <View style={styles.dropdownWrap}>
          <Pressable
            onPress={() => setCategoryOpen((open) => !open)}
            style={[styles.dropdownButton, { borderColor: line, backgroundColor: surface }]}
          >
            <Text style={styles.dropdownIcon}>{categoryMeta.icon}</Text>
            <View style={styles.dropdownCopy}>
              <Text style={[styles.dropdownLabel, { color: muted }]}>Filtre categorie</Text>
              <Text style={[styles.dropdownValue, { color: colors.text }]}>{categoryMeta.label}</Text>
            </View>
            <Text style={[styles.dropdownArrow, { color: colors.primary }]}>{categoryOpen ? '⌃' : '⌄'}</Text>
          </Pressable>
          {categoryOpen ? (
            <View style={[styles.dropdownPanel, { borderColor: line, backgroundColor: surface }]}>
              {categories.map((category) => {
                const active = selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setCategoryOpen(false);
                    }}
                    style={[styles.dropdownOption, { backgroundColor: active ? colors.primary : 'transparent' }]}
                  >
                    <Text style={styles.optionIcon}>{category.icon}</Text>
                    <Text style={[styles.optionText, { color: active ? colors.background : colors.text }]}>{category.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        {isOffline || error ? (
          <Surface style={styles.rankingNote}>
            <Text style={styles.rankingTitle}>{isOffline ? t('offlineCache') : 'API'}</Text>
            <Text style={styles.rankingText}>{isOffline ? t('offlineResults') : error}</Text>
          </Surface>
        ) : null}

        <SectionHeader
          title={normalizedQuery ? t('shopsSellingProduct') : t('availableShops')}
          description={normalizedQuery ? `${shopResults.length} ${t('shopsFound')}` : `${shops.length} ${t('visibleStorefronts')}`}
        />

        <View style={styles.stack}>
          {shopResults.length ? (
            shopResults.map((shop) => (
              <Surface key={shop.id} style={[styles.resultCard, { backgroundColor: surface, borderColor: line }]}>
                <View style={styles.resultTop}>
                  <Image source={shop.logo ?? shop.cover} style={styles.resultImage} resizeMode="cover" />
                  <View style={styles.resultCopy}>
                    <View style={styles.resultNameRow}>
                      <Text style={[styles.resultName, { color: colors.text }]}>{shop.name}</Text>
                      {shop.premium ? <Text style={styles.resultStar}>★</Text> : null}
                    </View>
                    <Text style={[styles.resultMeta, { color: muted }]}>{shop.city} · {shop.speciality}</Text>
                  </View>
                </View>
                <View style={styles.badgeRow}>
                  <Badge type="professional" />
                  {shop.certifiedByAp ? <Badge type="ap" /> : null}
                  {shop.premium ? <Badge type="premium" /> : null}
                </View>
                <View style={styles.productChips}>
                  {shop.products.slice(0, 5).map((product) => (
                    <View key={product.id} style={[styles.productChip, { backgroundColor: darkMode ? palette.dark : overlay.soft }]}>
                      <Text style={[styles.productChipTitle, { color: colors.text }]}>{product.title}</Text>
                      <Text style={[styles.productChipPrice, { color: colors.primary }]}>{product.price}</Text>
                    </View>
                  ))}
                  <Text style={[styles.moreText, { color: muted }]}>{shop.products.length} {t('articlesInShop')}</Text>
                </View>
              </Surface>
            ))
          ) : (
            <EmptyState title={t('noShopFound')} description={t('tryAnotherKeyword')} />
          )}
        </View>

        <SectionHeader title={normalizedQuery ? t('matchingProducts') : t('featuredProducts')} description={t('premiumRanking')} />
        <View style={styles.stack}>
          {productResults.length ? (
            productResults.map((item) => (
              <ProductCard key={item.product.id} item={item} onMessage={() => openMessages(item.seller.name)} onBuy={() => openPayment(item.product.title)} />
            ))
          ) : (
            <EmptyState title={t('noProductFound')} description={t('globalSearchKeepsShowing')} />
          )}
        </View>

        <Surface style={styles.rankingNote}>
          <Text style={styles.rankingTitle}>{t('visibilityRule')}</Text>
          <Text style={styles.rankingText}>{t('visibilityRuleText')}</Text>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 108,
    gap: 18,
  },
  header: {
    gap: 9,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    backgroundColor: palette.surface,
  },
  dropdownWrap: {
    gap: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  dropdownIcon: {
    fontSize: 19,
    lineHeight: 24,
  },
  dropdownCopy: {
    flex: 1,
    gap: 1,
  },
  dropdownLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dropdownValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  dropdownArrow: {
    fontSize: 18,
    fontWeight: '900',
  },
  dropdownPanel: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
    gap: 4,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  optionIcon: {
    fontSize: 17,
    lineHeight: 22,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '900',
  },
  stack: {
    gap: 12,
  },
  resultCard: {
    gap: 12,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultImage: {
    width: 62,
    height: 62,
    borderRadius: 17,
    backgroundColor: overlay.soft,
  },
  resultCopy: {
    flex: 1,
    gap: 2,
  },
  resultNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultName: {
    fontSize: 17,
    fontWeight: '900',
  },
  resultStar: {
    color: palette.orange,
    fontSize: 14,
    fontWeight: '900',
  },
  resultMeta: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productChips: {
    gap: 8,
  },
  productChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 11,
    borderRadius: 14,
  },
  productChipTitle: {
    fontWeight: '900',
  },
  productChipPrice: {
    fontWeight: '900',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rankingNote: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.green,
    backgroundColor: overlay.green,
    gap: 4,
  },
  rankingTitle: {
    color: palette.text,
    fontWeight: '900',
  },
  rankingText: {
    color: overlay.muted,
    lineHeight: 20,
  },
});
