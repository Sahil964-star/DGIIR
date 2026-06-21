import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../shared/components/Loader';
import { getRoleLandingPage } from '../utils/roleUtils';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, role, token, isLoading } = useAuth();

  // DEV BYPASS: Temporarily allow all access during frontend development
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader size={48} className="text-green-500" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and user's role is not included, redirect to a default safe route based on their actual role
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleLandingPage(role)} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
