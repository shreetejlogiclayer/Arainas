import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * Redirects unauthenticated users to login page
 * Used for: /portal/dashboard, /portal/orders, /portal/profile, etc.
 */
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  // While checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-araina-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-araina-pink/20 border-t-araina-pink animate-spin mx-auto mb-4" />
          <p className="text-araina-black/70 text-sm uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  // If authenticated, render the component
  return children;
};

export default ProtectedRoute;
