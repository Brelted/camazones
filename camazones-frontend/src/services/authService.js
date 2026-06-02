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
      id: 'ADM00001',
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
      id: 'ALAN0001',
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
      id: 'SONY0001',
      email: 'sony@camazones.demo',
      firstName: 'Sony',
      lastName: 'Boutique',
      phone: '+237600000302',
      role: 'SELLER',
    },
  },
  {
    email: 'atelier.koa@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'KOA00001',
      email: 'atelier.koa@camazones.demo',
      firstName: 'Atelier',
      lastName: 'Koa',
      phone: '+237600000101',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'talia.closet@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'TALIA001',
      email: 'talia.closet@camazones.demo',
      firstName: 'Talia',
      lastName: 'Closet',
      phone: '+237600000102',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'studio.noma@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'NOMA0001',
      email: 'studio.noma@camazones.demo',
      firstName: 'Studio',
      lastName: 'Noma',
      phone: '+237600000103',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'sawa.deals@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'SAWA0001',
      email: 'sawa.deals@camazones.demo',
      firstName: 'Sawa',
      lastName: 'Deals',
      phone: '+237600000104',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'bijoux.mboa@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'BIJOUX01',
      email: 'bijoux.mboa@camazones.demo',
      firstName: 'Bijoux',
      lastName: 'Mboa',
      phone: '+237600000105',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'maison.oud@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'OUD00001',
      email: 'maison.oud@camazones.demo',
      firstName: 'Maison',
      lastName: 'Oud',
      phone: '+237600000106',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'cuisine.sika@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'SIKA0001',
      email: 'cuisine.sika@camazones.demo',
      firstName: 'Cuisine',
      lastName: 'Sika',
      phone: '+237600000107',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'vision.home@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'VISION01',
      email: 'vision.home@camazones.demo',
      firstName: 'Vision',
      lastName: 'Home',
      phone: '+237600000108',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'mboa.kids@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'KIDS0001',
      email: 'mboa.kids@camazones.demo',
      firstName: 'Mboa',
      lastName: 'Kids',
      phone: '+237600000109',
      role: 'BOUTIQUE_PRO',
    },
  },
  {
    email: 'mila@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'MILA0001',
      email: 'mila@camazones.demo',
      firstName: 'Mila',
      lastName: 'Select',
      phone: '+237600000201',
      role: 'SELLER',
    },
  },
  {
    email: 'client@camazones.demo',
    password: 'Camazones2026!',
    user: {
      id: 'CLNT0001',
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
      id: 'BOUT0001',
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
      id: 'PREM0001',
      email: 'premium@camazones.demo',
      firstName: 'Premium',
      lastName: 'Demo',
      phone: '+237600000003',
      role: 'PREMIUM',
    },
  },
];

const createShortId = (prefix = 'USR') => `${prefix}${Date.now().toString(36).toUpperCase()}`.replace(/[^A-Z0-9]/g, '').slice(0, 8).padEnd(8, '0');
const createDemoToken = (email) => `demo-jwt-${email.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}`;

const createDemoPayload = (user) => ({
  token: createDemoToken(user.email),
  user,
  demo: true,
});

const shouldUseDemoFallback = (error) =>
  USE_DEMO_AUTH && (!error.response || [404, 405, 501].includes(error.response?.status) || error.message === 'Network Error');

const shouldUseDemoLoginFallback = (error, payload) => {
  const knownDemoEmail = demoAccounts.some((item) => item.email.toLowerCase() === payload.email?.toLowerCase());
  const demoFriendlyStatus = !error.response || [401, 403, 404, 405, 501].includes(error.response?.status) || error.message === 'Network Error';
  return demoFriendlyStatus && (USE_DEMO_AUTH || knownDemoEmail);
};

export const loginRequest = async (payload) => {
  try {
    const response = await authClient.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (!shouldUseDemoLoginFallback(error, payload)) {
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
      id: createShortId('USR'),
      email: payload.email,
      role: 'CLIENT_INDEPENDANT',
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    });
  }
};
