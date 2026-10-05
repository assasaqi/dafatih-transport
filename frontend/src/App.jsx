import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileBottomNav from '@/components/MobileBottomNav';
import AppRouter from '@/routes/AppRouter';

export default function App() {
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
            {/* 1. Header & Navigasi Atas (Desktop) */}
            <Navbar />

            {/* 2. Rute Konten Utama Halaman */}
            <main className="main-content" style={{ flex: '1 0 auto', width: '100%' }}>
                <AppRouter />
            </main>

            {/* 3. Footer Bagian Bawah */}
            <Footer />

            {/* 4. Navigasi Melayang Bawah Khusus Tampilan HP */}
            <MobileBottomNav />
        </div>
    );
}
