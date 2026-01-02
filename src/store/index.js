import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import categoriesReducer from './categoriesSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    categories: categoriesReducer,
    ui: uiReducer,
  },
});

export default store;