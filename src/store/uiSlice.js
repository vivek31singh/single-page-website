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
 * @property {Object} data - Additional data for the modal
 */

/**
 * @typedef {Object} UIState
 * @property {boolean} isLoading - Global loading state
 * @property {Notification[]} notifications - Array of active notifications
 * @property {Object} modals - Active modals keyed by type
 * @property {string} activeSidebarTab - Currently active sidebar tab
 * @property {boolean} isSidebarOpen - Sidebar open state for mobile
 * @property {boolean} isDarkMode - Dark mode preference
 */

/** @type {UIState} */
const initialState = {
  isLoading: false,
  notifications: [],
  modals: {
    deleteConfirmation: {
      isOpen: false,
      data: null,
    },
    editTask: {
      isOpen: false,
      data: null,
    },
    createTask: {
      isOpen: false,
      data: null,
    },
    createCategory: {
      isOpen: false,
      data: null,
    },
  },
  activeSidebarTab: 'tasks',
  isSidebarOpen: true,
  isDarkMode: false,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Notifications
    showNotification: (state, action) => {
      const { type, message, duration = 5000 } = action.payload;
      const id = Date.now().toString();
      state.notifications.push({ id, type, message, duration });
    },
    hideNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modals
    openModal: (state, action) => {
      const { type, data = null } = action.payload;
      if (state.modals[type]) {
        state.modals[type].isOpen = true;
        state.modals[type].data = data;
      }
    },
    closeModal: (state, action) => {
      const type = action.payload;
      if (state.modals[type]) {
        state.modals[type].isOpen = false;
        state.modals[type].data = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((type) => {
        state.modals[type].isOpen = false;
        state.modals[type].data = null;
      });
    },

    // Sidebar
    setActiveSidebarTab: (state, action) => {
      state.activeSidebarTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },

    // Dark mode
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Apply dark mode to document
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle(
          'dark',
          state.isDarkMode
        );
      }
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      // Apply dark mode to document
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle(
          'dark',
          state.isDarkMode
        );
      }
    },
  },
});

// Selectors
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectModalByType = (state, modalType) =>
  state.ui.modals[modalType] || { isOpen: false, data: null };
export const selectActiveSidebarTab = (state) => state.ui.activeSidebarTab;
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectIsDarkMode = (state) => state.ui.isDarkMode;

// Helper selectors for common modal checks
export const selectIsDeleteModalOpen = (state) =>
  state.ui.modals.deleteConfirmation?.isOpen || false;
export const selectIsEditTaskModalOpen = (state) =>
  state.ui.modals.editTask?.isOpen || false;
export const selectIsCreateTaskModalOpen = (state) =>
  state.ui.modals.createTask?.isOpen || false;
export const selectIsCreateCategoryModalOpen = (state) =>
  state.ui.modals.createCategory?.isOpen || false;

// Actions
export const {
  setLoading,
  showNotification,
  hideNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setActiveSidebarTab,
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
} = uiSlice.actions;

// Thunk creators for common notification patterns
export const showSuccessNotification = (message) =>
  showNotification({ type: 'success', message });

export const showErrorNotification = (message) =>
  showNotification({ type: 'error', message, duration: 7000 });

export const showWarningNotification = (message) =>
  showNotification({ type: 'warning', message });

export const showInfoNotification = (message) =>
  showNotification({ type: 'info', message });

// Modal convenience actions
export const openDeleteModal = (data) =>
  openModal({ type: 'deleteConfirmation', data });

export const openEditTaskModal = (data) =>
  openModal({ type: 'editTask', data });

export const openCreateTaskModal = () =>
  openModal({ type: 'createTask', data: null });

export const openCreateCategoryModal = () =>
  openModal({ type: 'createCategory', data: null });

export default uiSlice.reducer;
