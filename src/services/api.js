import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to normalize a request URL into just its pathname
function getPathname(url) {
  try {
    if (!url) return '/';
    if (url.startsWith('http')) {
      return new URL(url).pathname || '/';
    }
    // Relative path (axios merges with baseURL)
    return url.startsWith('/') ? url : `/${url}`;
  } catch {
    return '/';
  }
}

// Helper to determine whether an API path is public (no auth header needed)
function isPublicApiPath(url) {
  const pathname = getPathname(url);
  const publicPrefixes = [
    '/events',
    '/achievements',
    // also allow when baseURL is included in pathname
    '/api/events',
    '/api/achievements'
  ];
  return publicPrefixes.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Only attach Authorization for non-public API paths
    if (token && !isPublicApiPath(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers && config.headers.Authorization && isPublicApiPath(config.url || '')) {
      // Ensure no stale header remains on public endpoints
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to determine whether the current path is public (no auth required)
function isPublicPath(pathname) {
  // Treat core public pages and any Events routes as public
  const publicPrefixes = ['/', '/login', '/register', '/events'];
  return publicPrefixes.some(prefix =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the failed request was to a public API path, don't force login; just propagate the error
      if (isPublicApiPath(originalRequest.url || '')) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('token', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, only redirect to login if we're not on a public page
          const currentPath = window.location.pathname;
          
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          if (!isPublicPath(currentPath)) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, only redirect to login if we're not on a public page
        const currentPath = window.location.pathname;
        
        localStorage.removeItem('token');
        
        if (!isPublicPath(currentPath)) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
