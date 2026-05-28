import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Text, TextInput } from '../../components/ui';
import { Badge, EmptyState, ProductCard, SectionHeader } from '../../components/MarketplaceCards';
import { getRankedProducts, searchMarketplace, shops } from '../../data/marketplace';
import { darkPalette, overlay, palette } from '../../theme';

export default function ProductsScreen({ navigation, appSettings }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const shopResults = useMemo(() => searchMarketplace(query), [query]);
  const productResults = useMemo(() => {
    const products = getRankedProducts();

    if (!normalizedQuery) {
      return products.slice(0, 8);
    }

    return products.filter(({ product, seller }) =>
      `${product.title} ${product.category} ${product.description} ${seller.name}`.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const darkMode = Boolean(appSettings?.darkMode);
  const colors = appSettings?.colors ?? palette;
  const muted = darkMode ? darkPalette.muted : overlay.muted;
  const line = darkMode ? darkPalette.line : overlay.line;
  const screenStyle = [styles.screen, { backgroundColor: colors.background }];

  const openMessages = (sellerName) => {
    navigation.navigate('Messages', { sellerName });
  };

  const openPayment = (productTitle) => {
    navigation.navigate('Wallet', { productTitle });
  };

  return (
    <SafeAreaView style={screenStyle}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.secondary }]}>Recherche globale</Text>
          <Text style={[styles.title, { color: colors.text }]}>Un produit, toutes les boutiques pertinentes.</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            Hors d une boutique, la recherche rassemble les vitrines qui vendent reellement le produit demande.
          </Text>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ex: sac, lampe, tech, cafe..."
          style={styles.input}
          autoCapitalize="none"
        />

        <SectionHeader
          title={normalizedQuery ? 'Boutiques qui vendent ce produit' : 'Boutiques disponibles'}
          description={normalizedQuery ? `${shopResults.length} boutique(s) trouvee(s).` : `${shops.length} vitrines visibles des l entree.`}
        />

        <View style={styles.stack}>
          {shopResults.length ? (
            shopResults.map((shop) => (
              <Surface key={shop.id} style={[styles.resultCard, { borderColor: line }]} elevation={0}>
                <View style={styles.resultTop}>
                  <Image source={shop.cover} style={styles.resultImage} resizeMode="cover" />
                  <View style={styles.resultCopy}>
                    <View style={styles.resultNameRow}>
                      <Text style={styles.resultName}>{shop.name}</Text>
                      {shop.premium ? <Text style={styles.resultStar}>★</Text> : null}
                    </View>
                    <Text style={styles.resultMeta}>{shop.city} · {shop.speciality}</Text>
                  </View>
                </View>
                <View style={styles.badgeRow}>
                  <Badge type="professional" />
                  {shop.certifiedByAp ? <Badge type="ap" /> : null}
                  {shop.premium ? <Badge type="premium" /> : null}
                </View>
                <View style={styles.productChips}>
                  {shop.products.slice(0, 5).map((product) => (
                    <View key={product.id} style={styles.productChip}>
                      <Text style={styles.productChipTitle}>{product.title}</Text>
                      <Text style={styles.productChipPrice}>{product.price}</Text>
                    </View>
                  ))}
                  <Text style={styles.moreText}>{shop.products.length} articles disponibles dans cette boutique.</Text>
                </View>
              </Surface>
            ))
          ) : (
            <EmptyState title="Aucune boutique trouvee" description="Essayez un autre mot-cle ou une categorie plus large." />
          )}
        </View>

        <SectionHeader
          title={normalizedQuery ? 'Produits correspondants' : 'Produits mis en avant'}
          description="Les produits premium et reconnus sont mieux classes sans masquer les autres offres."
        />
        <View style={styles.stack}>
          {productResults.length ? (
            productResults.map((item) => (
              <ProductCard
                key={item.product.id}
                item={item}
                onMessage={() => openMessages(item.seller.name)}
                onBuy={() => openPayment(item.product.title)}
              />
            ))
          ) : (
            <EmptyState title="Aucun produit trouve" description="La recherche reste globale et affichera les boutiques des qu un produit correspond." />
          )}
        </View>

        <Surface style={styles.rankingNote} elevation={0}>
          <Text style={styles.rankingTitle}>Regle de visibilite</Text>
          <Text style={styles.rankingText}>Premium + certification AP = apparition prioritaire dans la decouverte et les resultats.</Text>
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
  stack: {
    gap: 12,
  },
  resultCard: {
    gap: 12,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: palette.surface,
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
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
  },
  resultStar: {
    color: palette.orange,
    fontSize: 14,
    fontWeight: '900',
  },
  resultMeta: {
    color: overlay.muted,
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
    backgroundColor: overlay.soft,
  },
  productChipTitle: {
    color: palette.text,
    fontWeight: '900',
  },
  productChipPrice: {
    color: palette.primary,
    fontWeight: '900',
  },
  moreText: {
    color: overlay.muted,
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
