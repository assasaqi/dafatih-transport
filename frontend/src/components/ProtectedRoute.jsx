import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const location = useLocation();

  // 1. Ambil token dan data user dari localStorage
  const adminToken = localStorage.getItem('adminToken');
  const clientToken = localStorage.getItem('clientToken');

  // Ambil data admin atau client
  const adminUserStr = localStorage.getItem('adminUser');
  const clientUserStr = localStorage.getItem('clientUser');

  let adminUser = null;
  let clientUser = null;

  try {
    adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;
  } catch (e) {
    adminUser = null;
  }

  try {
    clientUser = clientUserStr ? JSON.parse(clientUserStr) : null;
  } catch (e) {
    clientUser = null;
  }

  // 2. Jika mencoba mengakses area Admin
  if (requiredRole === 'admin') {
    // Apabila tidak memiliki token admin atau role-nya bukan admin
    if (!adminToken || (adminUser && adminUser.role && adminUser.role !== 'admin')) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // 3. Jika mencoba mengakses area khusus Client/Pelanggan (misal: Halaman Pesan/Profil Pelanggan)
  if (requiredRole === 'client') {
    if (!clientToken && !adminToken) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
