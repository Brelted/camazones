import React, { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import AnimatedBackdrop from '../../components/AnimatedBackdrop';
import { Surface, Text, TextInput } from '../../components/ui';
import { Badge, ProductCard, SectionHeader, ShopCard } from '../../components/MarketplaceCards';
import { useMarketplaceData, useShopSearch } from '../../services/marketplaceService';
import { darkPalette, overlay, palette } from '../../theme';

export default function ShopsScreen({ navigation, route, appSettings }) {
  const { shops, isLoading, isOffline, error } = useMarketplaceData();
  const [query, setQuery] = useState('');
  const [selectedShopId, setSelectedShopId] = useState(route?.params?.shopId ?? null);
  const results = useShopSearch(shops, query);
  const selectedShop = useMemo(() => shops.find((shop) => shop.id === selectedShopId), [shops, selectedShopId]);
  const otherShops = useMemo(() => shops.filter((shop) => shop.id !== selectedShopId), [shops, selectedShopId]);
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;
  const t = appSettings?.t ?? ((key) => key);

  useEffect(() => {
    if (route?.params?.shopId) {
      setSelectedShopId(route.params.shopId);
    }
  }, [route?.params?.shopId]);

  const openMessages = (shop, productTitle) => navigation.navigate('Messages', {
    sellerName: shop.name,
    sellerEmail: shop.email,
    productTitle: productTitle ?? shop.products[0]?.title ?? shop.name,
  });
  const openPayment = (product) => navigation.navigate('Wallet', {
    productTitle: product?.title ?? selectedShop?.name,
    productPrice: product?.price,
  });
  const sendShopMail = (shop) => {
    const subject = encodeURIComponent(`Contact Camazones - ${shop.name}`);
    const body = encodeURIComponent(`Bonjour ${shop.name},\n\nJe souhaite avoir plus d'informations sur votre boutique Camazones.\n\nMerci.`);
    Linking.openURL(`mailto:${shop.email ?? 'contact@camazones.demo'}?subject=${subject}&body=${body}`);
  };

  if (selectedShop) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <AnimatedBackdrop colors={colors} darkMode={darkMode} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelectedShopId(null)} style={styles.backLink}>
            <Text style={[styles.backText, { color: colors.primary }]}>‹ {t('shops')}</Text>
          </Pressable>

          <Surface style={[styles.hero, { backgroundColor: surface, borderColor: line }]}>
            <Image source={selectedShop.cover} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroCopy}>
              <View style={styles.nameRow}>
                <Text style={[styles.shopName, { color: colors.text }]}>{selectedShop.name}</Text>
                {selectedShop.premium ? <Text style={styles.star}>★</Text> : null}
              </View>
              <Text style={[styles.meta, { color: muted }]}>{selectedShop.city} · {selectedShop.speciality}</Text>
              <Text style={[styles.bodyText, { color: muted }]}>{selectedShop.tagline}</Text>
              <View style={styles.badges}>
                <Badge type="professional" />
                {selectedShop.certifiedByAp ? <Badge type="ap" /> : null}
                {selectedShop.premium ? <Badge type="premium" /> : null}
              </View>
            </View>
          </Surface>

          <View style={styles.actions}>
            <Pressable onPress={() => sendShopMail(selectedShop)} style={[styles.action, { backgroundColor: darkMode ? palette.darkSurface : overlay.orange, borderColor: colors.primary }]}>
              <Text style={[styles.actionText, { color: colors.primary }]}>Mail</Text>
            </Pressable>
            <Pressable onPress={() => openMessages(selectedShop)} style={[styles.action, { backgroundColor: colors.green ?? palette.green }]}>
              <Text style={[styles.actionText, { color: colors.background }]}>{t('sellerDm')}</Text>
            </Pressable>
            <Pressable onPress={() => openPayment(selectedShop.products[0])} style={[styles.action, { backgroundColor: colors.primary }]}>
              <Text style={[styles.actionText, { color: colors.background }]}>{t('buy')}</Text>
            </Pressable>
          </View>

          <SectionHeader title="Autres vitrines" description={`${otherShops.length} boutiques visibles dans Camazones`} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.otherShops}>
            {otherShops.map((shop) => (
              <Pressable
                key={shop.id}
                onPress={() => setSelectedShopId(shop.id)}
                style={[styles.otherShopCard, { backgroundColor: surface, borderColor: line }]}
              >
                <Image source={shop.logo ?? shop.cover} style={styles.otherShopLogo} resizeMode="cover" />
                <View style={styles.otherShopCopy}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.otherShopName, { color: colors.text }]} numberOfLines={1}>{shop.name}</Text>
                    {shop.premium ? <Text style={styles.star}>★</Text> : null}
                  </View>
                  <Text style={[styles.otherShopMeta, { color: muted }]} numberOfLines={1}>{shop.products.length} articles · {shop.city}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader title={t('storefront')} description={`${selectedShop.products.length} ${t('visibleArticlesInShop')}`} />
          <View style={styles.stack}>
            {selectedShop.products.map((product) => (
              <ProductCard
                key={product.id}
                item={{ product, seller: selectedShop, sellerType: 'shop' }}
                onMessage={() => openMessages(selectedShop, product.title)}
                onBuy={() => openPayment(product)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <AnimatedBackdrop colors={colors} darkMode={darkMode} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>{t('shopZone')}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{t('professionalStorefrontsOnly')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('independentProductsSearchOnly')}</Text>
          {isOffline || error ? (
            <Text style={[styles.offline, { color: colors.primary }]}>
              {isOffline ? t('offlineCacheActive') : error}
            </Text>
          ) : null}
        </View>

        <TextInput value={query} onChangeText={setQuery} placeholder={t('searchShopOrProduct')} autoCapitalize="none" />

        <SectionHeader
          title={query.trim() ? t('shopResults') : t('allStorefronts')}
          description={isLoading ? t('apiSync') : `${results.length} ${t('storefrontsAvailable')}`}
        />

        <View style={styles.stack}>
          {results.map((shop) => (
            <ShopCard key={shop.id} shop={shop} onPress={() => setSelectedShopId(shop.id)} />
          ))}
        </View>
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
    paddingBottom: 92,
    gap: 16,
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
  offline: {
    fontSize: 12,
    fontWeight: '900',
  },
  stack: {
    gap: 12,
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '900',
  },
  hero: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroImage: {
    width: '100%',
    height: 190,
    backgroundColor: overlay.soft,
  },
  heroCopy: {
    padding: 15,
    gap: 9,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shopName: {
    fontSize: 25,
    fontWeight: '900',
  },
  star: {
    color: palette.orange,
    fontSize: 18,
    fontWeight: '900',
  },
  meta: {
    fontWeight: '800',
  },
  bodyText: {
    lineHeight: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  otherShops: {
    gap: 10,
    paddingRight: 20,
  },
  otherShopCard: {
    width: 176,
    minHeight: 152,
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  otherShopLogo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: overlay.soft,
  },
  otherShopCopy: {
    gap: 4,
  },
  otherShopName: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '900',
  },
  otherShopMeta: {
    fontSize: 12,
    fontWeight: '800',
  },
  action: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionText: {
    fontWeight: '900',
  },
});
