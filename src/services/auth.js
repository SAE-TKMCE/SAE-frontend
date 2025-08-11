import api from './api';

export const authService = {
  async login(data) {
    try {
      const response = await api.post('/auth/login/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async register(data) {
    try {
      const response = await api.post('/auth/register/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateProfile(data) {
    try {
      const response = await api.put('/auth/profile/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
