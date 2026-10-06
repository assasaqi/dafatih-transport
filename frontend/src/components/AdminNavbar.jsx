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

            // Jika tersimpan sebagai string biasa/email lama
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
        // { label: 'Mobil', path: '/admin/vehicles', icon: 'fa-car' },
        { label: 'Rute & Tarif', path: '/admin/routes', icon: 'fa-route' },
        { label: 'Galeri', path: '/admin/galleries', icon: 'fa-images' },
        { label: 'Blog', path: '/admin/blogs', icon: 'fa-blog' },
        { label: 'Profil Saya', path: '/admin/profile', icon: 'fa-user-gear' },
    ];

    return (
        <>
            <style>{`
        /* Spasi Konten Utama agar Tidak Tertutup Sidebar di Desktop */
        body {
          margin: 0;
          padding-left: 240px;
          transition: padding-left 0.3s ease;
        }

        /* Sidebar Style Desktop */
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: 240px;
          height: 100vh;
          background: #0f172a;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 1200;
          box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          transition: transform 0.3s ease;
        }

        .sidebar-brand {
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #1e293b;
        }

        .admin-logo {
          font-size: 1.15rem;
          font-weight: 800;
          color: #38bdf8;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sidebar-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 12px;
          flex-grow: 1;
          overflow-y: auto;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .sidebar-nav-item i {
          width: 20px;
          text-align: center;
          font-size: 1rem;
        }

        .sidebar-user-footer {
          padding: 16px;
          background: #090d16;
          border-top: 1px solid #1e293b;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .user-info-text {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .btn-sidebar-logout {
          width: 100%;
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.2s ease;
        }

        .btn-sidebar-logout:hover {
          background: #dc2626;
        }

        /* Top Bar Mobile */
        .mobile-header-bar {
          display: none;
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          background: #0f172a;
          color: #fff;
          padding: 12px 16px;
          justify-content: space-between;
          align-items: center;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
        }

        .mobile-toggle-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 4px;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 1150;
        }

        /* Breakpoint Mobile (< 768px) */
        @media (max-width: 768px) {
          body {
            padding-left: 0 !important;
          }

          .mobile-header-bar {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(-100%);
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay.open {
            display: block;
          }
        }
      `}</style>

            {/* Header Tipis Mobile */}
            <div className="mobile-header-bar">
                <Link to="/admin/dashboard" className="admin-logo">
                    Dafatih Admin
                </Link>
                <button
                    className="mobile-toggle-btn"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open Sidebar"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
            </div>

            {/* Backdrop Gelap Mobile */}
            <div
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Utama */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div>
                    <div className="sidebar-brand">
                        <Link to="/admin/dashboard" className="admin-logo">
                            <i className="fa-solid fa-shield-halved" style={{ color: '#38bdf8' }}></i>
                            <span>Dafatih Admin</span>
                        </Link>
                    </div>

                    <nav className="sidebar-nav-list">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="sidebar-nav-item"
                                    onClick={() => setIsSidebarOpen(false)}
                                    style={{
                                        color: isActive ? '#ffffff' : '#94a3b8',
                                        background: isActive ? '#0284c7' : 'transparent',
                                    }}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="sidebar-user-footer">
                    <div className="user-info-text">
                        <i className="fa-solid fa-user-gear" style={{ color: '#38bdf8' }}></i>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {displayName}
                        </span>
                    </div>
                    <button className="btn-sidebar-logout" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminNavbar;
