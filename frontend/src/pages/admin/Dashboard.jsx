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
        <div className="min-h-screen bg-slate-100 text-slate-800 md:pl-60 transition-all">
            <AdminNavbar />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* Header Ringkasan */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Dashboard Utama
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Selamat datang kembali, <strong className="text-[#0194F3] font-bold">{adminDisplayName}</strong>! Berikut adalah ringkasan data aplikasi Dafatih Transport.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/admin/profile')}
                        className="self-start sm:self-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <i className="fa-solid fa-user-gear text-[#0194F3]"></i>
                        <span>Pengaturan Profil</span>
                    </button>
                </div>

                {/* Grid Kartu Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Rute & Tarif */}
                    <div
                        onClick={() => navigate('/admin/routes')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Rute Transfer
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0194F3]">
                                {loading ? '...' : stats.totalRoutes}
                            </h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0194F3] group-hover:bg-[#0194F3] group-hover:text-white transition-colors flex items-center justify-center text-xl">
                            <i className="fa-solid fa-route"></i>
                        </div>
                    </div>

                    {/* Card 2: Armada Mobil */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Armada Mobil
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                                {loading ? '...' : stats.totalVehicles}
                            </h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-car"></i>
                        </div>
                    </div>

                    {/* Card 3: Galeri */}
                    <div
                        onClick={() => navigate('/admin/galleries')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Foto Galeri
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                                {loading ? '...' : stats.totalGalleries}
                            </h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center text-xl">
                            <i className="fa-solid fa-images"></i>
                        </div>
                    </div>

                    {/* Card 4: Blog */}
                    <div
                        onClick={() => navigate('/admin/blogs')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Artikel Blog
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                                {loading ? '...' : stats.totalBlogs}
                            </h2>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center text-xl">
                            <i className="fa-solid fa-blog"></i>
                        </div>
                    </div>
                </div>

                {/* Pintasan Akses Cepat */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                        Pintasan Manajemen
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/bookings')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
                        >
                            <i className="fa-solid fa-clipboard-list text-lg text-[#0194F3] mb-2 block"></i>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0194F3] block">Kelola Pemesanan</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/routes')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
                        >
                            <i className="fa-solid fa-route text-lg text-[#0194F3] mb-2 block"></i>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0194F3] block">Atur Rute &amp; Tarif</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/galleries')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
                        >
                            <i className="fa-solid fa-images text-lg text-[#0194F3] mb-2 block"></i>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0194F3] block">Upload Galeri</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/blogs')}
                            className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/50 text-left transition-all cursor-pointer group"
                        >
                            <i className="fa-solid fa-pen-to-square text-lg text-[#0194F3] mb-2 block"></i>
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#0194F3] block">Tulis Blog</span>
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
