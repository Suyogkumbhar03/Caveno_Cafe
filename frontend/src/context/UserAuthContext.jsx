import React, { createContext, useContext, useState } from 'react';
import API_BASE_URL from '../config/api';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(() => localStorage.getItem('caveno_user_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('caveno_user_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Customer login failed');
      }

      setUserToken(json.token);
      setUser(json.user);
      localStorage.setItem('caveno_user_token', json.token);
      localStorage.setItem('caveno_user_profile', JSON.stringify(json.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Registration failed');
      }

      setUserToken(json.token);
      setUser(json.user);
      localStorage.setItem('caveno_user_token', json.token);
      localStorage.setItem('caveno_user_profile', JSON.stringify(json.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserToken(null);
    setUser(null);
    localStorage.removeItem('caveno_user_token');
    localStorage.removeItem('caveno_user_profile');
  };

  return (
    <UserAuthContext.Provider
      value={{
        userToken,
        user,
        isAuthenticated: !!userToken,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
