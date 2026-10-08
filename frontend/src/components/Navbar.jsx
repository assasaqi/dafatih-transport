import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    // Deteksi scroll layar untuk menyesuaikan gaya Navbar saat digulir ke bawah
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sembunyikan navbar utama jika sedang berada di halaman /admin/*
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16'
                    : 'bg-transparent h-20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Brand Logo */}
                <NavLink to="/" className="flex items-center gap-2 group decoration-none">
                    <div className="w-9 h-9 bg-[#0194F3] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-sky-600 transition-colors">
                        <i className="fa-solid fa-car-side text-lg"></i>
                    </div>
                    <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight group-hover:text-[#0194F3] transition-colors">
                        Dafatih<span className="text-[#0194F3]">Transport</span>
                    </span>
                </NavLink>

                {/* Desktop Navigasi (Wadah Kapsul Kaca Semi-Transparan) */}
                <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-white/75 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/60 shadow-xs">
                    <NavLink
                        to="/notfound"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3]'
                                    : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Bantuan
                    </NavLink>

                    {/* <NavLink
                        to="/tarif"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3]'
                                    : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Tarif Antar-Jemput
                    </NavLink> */}

                    <NavLink
                        to="/galeri"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3]'
                                    : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Galeri
                    </NavLink>

                    <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'text-[#0194F3]'
                                    : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Blog
                    </NavLink>
                </nav>

                {/* Header Actions */}
                <div className="hidden sm:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan')}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                        <span>Pesan Sekarang</span>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
