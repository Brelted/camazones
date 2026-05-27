import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, city, search, page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (city)     params.append('city', city);
      if (search)   params.append('search', search);
      params.append('page', page);
      params.append('limit', limit);
      return await apiClient.get(`/products?${params.toString()}`);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur chargement produits');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchOne',
  async (productId, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/products/${productId}`);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Produit introuvable');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      return await apiClient.post('/products', productData);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur création produit');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur suppression');
    }
  }
);

export const fetchShopProducts = createAsyncThunk(
  'products/fetchShop',
  async ({ shopId, page = 1 }, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/shops/${shopId}/products?page=${page}`);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur boutique');
    }
  }
);

const initialState = {
  products: [], total: 0, currentPage: 1, totalPages: 1,
  filters: { category: null, city: null, search: null },
  selectedProduct: null,
  isLoading: false, isLoadingMore: false, isCreating: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters:           (state, action) => { state.filters = { ...state.filters, ...action.payload }; state.products = []; state.currentPage = 1; },
    clearFilters:         (state)         => { state.filters = { category: null, city: null, search: null }; state.products = []; state.currentPage = 1; },
    clearSelectedProduct: (state)         => { state.selectedProduct = null; },
    clearError:           (state)         => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const first = (action.meta.arg?.page ?? 1) === 1;
        if (first) { state.isLoading = true; state.products = []; } else { state.isLoadingMore = true; }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data = [], total = 0, page = 1, totalPages = 1 } = action.payload ?? {};
        state.products = page === 1 ? data : [...state.products, ...data];
        state.total = total; state.currentPage = page; state.totalPages = totalPages;
        state.isLoading = false; state.isLoadingMore = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.isLoading = false; state.isLoadingMore = false; state.error = action.payload; });
    builder
      .addCase(fetchProductById.pending,   (state)         => { state.isLoading = true; state.selectedProduct = null; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.isLoading = false; state.selectedProduct = action.payload; })
      .addCase(fetchProductById.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload; });
    builder
      .addCase(createProduct.pending,   (state)         => { state.isCreating = true; state.error = null; })
      .addCase(createProduct.fulfilled, (state, action) => { state.isCreating = false; state.products = [action.payload, ...state.products]; })
      .addCase(createProduct.rejected,  (state, action) => { state.isCreating = false; state.error = action.payload; });
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => { state.products = state.products.filter((p) => p.id !== action.payload); });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
