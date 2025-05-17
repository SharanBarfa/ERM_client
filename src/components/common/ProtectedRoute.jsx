import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../layout/AdminLayout';
import EmployeeLayout from '../layout/EmployeeLayout';
import { hasPendingRedirect, applyRegistrationData } from '../../utils/registrationHelper';

const ProtectedRoute = ({ requireAdmin = false, requireEmployee = false, children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if we're coming from registration
  const isPostRegistration = hasPendingRedirect();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, checking alternatives');

    // If we're in the post-registration state, apply the registration data
    if (isPostRegistration) {
      console.log('Post-registration state detected, applying registration data');
      const success = applyRegistrationData();

      if (success) {
        console.log('Successfully applied registration data, allowing access');
        // The component will re-render with the updated auth context
        return children || <Outlet />;
      }
    }

    // Check if there's a token in localStorage as a fallback
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      console.log('Found token and user in localStorage, attempting to use them');
      try {
        // Try to parse the user data
        const userData = JSON.parse(userStr);
        // If we have valid user data, we can proceed
        if (userData && userData.role) {
          console.log('Valid user data found in localStorage:', userData.name);

          // Check role requirements
          if (requireAdmin && userData.role !== 'admin') {
            console.log('Admin access required but user is not admin');
            return <Navigate to="/employee/dashboard" replace />;
          }

          if (requireEmployee && userData.role === 'admin') {
            console.log('Employee access required but user is admin');
            return <Navigate to="/admin/dashboard" replace />;
          }

          // Set the user in the auth context
          // This is a workaround - normally we'd use the context's setter
          // but we don't have direct access to it here
          setTimeout(() => {
            // Force a refresh of the page to update the auth context
            window.location.reload();
          }, 100);

          // The component will re-render with the updated auth context
          return children || <Outlet />;
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    console.log('No valid authentication found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Handle redirection from old dashboard path
  if (location.pathname === '/dashboard') {
    const userRole = user?.user?.role || user?.role;
    return userRole === 'admin'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/employee/dashboard" replace />;
  }

  // Get user role with fallback
  const userRole = user?.user?.role || user?.role;

  // Check role requirements
  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/employee/dashboard" replace />;
  }

  if (requireEmployee && userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If children are provided, render them directly
  if (children) {
    return children;
  }

  // Determine which layout to use based on user role
  if (userRole === 'admin') {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  } else {
    return (
      <EmployeeLayout>
        <Outlet />
      </EmployeeLayout>
    );
  }
};

export default ProtectedRoute;
