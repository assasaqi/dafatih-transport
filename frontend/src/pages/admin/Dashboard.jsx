import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles, getRoutes, getGalleries, getBlogs } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const Dashboard = () => {
    const navigate = useNavigate();

    // Fungsi membaca nama/email admin dari localStorage
    const getAdminDisplayName = () => {
        try {
            const saved = localStorage.getItem('adminUser');
            if (!saved) return 'Admin';

            if (!saved.startsWith('{')) {
                return saved;
            }

            const parsed = JSON.parse(saved);
            return parsed.name || parsed.email || 'Admin';
        } catch (e) {
            return 'Admin';
        }
    };

    const adminDisplayName = getAdminDisplayName();

    const [stats, setStats] = useState({
        totalVehicles: 0,
        totalRoutes: 0,
        totalGalleries: 0,
        totalBlogs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ambil data statistik dari seluruh endpoint backend
        Promise.all([
            getVehicles().catch(() => ({ data: { data: [] } })),
            getRoutes().catch(() => ({ data: { data: [] } })),
            getGalleries().catch(() => ({ data: { data: [] } })),
            getBlogs().catch(() => ({ data: { data: [] } }))
        ])
            .then(([resVehicles, resRoutes, resGalleries, resBlogs]) => {
                setStats({
                    totalVehicles: resVehicles.data.data?.length || 0,
                    totalRoutes: resRoutes.data.data?.length || 0,
                    totalGalleries: resGalleries.data.data?.length || 0,
                    totalBlogs: resBlogs.data.data?.length || 0
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data statistik:', err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <AdminNavbar />

            <div style={{ padding: '24px 5%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Ringkasan */}
                <div style={{
                    marginBottom: '24px',
                    paddingBottom: '14px',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Dashboard Utama
                    </h1>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                        Selamat datang kembali, <strong>{adminDisplayName}</strong>! Berikut adalah ringkasan data aplikasi Dafatih Transport.
                    </p>
                </div>

                {/* Grid Kartu Statistik */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '30px'
                }}>
                    <div style={{ background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Armada Mobil</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '6px 0 0 0' }}>
                            {loading ? '...' : stats.totalVehicles}
                        </h2>
                    </div>

                    <div style={{ background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Rute Transfer</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '6px 0 0 0' }}>
                            {loading ? '...' : stats.totalRoutes}
                        </h2>
                    </div>

                    <div style={{ background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Foto Galeri</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '6px 0 0 0' }}>
                            {loading ? '...' : stats.totalGalleries}
                        </h2>
                    </div>

                    <div style={{ background: '#fff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Artikel Blog</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '6px 0 0 0' }}>
                            {loading ? '...' : stats.totalBlogs}
                        </h2>
                    </div>
                </div>
          </div>
        </>
    );
};

export default Dashboard;
