import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('authToken'); // Check if user is logged in (by token)
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
