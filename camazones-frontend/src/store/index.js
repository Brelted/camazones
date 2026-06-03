import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import walletReducer from './slices/walletSlice';
import settingsReducer from './slices/settingsSlice';
import { logout } from './slices/authSlice';
import { configureApiClientAuth } from '../services/apiClient';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    wallet: walletReducer,
    settings: settingsReducer,
  },
});

configureApiClientAuth({
  getToken: () => store.getState().auth.token,
  handleUnauthorized: () => store.dispatch(logout()),
});

export default store;
