import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// Import kedua aset logo dari folder public/logo
import logoImg from '/logo/logo.png';
import logo2Img from '/logo/logo2.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Cek apakah halaman yang sedang dibuka adalah halaman Beranda (Home)
    const isHomePage = location.pathname === '/';

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

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    // Tentukan logo mana yang akan ditampilkan
    // Jika halaman Home & belum discroll: logoImg
    // Jika halaman Home & discroll ATAU berada di halaman lain: logo2Img
    const currentLogo = isHomePage && !isScrolled ? logoImg : logo2Img;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled || isMobileMenuOpen || !isHomePage
                    ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16'
                    : 'bg-transparent h-20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Brand Logo Pengondisian Halaman & Scroll */}
                <NavLink to="/" className="flex items-center group decoration-none">
                    <img
                        src={currentLogo}
                        alt="Dafatih Transport Logo"
                        className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                            isScrolled || !isHomePage ? 'h-10 sm:h-24' : 'h-12 sm:h-24'
                        }`}
                    />
                </NavLink>

                {/* Desktop Navigasi */}
                <nav className="hidden md:flex items-center gap-1 sm:gap-2 bg-white/75 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/60 shadow-xs">
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

                {/* Header Actions Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate('/pesan')}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                        <span>Pesan Sekarang</span>
                    </button>
                </div>

                {/* Tombol Hamburger Menu Mobile */}
                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden text-slate-700 hover:text-[#0194F3] text-xl p-2 rounded-xl cursor-pointer transition-colors"
                >
                    <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </button>

            </div>

            {/* Dropdown Menu Mobile */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200/80 px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-1">
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

                    <div className="pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate('/pesan');
                            }}
                            className="w-full bg-[#0194F3] hover:bg-sky-600 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="fa-solid fa-paper-plane text-xs"></i>
                            <span>Pesan Sekarang</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
