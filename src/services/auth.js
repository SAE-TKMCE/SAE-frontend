import api from './api';

export const authService = {
  // Check if user is authenticated (has token)
  isAuthenticated: () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      return !!token;
    } catch {
      return false;
    }
  },

  // Get current user profile - returns null if not authenticated
  getCurrentUser: async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      // Silently return null for any auth errors
      if (error.response?.status === 401 || error.response?.status === 404) {
        authService.removeToken();
      }
      return null;
    }
  },

  // Alias for getCurrentUser
  getProfile: async () => {
    return authService.getCurrentUser();
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await api.patch('/auth/profile/', data);
    return response.data;
  },

  // Remove token
  removeToken: () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch {
      // Ignore storage errors
    }
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    } else if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    } else if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      if (authService.isAuthenticated()) {
        await api.post('/auth/logout/');
      }
    } catch {
      // Ignore logout errors
    }
    authService.removeToken();
  },

  // Register
  register: async (data) => {
    const response = await api.post('/auth/registration/', data);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    return response.data;
  },

  // Get stored token
  getToken: () => {
    try {
      return localStorage.getItem('token') || localStorage.getItem('access_token');
    } catch {
      return null;
    }
  },

  // Set token
  setToken: (token) => {
    try {
      localStorage.setItem('token', token);
    } catch {
      // Ignore storage errors
    }
  },
};

export default authService;
