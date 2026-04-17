import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import homesReducer from './homesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    homes: homesReducer,
  },
});
