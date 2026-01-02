import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryService from '../services/categoryService';

/**
 * @typedef {Object} Category
 * @property {string} id - Unique identifier
 * @property {string} name - Category name
 * @property {string} color - Category color (hex code)
 */

/**
 * @typedef {Object} CategoriesState
 * @property {Category[]} items - Array of categories
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string|null} error - Error message if any
 */

/** @type {CategoriesState} */
const initialState = {
  items: [
    {
      id: '1',
      name: 'Work',
      color: '#1976d2',
    },
    {
      id: '2',
      name: 'Personal',
      color: '#4caf50',
    },
    {
      id: '3',
      name: 'Shopping',
      color: '#ff9800',
    },
    {
      id: '4',
      name: 'Health',
      color: '#f44336',
    },
  ],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update category'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete category'
      );
    }
  }
);

// Slice
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addCategory: (state, action) => {
      state.items.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.items = state.items.filter(
        (category) => category.id !== action.payload
      );
    },
    updateCategoryState: (state, action) => {
      const index = state.items.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
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
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCategoryById = (state, categoryId) =>
  state.categories.items.find((category) => category.id === categoryId);

export const selectCategoryByName = (state, categoryName) =>
  state.categories.items.find(
    (category) => category.name.toLowerCase() === categoryName.toLowerCase()
  );

export const selectCategoryColors = (state) =>
  state.categories.items.reduce((acc, category) => {
    acc[category.id] = category.color;
    return acc;
  }, {});

// Actions
export const { clearError, addCategory, removeCategory, updateCategoryState } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;
