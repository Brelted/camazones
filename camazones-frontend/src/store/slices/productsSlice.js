import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/apiClient';

// ── Thunks (appels API) ───────────────────────────────────────────────────────

/** GET /products avec filtres et pagination */
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

/** GET /products/:id */
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

/** POST /products */
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

/** DELETE /products/:id */
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

/** GET /shops/:id/products */
export const fetchShopProducts = createAsyncThunk(
  'products/fetchShop',
  async ({ shopId, page = 1 }, { rejectWithValue }) => {
    try {
      return await apiClient.get(`/shops/${shopId}/products?page=${page}`);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Erreur chargement boutique');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  // Liste principale
  products:     [],
  total:        0,
  currentPage:  1,
  totalPages:   1,

  // Filtres actifs
  filters: { category: null, city: null, search: null },

  // Détail d'un produit
  selectedProduct: null,

  // États de chargement
  isLoading:       false,
  isLoadingMore:   false,
  isCreating:      false,

  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters    = { ...state.filters, ...action.payload };
      state.products   = [];  // Reset la liste quand les filtres changent
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters    = { category: null, city: null, search: null };
      state.products   = [];
      state.currentPage = 1;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchProducts ──────────────────────────────────────────
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const isFirstPage = action.meta.arg?.page === 1 || !action.meta.arg?.page;
        if (isFirstPage) {
          state.isLoading  = true;
          state.products   = [];
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { data, total, page, totalPages } = action.payload;
        if (page === 1) {
          state.products = data;
        } else {
          state.products = [...state.products, ...data]; // Append pour "load more"
        }
        state.total        = total;
        state.currentPage  = page;
        state.totalPages   = totalPages;
        state.isLoading    = false;
        state.isLoadingMore = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading    = false;
        state.isLoadingMore = false;
        state.error        = action.payload;
      });

    // ── fetchProductById ───────────────────────────────────────
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading      = true;
        state.selectedProduct = null;
        state.error          = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading      = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── createProduct ──────────────────────────────────────────
    builder
      .addCase(createProduct.pending,   (state) => { state.isCreating = true; state.error = null; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products   = [action.payload, ...state.products];
      })
      .addCase(createProduct.rejected,  (state, action) => {
        state.isCreating = false;
        state.error      = action.payload;
      });

    // ── deleteProduct ──────────────────────────────────────────
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;
