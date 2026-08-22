import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

const UserRoute = () => {
  const { isAuthenticated, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-caveno-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-caveno-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoute;
