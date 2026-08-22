import React, { createContext, useContext, useState } from 'react';
import API_BASE_URL from '../config/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('caveno_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('caveno_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Login failed');
      }

      setAdminToken(json.token);
      setAdminUser(json.user);
      localStorage.setItem('caveno_admin_token', json.token);
      localStorage.setItem('caveno_admin_user', JSON.stringify(json.user));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('caveno_admin_token');
    localStorage.removeItem('caveno_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminUser,
        isAuthenticated: !!adminToken,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
