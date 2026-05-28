import React, { useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text } from '../../components/ui';
import { Badge, ProductCard, SectionHeader, ShopCard } from '../../components/MarketplaceCards';
import { categories, getRankedProducts, shops } from '../../data/marketplace';
import { overlay, palette } from '../../theme';

export default function HomeScreen({ navigation }) {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const rankedProducts = useMemo(() => getRankedProducts(), []);
  const selectedShop = shops.find((shop) => shop.id === selectedShopId);

  const openMessages = (sellerName) => {
    navigation.navigate('Messages', { sellerName });
  };

  const openPayment = (productTitle) => {
    navigation.navigate('Wallet', { productTitle });
  };

  if (selectedShop) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelectedShopId(null)} style={styles.backLink}>
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back to marketplace</Text>
          </Pressable>

          <Surface style={styles.shopHero} elevation={0}>
            <Image source={selectedShop.cover} style={styles.shopHeroImage} resizeMode="cover" />
            <View style={styles.shopHeroCopy}>
              <View style={styles.nameRow}>
                <Text style={styles.shopName}>{selectedShop.name}</Text>
                {selectedShop.premium ? <Text style={styles.shopStar}>★</Text> : null}
              </View>
              <Text style={styles.shopMeta}>{selectedShop.city} · {selectedShop.speciality}</Text>
              <Text style={styles.shopText}>{selectedShop.tagline}</Text>
              <View style={styles.badges}>
                <Badge type="professional" />
                {selectedShop.certifiedByAp ? <Badge type="ap" /> : null}
                {selectedShop.premium ? <Badge type="premium" /> : null}
              </View>
            </View>
          </Surface>

          <SectionHeader title="Store products" description="Clothes, gadgets and offers from this boutique only." />
          <View style={styles.stack}>
            {selectedShop.products.map((product) => (
              <ProductCard
                key={product.id}
                item={{ product, seller: selectedShop, sellerType: 'shop' }}
                onMessage={() => openMessages(selectedShop.name)}
                onBuy={() => openPayment(product.title)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoText}>C</Text>
            </View>
            <View>
              <Text style={styles.logoName}>CAMAZONE</Text>
              <Text style={styles.logoSub}>Mobile marketplace</Text>
            </View>
            <Text style={styles.cartIcon}>🛍️</Text>
          </View>

          <Pressable onPress={() => navigation.navigate('Products')} style={styles.searchBar}>
            <Text style={styles.searchIcon}>⌕</Text>
            <Text style={styles.searchPlaceholder}>Search clothes, gadgets...</Text>
          </Pressable>
        </View>

        <View style={styles.sectionInline}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable key={category.id} onPress={() => navigation.navigate('Products')} style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </Pressable>
          ))}
        </View>

        <Surface style={styles.banner} elevation={0}>
          <View style={styles.bannerBlue} />
          <View style={styles.bannerPurple} />
          <Text style={styles.bannerTitle}>⚡ New arrivals, big deals</Text>
          <Text style={styles.bannerText}>Fresh clothes, sneakers and gadgets with premium stores first.</Text>
        </Surface>

        <View style={styles.sectionInline}>
          <Text style={styles.sectionTitle}>Featured products</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>

        <View style={styles.productGrid}>
          {rankedProducts.slice(0, 8).map((item) => (
            <GridProductCard
              key={item.product.id}
              item={item}
              onMessage={() => openMessages(item.seller.name)}
              onBuy={() => openPayment(item.product.title)}
            />
          ))}
        </View>

        <View style={styles.sectionInline}>
          <Text style={styles.sectionTitle}>Stores</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.stack}>
          {shops.slice(0, 3).map((shop) => (
            <ShopCard key={shop.id} shop={shop} onPress={() => setSelectedShopId(shop.id)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GridProductCard({ item, onMessage, onBuy }) {
  const { product, seller } = item;

  return (
    <Surface style={styles.gridCard} elevation={0}>
      <View style={styles.gridImageWrap}>
        <Image source={product.image} style={styles.gridImage} resizeMode="cover" />
        <View style={styles.badgeTopLeft}>
          <Text style={styles.badgeTopText}>⭐ {seller.premium ? 'Top' : 'New'}</Text>
        </View>
        <View style={styles.badgeTopRight}>
          <Text style={styles.badgeTopText}>-{product.premium ? '35' : '20'}%</Text>
        </View>
      </View>
      <Text numberOfLines={2} style={styles.gridTitle}>{product.title}</Text>
      <Text numberOfLines={1} style={styles.gridSeller}>{seller.name}{seller.premium ? ' ★' : ''}</Text>
      <View style={styles.gridFooter}>
        <Text style={styles.gridPrice}>{product.price}</Text>
        <View style={styles.gridActions}>
          <Pressable onPress={onMessage} style={styles.gridMiniButton}>
            <Text style={styles.gridMiniText}>💬</Text>
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
    paddingBottom: 108,
    gap: 16,
  },
  detailContent: {
    padding: 18,
    paddingBottom: 108,
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
  cartIcon: {
    marginLeft: 'auto',
    color: palette.card,
    fontSize: 16,
    lineHeight: 20,
  },
  searchBar: {
    minHeight: 40,
    borderRadius: 8,
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
    minHeight: 76,
    marginHorizontal: 18,
    borderRadius: 12,
    padding: 14,
    overflow: 'hidden',
    backgroundColor: palette.blue,
  },
  bannerBlue: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: palette.blue,
  },
  bannerPurple: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: palette.purple,
    opacity: 0.9,
  },
  bannerTitle: {
    color: palette.card,
    fontSize: 16,
    fontWeight: '900',
  },
  bannerText: {
    color: '#EDE3D1',
    marginTop: 5,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
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
    backgroundColor: palette.blue,
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
    width: 34,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: overlay.soft,
  },
  gridMiniText: {
    fontSize: 12,
    lineHeight: 15,
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
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
  },
  backIcon: {
    color: palette.orange,
    fontSize: 24,
    fontWeight: '900',
  },
  backText: {
    color: palette.orange,
    fontWeight: '900',
  },
  shopHero: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: overlay.line,
  },
  shopHeroImage: {
    width: '100%',
    height: 180,
    backgroundColor: palette.khaki,
  },
  shopHeroCopy: {
    padding: 14,
    gap: 9,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shopName: {
    color: palette.text,
    fontSize: 23,
    fontWeight: '900',
  },
  shopStar: {
    color: palette.orange,
    fontSize: 16,
    fontWeight: '900',
  },
  shopMeta: {
    color: overlay.muted,
    fontWeight: '800',
  },
  shopText: {
    color: overlay.muted,
    lineHeight: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
