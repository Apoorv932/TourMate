import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiRequest, makeFormData } from '@/utils/apiClient';

export const fetchHomes = createAsyncThunk('homes/fetchHomes', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest('/homes');
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchHomeDetail = createAsyncThunk('homes/fetchHomeDetail', async (homeId, { rejectWithValue }) => {
  try {
    return await apiRequest(`/homes/${homeId}`);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchFavourites = createAsyncThunk('homes/fetchFavourites', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest('/favourites');
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const addFavourite = createAsyncThunk('homes/addFavourite', async (homeId, { rejectWithValue }) => {
  try {
    await apiRequest('/favourites', {
      method: 'POST',
      body: { id: homeId },
    });
    return homeId;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const removeFavourite = createAsyncThunk('homes/removeFavourite', async (homeId, { rejectWithValue }) => {
  try {
    await apiRequest(`/favourites/${homeId}`, {
      method: 'DELETE',
    });
    return homeId;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchHostHomes = createAsyncThunk('homes/fetchHostHomes', async (_, { rejectWithValue }) => {
  try {
    return await apiRequest('/host/homes');
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const saveHostHome = createAsyncThunk('homes/saveHostHome', async ({ homeId, values }, { rejectWithValue }) => {
  try {
    const endpoint = homeId ? `/host/homes/${homeId}` : '/host/homes';
    return await apiRequest(endpoint, {
      method: homeId ? 'PUT' : 'POST',
      body: makeFormData(values),
    });
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteHostHome = createAsyncThunk('homes/deleteHostHome', async (homeId, { rejectWithValue }) => {
  try {
    await apiRequest(`/host/homes/${homeId}`, {
      method: 'DELETE',
    });
    return homeId;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const homesSlice = createSlice({
  name: 'homes',
  initialState: {
    homes: [],
    favourites: [],
    hostHomes: [],
    selectedHome: null,
    status: 'idle',
    errorMessage: '',
  },
  reducers: {
    clearHomesError(state) {
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomes.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = '';
      })
      .addCase(fetchHomes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.homes = action.payload.homes;
      })
      .addCase(fetchHomes.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload?.message || 'Unable to load homes.';
      })
      .addCase(fetchHomeDetail.fulfilled, (state, action) => {
        state.selectedHome = action.payload.home;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload.homes;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        const existingHome = state.homes.find((home) => home.id === action.payload) || state.selectedHome;
        if (existingHome && !state.favourites.some((home) => home.id === action.payload)) {
          state.favourites.push(existingHome);
        }
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter((home) => home.id !== action.payload);
      })
      .addCase(fetchHostHomes.fulfilled, (state, action) => {
        state.hostHomes = action.payload.homes;
      })
      .addCase(saveHostHome.rejected, (state, action) => {
        state.errorMessage = action.payload?.errors?.[0] || action.payload?.message || 'Unable to save home.';
      })
      .addCase(deleteHostHome.fulfilled, (state, action) => {
        state.hostHomes = state.hostHomes.filter((home) => home.id !== action.payload);
      });
  },
});

export const { clearHomesError } = homesSlice.actions;
export default homesSlice.reducer;
