import { createSlice } from '@reduxjs/toolkit';

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
    { id: 'cat_1', name: 'Work', color: '#2196F3' },
    { id: 'cat_2', name: 'Personal', color: '#4CAF50' },
    { id: 'cat_3', name: 'Shopping', color: '#FF9800' },
    { id: 'cat_4', name: 'Health', color: '#F44336' },
    { id: 'cat_5', name: 'Finance', color: '#9C27B0' },
  ],
  isLoading: false,
  error: null,
};

/**
 * Generate a unique ID for new categories
 * @returns {string} Unique identifier
 */
const generateId = () => {
  return 'cat_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Load categories from local storage
    loadCategories: (state, action) => {
      state.items = action.payload;
    },

    // Add a new category
    addCategory: (state, action) => {
      const newCategory = {
        id: generateId(),
        ...action.payload,
      };
      state.items.push(newCategory);
    },

    // Update an existing category
    updateCategory: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex((cat) => cat.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
        };
      }
    },

    // Delete a category
    deleteCategory: (state, action) => {
      state.items = state.items.filter((cat) => cat.id !== action.payload);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  setLoading,
  setError,
  clearError,
} = categoriesSlice.actions;

/**
 * Selector to get category by ID
 */
export const selectCategoryById = (state, categoryId) => {
  return state.categories.items.find((cat) => cat.id === categoryId);
};

/**
 * Selector to get category names array
 */
export const selectCategoryNames = (state) => {
  return state.categories.items.map((cat) => cat.name);
};

export default categoriesSlice.reducer;
