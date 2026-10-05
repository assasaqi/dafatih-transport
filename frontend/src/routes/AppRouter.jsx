import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Impor Halaman Publik
import Home from '@/pages/Home';
import Tariffs from '@/pages/Tariffs';
import Booking from '@/pages/Booking';
import Gallery from '@/pages/Gallery';
import Blog from '@/pages/Blog';
import Mobil from '@/pages/Mobil';
import NotFound from '@/pages/NotFound';

// Impor Halaman Admin & Proteksi Route
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import AdminRoutes from '@/pages/admin/AdminRoutes';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminProfile from '@/pages/admin/AdminProfile'; // <-- IMPOR INI YANG MENGATASI ERROR

export default function AppRouter() {
    return (
        <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<Home />} />
            <Route path="/tarif" element={<Tariffs />} />
            <Route path="/pesan" element={<Booking />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/mobil" element={<Mobil />} />

            {/* Rute Admin Auth */}
            <Route path="/admin/login" element={<Login />} />

            {/* Rute Admin Terproteksi */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/routes"
                element={
                    <ProtectedRoute>
                        <AdminRoutes />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/bookings"
                element={
                    <ProtectedRoute>
                        <AdminBookings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/galleries"
                element={
                    <ProtectedRoute>
                        <AdminGallery />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/blogs"
                element={
                    <ProtectedRoute>
                        <AdminBlog />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/profile"
                element={
                    <ProtectedRoute>
                        <AdminProfile />
                    </ProtectedRoute>
                }
            />

            {/* Fallback Rute Tidak Ditemukan */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
