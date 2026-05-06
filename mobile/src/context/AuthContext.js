import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      const storedUser = await SecureStore.getItemAsync('auth_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
        } catch {
          await logout();
        }
      }
    } catch (err) {
      console.error('Auth load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (tokenValue, userData) => {
    await SecureStore.setItemAsync('auth_token', tokenValue);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('auth_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (userData) => {
    await SecureStore.setItemAsync('auth_user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
