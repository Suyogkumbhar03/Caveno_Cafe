import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { Sparkles } from 'lucide-react';

const UserRoute = () => {
  const { isAuthenticated, userToken, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-caveno-black flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-caveno-gold border-t-transparent animate-spin" />
        <div className="flex items-center gap-2 font-mono text-xs text-caveno-gold uppercase tracking-widest">
          <Sparkles size={14} />
          <span>Authenticating Session...</span>
        </div>
      </div>
    );
  }

  // Strict check for user token and authenticated state
  const isValidCustomer = isAuthenticated && userToken;

  if (!isValidCustomer) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default UserRoute;
