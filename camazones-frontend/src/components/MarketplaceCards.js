import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Surface, Text } from './ui';
import { darkPalette, overlay, palette } from '../theme';

const badgeMeta = {
  ap: { label: 'Reconnu AP', icon: 'AP' },
  premium: { label: 'Premium', icon: '★' },
  professional: { label: 'Boutique pro', icon: '◇' },
  independent: { label: 'Independant', icon: '●' },
};

const useCardTheme = () => {
  const darkMode = useSelector((state) => state.settings?.darkMode);
  return {
    colors: darkMode ? darkPalette : palette,
    surface: darkMode ? darkPalette.surface : overlay.surface,
    soft: darkMode ? 'rgba(246, 241, 234, 0.08)' : overlay.soft,
    muted: darkMode ? darkPalette.muted : overlay.muted,
    line: darkMode ? darkPalette.line : overlay.line,
  };
};

export function Badge({ type }) {
  const tokens = useCardTheme();
  const meta = badgeMeta[type] ?? badgeMeta.premium;
  const isPremium = type === 'premium';
  const isAp = type === 'ap';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tokens.soft, borderColor: tokens.line },
        isPremium && { backgroundColor: overlay.orange, borderColor: palette.orange },
        isAp && { backgroundColor: overlay.green, borderColor: palette.green },
      ]}
    >
      <Text style={[styles.badgeIcon, { color: tokens.colors.primary }, isPremium && styles.badgePremiumText]}>{meta.icon}</Text>
      <Text style={[styles.badgeText, { color: tokens.colors.primary }, isPremium && styles.badgePremiumText]}>{meta.label}</Text>
    </View>
  );
}

export function SectionHeader({ title, description }) {
  const tokens = useCardTheme();

  return (
    <View style={[styles.sectionHeader, { backgroundColor: tokens.surface, borderColor: tokens.line }]}>
      <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>{title}</Text>
      {description ? <Text style={[styles.sectionDescription, { color: tokens.muted }]}>{description}</Text> : null}
    </View>
  );
}

export function ShopCard({ shop, onPress }) {
  const tokens = useCardTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Surface style={[styles.card, { backgroundColor: tokens.surface, borderColor: tokens.line }]}>
        <Image source={shop.cover} style={styles.shopCover} resizeMode="cover" />
        <View style={styles.cardTop}>
          <View style={[styles.avatar, { backgroundColor: tokens.colors.primary }, shop.premium && styles.avatarPremium]}>
            <Text style={[styles.avatarText, { color: tokens.colors.background }]}>{shop.name.slice(0, 1)}</Text>
          </View>
          <View style={styles.cardTitleBlock}>
            <View style={styles.titleRow}>
              <Text style={[styles.cardTitle, { color: tokens.colors.text }]}>{shop.name}</Text>
              {shop.premium ? <Text style={styles.shopStar}>★</Text> : null}
            </View>
            <Text style={[styles.cardSubtitle, { color: tokens.muted }]}>{shop.city} · {shop.speciality ?? 'Vente active'}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
        <Text style={[styles.cardBody, { color: tokens.muted }]}>{shop.tagline}</Text>
        <View style={styles.badgeRow}>
          <Badge type="professional" />
          {shop.certifiedByAp ? <Badge type="ap" /> : null}
          {shop.premium ? <Badge type="premium" /> : null}
        </View>
        <View style={styles.metricsRow}>
          <Metric label="Articles" value={String(shop.products.length)} />
          <Metric label="Visibilite" value={shop.premium ? 'Haute' : 'Claire'} />
          <Metric label="Rang" value={`${shop.visibilityRank ?? 76}%`} />
        </View>
      </Surface>
    </Pressable>
  );
}

