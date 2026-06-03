import apiClient from './apiClient';

export const sendPurchaseReceiptEmail = async (payload) => {
  try {
    const response = await apiClient.post('/notifications/purchase-receipt', payload);
    return Boolean(response?.sent);
  } catch (error) {
    return false;
  }
};

export const sendWelcomeEmail = async (payload) => {
  try {
    const response = await apiClient.post('/notifications/welcome', payload);
    return Boolean(response?.sent);
  } catch (error) {
    return false;
  }
};
