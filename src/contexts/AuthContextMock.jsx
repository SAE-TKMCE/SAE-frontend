
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login with backend authentication
  const login = async (email, password) => {
    try {
      // Use DRF token auth endpoint (adjust if using JWT or other)
      const response = await api.post('/auth-token/', { username: email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Optionally fetch user profile after login
      const userResp = await api.get('/auth/profile/');
      setUser(userResp.data);
      localStorage.setItem('user', JSON.stringify(userResp.data));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export as MockAuthProvider as well for compatibility
export const MockAuthProvider = AuthProvider;
