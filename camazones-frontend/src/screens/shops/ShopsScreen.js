import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
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
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const surface = darkMode ? darkPalette.surface : overlay.surface;

  useEffect(() => {
    if (route?.params?.shopId) {
      setSelectedShopId(route.params.shopId);
    }
  }, [route?.params?.shopId]);

  const openMessages = (sellerName) => navigation.navigate('Messages', { sellerName });
  const openPayment = (productTitle) => navigation.navigate('Wallet', { productTitle });

  if (selectedShop) {
    return (
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelectedShopId(null)} style={styles.backLink}>
            <Text style={[styles.backText, { color: colors.primary }]}>‹ Boutiques</Text>
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
            <Pressable onPress={() => openMessages(selectedShop.name)} style={[styles.action, { backgroundColor: colors.green ?? palette.green }]}>
              <Text style={[styles.actionText, { color: colors.background }]}>DM vendeur</Text>
            </Pressable>
            <Pressable onPress={() => openPayment(selectedShop.products[0]?.title ?? selectedShop.name)} style={[styles.action, { backgroundColor: colors.primary }]}>
              <Text style={[styles.actionText, { color: colors.background }]}>Acheter</Text>
            </Pressable>
          </View>

          <SectionHeader title="Vitrine boutique" description={`${selectedShop.products.length} articles visibles dans cette boutique.`} />
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
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>Zone boutique</Text>
          <Text style={[styles.title, { color: colors.text }]}>Uniquement des vitrines professionnelles.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Les produits de vendeurs independants restent dans la recherche, pas dans cette zone boutique.
          </Text>
          {isOffline || error ? (
            <Text style={[styles.offline, { color: colors.primary }]}>
              {isOffline ? 'Mode cache offline actif.' : error}
            </Text>
          ) : null}
        </View>

        <TextInput value={query} onChangeText={setQuery} placeholder="Chercher une boutique ou un article..." autoCapitalize="none" />

        <SectionHeader
          title={query.trim() ? 'Resultats boutiques' : 'Toutes les vitrines'}
          description={isLoading ? 'Synchronisation API en cours...' : `${results.length} vitrine(s) disponible(s).`}
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
  action: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontWeight: '900',
  },
});
