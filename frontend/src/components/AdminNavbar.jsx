import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: 'fa-gauge' },
        { label: 'Pemesanan', path: '/admin/bookings', icon: 'fa-clipboard-list' },
        { label: 'Rute & Tarif', path: '/admin/routes', icon: 'fa-route' },
        { label: 'Galeri', path: '/admin/galleries', icon: 'fa-images' },
        { label: 'Blog', path: '/admin/blogs', icon: 'fa-blog' },
        { label: 'Profil Saya', path: '/admin/profile', icon: 'fa-user-gear' },
    ];

    return (
        <>
            {/* Header Tipis Khusus Mobile */}
            <div className="md:hidden sticky top-0 left-0 w-full bg-slate-900 text-white px-4 py-3 flex justify-between items-center z-40 shadow-md">
                <Link to="/admin/dashboard" className="font-extrabold text-sky-400 text-base flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-sky-400"></i>
                    <span>Dafatih Admin</span>
                </Link>
                <button
                    type="button"
                    className="text-white text-xl p-1 cursor-pointer focus:outline-none"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Buka Menu Sidebar"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Backdrop Gelap saat Sidebar Terbuka di Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Utama (Fixed di Desktop, Drawer di Mobile) */}
            <aside
                className={`fixed top-0 left-0 w-60 h-screen bg-slate-900 text-white flex flex-col justify-between z-50 shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="p-5 flex items-center justify-between border-b border-slate-800">
                        <Link to="/admin/dashboard" className="font-extrabold text-sky-400 text-lg flex items-center gap-2.5">
                            <i className="fa-solid fa-shield-halved text-sky-400 text-xl"></i>
                            <span>Dafatih Admin</span>
                        </Link>
                        <button
                            type="button"
                            className="md:hidden text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Navigasi Menu */}
                    <nav className="flex flex-col gap-1 p-3 overflow-y-auto max-h-[calc(100vh-160px)]">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#0194F3] text-white shadow-xs'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    <i className={`fa-solid ${item.icon} w-5 text-center text-sm`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Profil & Logout */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center gap-2.5 text-slate-300 text-xs font-semibold">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-user-gear text-sky-400 text-xs"></i>
                        </div>
                        <span className="truncate">{displayName}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminNavbar;
