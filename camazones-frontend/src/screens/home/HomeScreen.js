import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from '../../components/ui';
import BrandLogo from '../../components/BrandLogo';
import { Badge, Metric, ProductCard, SectionHeader, ShopCard } from '../../components/MarketplaceCards';
import { getRankedProducts, shops } from '../../data/marketplace';
import { darkPalette, overlay, palette } from '../../theme';

export default function HomeScreen({ navigation, appSettings }) {
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [notice, setNotice] = useState('');
  const rankedProducts = useMemo(() => getRankedProducts(), []);
  const selectedShop = shops.find((shop) => shop.id === selectedShopId);
  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const screenStyle = [styles.screen, { backgroundColor: colors.background }];

  const openMessages = (sellerName) => {
    setNotice(`DM prepare avec ${sellerName}.`);
    navigation.navigate('Messages', { sellerName });
  };

  const openPayment = (productTitle) => {
    setNotice(`Paiement pret pour ${productTitle}.`);
    navigation.navigate('Wallet', { productTitle });
  };

  if (selectedShop) {
    return (
      <SafeAreaView style={screenStyle}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelectedShopId(null)} style={styles.backLink}>
            <Text style={[styles.backIcon, { color: colors.green ?? palette.green }]}>‹</Text>
            <Text style={[styles.backText, { color: colors.primary }]}>Toutes les vitrines</Text>
          </Pressable>

          <Surface style={styles.shopHero} elevation={0}>
            <View style={styles.heroGlowOrange} />
            <View style={styles.heroGlowGreen} />
            <View style={styles.shopHeroTop}>
              <View style={[styles.shopMark, { backgroundColor: selectedShop.premium ? palette.orange : palette.primary }]}>
                <Text style={styles.shopMarkText}>{selectedShop.name.slice(0, 1)}</Text>
              </View>
              <View style={styles.shopHeroTitle}>
                <View style={styles.nameRow}>
                  <Text style={styles.shopName}>{selectedShop.name}</Text>
                  {selectedShop.premium ? <Text style={styles.shopStar}>★</Text> : null}
                </View>
                <Text style={styles.shopMeta}>{selectedShop.city} · {selectedShop.speciality}</Text>
              </View>
            </View>
            <Text style={styles.shopText}>{selectedShop.tagline}</Text>
            <View style={styles.badges}>
              <Badge type="professional" />
              {selectedShop.certifiedByAp ? <Badge type="ap" /> : null}
              {selectedShop.premium ? <Badge type="premium" /> : null}
            </View>
            <View style={styles.metricGrid}>
              <Metric label="Articles reels" value={String(selectedShop.products.length)} />
              <Metric label="Compte" value="Boutique" />
              <Metric label="Visibilite" value={selectedShop.premium ? 'Premium' : 'Claire'} />
            </View>
          </Surface>

          <SectionHeader title="Produits de la boutique" description="Dans une vitrine, seuls les produits de cette boutique sont affiches." />
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
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BrandLogo caption="Vitrines, recherche globale et paiement fluide" />
          <Text style={[styles.title, { color: colors.text }]}>Des boutiques fiables, des produits visibles.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Des l entree, Camazones affiche uniquement les vitrines, puis les produits premium les mieux classes.
          </Text>
        </View>

        <Surface style={styles.searchHint} elevation={0}>
          <View style={styles.heroGlowOrange} />
          <View style={styles.heroGlowGreen} />
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>⌕</Text>
          </View>
          <View style={styles.searchCopy}>
            <Text style={styles.searchTitle}>Recherche globale hors boutique</Text>
            <Text style={styles.searchText}>Cherchez un produit et voyez toutes les boutiques qui le vendent.</Text>
          </View>
          <Button
            mode="contained"
            compact
            onPress={() => navigation.navigate('Products')}
            buttonColor={palette.green}
            textColor={palette.background}
          >
            Voir
          </Button>
        </Surface>

        {notice ? <Text style={[styles.notice, { color: colors.green ?? palette.green }]}>{notice}</Text> : null}

        <SectionHeader title="Vitrines selectionnees" description="La zone boutique ne contient que des boutiques professionnelles." />
        <View style={styles.stack}>
          {[...shops].sort((left, right) => Number(right.premium) - Number(left.premium)).map((shop) => (
            <ShopCard key={shop.id} shop={shop} onPress={() => setSelectedShopId(shop.id)} />
          ))}
        </View>

        <SectionHeader title="Produits premium" description="Les offres premium et reconnues remontent plus souvent dans les listes." />
        <View style={styles.stack}>
          {rankedProducts.slice(0, 6).map((item) => (
            <ProductCard
              key={item.product.id}
              item={item}
              onMessage={() => openMessages(item.seller.name)}
              onBuy={() => openPayment(item.product.title)}
            />
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
    paddingBottom: 108,
    gap: 18,
  },
  header: {
    gap: 14,
  },
  title: {
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  searchHint: {
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: palette.surface,
  },
  heroGlowOrange: {
    position: 'absolute',
    top: -38,
    right: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: overlay.orange,
  },
  heroGlowGreen: {
    position: 'absolute',
    bottom: -48,
    left: -24,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: overlay.green,
  },
  searchIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: palette.primary,
  },
  searchCopy: {
    flex: 1,
    gap: 2,
  },
  searchTitle: {
    color: palette.text,
    fontWeight: '900',
  },
  searchText: {
    color: overlay.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  notice: {
    fontWeight: '900',
    paddingHorizontal: 2,
  },
  stack: {
    gap: 12,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
  },
  backText: {
    fontWeight: '900',
  },
  shopHero: {
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: overlay.line,
    backgroundColor: palette.surface,
  },
  shopHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shopMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.secondary,
  },
  shopMarkText: {
    color: palette.background,
    fontSize: 28,
    fontWeight: '900',
  },
  shopHeroTitle: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  shopName: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  shopStar: {
    color: palette.orange,
    fontSize: 18,
    fontWeight: '900',
  },
  shopMeta: {
    color: overlay.muted,
    fontWeight: '700',
  },
  shopText: {
    color: overlay.muted,
    lineHeight: 21,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '900',
  },
  searchIconText: {
    color: palette.background,
    fontSize: 20,
    fontWeight: '900',
  },
});
