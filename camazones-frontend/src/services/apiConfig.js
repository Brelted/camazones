import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_PORT = '8080';
const API_PATH = '/api';

const cleanUrl = (value) => value?.trim()?.replace(/\/+$/, '');

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.manifest?.hostUri ||
    '';

  return hostUri.split(':')[0];
};

const getDefaultApiBaseUrl = () => {
  const expoHost = getExpoHost();

  if (expoHost && expoHost !== 'localhost' && expoHost !== '127.0.0.1') {
    return `http://${expoHost}:${API_PORT}${API_PATH}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}${API_PATH}`;
  }

  return `http://localhost:${API_PORT}${API_PATH}`;
};

export const API_BASE_URL = cleanUrl(process.env.EXPO_PUBLIC_API_BASE_URL) || getDefaultApiBaseUrl();
export const USE_DEMO_AUTH = process.env.EXPO_PUBLIC_USE_DEMO_AUTH === 'true';
export const AUTH_STORAGE_KEY = '@camazones/auth';
