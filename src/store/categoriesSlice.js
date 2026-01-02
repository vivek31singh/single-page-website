import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: '1', name: 'Work', color: '#2196f3' },
    { id: '2', name: 'Personal', color: '#4caf50' },
    { id: '3', name: 'Shopping', color: '#ff9800' },
    { id: '4', name: 'Health', color: '#f44336' },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.items.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.items = state.items.filter((cat) => cat.id !== action.payload);
    },
  },
});

export const { addCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;