import { useEffect, useMemo, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import apiClient from './apiClient';
import { storage } from './storage';
import {
  getRankedProducts as getLocalRankedProducts,
  independentSellers,
  shops as localShops,
} from '../data/marketplace';

const MARKETPLACE_CACHE_KEY = '@camazones/marketplace-cache';

const formatPrice = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
const imageSource = (url, fallback) => (url ? { uri: url } : fallback);
const stockLabel = (value) => (Number(value ?? 0) > 0 ? `${value} pieces` : 'En stock');
const isPremiumShop = (shop) => shop.subscriptionTier === 'PREMIUM' || shop.subscriptionTier === 'MONTHLY';

const localShopByName = localShops.reduce((accumulator, shop) => {
  accumulator[shop.name.toLowerCase()] = shop;
  return accumulator;
}, {});

const normalizeProduct = (item, seller, sellerType) => {
  const fallbackShop = sellerType === 'shop' ? localShopByName[seller.name?.toLowerCase?.()] : null;
  const fallback = fallbackShop?.products?.[0]?.image ?? getLocalRankedProducts()[0]?.product?.image;
  return {
    product: {
      id: String(item.id),
      title: item.title,
      image: imageSource(item.primaryImageUrl || item.imageUrls?.[0], fallback),
      category: item.category,
      price: formatPrice(item.price),
      stock: stockLabel(item.stockQuantity),
      description: item.description ?? 'Produit disponible avec vendeur joignable.',
      premium: Boolean(seller.premium),
      certified: Boolean(seller.certifiedByAp),
      raw: item,
    },
    seller,
    sellerType,
  };
};

const normalizeShop = (shop, products) => {
  const fallback = localShopByName[shop.name?.toLowerCase?.()] ?? localShops[0];
  const seller = {
    id: String(shop.id),
    name: shop.name,
    city: shop.city ?? fallback.city,
    accountType: 'professional',
    certifiedByAp: Boolean(shop.verified),
    premium: isPremiumShop(shop),
    visibilityRank: isPremiumShop(shop) ? 95 : shop.verified ? 86 : 72,
    speciality: shop.category ?? fallback.speciality,
    tagline: shop.description ?? fallback.tagline,
    cover: imageSource(shop.logoUrl, fallback.cover),
    products: [],
  };

  seller.products = products
    .filter((product) => product.shop?.id === shop.id)
    .map((product) => normalizeProduct(product, seller, 'shop').product);

  if (!seller.products.length) {
    seller.products = fallback.products;
  }

  return seller;
};

export const fetchMarketplace = async () => {
  const [shopsPayload, productsPayload] = await Promise.all([
    apiClient.get('/shops'),
    apiClient.get('/products?limit=100'),
  ]);
  const apiProducts = productsPayload?.data ?? [];
  const apiShops = Array.isArray(shopsPayload) ? shopsPayload : [];
  const shops = apiShops.map((shop) => normalizeShop(shop, apiProducts));
  const shopProductIds = new Set(shops.flatMap((shop) => shop.products.map((product) => product.id)));
  const independentProducts = apiProducts
    .filter((product) => !product.shop || !shopProductIds.has(String(product.id)))
    .map((product) =>
      normalizeProduct(
        product,
        {
          id: product.seller?.id,
          name: `${product.seller?.firstName ?? 'Vendeur'} ${product.seller?.lastName ?? ''}`.trim(),
          city: product.city ?? 'Camazones',
          certifiedByAp: false,
          premium: false,
        },
        'independent'
      )
    );

  return {
    shops: shops.length ? shops : localShops,
    rankedProducts: [
      ...shops.flatMap((shop) => shop.products.map((product) => ({ product, seller: shop, sellerType: 'shop' }))),
      ...independentProducts,
      ...independentSellers.flatMap((seller) => seller.products.map((product) => ({ product, seller, sellerType: 'independent' }))),
    ].sort((left, right) => Number(right.seller.premium) - Number(left.seller.premium)),
    syncedAt: new Date().toISOString(),
  };
};

export const useMarketplaceData = () => {
  const [state, setState] = useState({
    shops: localShops,
    rankedProducts: getLocalRankedProducts(),
    isLoading: true,
    isOffline: false,
    error: null,
  });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const netState = await NetInfo.fetch();
      const offline = netState.isConnected === false;

      try {
        if (offline) {
          throw new Error('offline');
        }
        const data = await fetchMarketplace();
        await storage.setItem(MARKETPLACE_CACHE_KEY, JSON.stringify(data));
        if (alive) {
          setState({ ...data, isLoading: false, isOffline: false, error: null });
        }
      } catch (error) {
        const cached = await storage.getItem(MARKETPLACE_CACHE_KEY);
        const data = cached ? JSON.parse(cached) : { shops: localShops, rankedProducts: getLocalRankedProducts() };
        if (alive) {
          setState({ ...data, isLoading: false, isOffline: true, error: offline ? null : 'API indisponible, cache local affiche.' });
        }
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return state;
};

export const useShopSearch = (shops, query) =>
  useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return shops;
    }
    return shops.filter((shop) => {
      const shopText = `${shop.name} ${shop.city} ${shop.speciality} ${shop.tagline}`.toLowerCase();
      const productText = shop.products
        .map((item) => `${item.title} ${item.category} ${item.description}`)
        .join(' ')
        .toLowerCase();
      return `${shopText} ${productText}`.includes(cleanQuery);
    });
  }, [shops, query]);
