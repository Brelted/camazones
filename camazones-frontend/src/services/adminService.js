import apiClient from './apiClient';

const money = (value) => `${Number(value ?? 0).toLocaleString('fr-FR')} FCFA`;

export const fetchAdminDashboard = async () => apiClient.get('/admin/dashboard');

export const blockAdminUser = async (id) => apiClient.patch(`/admin/users/${id}/block`);
export const unblockAdminUser = async (id) => apiClient.patch(`/admin/users/${id}/unblock`);
export const deleteAdminUser = async (id) => apiClient.delete(`/admin/users/${id}`);
export const blockAdminShop = async (id) => apiClient.patch(`/admin/shops/${id}/block`);
export const unblockAdminShop = async (id) => apiClient.patch(`/admin/shops/${id}/unblock`);
export const blockAdminProduct = async (id) => apiClient.patch(`/admin/products/${id}/block`);
export const unblockAdminProduct = async (id) => apiClient.patch(`/admin/products/${id}/unblock`);

export const formatAdminMoney = money;
