import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Impor Halaman Portal Client Baru
import ClientDashboard from '@/pages/client/ClientDashboard';

// Impor Login & Admin
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/pages/admin/Dashboard';
import NotFound from '@/pages/NotFound';

export default function AppRouter() {
  return (
    <Routes>
      {/* Pengalihan Rute Utama ke Client Dashboard */}
      <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
      <Route path="/client/myorders" element={<Navigate to="/client/dashboard" replace />} />

      {/* Rute Dasbor Client */}
      <Route path="/client/dashboard" element={<ClientDashboard />} />

      {/* Auth Universal */}
      <Route path="/login" element={<Login />} />

      {/* Rute Admin Terproteksi */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
