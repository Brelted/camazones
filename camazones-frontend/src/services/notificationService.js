import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const notificationClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4500,
});

export const sendPurchaseReceiptEmail = async (payload) => {
  try {
    await notificationClient.post('/notifications/purchase-receipt', payload);
    return true;
  } catch (error) {
    return false;
  }
};

export const sendWelcomeEmail = async (payload) => {
  try {
    await notificationClient.post('/notifications/welcome', payload);
    return true;
  } catch (error) {
    return false;
  }
};
