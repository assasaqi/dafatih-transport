import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Sembunyikan navbar utama jika sedang berada di halaman /admin/*
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Brand Logo */}
                <NavLink to="/" className="flex items-center gap-2 group decoration-none">
                    <div className="w-9 h-9 bg-[#0194F3] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-sky-600 transition-colors">
                        <i className="fa-solid fa-car-side text-lg"></i>
                    </div>
                    <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-[#0194F3] transition-colors">
                        Dafatih<span className="text-[#0194F3]">Transport</span>
                    </span>
                </NavLink>

                {/* Desktop Navigasi */}
                <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3] bg-sky-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`
                        }
                    >
                        Beranda
                    </NavLink>

                    <NavLink
                        to="/tarif"
                        className={({ isActive }) =>
                            `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3] bg-sky-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`
                        }
                    >
                        Daftar Tarif
                    </NavLink>

                    <NavLink
                        to="/galeri"
                        className={({ isActive }) =>
                            `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3] bg-sky-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`
                        }
                    >
                        Galeri
                    </NavLink>

                    <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                            `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3] bg-sky-50'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`
                        }
                    >
                        Blog
                    </NavLink>
                </nav>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan')}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <i className="fa-solid fa-[#0194F3] fa-paper-plane text-xs"></i>
                        <span>Pesan Sekarang</span>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