export function ProductCard({ item, onMessage, onBuy }) {
  const tokens = useCardTheme();
  const { product, seller, sellerType } = item;

  return (
    <Surface style={[styles.productCard, { backgroundColor: tokens.surface, borderColor: tokens.line }]}>
      <View style={styles.productImageWrap}>
        <Image source={product.image} style={styles.productImage} resizeMode="cover" />
        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeText}>{product.category}</Text>
        </View>
      </View>
      <View style={styles.productHeader}>
        <View style={[styles.productIcon, product.premium && styles.productIconPremium]}>
          <Text style={styles.productIconText}>{product.title.slice(0, 1)}</Text>
        </View>
        <View style={styles.cardTitleBlock}>
          <View style={styles.titleRow}>
            <Text style={[styles.productTitle, { color: tokens.colors.text }]}>{product.title}</Text>
            {product.premium || seller.premium ? <Text style={styles.productStar}>★</Text> : null}
          </View>
          <Text style={[styles.cardSubtitle, { color: tokens.muted }]}>{seller.name} · {sellerType === 'shop' ? 'Boutique' : 'Vendeur'}</Text>
        </View>
      </View>
      <Text style={[styles.cardBody, { color: tokens.muted }]}>{product.description}</Text>
      <View style={styles.badgeRow}>
        {product.certified || seller.certifiedByAp ? <Badge type="ap" /> : null}
        {product.premium || seller.premium ? <Badge type="premium" /> : null}
      </View>
      <View style={styles.productBottom}>
        <View>
          <Text style={[styles.price, { color: tokens.colors.text }]}>{product.price}</Text>
          <Text style={[styles.stock, { color: tokens.muted }]}>{product.stock}</Text>
        </View>
        <View style={styles.actions}>
          <Button mode="outlined" compact onPress={onMessage} textColor={tokens.colors.primary} style={styles.outlineButton}>
            DM
          </Button>
          <Button mode="contained" compact onPress={onBuy} buttonColor={tokens.colors.primary} textColor={tokens.colors.background}>
            Payer
          </Button>
        </View>
      </View>
    </Surface>
  );
}

export function Metric({ label, value }) {
  const tokens = useCardTheme();

  return (
    <View style={[styles.metric, { backgroundColor: tokens.soft }]}>
      <Text style={[styles.metricValue, { color: tokens.colors.primary }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: tokens.muted }]}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, description }) {
  const tokens = useCardTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: tokens.surface, borderColor: tokens.line }]}>
      <Text style={styles.emptyIcon}>⌕</Text>
      <Text style={[styles.emptyTitle, { color: tokens.colors.text }]}>{title}</Text>
      <Text style={[styles.emptyDescription, { color: tokens.muted }]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.76,
  },
  card: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    overflow: 'hidden',
  },
  shopCover: {
    width: '100%',
    height: 130,
    borderRadius: 15,
    backgroundColor: overlay.soft,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPremium: {
    backgroundColor: palette.orange,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  shopStar: {
    color: palette.orange,
    fontSize: 15,
    fontWeight: '900',
  },
  productStar: {
    color: palette.orange,
    fontSize: 13,
    fontWeight: '900',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    color: palette.green,
    fontSize: 30,
    fontWeight: '900',
  },
  cardBody: {
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeIcon: {
    fontSize: 10,
    fontWeight: '900',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  badgePremiumText: {
    color: palette.text,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
  },
  productCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  productImageWrap: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 168,
    borderRadius: 15,
    backgroundColor: overlay.soft,
  },
  imageBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(31, 31, 31, 0.72)',
  },
  imageBadgeText: {
    color: palette.background,
    fontSize: 11,
    fontWeight: '900',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.green,
  },
  productIconPremium: {
    backgroundColor: palette.orange,
  },
  productIconText: {
    color: palette.background,
    fontSize: 17,
    fontWeight: '900',
  },
  productTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  productBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
  },
  stock: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  outlineButton: {
    borderColor: palette.green,
  },
  sectionHeader: {
    gap: 5,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionDescription: {
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  emptyIcon: {
    color: palette.green,
    fontSize: 22,
    fontWeight: '900',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
