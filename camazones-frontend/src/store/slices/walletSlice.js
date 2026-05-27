import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    fetchStart: (state) => { state.isLoading = true; },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
    },
    fetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = walletSlice.actions;
export default walletSlice.reducer;
