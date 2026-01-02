import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {Object} Notification
 * @property {string} id - Unique identifier for the notification
 * @property {'success' | 'error' | 'warning' | 'info'} type - Notification type
 * @property {string} message - Notification message
 * @property {number} duration - Duration in milliseconds before auto-dismiss
 */

/**
 * @typedef {Object} Modal
 * @property {string} type - Modal type identifier
 * @property {boolean} isOpen - Whether the modal is open
 * @property {any} data - Additional data for the modal
 */

const initialState = {
  /** @type {Notification[]} */
  notifications: [],
  /** @type {Modal} */
  modal: {
    type: null,
    isOpen: false,
    data: null,
  },
  /** @type {Record<string, boolean>} */
  isLoading: {
    global: false,
    tasks: false,
    categories: false,
  },
  /** @type {boolean} */
  isSidebarOpen: true,
  /** @type {string} */
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notification actions
    showNotification: (state, action) => {
      const notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    hideNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal actions
    openModal: (state, action) => {
      state.modal = {
        type: action.payload.type,
        isOpen: true,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        type: null,
        isOpen: false,
        data: null,
      };
    },

    // Loading state actions
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.isLoading[key] = value;
    },
    setGlobalLoading: (state, action) => {
      state.isLoading.global = action.payload;
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },

    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Persist theme to localStorage
      localStorage.setItem('theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    loadThemeFromStorage: (state) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        state.theme = savedTheme;
      }
    },
  },
});

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectModal = (state) => state.ui.modal;
export const selectIsModalOpen = (state) => state.ui.modal.isOpen;
export const selectModalType = (state) => state.ui.modal.type;
export const selectModalData = (state) => state.ui.modal.data;
export const selectLoading = (state, key) => state.ui.isLoading[key] || false;
export const selectGlobalLoading = (state) => state.ui.isLoading.global;
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectTheme = (state) => state.ui.theme;

// Helper selectors for common loading states
export const selectTasksLoading = (state) => state.ui.isLoading.tasks;
export const selectCategoriesLoading = (state) => state.ui.isLoading.categories;

// Helper selector to check if any loading state is active
export const selectIsAnyLoading = (state) =>
  Object.values(state.ui.isLoading).some((loading) => loading);

export const {
  showNotification,
  hideNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
  setGlobalLoading,
  toggleSidebar,
  setSidebarOpen,
  toggleTheme,
  setTheme,
  loadThemeFromStorage,
} = uiSlice.actions;

export default uiSlice.reducer;
