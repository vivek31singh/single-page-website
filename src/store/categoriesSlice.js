import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunks for category operations
 */

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing category
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [
      // Default categories
      {
        id: 'work',
        name: 'Work',
        color: '#1976d2',
      },
      {
        id: 'personal',
        name: 'Personal',
        color: '#388e3c',
      },
      {
        id: 'shopping',
        name: 'Shopping',
        color: '#f57c00',
      },
      {
        id: 'health',
        name: 'Health',
        color: '#d32f2f',
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Local action to add category without API (for offline mode)
    addCategoryLocal: (state, action) => {
      state.items.push(action.payload);
    },
    // Local action to update category without API
    updateCategoryLocal: (state, action) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    // Local action to delete category without API
    deleteCategoryLocal: (state, action) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesError = (state) => state.categories.error;

// Get category by id
export const selectCategoryById = (state, categoryId) =>
  state.categories.items.find((c) => c.id === categoryId);

// Get categories as options for select fields
export const selectCategoryOptions = (state) =>
  state.categories.items.map((c) => ({
    value: c.id,
    label: c.name,
    color: c.color,
  }));

export const {
  clearError,
  addCategoryLocal,
  updateCategoryLocal,
  deleteCategoryLocal,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;