import axios from 'axios';

// 1. Where is the backend?
// We use localhost:3001 as the default for your machine.
const BASE_URL = 'http://localhost:3001';

// 2. Create our Axios machine
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // This sends our cookies/session automatically
});

// 3. The main function to talk to the backend
export async function apiRequest(url, options = {}) {
  try {
    const response = await apiClient({
      url: url,
      method: options.method || 'GET',
      data: options.body,    // Your JSON data (for POST/PUT)
      params: options.params, // Your search queries (?id=123)
      headers: options.headers,
    });

    return response.data; // Just return the actual data from the server
  } catch (error) {
    // If the server has a custom error message, throw that. Otherwise, a generic one.
    throw error.response?.data || { message: 'Something went wrong!' };
  }
}

// 4. Helper for image uploads (FormData)
export function makeFormData(values) {
  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    // Only add it if the value actually exists
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value);
    }
  }
  return formData;
}

// 5. Helper to get full paths for images
export function getBackendUrl(path) {
  if (!path) return BASE_URL;
  // If the path already has "http", just leave it alone
  if (path.includes('http')) return path;
  // Otherwise, glue the backend URL to the front
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// 6. Helper to get Google OAuth URL
export function getGoogleAuthUrl() {
  return `${BASE_URL}/api/auth/google`;
}