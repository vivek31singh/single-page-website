import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {Object} UIState
 * @property {boolean} isSidebarOpen - Sidebar visibility state
 * @property {boolean} isModalOpen - Generic modal open state
 * @property {string} modalType - Type of modal to display ('editTask' | 'deleteConfirmation' | null)
 * @property {Object} modalData - Data to pass to the modal
 * @property {string} activePage - Currently active page/route
 * @property {boolean} isDarkMode - Dark mode theme preference
 * @property {string} notification - Notification message
 * @property {string} notificationType - Notification type ('success' | 'error' | 'info' | 'warning')
 * @property {number} notificationDuration - Duration in ms to show notification
 * @property {boolean} isMobile - Mobile device detection
 */

/** @type {UIState} */
const initialState = {
  isSidebarOpen: true,
  isModalOpen: false,
  modalType: null,
  modalData: null,
  activePage: 'dashboard',
  isDarkMode: false,
  notification: null,
  notificationType: 'info',
  notificationDuration: 3000,
  isMobile: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle sidebar visibility
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    // Set sidebar visibility
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },

    // Open modal with type and optional data
    openModal: (state, action) => {
      const { modalType, modalData = null } = action.payload;
      state.isModalOpen = true;
      state.modalType = modalType;
      state.modalData = modalData;
    },

    // Close modal
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
      state.modalData = null;
    },

    // Set active page
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },

    // Toggle dark mode
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

    // Set dark mode
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },

    // Show notification
    showNotification: (state, action) => {
      const { message, type = 'info', duration = 3000 } = action.payload;
      state.notification = message;
      state.notificationType = type;
      state.notificationDuration = duration;
    },

    // Clear notification
    clearNotification: (state) => {
      state.notification = null;
      state.notificationType = 'info';
    },

    // Set mobile device state
    setMobile: (state, action) => {
      state.isMobile = action.payload;
      // Auto-close sidebar on mobile
      if (action.payload) {
        state.isSidebarOpen = false;
      }
    },

    // Reset UI state to initial
    resetUI: () => initialState,
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  setActivePage,
  toggleDarkMode,
  setDarkMode,
  showNotification,
  clearNotification,
  setMobile,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
