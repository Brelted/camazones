import axios from 'axios';
import { API_BASE_URL, USE_DEMO_AUTH } from './apiConfig';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
});

export const demoAccounts = [
  {
    email: 'admin@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-admin',
      email: 'admin@camazones.demo',
      firstName: 'Admin',
      lastName: 'Camazones',
      phone: '+237600000000',
      role: 'ADMIN',
    },
  },
  {
    email: 'alan.independant@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-alan-independant',
      email: 'alan.independant@camazones.demo',
      firstName: 'Alan',
      lastName: 'Independant',
      phone: '+237600000301',
      role: 'SELLER',
    },
  },
  {
    email: 'sony@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-sony-store',
      email: 'sony@camazones.demo',
      firstName: 'Sony',
      lastName: 'Boutique',
      phone: '+237600000302',
      role: 'SELLER',
    },
  },
  {
    email: 'client@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-client',
      email: 'client@camazones.demo',
      firstName: 'Client',
      lastName: 'Demo',
      phone: '+237600000001',
      role: 'CLIENT_INDEPENDANT',
    },
  },
  {
    email: 'boutique@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-boutique',
      email: 'boutique@camazones.demo',
      firstName: 'Boutique',
      lastName: 'Demo',
      phone: '+237600000002',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'premium@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'demo-premium',
      email: 'premium@camazones.demo',
      firstName: 'Premium',
      lastName: 'Demo',
      phone: '+237600000003',
      role: 'PREMIUM',
    },
  },
];

const createDemoToken = (email) => `demo-jwt-${email.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}`;

const createDemoPayload = (user) => ({
  token: createDemoToken(user.email),
  user,
});

const shouldUseDemoFallback = (error) =>
  USE_DEMO_AUTH && (!error.response || [404, 405, 501].includes(error.response?.status) || error.message === 'Network Error');

export const loginRequest = async (payload) => {
  try {
    const response = await authClient.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (!shouldUseDemoFallback(error)) {
      throw error;
    }

    const account = demoAccounts.find(
      (item) => item.email.toLowerCase() === payload.email?.toLowerCase() && item.password === payload.password
    );

    if (!account) {
      throw new Error('Compte demo introuvable.');
    }

    return createDemoPayload(account.user);
  }
};

export const registerRequest = async (payload) => {
  try {
    const response = await authClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    if (!shouldUseDemoFallback(error)) {
      throw error;
    }

    return createDemoPayload({
      id: `demo-register-${Date.now()}`,
      email: payload.email,
      role: 'CLIENT_INDEPENDANT',
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    });
  }
};
