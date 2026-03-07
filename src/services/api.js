import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT Bearer token if present, else DRF Token
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('sae_access_token');
    const drfToken = localStorage.getItem('token');
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    } else if (drfToken) {
      config.headers.Authorization = `Token ${drfToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: clear tokens on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sae_access_token');
      localStorage.removeItem('sae_refresh_token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;

