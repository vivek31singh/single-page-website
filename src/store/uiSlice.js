import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  filter: {
    status: 'all',
    priority: 'all',
    category: 'all',
  },
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const { toggleSidebar, setFilter, setSort } = uiSlice.actions;
export default uiSlice.reducer;