import React, { createContext, useContext, useState } from 'react';

// Mock AuthContext for development
const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock users for testing
  const mockUsers = [
    {
      id: 1,
      email: 'admin@sae.ac.in',
      password: 'admin123',
      name: 'SAE Admin',
      role: 'admin',
      isAdmin: true
    },
    {
      id: 2,
      email: 'user@sae.ac.in',
      password: 'user123',
      name: 'SAE Member',
      role: 'member',
      isAdmin: false
    },
    {
      id: 3,
      email: 'test@test.com',
      password: 'test123',
      name: 'Test User',
      role: 'member',
      isAdmin: false
    }
  ];

  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password from user object for security
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        
        // Store in localStorage for persistence
        localStorage.setItem('mockUser', JSON.stringify(userWithoutPassword));
        
        return userWithoutPassword;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        email: userData.email,
        name: userData.name || 'New User',
        role: 'member',
        isAdmin: false
      };
      
      // Add to mock users array
      mockUsers.push({ ...newUser, password: userData.password });
      
      // Set as current user
      setUser(newUser);
      localStorage.setItem('mockUser', JSON.stringify(newUser));
      
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
