import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Import aset logo dari folder public/logo
import logoImg from '/logo/logo.png';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Ambil & parse data admin dari localStorage
    const getAdminData = () => {
        try {
            const saved = localStorage.getItem('adminUser');
            if (!saved) return { name: 'Admin', email: '' };

            if (!saved.startsWith('{')) {
                return { name: saved, email: saved };
            }

            return JSON.parse(saved);
        } catch (e) {
            return { name: 'Admin', email: '' };
        }
    };

    const adminData = getAdminData();
    const displayName = adminData.name || adminData.email || 'Admin';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    // Daftar Menu Navigasi Admin
    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'fa-gauge' },
        { label: 'Pemesanan', path: '/admin/bookings', icon: 'fa-clipboard-list' },
        { label: 'Armada Mobil', path: '/admin/vehicles', icon: 'fa-car' },
        { label: 'Rute & Tarif', path: '/admin/routes', icon: 'fa-route' },
        { label: 'Galeri', path: '/admin/galleries', icon: 'fa-images' },
        { label: 'Blog', path: '/admin/blogs', icon: 'fa-blog' },
        { label: 'Profil Saya', path: '/admin/profile', icon: 'fa-user-gear' },
    ];

    return (
        <>
            {/* Header Mobile Tipis */}
            <div className="md:hidden sticky top-0 left-0 w-full bg-slate-900 text-white px-4 py-3 flex justify-between items-center z-40 shadow-md">
                <Link to="/admin/dashboard" className="flex items-center">
                    <img
                        src={logoImg}
                        alt="Dafatih Transport Logo"
                        className="h-14 w-auto object-contain"
                    />
                </Link>
                <button
                    type="button"
                    className="text-white text-xl p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer focus:outline-hidden"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Buka Menu Sidebar"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Backdrop Gelap Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Utama */}
            <aside
                className={`fixed top-0 left-0 w-60 h-screen bg-slate-900 text-white flex flex-col justify-between z-50 shadow-2xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Brand Header Menggunakan Gambar Logo */}
                    <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
                        <Link to="/admin/dashboard" className="flex items-center">
                            <img
                                src={logoImg}
                                alt="Dafatih Transport Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <button
                            type="button"
                            className="md:hidden text-slate-400 hover:text-white text-base p-1 cursor-pointer"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Navigasi Menu */}
                    <nav className="flex flex-col gap-1 p-3 overflow-y-auto max-h-[calc(100vh-175px)]">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Menu Utama
                        </div>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#0194F3] text-white shadow-md shadow-sky-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <i className={`fa-solid ${item.icon} w-5 text-center text-sm ${
                                            isActive ? 'text-white' : 'text-slate-400'
                                        }`}></i>
                                        <span>{item.label}</span>
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Profil & Logout */}
                <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 px-1 py-0.5">
                        <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[#0194F3] flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-user-gear text-xs"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-200 block truncate leading-tight">
                                {displayName}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Online
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full bg-red-600/90 hover:bg-red-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Keluar Akun</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminNavbar;
