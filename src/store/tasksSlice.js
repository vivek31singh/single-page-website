import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../services/taskService';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {'active' | 'completed'} status - Task status
 * @property {'low' | 'medium' | 'high'} priority - Task priority
 * @property {string} category - Category ID
 * @property {string} dueDate - Due date in ISO format
 * @property {string} createdAt - Creation timestamp in ISO format
 * @property {string} updatedAt - Last update timestamp in ISO format
 */

/**
 * @typedef {Object} TasksState
 * @property {Task[]} items - Array of tasks
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string|null} error - Error message if any
 * @property {Object} filters - Current active filters
 * @property {string} filters.status - Filter by status
 * @property {string} filters.priority - Filter by priority
 * @property {string} filters.category - Filter by category
 * @property {string} filters.search - Search query
 * @property {string} sortBy - Current sort field
 * @property {string} sortOrder - Current sort order ('asc' | 'desc')
 */

/** @type {TasksState} */
const initialState = {
  items: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Async Thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getAllTasks();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tasks'
      );
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create task'
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update task'
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete task'
      );
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const task = getState().tasks.items.find((t) => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      const newStatus = task.status === 'active' ? 'completed' : 'active';
      const response = await taskService.updateTask(taskId, { status: newStatus });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle task status'
      );
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSort: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Toggle task status
    builder
      .addCase(toggleTaskStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksLoading = (state) => state.tasks.isLoading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksFilters = (state) => state.tasks.filters;
export const selectTasksSort = (state) => ({
  sortBy: state.tasks.sortBy,
  sortOrder: state.tasks.sortOrder,
});

export const selectFilteredTasks = (state) => {
  const { items, filters, sortBy, sortOrder } = state.tasks;
  let filtered = [...items];

  // Apply filters
  if (filters.status !== 'all') {
    filtered = filtered.filter((task) => task.status === filters.status);
  }
  if (filters.priority !== 'all') {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }
  if (filters.category !== 'all') {
    filtered = filtered.filter((task) => task.category === filters.category);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle date comparisons
    if (sortBy === 'dueDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle priority comparisons
    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
};

export const selectTaskById = (state, taskId) =>
  state.tasks.items.find((task) => task.id === taskId);

export const selectActiveTasksCount = (state) =>
  state.tasks.items.filter((task) => task.status === 'active').length;

export const selectCompletedTasksCount = (state) =>
  state.tasks.items.filter((task) => task.status === 'completed').length;

// Actions
export const { setFilter, clearFilters, setSort, clearError } = tasksSlice.actions;

export default tasksSlice.reducer;
