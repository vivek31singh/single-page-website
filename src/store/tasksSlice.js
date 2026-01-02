import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier for the task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {'active' | 'completed'} status - Task status
 * @property {'low' | 'medium' | 'high'} priority - Task priority
 * @property {string} category - Task category ID
 * @property {string} dueDate - Due date in ISO format
 * @property {string} createdAt - Creation date in ISO format
 * @property {string} updatedAt - Last update date in ISO format
 */

/**
 * @typedef {Object} TasksFilter
 * @property {string} status - Filter by status ('all', 'active', 'completed')
 * @property {string} priority - Filter by priority ('all', 'low', 'medium', 'high')
 * @property {string} category - Filter by category ID ('all' or specific ID)
 * @property {string} search - Search query string
 */

/**
 * @typedef {Object} TasksSort
 * @property {'dueDate' | 'priority' | 'createdAt' | 'title'} field - Sort field
 * @property {'asc' | 'desc'} direction - Sort direction
 */

// Async thunks for API interactions (placeholder for future implementation)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.get('/api/tasks');
      // return response.data;
      
      // For now, return empty array
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.post('/api/tasks', taskData);
      // return response.data;
      
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newTask;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // const response = await api.put(`/api/tasks/${id}`, updates);
      // return response.data;
      
      return {
        id,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // await api.delete(`/api/tasks/${id}`);
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  /** @type {Task[]} */
  items: [],
  /** @type {TasksFilter} */
  filter: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  },
  /** @type {TasksSort} */
  sort: {
    field: 'dueDate',
    direction: 'asc',
  },
  /** @type {boolean} */
  isLoading: false,
  /** @type {string | null} */
  error: null,
  /** @type {Task | null} */
  editingTask: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
    setSort: (state, action) => {
      state.sort = { ...state.sort, ...action.payload };
    },
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
    clearEditingTask: (state) => {
      state.editingTask = null;
    },
    toggleTaskStatus: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === 'active' ? 'completed' : 'active';
        task.updatedAt = new Date().toISOString();
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Local storage helpers
    loadTasksFromStorage: (state) => {
      try {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
          state.items = JSON.parse(storedTasks);
        }
      } catch (error) {
        console.error('Failed to load tasks from storage:', error);
      }
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
        // Save to local storage
        localStorage.setItem('tasks', JSON.stringify(action.payload));
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
        // Save to local storage
        localStorage.setItem('tasks', JSON.stringify(state.items));
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create task';
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
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        // Save to local storage
        localStorage.setItem('tasks', JSON.stringify(state.items));
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update task';
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
        // Save to local storage
        localStorage.setItem('tasks', JSON.stringify(state.items));
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete task';
      });
  },
});

// Selectors
export const selectAllTasks = (state) => state.tasks.items;

export const selectFilteredTasks = (state) => {
  const { items, filter, sort } = state.tasks;
  
  let filtered = [...items];
  
  // Apply filters
  if (filter.status !== 'all') {
    filtered = filtered.filter((task) => task.status === filter.status);
  }
  if (filter.priority !== 'all') {
    filtered = filtered.filter((task) => task.priority === filter.priority);
  }
  if (filter.category !== 'all') {
    filtered = filtered.filter((task) => task.category === filter.category);
  }
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'priority':
        const priorityOrder = { low: 0, medium: 1, high: 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        break;
    }
    
    return sort.direction === 'desc' ? -comparison : comparison;
  });
  
  return filtered;
};

export const selectTaskById = (state, taskId) =>
  state.tasks.items.find((task) => task.id === taskId);

export const selectActiveTasksCount = (state) =>
  state.tasks.items.filter((task) => task.status === 'active').length;

export const selectCompletedTasksCount = (state) =>
  state.tasks.items.filter((task) => task.status === 'completed').length;

export const selectTasksFilter = (state) => state.tasks.filter;
export const selectTasksSort = (state) => state.tasks.sort;
export const selectTasksLoading = (state) => state.tasks.isLoading;
export const selectTasksError = (state) => state.tasks.error;
export const selectEditingTask = (state) => state.tasks.editingTask;

export const {
  setFilter,
  resetFilter,
  setSort,
  setEditingTask,
  clearEditingTask,
  toggleTaskStatus,
  clearError,
  loadTasksFromStorage,
} = tasksSlice.actions;

export default tasksSlice.reducer;
