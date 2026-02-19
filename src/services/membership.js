import api from './api';
import { authService } from './auth';

export const membershipService = {
  // Get current user's membership application
  getMyApplication: async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    try {
      const response = await api.get('/membership/applications/my_application/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Submit a new membership application
  submitApplication: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post('/membership/applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get membership card data
  getMyCard: async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    try {
      const response = await api.get('/membership/applications/card/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get membership card as HTML
  getCardHtml: async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    try {
      const response = await api.get('/membership/applications/card_html/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Download membership card as PDF
  downloadCardPdf: async () => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    const response = await api.get('/membership/card/pdf/', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Verify a membership card (public endpoint - no auth needed)
  verifyCard: async (token) => {
    try {
      const response = await api.get(`/membership/verify/${token}/`);
      return response.data;
    } catch (error) {
      return { valid: false, error: 'Invalid card' };
    }
  },

  // Get membership types (public)
  getTypes: async () => {
    const response = await api.get('/membership/types/');
    return response.data;
  }
};

export default membershipService;