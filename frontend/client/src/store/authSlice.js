import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/apiClient';

// --- 1. THE ACTIONS (Talking to the Server) ---

// Check if the user is already logged in (runs when you refresh the page)
export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  return await apiRequest('/api/session');
});

// Send login details to the server
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    return await apiRequest('/api/auth/login', { method: 'POST', body: credentials });
  } catch (error) {
    return rejectWithValue(error); // Sends the error to the 'rejected' case below
  }
});

// Create a new account
export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
  try {
    return await apiRequest('/api/auth/signup', { method: 'POST', body: userData });
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Log the user out
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await apiRequest('/api/auth/logout', { method: 'POST' });
});


// --- 2. THE SLICE (Managing the Data) ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    loading: false, // Simplified status
    errors: [],
  },
  reducers: {
    // Clear errors (useful when navigating away from the login page)
    clearAuthErrors: (state) => {
      state.errors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* --- LOGIN CASES --- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errors = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user; // Save user data
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload?.errors || ['Login failed'];
      })

      /* --- SESSION RESTORE CASES --- */
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
        state.user = action.payload.user;
      })

      /* --- LOGOUT CASE --- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
      });
  },
});

export const { clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;