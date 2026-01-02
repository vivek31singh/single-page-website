import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {'active' | 'completed'} status - Task status
 * @property {'low' | 'medium' | 'high'} priority - Task priority
 * @property {string} category - Task category
 * @property {string} dueDate - Due date in ISO format
 * @property {string} createdAt - Creation timestamp in ISO format
 * @property {string} updatedAt - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} TasksState
 * @property {Task[]} items - Array of tasks
 * @property {string} filterByStatus - Current status filter ('all' | 'active' | 'completed')
 * @property {string} filterByCategory - Current category filter ('all' | category name)
 * @property {string} filterByPriority - Current priority filter ('all' | 'low' | 'medium' | 'high')
 * @property {string} sortBy - Current sort option ('dueDate' | 'priority' | 'createdAt')
 * @property {string} sortOrder - Sort order ('asc' | 'desc')
 * @property {string} searchQuery - Current search query
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string|null} error - Error message if any
 */

/** @type {TasksState} */
const initialState = {
  items: [],
  filterByStatus: 'all',
  filterByCategory: 'all',
  filterByPriority: 'all',
  sortBy: 'dueDate',
  sortOrder: 'asc',
  searchQuery: '',
  isLoading: false,
  error: null,
};

/**
 * Generate a unique ID for new tasks
 * @returns {string} Unique identifier
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Load tasks from local storage
    loadTasks: (state, action) => {
      state.items = action.payload;
    },

    // Add a new task
    addTask: (state, action) => {
      const newTask = {
        id: generateId(),
        ...action.payload,
        status: action.payload.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.unshift(newTask);
    },

    // Update an existing task
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex((task) => task.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // Delete a task
    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },

    // Toggle task completion status
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === 'active' ? 'completed' : 'active';
        task.updatedAt = new Date().toISOString();
      }
    },

    // Set status filter
    setFilterByStatus: (state, action) => {
      state.filterByStatus = action.payload;
    },

    // Set category filter
    setFilterByCategory: (state, action) => {
      state.filterByCategory = action.payload;
    },

    // Set priority filter
    setFilterByPriority: (state, action) => {
      state.filterByPriority = action.payload;
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filterByStatus = 'all';
      state.filterByCategory = 'all';
      state.filterByPriority = 'all';
      state.searchQuery = '';
    },

    // Set sort option
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },

    // Set sort order
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
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
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setFilterByStatus,
  setFilterByCategory,
  setFilterByPriority,
  clearFilters,
  setSortBy,
  setSortOrder,
  setSearchQuery,
  setLoading,
  setError,
  clearError,
} = tasksSlice.actions;

/**
 * Selector to get filtered and sorted tasks
 */
export const selectFilteredTasks = (state) => {
  let filtered = [...state.tasks.items];

  // Apply status filter
  if (state.tasks.filterByStatus !== 'all') {
    filtered = filtered.filter(
      (task) => task.status === state.tasks.filterByStatus
    );
  }

  // Apply category filter
  if (state.tasks.filterByCategory !== 'all') {
    filtered = filtered.filter(
      (task) => task.category === state.tasks.filterByCategory
    );
  }

  // Apply priority filter
  if (state.tasks.filterByPriority !== 'all') {
    filtered = filtered.filter(
      (task) => task.priority === state.tasks.filterByPriority
    );
  }

  // Apply search filter
  if (state.tasks.searchQuery.trim()) {
    const query = state.tasks.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (state.tasks.sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'priority':
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      default:
        comparison = 0;
    }

    return state.tasks.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

export const selectTasksStats = (state) => {
  const items = state.tasks.items;
  return {
    total: items.length,
    active: items.filter((task) => task.status === 'active').length,
    completed: items.filter((task) => task.status === 'completed').length,
    highPriority: items.filter(
      (task) => task.status === 'active' && task.priority === 'high'
    ).length,
  };
};

export default tasksSlice.reducer;
