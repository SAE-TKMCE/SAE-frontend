import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export const designTemplatesApi = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE}/api/design-templates/`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/api/design-templates/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(`${API_BASE}/api/design-templates/`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`${API_BASE}/api/design-templates/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_BASE}/api/design-templates/${id}/`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await axios.post(`${API_BASE}/api/design-templates/${id}/duplicate/`);
    return response.data;
  }
};
