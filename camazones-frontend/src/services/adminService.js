import apiClient from './apiClient';
import { getRankedProducts, shops } from '../data/marketplace';

const parsePrice = (value) => Number(String(value ?? '0').replace(/[^0-9]/g, '')) || 0;
const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

export const fetchAdminDashboard = async () => apiClient.get('/admin/dashboard');

export const blockAdminUser = async (id) => apiClient.patch(`/admin/users/${id}/block`);
export const unblockAdminUser = async (id) => apiClient.patch(`/admin/users/${id}/unblock`);
export const blockAdminShop = async (id) => apiClient.patch(`/admin/shops/${id}/block`);
export const unblockAdminShop = async (id) => apiClient.patch(`/admin/shops/${id}/unblock`);
export const blockAdminProduct = async (id) => apiClient.patch(`/admin/products/${id}/block`);
export const unblockAdminProduct = async (id) => apiClient.patch(`/admin/products/${id}/unblock`);

export const createFallbackAdminDashboard = () => {
  const rankedProducts = getRankedProducts();
  const users = [
    {
      id: 'demo-admin',
      email: 'admin@camazones.demo',
      firstName: 'Admin',
      lastName: 'Camazones',
      phone: '+237600000000',
      role: 'ADMIN',
      verified: true,
      blocked: false,
      city: 'Douala',
    },
    ...shops.map((shop) => ({
      id: `owner-${shop.id}`,
      email: `${shop.id}@camazones.demo`,
      firstName: shop.name.split(' ')[0],
      lastName: shop.name.split(' ').slice(1).join(' ') || 'Store',
      phone: '+237600000100',
      role: 'SELLER',
      verified: shop.certifiedByAp,
      blocked: false,
      city: shop.city,
    })),
  ];

  const products = rankedProducts.map(({ product, seller }) => ({
    id: product.id,
    title: product.title,
    category: product.category,
    price: parsePrice(product.price),
    status: 'ACTIVE',
    blocked: false,
    sellerName: seller.name,
    sellerEmail: `${seller.id}@camazones.demo`,
    shopName: seller.accountType === 'professional' ? seller.name : null,
  }));

  const weeklyCommissions = rankedProducts.slice(0, 10).map(({ product, seller }, index) => {
    const grossAmount = parsePrice(product.price) * (1 + (index % 3));
    const commissionRate = 0.10;
    return {
      id: `commission-${product.id}`,
      orderReference: `CMZ-WEEK-${String(index + 1).padStart(4, '0')}`,
      sellerName: seller.name,
      shopName: seller.accountType === 'professional' ? seller.name : 'Vendeur independant',
      productTitle: product.title,
      grossAmount,
      commissionRate,
      commissionAmount: Math.round(grossAmount * commissionRate),
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
    };
  });

  const totalGross = weeklyCommissions.reduce((sum, item) => sum + item.grossAmount, 0);
  const totalCommission = weeklyCommissions.reduce((sum, item) => sum + item.commissionAmount, 0);

  return {
    users,
    shops: shops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      city: shop.city,
      category: shop.speciality,
      verified: shop.certifiedByAp,
      blocked: false,
      subscriptionTier: shop.premium ? 'PREMIUM' : 'FREE',
      ownerName: shop.name,
      ownerEmail: `${shop.id}@camazones.demo`,
    })),
    products,
    weeklyCommissions,
    summary: {
      totalGross,
      totalCommission,
      count: weeklyCommissions.length,
      weekStart: new Date().toISOString(),
      weekEnd: new Date().toISOString(),
    },
    isFallback: true,
  };
};

export const formatAdminMoney = money;
