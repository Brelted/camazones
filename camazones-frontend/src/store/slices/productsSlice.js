import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchStart: (state) => { state.isLoading = true; },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    },
    fetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure } = productsSlice.actions;
export default productsSlice.reducer;
