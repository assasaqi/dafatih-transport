import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';

// Import aset logo
import logoImg from '/logo/logo.png';
import logo2Img from '/logo/logo2.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef(null);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // State untuk data sesi pengguna
    const [clientUser, setClientUser] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const isHomePage = location.pathname === '/';

    // Handle Scroll Header
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

    // Handle Klik di Luar Dropdown untuk Menutup Menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load User & Toast dari LocalStorage / Location State
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);

        const storedUser = localStorage.getItem('clientUser');
        if (storedUser) {
            try {
                setClientUser(JSON.parse(storedUser));
            } catch (err) {
                console.error('Gagal membaca data clientUser:', err);
            }
        } else {
            setClientUser(null);
        }

        if (location.state?.message) {
            setToastMessage(location.state.message);
            const timer = setTimeout(() => setToastMessage(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('clientToken');
        localStorage.removeItem('clientUser');
        setClientUser(null);
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    const currentLogo = isHomePage && !isScrolled ? logoImg : logo2Img;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled || isMobileMenuOpen || !isHomePage
                    ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16'
                    : 'bg-transparent h-20'
            }`}
        >
            {/* Pop-up Toast Penanda Sesi */}
            {toastMessage && (
                <div className="bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md animate-in fade-in duration-200">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

                {/* Brand Logo */}
                <NavLink to="/" className="flex items-center group decoration-none shrink-0">
                    <img
                        src={currentLogo}
                        alt="Dafatih Transport Logo"
                        className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                            isScrolled || !isHomePage ? 'h-9 sm:h-24 lg:h-24' : 'h-10 sm:h-24 lg:h-24'
                        }`}
                    />
                </NavLink>

                {/* Desktop Navigasi Utama (Hanya Tampil di Layar XL/Lebar agar tidak berhimpitan di Tablet) */}
                <nav className="hidden xl:flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/60 shadow-xs">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive ? 'text-[#0194F3]' : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Beranda
                    </NavLink>
                    <NavLink
                        to="/mobil"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive ? 'text-[#0194F3]' : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Armada
                    </NavLink>
                    <NavLink
                        to="/tarif"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive ? 'text-[#0194F3]' : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Rute &amp; Tarif
                    </NavLink>
                    <NavLink
                        to="/galeri"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive ? 'text-[#0194F3]' : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Galeri
                    </NavLink>
                    <NavLink
                        to="/blog"
                        className={({ isActive }) =>
                            `px-3 py-1.5 text-xs sm:text-sm font-bold transition-all ${
                                isActive ? 'text-[#0194F3]' : 'text-slate-700 hover:text-[#0194F3]'
                            }`
                        }
                    >
                        Blog
                    </NavLink>
                </nav>

                {/* Header Actions (Mulai Tampil dari Layar Medium `md`) */}
                <div className="hidden md:flex items-center gap-3 shrink-0">
                    {clientUser ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* Tombol Trigger Profil Navbar */}
                            <button
                                type="button"
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2.5 bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/90 pl-2 pr-3 py-1.5 rounded-2xl shadow-xs transition-all cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-[#0194F3] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-xs">
                                    {clientUser.name ? clientUser.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-extrabold text-slate-900 leading-none">
                                        {clientUser.name?.split(' ')[0]}
                                    </p>
                                    <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">
                                        • Sesi Aktif
                                    </span>
                                </div>
                                <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-200 ${
                                    isProfileMenuOpen ? 'rotate-180' : ''
                                }`}></i>
                            </button>

                            {/* Dropdown Menu Klien Desktop */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                                    <div className="py-2 text-xs font-bold text-slate-700 divide-y divide-slate-100">
                                        <div className="py-1">
                                            <Link
                                                to="/profile/edit"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <i className="fa-regular fa-user text-sm text-[#0194F3] w-5 text-center"></i>
                                                <span>Edit Profil Saya</span>
                                            </Link>
                                            <Link
                                                to="/my-bookings"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <i className="fa-solid fa-receipt text-sm text-[#0194F3] w-5 text-center"></i>
                                                <span>Pesanan Saya</span>
                                            </Link>
                                            <Link
                                                to="/payments"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <i className="fa-regular fa-credit-card text-sm text-[#0194F3] w-5 text-center"></i>
                                                <span>Riwayat Pembayaran</span>
                                            </Link>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/refunds"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <i className="fa-solid fa-rotate-left text-sm text-[#0194F3] w-5 text-center"></i>
                                                    <span>Pengajuan Refund</span>
                                                </div>
                                                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                                                    Baru!
                                                </span>
                                            </Link>
                                            <Link
                                                to="/promos"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                                            >
                                                <i className="fa-regular fa-envelope text-sm text-[#0194F3] w-5 text-center"></i>
                                                <span>Info Promo &amp; Diskon</span>
                                            </Link>
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 text-rose-600 transition-colors text-left cursor-pointer"
                                            >
                                                <i className="fa-solid fa-power-off text-sm w-5 text-center"></i>
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-[#0194F3] hover:bg-slate-100/80 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-right-to-bracket text-xs"></i>
                                <span>Login</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="bg-[#0194F3] hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                                <i className="fa-solid fa-user-plus text-xs"></i>
                                <span>Daftar</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Tombol Hamburger Mobile/Tablet (Tampil di Layar < XL) */}
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="xl:hidden text-slate-700 hover:text-[#0194F3] text-xl p-2 rounded-xl cursor-pointer transition-colors"
                >
                    <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>

            </div>

            {/* Dropdown Menu Mobile & Tablet (< XL) */}
            {isMobileMenuOpen && (
                <div className="xl:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200/80 px-4 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">

                    {/* Halaman Utama Navigasi */}
                    <div className="flex flex-col space-y-1">
                        <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Navigasi Utama</p>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    isActive ? 'bg-sky-50 text-[#0194F3]' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            Beranda
                        </NavLink>
                        <NavLink
                            to="/mobil"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    isActive ? 'bg-sky-50 text-[#0194F3]' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            Armada
                        </NavLink>
                        <NavLink
                            to="/tarif"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    isActive ? 'bg-sky-50 text-[#0194F3]' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            Rute &amp; Tarif
                        </NavLink>
                        <NavLink
                            to="/galeri"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    isActive ? 'bg-sky-50 text-[#0194F3]' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            Galeri
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                `px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                                    isActive ? 'bg-sky-50 text-[#0194F3]' : 'text-slate-700 hover:bg-slate-50'
                                }`
                            }
                        >
                            Blog
                        </NavLink>
                    </div>

                    {/* Area Akun Klien Lengkap (Diperbaiki agar seluruh fitur profil muncul) */}
                    <div className="pt-3 border-t border-slate-100">
                        {clientUser ? (
                            <div className="space-y-1">
                                <p className="px-3 text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Akun Saya ({clientUser.name?.split(' ')[0]})</p>

                                <Link
                                    to="/profile/edit"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <i className="fa-regular fa-user text-[#0194F3] w-4 text-center"></i>
                                    <span>Edit Profil Saya</span>
                                </Link>

                                <Link
                                    to="/my-bookings"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <i className="fa-solid fa-receipt text-[#0194F3] w-4 text-center"></i>
                                    <span>Pesanan Saya</span>
                                </Link>

                                <Link
                                    to="/payments"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <i className="fa-regular fa-credit-card text-[#0194F3] w-4 text-center"></i>
                                    <span>Riwayat Pembayaran</span>
                                </Link>

                                <Link
                                    to="/refunds"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-rotate-left text-[#0194F3] w-4 text-center"></i>
                                        <span>Pengajuan Refund</span>
                                    </div>
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                                        Baru!
                                    </span>
                                </Link>

                                <Link
                                    to="/promos"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                    <i className="fa-regular fa-envelope text-[#0194F3] w-4 text-center"></i>
                                    <span>Info Promo &amp; Diskon</span>
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
                                >
                                    <i className="fa-solid fa-right-from-bracket text-xs"></i>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/login');
                                    }}
                                    className="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <i className="fa-solid fa-right-to-bracket text-xs"></i>
                                    <span>Login</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/register');
                                    }}
                                    className="flex-1 bg-[#0194F3] hover:bg-sky-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <i className="fa-solid fa-user-plus text-xs"></i>
                                    <span>Daftar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
