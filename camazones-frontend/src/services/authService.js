import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
});

export const profileRequest = async (token) => {
  const response = await authClient.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const loginRequest = async (payload) => {
  const response = await authClient.post('/auth/login', payload);
  return response.data;
};

export const registerRequest = async (payload) => {
  const response = await authClient.post('/auth/register', payload);
  return response.data;
};

export const deleteAccountRequest = async (token) => {
  const response = await authClient.delete('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
