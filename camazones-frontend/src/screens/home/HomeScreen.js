import React from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text } from '../../components/ui';
import { ShopCard } from '../../components/MarketplaceCards';
import { categories } from '../../data/marketplace';
import { useMarketplaceData } from '../../services/marketplaceService';
import { darkPalette, overlay, palette } from '../../theme';

export default function HomeScreen({ navigation, appSettings }) {
  const { shops, rankedProducts, isOffline, error } = useMarketplaceData();
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const cardSurface = darkMode ? darkPalette.surface : palette.card;
  const t = appSettings?.t ?? ((key) => key);
  const openMessages = (sellerName) => navigation.navigate('Messages', { sellerName });
  const openPayment = (productTitle) => navigation.navigate('Wallet', { productTitle });

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
          <View style={styles.logoRow}>
            <View style={[styles.logoMark, { backgroundColor: colors.background }]}>
              <Text style={[styles.logoText, { color: colors.primary }]}>C</Text>
            </View>
            <View>
              <Text style={[styles.logoName, { color: colors.background }]}>CAMAZONE</Text>
              <Text style={[styles.logoSub, { color: darkMode ? darkPalette.muted : '#FFE1C4' }]}>{t('mobileMarketplace')}</Text>
            </View>
            <Pressable onPress={() => navigation.navigate('Seller')} style={[styles.walletPill, { backgroundColor: colors.background }]}>
              <Text style={[styles.walletText, { color: colors.primary }]}>{t('profile')}</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => navigation.navigate('Products')} style={[styles.searchBar, { backgroundColor: cardSurface }]}>
            <Text style={[styles.searchIcon, { color: colors.primary }]}>⌕</Text>
            <Text style={[styles.searchPlaceholder, { color: muted }]}>{t('searchPlaceholder')}</Text>
          </Pressable>
        </View>

        {isOffline || error ? (
          <Surface style={styles.syncNote}>
            <Text style={styles.syncText}>{isOffline ? 'Mode offline: cache Camazones actif.' : error}</Text>
          </Surface>
        ) : null}

        <View style={styles.sectionInline}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('categories')}</Text>
          <Text style={[styles.viewAll, { color: colors.primary }]}>{t('quick')}</Text>
        </View>

        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable key={category.id} onPress={() => navigation.navigate('Products')} style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: cardSurface, borderColor: line }]}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={[styles.categoryLabel, { color: colors.text }]}>{t(category.id) || category.label}</Text>
            </Pressable>
          ))}
        </View>

        <Surface style={styles.banner}>
          <View style={styles.bannerOrange} />
          <View style={styles.bannerGreen} />
          <Text style={styles.bannerTitle}>{t('newDeals')}</Text>
          <Text style={styles.bannerText}>{t('premiumVisibilityNote')}</Text>
        </Surface>

        <View style={styles.sectionInline}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('trending')}</Text>
          <Text style={[styles.viewAll, { color: colors.primary }]}>{t('carousel')}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {rankedProducts.slice(0, 10).map((item) => (
            <TrendProductCard
              key={item.product.id}
              item={item}
              appSettings={appSettings}
              onMessage={() => openMessages(item.seller.name)}
              onBuy={() => openPayment(item.product.title)}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionInline}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('featuredProducts')}</Text>
          <Text style={[styles.viewAll, { color: colors.primary }]}>{t('view')}</Text>
        </View>

        <View style={styles.productGrid}>
          {rankedProducts.slice(0, 8).map((item) => (
            <GridProductCard
              key={`grid-${item.product.id}`}
              item={item}
              appSettings={appSettings}
              onMessage={() => openMessages(item.seller.name)}
              onBuy={() => openPayment(item.product.title)}
            />
          ))}
        </View>

        <View style={styles.sectionInline}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('storefronts')}</Text>
          <Pressable onPress={() => navigation.navigate('Shops')}>
            <Text style={[styles.viewAll, { color: colors.primary }]}>{t('all')}</Text>
          </Pressable>
        </View>

        <View style={styles.stack}>
          {shops.slice(0, 3).map((shop) => (
            <ShopCard key={shop.id} shop={shop} onPress={() => navigation.navigate('Shops', { shopId: shop.id })} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TrendProductCard({ item, onMessage, onBuy, appSettings }) {
  const { product, seller } = item;
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const cardSurface = darkMode ? darkPalette.surface : palette.card;

  return (
    <Surface style={[styles.trendCard, { backgroundColor: cardSurface, borderColor: line }]}>
      <Image source={product.image} style={styles.trendImage} resizeMode="cover" />
      <Text numberOfLines={2} style={[styles.gridTitle, { color: colors.text }]}>{product.title}</Text>
      <Text numberOfLines={1} style={[styles.gridSeller, { color: muted }]}>{seller.name}{seller.premium ? ' ★' : ''}</Text>
      <Text style={[styles.gridPrice, { color: colors.primary }]}>{product.price}</Text>
      <View style={styles.gridActions}>
        <Pressable onPress={onMessage} style={styles.gridMiniButton}>
          <Text style={styles.gridMiniText}>DM</Text>
        </Pressable>
        <Pressable onPress={onBuy} style={styles.gridBuyButton}>
          <Text style={styles.gridBuyText}>Buy</Text>
        </Pressable>
      </View>
    </Surface>
  );
}

function GridProductCard({ item, onMessage, onBuy, appSettings }) {
  const { product, seller } = item;
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const cardSurface = darkMode ? darkPalette.surface : palette.card;

  return (
    <Surface style={[styles.gridCard, { backgroundColor: cardSurface, borderColor: line }]}>
      <View style={styles.gridImageWrap}>
        <Image source={product.image} style={styles.gridImage} resizeMode="cover" />
        <View style={styles.badgeTopLeft}>
          <Text style={styles.badgeTopText}>{seller.premium ? 'Premium' : 'New'}</Text>
        </View>
        {seller.certifiedByAp ? (
          <View style={styles.badgeTopRight}>
            <Text style={styles.badgeTopText}>AP</Text>
          </View>
        ) : null}
      </View>
      <Text numberOfLines={2} style={[styles.gridTitle, { color: colors.text }]}>{product.title}</Text>
      <Text numberOfLines={1} style={[styles.gridSeller, { color: muted }]}>{seller.name}{seller.premium ? ' ★' : ''}</Text>
      <View style={styles.gridFooter}>
        <Text style={[styles.gridPrice, { color: colors.primary }]}>{product.price}</Text>
        <View style={styles.gridActions}>
          <Pressable onPress={onMessage} style={styles.gridMiniButton}>
            <Text style={styles.gridMiniText}>DM</Text>
          </Pressable>
          <Pressable onPress={onBuy} style={styles.gridBuyButton}>
            <Text style={styles.gridBuyText}>Buy</Text>
          </Pressable>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingBottom: 92,
    gap: 16,
  },
  topBar: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
    backgroundColor: palette.orange,
    gap: 14,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
  },
  logoText: {
    color: palette.orange,
    fontSize: 19,
    fontWeight: '900',
  },
  logoName: {
    color: palette.card,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  logoSub: {
    color: '#FFE1C4',
    fontSize: 10,
    fontWeight: '800',
  },
  walletPill: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: palette.card,
  },
  walletText: {
    color: palette.orange,
    fontSize: 12,
    fontWeight: '900',
  },
  searchBar: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: palette.card,
  },
  searchIcon: {
    color: palette.khaki,
    fontSize: 17,
    fontWeight: '900',
  },
  searchPlaceholder: {
    color: overlay.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  syncNote: {
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: overlay.green,
    borderWidth: 1,
    borderColor: palette.green,
  },
  syncText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '900',
  },
  sectionInline: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  viewAll: {
    color: palette.orange,
    fontSize: 12,
    fontWeight: '900',
  },
  categoryRow: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: 'rgba(31,31,31,0.06)',
  },
  categoryEmoji: {
    fontSize: 19,
    lineHeight: 22,
  },
  categoryLabel: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '800',
  },
  banner: {
    minHeight: 78,
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 14,
    overflow: 'hidden',
    backgroundColor: palette.orange,
  },
  bannerOrange: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '58%',
    backgroundColor: palette.orange,
  },
  bannerGreen: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '58%',
    backgroundColor: palette.green,
    opacity: 0.75,
  },
  bannerTitle: {
    color: palette.card,
    fontSize: 16,
    fontWeight: '900',
  },
  bannerText: {
    color: '#FFF0DE',
    marginTop: 5,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  carousel: {
    paddingLeft: 18,
    paddingRight: 18,
    gap: 12,
  },
  trendCard: {
    width: 168,
    minHeight: 248,
    borderRadius: 12,
    padding: 8,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: overlay.line,
    gap: 7,
  },
  trendImage: {
    width: '100%',
    height: 128,
    borderRadius: 9,
    backgroundColor: palette.khaki,
  },
  productGrid: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    minHeight: 236,
    borderRadius: 10,
    padding: 8,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: overlay.line,
    gap: 7,
  },
  gridImageWrap: {
    height: 126,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: palette.khaki,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 7,
    left: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: palette.orange,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 7,
    right: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: palette.green,
  },
  badgeTopText: {
    color: palette.card,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '900',
  },
  gridTitle: {
    color: palette.text,
    minHeight: 34,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
  },
  gridSeller: {
    color: overlay.muted,
    fontSize: 10,
    fontWeight: '800',
  },
  gridFooter: {
    gap: 8,
  },
  gridPrice: {
    color: palette.orange,
    fontSize: 14,
    fontWeight: '900',
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  gridMiniButton: {
    minWidth: 34,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.soft,
    paddingHorizontal: 8,
  },
  gridMiniText: {
    color: palette.text,
    fontSize: 10,
    fontWeight: '900',
  },
  gridBuyButton: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.orange,
  },
  gridBuyText: {
    color: palette.card,
    fontSize: 11,
    fontWeight: '900',
  },
  stack: {
    paddingHorizontal: 18,
    gap: 12,
  },
});
