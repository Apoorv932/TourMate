import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiRequest } from '@/utils/apiClient';

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest('/session');
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const signupUser = createAsyncThunk('auth/signupUser', async (payload, { rejectWithValue }) => {
  try {
    return await apiRequest('/auth/signup', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await apiRequest('/auth/logout', {
    method: 'POST',
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    status: 'idle',
    errorMessages: [],
  },
  reducers: {
    clearAuthErrors(state) {
      state.errorMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'failed';
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessages = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessages = action.payload?.errors || ['Unable to login.'];
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
        state.errorMessages = [];
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessages = action.payload?.errors || ['Unable to sign up.'];
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
