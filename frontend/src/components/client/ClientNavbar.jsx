import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

const ClientNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [clientUser, setClientUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);

  // 1. Deteksi scroll layar untuk menyesuaikan tampilan header
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

  // 2. Membaca data pengguna client dari localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('clientUser');
    if (savedUser) {
      try {
        setClientUser(JSON.parse(savedUser));
      } catch (e) {
        setClientUser({ name: 'Juliadi' });
      }
    }
  }, []);

  // 3. Menutup dropdown profil saat mengklik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sembunyikan navbar utama jika sedang berada di area portal admin
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('clientUser');
    localStorage.removeItem('clientToken');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Bantuan', path: '/notfound' }, // Sesuaikan rute jika Anda menggunakan /bantuan
    { name: 'Galeri', path: '/galeri' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 sm:h-18'
          : 'bg-white/80 sm:bg-transparent backdrop-blur-sm h-18 sm:h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-2">

          {/* LOGO BRAND */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group decoration-none">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0194F3] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:bg-sky-600 transition-colors">
              <i className="fa-solid fa-car-side text-lg"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-[#0194F3] transition-colors">
                Dafatih<span className="text-[#0194F3]">Transport</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                Portal Pelanggan
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU NAVIGASI */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0194F3] text-white shadow-xs'
                      : 'text-slate-700 hover:text-[#0194F3] hover:bg-slate-100/60'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* AREA PROFIL USER & UTILITAS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Tombol Profil & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-300 hover:border-[#0194F3] bg-white/90 hover:bg-sky-50/80 backdrop-blur-md transition-all cursor-pointer shadow-xs"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0194F3] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {clientUser?.name || 'Juliadi'}
                </span>
                <i className={`fa-solid fa-chevron-down text-[11px] text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
              </button>

              {/* Menu Dropdown Profil */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Header Informasi Akun */}
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                      {clientUser?.name || 'Juliadi'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {clientUser?.email || 'rasmanassasaqi93@gmail.com'}
                    </p>
                  </div>

                  {/* Tombol Akses Cepat */}
                  <div className="p-2 border-b border-slate-100">
                    <Link
                      to="/pesan"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full py-2 px-3 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>Pesan Sekarang</span>
                    </Link>
                  </div>

                  {/* Link Tab Portal Pelanggan */}
                  <Link
                    to="/client/dashboard?tab=orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-[#0194F3] flex items-center gap-2.5 transition-colors"
                  >
                    <i className="fa-solid fa-receipt text-slate-400"></i>
                    <span>Pesanan Saya</span>
                  </Link>

                  <Link
                    to="/client/dashboard?tab=booking"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:text-[#0194F3] flex items-center gap-2.5 transition-colors"
                  >
                    <i className="fa-solid fa-calendar-check text-slate-400"></i>
                    <span>Form Booking</span>
                  </Link>

                  {/* Action Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-slate-100 mt-1"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tombol Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 text-lg cursor-pointer"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};

export default ClientNavbar;
