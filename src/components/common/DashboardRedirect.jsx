import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  // Redirect based on user role
  return user?.role === 'admin' 
    ? <Navigate to="/admin/dashboard" replace /> 
    : <Navigate to="/employee/dashboard" replace />;
};

export default DashboardRedirect;
