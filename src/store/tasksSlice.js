import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunks for task operations
 */

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle task status
export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const task = getState().tasks.items.find((t) => t.id === taskId);
      const newStatus = task.status === 'active' ? 'completed' : 'active';
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    filter: {
      status: 'all', // 'all', 'active', 'completed'
      priority: 'all', // 'all', 'low', 'medium', 'high'
      category: 'all', // 'all' or category id
    },
    sortBy: 'dueDate', // 'dueDate', 'priority', 'createdAt', 'title'
    sortOrder: 'asc', // 'asc', 'desc'
    searchQuery: '',
  },
  reducers: {
    // Local state management for filters
    setStatusFilter: (state, action) => {
      state.filter.status = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.filter.priority = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.filter.category = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filter = {
        status: 'all',
        priority: 'all',
        category: 'all',
      };
      state.searchQuery = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Toggle task status
    builder
      .addCase(toggleTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectTasksFilter = (state) => state.tasks.filter;
export const selectTasksSortBy = (state) => state.tasks.sortBy;
export const selectTasksSortOrder = (state) => state.tasks.sortOrder;
export const selectSearchQuery = (state) => state.tasks.searchQuery;

// Computed selector for filtered and sorted tasks
export const selectFilteredTasks = (state) => {
  let tasks = [...state.tasks.items];
  const { status, priority, category } = state.tasks.filter;
  const searchQuery = state.tasks.searchQuery.toLowerCase();
  const sortBy = state.tasks.sortBy;
  const sortOrder = state.tasks.sortOrder;

  // Apply filters
  if (status !== 'all') {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (priority !== 'all') {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (category !== 'all') {
    tasks = tasks.filter((t) => t.category === category);
  }
  if (searchQuery) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery) ||
        t.description?.toLowerCase().includes(searchQuery)
    );
  }

  // Apply sorting
  tasks.sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'dueDate':
        compareValue = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        compareValue = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'createdAt':
        compareValue = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'title':
        compareValue = a.title.localeCompare(b.title);
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return tasks;
};

export const {
  setStatusFilter,
  setPriorityFilter,
  setCategoryFilter,
  setSortBy,
  setSortOrder,
  setSearchQuery,
  clearFilters,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;