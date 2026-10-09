import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AppRouter from '@/routes/AppRouter';
import { useNotification } from '@/hooks/useNotification';

export default function App() {
    const location = useLocation();
    const { NotificationToast } = useNotification(4000); // Notifikasi otomatis hilang dalam 4 detik

    // Cek apakah halaman yang dibuka adalah halaman admin
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div
            className="app-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                width: '100%',
                overflowX: 'hidden'
            }}
        >
            {/* Toast Notifikasi Melayang (Tampil di atas semua elemen tanpa menutupi Navbar) */}
            <NotificationToast />

            {/* 1. Header & Navigasi Atas (Hanya untuk publik) */}
            {!isAdminRoute && <Navbar />}

            {/* 2. Rute Konten Utama Halaman */}
            <main className="main-content" style={{ flex: '1 0 auto', width: '100%' }}>
                <AppRouter />
            </main>

            {/* 3. Footer Bagian Bawah (Hanya untuk publik) */}
            {!isAdminRoute && <Footer />}

            {/* 4. Navigasi Melayang Bawah Khusus HP (Hanya untuk publik) */}
            {!isAdminRoute && <MobileBottomNav />}
        </div>
    );
}
