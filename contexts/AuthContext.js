'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/lib/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authenticated = AuthService.isAuthenticated();
    const userData = AuthService.getUser();
    
    setIsAuthenticated(authenticated);
    setUser(userData);
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}