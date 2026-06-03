import { useEffect, useMemo, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import apiClient from './apiClient';
import { getProductVisual, getShopVisuals } from '../data/visualAssets';

const NETINFO_TIMEOUT_MS = 1200;

const formatPrice = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
const imageSource = (url, fallback) => (url ? { uri: url } : fallback);
const stockLabel = (value) => (Number(value ?? 0) > 0 ? `${value} pieces` : 'En stock');
const isPremiumShop = (shop) => shop.subscriptionTier === 'PREMIUM' || shop.subscriptionTier === 'MONTHLY';

const parseStockQuantity = (value) => {
  const parsed = Number(String(value ?? '').replace(/[^0-9]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const normalizeProduct = (item, seller, sellerType) => {
  const fallback = getProductVisual({ title: item.title, category: item.category });
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
  const fallback = getShopVisuals(shop);
  const seller = {
    id: String(shop.id),
    name: shop.name,
    email: shop.owner?.email,
    city: shop.city ?? 'Camazones',
    accountType: 'professional',
    certifiedByAp: Boolean(shop.verified),
    premium: isPremiumShop(shop),
    visibilityRank: isPremiumShop(shop) ? 95 : shop.verified ? 86 : 72,
    speciality: shop.category ?? 'Boutique',
    tagline: shop.description ?? 'Boutique Camazones active.',
    logo: imageSource(shop.logoUrl, fallback.logo),
    cover: imageSource(shop.logoUrl, fallback.cover),
    products: [],
  };

  seller.products = products
    .filter((product) => product.shop?.id === shop.id)
    .map((product) => normalizeProduct(product, seller, 'shop').product);

  return seller;
};

const fetchMyShop = async () => {
  try {
    return await apiClient.get('/shops/mine');
  } catch (error) {
    return null;
  }
};

export const savePublishedProduct = async ({ payload }) => {
  const shop = await fetchMyShop();
  return apiClient.post('/products', {
    title: payload.title.trim(),
    description: payload.description.trim(),
    category: payload.category.trim(),
    price: Number(payload.price || 0),
    negotiable: true,
    stockQuantity: parseStockQuantity(payload.stock),
    city: payload.city?.trim() || 'Douala',
    primaryImageUrl: payload.imageUri ?? null,
    imageUrls: payload.imageUri ? [payload.imageUri] : [],
    shopId: shop?.id ?? null,
  });
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
          email: product.seller?.email,
          name: `${product.seller?.firstName ?? 'Vendeur'} ${product.seller?.lastName ?? ''}`.trim(),
          city: product.city ?? 'Camazones',
          certifiedByAp: false,
          premium: false,
        },
        'independent'
      )
    );

  return {
    shops,
    rankedProducts: [
      ...shops.flatMap((shop) => shop.products.map((product) => ({ product, seller: shop, sellerType: 'shop' }))),
      ...independentProducts,
    ].sort((left, right) => Number(right.seller.premium) - Number(left.seller.premium)),
    syncedAt: new Date().toISOString(),
  };
};

export const searchDatabaseProducts = async (query) => {
  const value = query?.trim?.();
  if (!value) {
    return [];
  }
  const params = new URLSearchParams({ search: value, limit: '30', page: '1' });
  const payload = await apiClient.get(`/products?${params.toString()}`);
  const items = payload?.data ?? [];
  return items.map((product) => {
    const seller = product.shop
      ? {
          id: product.shop.id,
          name: product.shop.name,
          email: product.seller?.email,
          city: product.city ?? 'Camazones',
          accountType: 'professional',
          certifiedByAp: Boolean(product.shop.verified),
          premium: isPremiumShop(product.shop),
        }
      : {
          id: product.seller?.id,
          email: product.seller?.email,
          name: `${product.seller?.firstName ?? 'Vendeur'} ${product.seller?.lastName ?? ''}`.trim(),
          city: product.city ?? 'Camazones',
          certifiedByAp: false,
          premium: false,
        };
    return normalizeProduct(product, seller, product.shop ? 'shop' : 'independent');
  });
};

export const useMarketplaceData = () => {
  const [state, setState] = useState({
    shops: [],
    rankedProducts: [],
    isLoading: true,
    isOffline: false,
    error: null,
  });

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const netState = await Promise.race([
        NetInfo.fetch(),
        new Promise((resolve) => setTimeout(() => resolve({ isConnected: true }), NETINFO_TIMEOUT_MS)),
      ]);
      const offline = netState.isConnected === false;

      try {
        if (offline) {
          throw new Error('offline');
        }
        const data = await fetchMarketplace();
        if (alive) {
          setState({ ...data, isLoading: false, isOffline: false, error: null });
        }
      } catch (error) {
        if (alive) {
          setState({ shops: [], rankedProducts: [], isLoading: false, isOffline: true, error: offline ? null : 'API WAMP indisponible.' });
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
