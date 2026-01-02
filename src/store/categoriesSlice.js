import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier for the category
 * @property {string} name - Category name
 * @property {string} color - Category color (hex code)
 */

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Work', color: '#3b82f6' },
  { id: 'cat-2', name: 'Personal', color: '#10b981' },
  { id: 'cat-3', name: 'Shopping', color: '#f59e0b' },
  { id: 'cat-4', name: 'Health', color: '#ef4444' },
  { id: 'cat-5', name: 'Finance', color: '#8b5cf6' },
  { id: 'cat-6', name: 'Learning', color: '#ec4899' },
];

// Async thunks for API interactions (placeholder for future implementation)
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.get('/api/categories');
      // return response.data;
      
      // For now, return default categories
      return DEFAULT_CATEGORIES;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.post('/api/categories', categoryData);
      // return response.data;
      
      const newCategory = {
        id: `cat-${Date.now()}`,
        ...categoryData,
      };
      return newCategory;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.put(`/api/categories/${id}`, updates);
      // return response.data;
      
      return {
        id,
        ...updates,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // await api.delete(`/api/categories/${id}`);
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  /** @type {Category[]} */
  items: DEFAULT_CATEGORIES,
  /** @type {boolean} */
  isLoading: false,
  /** @type {string | null} */
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local storage helpers
    loadCategoriesFromStorage: (state) => {
      try {
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
          state.items = JSON.parse(storedCategories);
        }
      } catch (error) {
        console.error('Failed to load categories from storage:', error);
      }
    },
    // Synchronous category actions (for optimistic updates)
    addCategoryOptimistic: (state, action) => {
      state.items.push(action.payload);
    },
    updateCategoryOptimistic: (state, action) => {
      const index = state.items.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeCategoryOptimistic: (state, action) => {
      state.items = state.items.filter(
        (category) => category.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        // Save to local storage
        localStorage.setItem('categories', JSON.stringify(action.payload));
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
        // Save to local storage
        localStorage.setItem('categories', JSON.stringify(state.items));
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create category';
      });

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (category) => category.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        // Save to local storage
        localStorage.setItem('categories', JSON.stringify(state.items));
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update category';
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (category) => category.id !== action.payload
        );
        // Save to local storage
        localStorage.setItem('categories', JSON.stringify(state.items));
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete category';
      });
  },
});

// Selectors
export const selectAllCategories = (state) => state.categories.items;
export const selectCategoryById = (state, categoryId) =>
  state.categories.items.find((category) => category.id === categoryId);
export const selectCategoriesLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;

// Helper selector to get category name by ID
export const selectCategoryNameById = (state, categoryId) => {
  const category = state.categories.items.find(
    (cat) => cat.id === categoryId
  );
  return category ? category.name : 'Uncategorized';
};

// Helper selector to get category color by ID
export const selectCategoryColorById = (state, categoryId) => {
  const category = state.categories.items.find(
    (cat) => cat.id === categoryId
  );
  return category ? category.color : '#6b7280';
};

export const {
  clearError,
  loadCategoriesFromStorage,
  addCategoryOptimistic,
  updateCategoryOptimistic,
  removeCategoryOptimistic,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
