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
        <>
            <style>{`
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 5%;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .logo { font-size: 1.3rem; font-weight: 800; color: #0284c7; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .logo i { color: #f59e0b; }
        .desktop-nav { display: flex; gap: 25px; }
        .desktop-nav a { text-decoration: none; color: #334155; font-weight: 600; font-size: 0.95rem; transition: color 0.2s ease; }
        .desktop-nav a.active, .desktop-nav a:hover { color: #0284c7; }
        .header-actions { display: flex; align-items: center; gap: 8px; }
        .btn-header { background: #0284c7; color: #ffffff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: background 0.2s ease; }
        .btn-header:hover { background: #0369a1; }
        @media (max-width: 768px) {
          .desktop-nav, .header-actions { display: none !important; }
        }
      `}</style>

            <header className="main-header">
                <NavLink to="/" className="logo">
                    <i className="fa-solid fa-car-side"></i>
                    <span>Dafatih Transport</span>
                </NavLink>

                <nav className="desktop-nav">
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Beranda</NavLink>
                    <NavLink to="/tarif" className={({ isActive }) => (isActive ? 'active' : '')}>Daftar Tarif</NavLink>
                    {/* <NavLink to="/mobil" className={({ isActive }) => (isActive ? 'active' : '')}>Mobil</NavLink> */}
                    <NavLink to="/galeri" className={({ isActive }) => (isActive ? 'active' : '')}>Galeri</NavLink>
                    <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>Blog</NavLink>
                </nav>

                <div className="header-actions">
                    <button className="btn-header" onClick={() => navigate('/pesan')}>Pesan Sekarang</button>
                </div>
            </header>
        </>
    );
};

export default Navbar;
