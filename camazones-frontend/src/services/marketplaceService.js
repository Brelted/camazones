import { useEffect, useMemo, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import apiClient from './apiClient';
import { storage } from './storage';
import {
  getRankedProducts as getLocalRankedProducts,
  independentSellers,
  shopAccountMap,
  shops as localShops,
} from '../data/marketplace';

const MARKETPLACE_CACHE_KEY = '@camazones/marketplace-cache';
const MARKETPLACE_PUBLISHED_KEY = '@camazones/published-products';
const NETINFO_TIMEOUT_MS = 1200;

const formatPrice = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;
const imageSource = (url, fallback) => (url ? { uri: url } : fallback);
const stockLabel = (value) => (Number(value ?? 0) > 0 ? `${value} pieces` : 'En stock');
const isPremiumShop = (shop) => shop.subscriptionTier === 'PREMIUM' || shop.subscriptionTier === 'MONTHLY';

const localShopByName = localShops.reduce((accumulator, shop) => {
  accumulator[shop.name.toLowerCase()] = shop;
  return accumulator;
}, {});

const localShopById = localShops.reduce((accumulator, shop) => {
  accumulator[shop.id] = shop;
  return accumulator;
}, {});

export const getShopIdForEmail = (email) => shopAccountMap[email?.toLowerCase?.()] ?? null;

const createShortId = (prefix = 'PRD') => `${prefix}${Date.now().toString(36).toUpperCase()}`.replace(/[^A-Z0-9]/g, '').slice(0, 8).padEnd(8, '0');

const fallbackImageFor = (category, shopId) => {
  const shop = localShopById[shopId];
  const productPool = shop?.products?.length ? shop.products : getLocalRankedProducts().map((item) => item.product);
  const normalizedCategory = category?.toLowerCase?.() ?? '';
  return productPool.find((item) => item.category?.toLowerCase?.() === normalizedCategory)?.image ?? productPool[0]?.image;
};

const loadPublishedProducts = async () => {
  try {
    const serialized = await storage.getItem(MARKETPLACE_PUBLISHED_KEY);
    return serialized ? JSON.parse(serialized) : [];
  } catch (error) {
    return [];
  }
};

const persistPublishedProducts = async (products) => {
  await storage.setItem(MARKETPLACE_PUBLISHED_KEY, JSON.stringify(products.slice(0, 80)));
};

export const savePublishedProduct = async ({ user, payload }) => {
  const email = user?.email ?? 'client@camazones.demo';
  const shopId = getShopIdForEmail(email);
  const record = {
    id: createShortId('PRD'),
    title: payload.title.trim(),
    category: payload.category.trim(),
    price: `${Number(payload.price || 0).toLocaleString('fr-FR')} FCFA`,
    stock: payload.stock?.trim() || 'En stock',
    description: payload.description.trim(),
    sellerEmail: email,
    sellerName: `${user?.firstName ?? 'Client'} ${user?.lastName ?? 'Camazones'}`.trim(),
    city: payload.city?.trim() || 'Douala',
    shopId,
    createdAt: new Date().toISOString(),
  };
  const current = await loadPublishedProducts();
  await persistPublishedProducts([record, ...current]);
  return record;
};

const mergePublishedProducts = (data, publishedProducts) => {
  if (!publishedProducts.length) {
    return data;
  }

  const publishedIds = new Set(publishedProducts.map((item) => item.id));
  const nextShops = data.shops.map((shop) => ({
    ...shop,
    products: shop.products.filter((product) => !publishedIds.has(product.id)),
  }));
  const nextShopById = nextShops.reduce((accumulator, shop) => {
    accumulator[shop.id] = shop;
    return accumulator;
  }, {});
  const nextRankedProducts = data.rankedProducts.filter(({ product }) => !publishedIds.has(product.id));

  publishedProducts.forEach((record) => {
    const product = {
      id: record.id,
      title: record.title,
      image: fallbackImageFor(record.category, record.shopId),
      category: record.category,
      price: record.price,
      stock: record.stock,
      description: record.description,
      premium: false,
      certified: false,
      local: true,
    };

    if (record.shopId && nextShopById[record.shopId]) {
      nextShopById[record.shopId].products = [product, ...nextShopById[record.shopId].products];
      nextRankedProducts.push({ product, seller: nextShopById[record.shopId], sellerType: 'shop' });
      return;
    }

    const seller = {
      id: record.sellerEmail,
      name: record.sellerName,
      city: record.city,
      email: record.sellerEmail,
      accountType: 'independent',
      certifiedByAp: false,
      premium: false,
    };
    nextRankedProducts.push({ product, seller, sellerType: 'independent' });
  });

  return {
    ...data,
    shops: nextShops,
    rankedProducts: nextRankedProducts.sort((left, right) => Number(right.seller.premium) - Number(left.seller.premium)),
  };
};

const normalizeProduct = (item, seller, sellerType) => {
  const fallbackShop = sellerType === 'shop' ? localShopByName[seller.name?.toLowerCase?.()] : null;
  const fallbackProduct =
    fallbackShop?.products?.find((product) => product.title?.toLowerCase?.() === item.title?.toLowerCase?.()) ??
    fallbackShop?.products?.find((product) => product.category?.toLowerCase?.() === item.category?.toLowerCase?.()) ??
    fallbackShop?.products?.[0];
  const fallback = fallbackProduct?.image ?? getLocalRankedProducts()[0]?.product?.image;
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
    logo: imageSource(shop.logoUrl, fallback.logo ?? fallback.cover),
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
      const netState = await Promise.race([
        NetInfo.fetch(),
        new Promise((resolve) => setTimeout(() => resolve({ isConnected: true }), NETINFO_TIMEOUT_MS)),
      ]);
      const offline = netState.isConnected === false;

      try {
        if (offline) {
          throw new Error('offline');
        }
        const baseData = await fetchMarketplace();
        await storage.setItem(MARKETPLACE_CACHE_KEY, JSON.stringify(baseData));
        const data = mergePublishedProducts(baseData, await loadPublishedProducts());
        if (alive) {
          setState({ ...data, isLoading: false, isOffline: false, error: null });
        }
      } catch (error) {
        const cached = await storage.getItem(MARKETPLACE_CACHE_KEY);
        const baseData = cached ? JSON.parse(cached) : { shops: localShops, rankedProducts: getLocalRankedProducts() };
        const data = mergePublishedProducts(baseData, await loadPublishedProducts());
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
