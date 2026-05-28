import axios from 'axios';
import store from '../store';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL, AUTH_STORAGE_KEY } from './apiConfig';
import { storage } from './storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

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
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default apiClient;
