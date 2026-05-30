import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';

const WALLET_STORAGE_KEY = '@camazones/wallet';

const initialState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  lastInvoice: null,
};

const persist = async (wallet) => {
  await storage.setItem(
    WALLET_STORAGE_KEY,
    JSON.stringify({
      balance: wallet.balance,
      transactions: wallet.transactions,
      lastInvoice: wallet.lastInvoice,
    })
  );
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    walletRestored: (state, action) => {
      state.balance = action.payload.balance ?? 0;
      state.transactions = action.payload.transactions ?? [];
      state.lastInvoice = action.payload.lastInvoice ?? null;
    },
    rechargeAdded: (state, action) => {
      const amount = action.payload.amount;
      state.balance += amount;
      state.transactions = [
        { id: `${Date.now()}`, type: 'recharge', amount, label: action.payload.label, at: new Date().toISOString() },
        ...state.transactions,
      ].slice(0, 20);
    },
    paymentAdded: (state, action) => {
      const amount = action.payload.amount;
      if (action.payload.fromWallet) {
        state.balance = Math.max(0, state.balance - amount);
      }
      state.transactions = [
        { id: `${Date.now()}`, type: 'payment', amount: -amount, label: action.payload.label, at: new Date().toISOString() },
        ...state.transactions,
      ].slice(0, 20);
      state.lastInvoice = action.payload.invoice;
    },
    invoiceSaved: (state, action) => {
      state.lastInvoice = action.payload;
    },
  },
});

export const restoreWallet = () => async (dispatch) => {
  const serialized = await storage.getItem(WALLET_STORAGE_KEY);
  if (serialized) {
    dispatch(walletRestored(JSON.parse(serialized)));
  }
};

export const rechargeWallet = ({ amount, label }) => async (dispatch, getState) => {
  dispatch(rechargeAdded({ amount, label }));
  await persist(getState().wallet);
};

export const payOrder = ({ amount, label, fromWallet, invoice }) => async (dispatch, getState) => {
  dispatch(paymentAdded({ amount, label, fromWallet, invoice }));
  await persist(getState().wallet);
};

export const saveInvoice = (invoice) => async (dispatch, getState) => {
  dispatch(invoiceSaved(invoice));
  await persist(getState().wallet);
};

export const { walletRestored, rechargeAdded, paymentAdded, invoiceSaved } = walletSlice.actions;
export default walletSlice.reducer;
