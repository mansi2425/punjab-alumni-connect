import { createContext, useState, useContext, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me/');
      setUser(response.data);
    } catch (e) {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    initialize();
  }, []);

  // --- THIS IS THE CRITICAL FIX ---
  const login = async (username, password) => {
    try {
      const response = await api.post('/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await refreshUser();
      // On success, return a success object.
      return { success: true };
    } catch (error) {
      console.error("Login API call failed:", error);
      const errorMessage = error.response?.data?.detail || "An unknown error occurred.";
      // On failure, return a failure object with the message. DO NOT THROW.
      return { success: false, message: errorMessage };
    }
  };
  // --- END OF FIX ---

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = { user, isAuthenticated: !!user, loading, login, logout, refreshUser };

  if (loading) return <div>Loading Application...</div>;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}