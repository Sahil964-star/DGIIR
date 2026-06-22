import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');

        // No token → no session
        if (!storedToken) {
          if (mounted) setIsLoading(false);
          return;
        }

        // Verify session with backend
        const response = await authApi.getCurrentUser();

        const backendUser =
          response?.data?.user ||
          response?.user ||
          null;

        if (!backendUser) {
          throw new Error('No user data returned');
        }

        if (!mounted) return;

        setToken(storedToken);
        setUser(backendUser);
        setRole(backendUser.role);

        localStorage.setItem('role', backendUser.role);
        localStorage.setItem('user', JSON.stringify(backendUser));
      } catch (error) {
        console.error('Auth initialization failed:', error);

        if (!mounted) return;

        setUser(null);
        setRole(null);
        setToken(null);

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = (userData, userRole, jwtToken) => {
    setUser(userData);
    setRole(userRole);
    setToken(jwtToken);

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      setUser(null);
      setRole(null);
      setToken(null);

      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      window.location.href = '/login';
    }
  };

  const value = {
    user,
    role,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};