import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import homesReducer from '@/features/homes/homesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    homes: homesReducer,
  },
});
