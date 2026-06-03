import { createSlice } from '@reduxjs/toolkit';
import { AUTH_STORAGE_KEY } from '../../services/apiConfig';
import { deleteAccountRequest, loginRequest, profileRequest, registerRequest } from '../../services/authService';
import { storage } from '../../services/storage';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isBootstrapping: true,
  error: null,
};

const normalizeAuthPayload = (payload) => {
  const data = payload?.data ?? payload ?? {};
  const token = data.token ?? null;
  const user = data.user ?? (
    data.id || data.email
      ? {
          id: data.id ?? null,
          email: data.email ?? null,
          role: data.role ?? null,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          phone: data.phone ?? null,
        }
      : null
  );

  return { token, user };
};

const getErrorMessage = (error) => {
  if (error?.message === 'Network Error' || error?.code === 'ECONNABORTED') {
    return 'Connexion backend impossible. Verifiez que le backend tourne sur le PC et que le telephone est sur le meme Wi-Fi.';
  }

  return error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Authentication failed';
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.isBootstrapping = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = Boolean(action.payload.token);
      state.error = null;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    authBootstrapComplete: (state) => {
      state.isBootstrapping = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isBootstrapping = false;
      state.error = null;
    },
  },
});

export const restoreAuth = () => async (dispatch) => {
  try {
    const serializedAuth = await storage.getItem(AUTH_STORAGE_KEY);

    if (serializedAuth) {
      const parsedAuth = JSON.parse(serializedAuth);
      if (!parsedAuth?.token || parsedAuth.token.startsWith('demo-jwt-')) {
        await storage.removeItem(AUTH_STORAGE_KEY);
        dispatch(clearAuth());
        return;
      }

      const profile = await profileRequest(parsedAuth.token);
      dispatch(authSuccess({ token: parsedAuth.token, user: profile }));
      return;
    }

    dispatch(authBootstrapComplete());
  } catch (error) {
    await storage.removeItem(AUTH_STORAGE_KEY);
    dispatch(clearAuth());
  }
};

export const validateSession = () => async (dispatch, getState) => {
  const token = getState().auth.token;
  if (!token) {
    return null;
  }

  try {
    const profile = await profileRequest(token);
    dispatch(authSuccess({ token, user: profile }));
    return profile;
  } catch (error) {
    await storage.removeItem(AUTH_STORAGE_KEY);
    dispatch(clearAuth());
    return null;
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch(authStart());

  try {
    const response = await loginRequest(credentials);
    const authData = normalizeAuthPayload(response);

    if (!authData.token) {
      throw new Error('Missing token in login response');
    }

    await storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    dispatch(authSuccess(authData));
    return authData;
  } catch (error) {
    dispatch(authFailure(getErrorMessage(error)));
    throw error;
  }
};

export const register = (credentials) => async (dispatch) => {
  dispatch(authStart());

  try {
    const response = await registerRequest(credentials);
    const authData = normalizeAuthPayload(response);

    if (!authData.token) {
      throw new Error('Missing token in register response');
    }

    await storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    dispatch(authSuccess(authData));
    return authData;
  } catch (error) {
    dispatch(authFailure(getErrorMessage(error)));
    throw error;
  }
};

export const logout = () => async (dispatch) => {
  await storage.removeItem(AUTH_STORAGE_KEY);
  dispatch(clearAuth());
};

export const deleteAccount = () => async (dispatch, getState) => {
  dispatch(authStart());

  try {
    const token = getState().auth.token;
    if (!token) {
      throw new Error('Session introuvable.');
    }
    await deleteAccountRequest(token);
    await storage.removeItem(AUTH_STORAGE_KEY);
    dispatch(clearAuth());
  } catch (error) {
    dispatch(authFailure(getErrorMessage(error)));
    throw error;
  }
};

export const { authStart, authSuccess, authFailure, authBootstrapComplete, clearAuth } = authSlice.actions;

export default authSlice.reducer;
