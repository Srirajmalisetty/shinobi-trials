import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChakraSpinner } from '../common/ChakraSpinner';

interface RequireAuthProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <ChakraSpinner size="lg" label="Verifying Shinobi Credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to /login, remembering the destination they were attempting to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Non-admin attempted to enter restricted Hokage council/admin zone
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
