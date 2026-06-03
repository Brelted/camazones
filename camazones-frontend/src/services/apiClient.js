import axios from 'axios';
import { API_BASE_URL, AUTH_STORAGE_KEY } from './apiConfig';
import { storage } from './storage';

let getAuthToken = () => null;
let onUnauthorized = async () => {};

export const configureApiClientAuth = ({ getToken, handleUnauthorized } = {}) => {
  getAuthToken = typeof getToken === 'function' ? getToken : () => null;
  onUnauthorized = typeof handleUnauthorized === 'function' ? handleUnauthorized : async () => {};
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 7000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem(AUTH_STORAGE_KEY);
      await onUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
