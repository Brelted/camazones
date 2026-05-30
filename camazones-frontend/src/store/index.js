import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import walletReducer from './slices/walletSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    wallet: walletReducer,
    settings: settingsReducer,
  },
});

export default store;
