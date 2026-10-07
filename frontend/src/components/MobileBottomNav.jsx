import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
    const location = useLocation();

    // Sembunyikan bottom nav jika sedang di area /admin/*
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <style>{`
        .mobile-bottom-nav { display: none; }
        @media (max-width: 992px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
            box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
            z-index: 1500;
            justify-content: space-around;
            align-items: center;
          }
          .mobile-nav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; height: 100%; text-decoration: none; color: #94a3b8; font-size: 0.68rem; font-weight: 600; }
          .mobile-nav-item i { font-size: 1.15rem; margin-bottom: 2px; }
          .mobile-nav-item.active { color: #0284c7; }
        }
      `}</style>

            <div className="mobile-bottom-nav">
                <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-house"></i><span>Beranda</span></NavLink>
                {/* <NavLink to="/tarif" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-table-list"></i><span>Tarif</span></NavLink> */}
                {/* <NavLink to="/mobil" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-car"></i><span>Mobil</span></NavLink> */}
                <NavLink to="/pesan" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-circle-plus"></i><span>Pesan</span></NavLink>
                <NavLink to="/galeri" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-images"></i><span>Galeri</span></NavLink>
                <NavLink to="/blog" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}><i className="fa-solid fa-blog"></i><span>Blog</span></NavLink>
            </div>
        </>
    );
};

export default MobileBottomNav;
