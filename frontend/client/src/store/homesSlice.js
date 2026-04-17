import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest, makeFormData } from '@/utils/apiClient';

/**
 * --- ACTIONS (The API Calls) ---
 */

// 1. Get all homes for the homepage
export const fetchHomes = createAsyncThunk('homes/fetchAll', async () => {
  return await apiRequest('/api/homes');
});

// 2. Get details for ONE specific home (when you click on it)
export const fetchHomeDetail = createAsyncThunk('homes/fetchDetail', async (id) => {
  return await apiRequest(`/api/homes/${id}`);
});

// 3. Add a home to your "Favorites" list
export const addFavourite = createAsyncThunk('homes/addFav', async (homeId) => {
  await apiRequest('/api/favourites', { method: 'POST', body: { id: homeId } });
  return homeId; // We return the ID so the "brain" knows which one to add to the list
});

// 4. Remove a home from "Favorites"
export const removeFavourite = createAsyncThunk('homes/removeFav', async (homeId) => {
  await apiRequest(`/api/favourites/${homeId}`, { method: 'DELETE' });
  return homeId;
});

// 5. Save a home (Creates a NEW one or UPDATES an existing one)
export const saveHostHome = createAsyncThunk('homes/saveHostHome', async ({ homeId, values }) => {
  const endpoint = homeId ? `/api/host/homes/${homeId}` : '/api/host/homes';
  const method = homeId ? 'PUT' : 'POST';
  
  // makeFormData is used because uploading images requires "Multipart" data, not just JSON
  return await apiRequest(endpoint, { method, body: makeFormData(values) });
});


/**
 * --- THE SLICE (The Brain) ---
 */

const homesSlice = createSlice({
  name: 'homes',
  initialState: {
    allHomes: [],      // The big list on the home page
    favourites: [],    // Your saved "liked" homes
    myListings: [],    // Homes you own as a host
    currentHome: null, // The single home you are currently looking at
    isLoading: false,
    error: '',
  },
  reducers: {
    clearHomesError: (state) => { state.error = ''; },
  },
  extraReducers: (builder) => {
    builder
      // When we start fetching homes, show a loading spinner
      .addCase(fetchHomes.pending, (state) => {
        state.isLoading = true;
      })
      // When homes arrive, save them and stop loading
      .addCase(fetchHomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allHomes = action.payload.homes;
      })
      // If we click a specific home, store it in currentHome
      .addCase(fetchHomeDetail.fulfilled, (state, action) => {
        state.currentHome = action.payload.home;
      })
      // Adding a favorite "locally" so the UI updates instantly
      .addCase(addFavourite.fulfilled, (state, action) => {
        const homeToAdd = state.allHomes.find(h => h.id === action.payload);
        if (homeToAdd) state.favourites.push(homeToAdd);
      })
      // Removing a favorite
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(h => h.id !== action.payload);
      });
  },
});

export const { clearHomesError } = homesSlice.actions;
export default homesSlice.reducer;