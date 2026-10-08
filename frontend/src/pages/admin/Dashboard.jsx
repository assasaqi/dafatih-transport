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
        <div className="min-h-screen bg-[#F2F4F7] text-slate-800 md:pl-60 transition-all">
            <AdminNavbar />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

                {/* Banner Hero Header Diselaraskan dengan Home.jsx */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-sky-50 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Selamat Datang, <span className="text-[#0194F3]">{adminDisplayName}</span>!
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
                                Kelola seluruh pemesanan, daftar rute penjemputan, armada mobil, serta artikel blog Dafatih Transport dalam satu panel yang terintegrasi.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/profile')}
                            className="self-start sm:self-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <i className="fa-solid fa-user-gear text-[#0194F3]"></i>
                            <span>Pengaturan Profil</span>
                        </button>
                    </div>
                </div>

                {/* Grid Kartu Statistik Berstrik & Konsisten */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

                    {/* Card 1: Rute & Tarif */}
                    <div
                        onClick={() => navigate('/admin/routes')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Rute Transfer
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0194F3]">
                                {loading ? '...' : stats.totalRoutes}
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
                                Rute &amp; Tarif Aktif
                            </span>
                        </div>
                        <div className="w-13 h-13 rounded-xl bg-sky-50 text-[#0194F3] group-hover:bg-[#0194F3] group-hover:text-white transition-colors flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-route"></i>
                        </div>
                    </div>

                    {/* Card 2: Armada Mobil */}
                    <div
                        onClick={() => navigate('/admin/vehicles')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Armada Mobil
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-500">
                                {loading ? '...' : stats.totalVehicles}
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
                                Unit Siap Sewa
                            </span>
                        </div>
                        <div className="w-13 h-13 rounded-xl bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-car"></i>
                        </div>
                    </div>

                    {/* Card 3: Galeri */}
                    <div
                        onClick={() => navigate('/admin/galleries')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Foto Galeri
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                                {loading ? '...' : stats.totalGalleries}
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
                                Dokumentasi Kegiatan
                            </span>
                        </div>
                        <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-images"></i>
                        </div>
                    </div>

                    {/* Card 4: Blog */}
                    <div
                        onClick={() => navigate('/admin/blogs')}
                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Total Artikel Blog
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
                                {loading ? '...' : stats.totalBlogs}
                            </h2>
                            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
                                Artikel Dipublikasikan
                            </span>
                        </div>
                        <div className="w-13 h-13 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center text-xl shadow-xs">
                            <i className="fa-solid fa-blog"></i>
                        </div>
                    </div>
                </div>

                {/* Pintasan Akses Cepat Bergaya Form Hero */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-md">
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <i className="fa-solid fa-[#0194F3] fa-bolt text-[#0194F3]"></i>
                            Pintasan Manajemen Cepat
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">Navigasi Langsung</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/bookings')}
                            className="p-4 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/40 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0194F3] flex items-center justify-center mb-3 group-hover:bg-[#0194F3] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-clipboard-list text-sm"></i>
                            </div>
                            <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0194F3] block">Kelola Pemesanan</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Cek pesanan masuk</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/routes')}
                            className="p-4 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/40 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0194F3] flex items-center justify-center mb-3 group-hover:bg-[#0194F3] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-route text-sm"></i>
                            </div>
                            <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0194F3] block">Atur Rute &amp; Tarif</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Kelola harga lokasi</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/galleries')}
                            className="p-4 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/40 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0194F3] flex items-center justify-center mb-3 group-hover:bg-[#0194F3] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-images text-sm"></i>
                            </div>
                            <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0194F3] block">Upload Galeri</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Tambah dokumentasi</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/admin/blogs')}
                            className="p-4 rounded-xl border border-slate-200 hover:border-[#0194F3] hover:bg-sky-50/40 text-left transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                        >
                            <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0194F3] flex items-center justify-center mb-3 group-hover:bg-[#0194F3] group-hover:text-white transition-colors">
                                <i className="fa-solid fa-pen-to-square text-sm"></i>
                            </div>
                            <span className="text-xs font-extrabold text-slate-800 group-hover:text-[#0194F3] block">Tulis Blog</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Artikel &amp; berita</span>
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
