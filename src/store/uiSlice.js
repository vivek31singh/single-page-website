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
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {Object} data - Additional data passed to the modal
 */

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Notifications state
    notifications: [],
    
    // Modal state
    modal: {
      type: null,
      isOpen: false,
      data: null,
    },
    
    // Global loading state
    isLoading: false,
    loadingMessage: '',
    
    // Theme state (for potential dark mode)
    theme: 'light',
    
    // Sidebar state for mobile responsiveness
    isSidebarOpen: true,
    
    // Confirmation dialog state
    confirmation: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null,
    },
  },
  reducers: {
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'info',
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Convenience actions for specific notification types
    showSuccess: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'success',
        message: action.payload,
        duration: 3000,
      };
      state.notifications.push(notification);
    },
    showError: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'error',
        message: action.payload,
        duration: 5000,
      };
      state.notifications.push(notification);
    },
    showWarning: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'warning',
        message: action.payload,
        duration: 4000,
      };
      state.notifications.push(notification);
    },
    showInfo: (state, action) => {
      const notification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'info',
        message: action.payload,
        duration: 3000,
      };
      state.notifications.push(notification);
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
    
    // Loading actions
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.loadingMessage = '';
    },
    setLoadingWithMessage: (state, action) => {
      state.isLoading = true;
      state.loadingMessage = action.payload;
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    
    // Confirmation dialog actions
    showConfirmation: (state, action) => {
      state.confirmation = {
        isOpen: true,
        title: action.payload.title || 'Confirm',
        message: action.payload.message || 'Are you sure?',
        onConfirm: action.payload.onConfirm || null,
        onCancel: action.payload.onCancel || null,
      };
    },
    hideConfirmation: (state) => {
      state.confirmation = {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
      };
    },
  },
});

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectModal = (state) => state.ui.modal;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectTheme = (state) => state.ui.theme;
export const selectIsSidebarOpen = (state) => state.ui.isSidebarOpen;
export const selectConfirmation = (state) => state.ui.confirmation;

// Check if any modal is open
export const selectIsModalOpen = (state) => state.ui.modal.isOpen;

// Check if confirmation dialog is open
export const selectIsConfirmationOpen = (state) => state.ui.confirmation.isOpen;

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  openModal,
  closeModal,
  setLoading,
  setLoadingWithMessage,
  clearLoading,
  setTheme,
  toggleTheme,
  toggleSidebar,
  setSidebarOpen,
  showConfirmation,
  hideConfirmation,
} = uiSlice.actions;

export default uiSlice.reducer;