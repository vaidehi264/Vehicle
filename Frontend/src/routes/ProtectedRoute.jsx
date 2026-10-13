import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Reusable ProtectedRoute guarding routes by authentication status and required role.
 * Note: As per project requirements, this is a frontend-only role simulation for UI navigation.
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Validating session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login preserving intended target path
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is not allowed, redirect to Access Denied
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;

