import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Sparkles } from 'lucide-react';

const AdminRoute = () => {
  const { isAuthenticated, adminUser, adminToken, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-caveno-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-caveno-gold border-t-transparent animate-spin" />
        <div className="flex items-center gap-2 font-mono text-xs text-caveno-gold uppercase tracking-widest">
          <Sparkles size={14} />
          <span>Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

  // Strict check for token, authenticated state, and admin role
  const isValidAdmin = isAuthenticated && adminToken && adminUser && adminUser.role === 'admin';

  if (!isValidAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminRoute;
