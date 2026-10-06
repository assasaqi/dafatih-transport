import React, { useEffect, useState, useRef } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ pickup_location: '', dropoff_location: '', price: '' });
    const [imageFile, setImageFile] = useState(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    const dropdownRef = useRef(null);

    const loadRoutes = () => {
        setLoading(true);
        getRoutes()
            .then((res) => {
                if (res.data.success) setRoutes(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadRoutes();

        // Menutup dropdown saat mengklik area di luar dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleOpenModal = (route = null) => {
        setActiveDropdownId(null);
        setImageFile(null);
        if (route) {
            setEditingId(route.id);
            setFormData({
                pickup_location: route.pickup_location,
                dropoff_location: route.dropoff_location,
                price: route.price
            });
        } else {
            setEditingId(null);
            setFormData({ pickup_location: '', dropoff_location: '', price: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('pickup_location', formData.pickup_location);
        submitData.append('dropoff_location', formData.dropoff_location);
        submitData.append('price', formData.price);
        if (imageFile) submitData.append('image', imageFile);

        try {
            if (editingId) await updateRoute(editingId, submitData);
            else await createRoute(submitData);
            setModalOpen(false);
            loadRoutes();
        } catch (err) {
            alert('Gagal menyimpan rute.');
        }
    };

    const handleDelete = async (id) => {
        setActiveDropdownId(null);
        if (window.confirm('Hapus rute ini?')) {
            try {
                await deleteRoute(id);
                loadRoutes();
            } catch (err) {
                alert('Gagal menghapus rute.');
            }
        }
    };

    return (
        <>
            <style>{`
        .admin-container {
          padding: 24px 5%;
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .admin-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .admin-title-area h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .admin-title-area p {
          font-size: 0.82rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .btn-add-primary {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 4px rgba(2, 132, 199, 0.2);
          transition: background 0.2s;
        }

        .btn-add-primary:hover {
          background: #0369a1;
        }

        /* Pembungkus Tabel */
        .table-card-wrapper {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.82rem;
          min-width: 480px;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 12px 14px;
          border-bottom: 1.5px solid #e2e8f0;
          color: #475569;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 10px 14px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
          white-space: nowrap;
        }

        .cell-truncate {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-table tbody tr:hover {
          background-color: #f8fafc;
        }

        .route-img-thumb {
          width: 46px;
          height: 32px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          display: block;
          margin: 0 auto;
        }

        /* Style Dropdown Aksi */
        .dropdown-wrapper {
          position: relative;
          display: inline-block;
        }

        .btn-dropdown-toggle {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-dropdown-toggle:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .dropdown-menu-list {
          position: absolute;
          right: 0;
          top: 38px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 120px;
          z-index: 100;
          overflow: hidden;
          padding: 4px 0;
        }

        .dropdown-item-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 8px 12px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.15s;
        }

        .dropdown-item-btn.edit {
          color: #d97706;
        }

        .dropdown-item-btn.edit:hover {
          background: #fef3c7;
        }

        .dropdown-item-btn.delete {
          color: #dc2626;
        }

        .dropdown-item-btn.delete:hover {
          background: #fee2e2;
        }

        @media (max-width: 640px) {
          .admin-header-bar {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add-primary {
            width: 100%;
            justify-content: center;
          }

          .admin-container {
            padding: 16px 3%;
          }

          .cell-truncate {
            max-width: 90px;
          }
        }
      `}</style>

            <AdminNavbar />

            <div className="admin-container">
                <div className="admin-header-bar">
                    <div className="admin-title-area">
                        <h2>Kelola Rute & Tarif</h2>
                        <p>Atur daftar rute transfer dan tarif resmi aplikasi.</p>
                    </div>
                    <button className="btn-add-primary" onClick={() => handleOpenModal()}>
                        <i className="fa-solid fa-plus"></i> Tambah Rute
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i> Memuat daftar rute...
                    </div>
                ) : (
                    <div className="table-card-wrapper">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '55px', textAlign: 'center' }}>Foto</th>
                                        <th>Penjemputan</th>
                                        <th>Tujuan</th>
                                        <th>Tarif</th>
                                        <th style={{ textAlign: 'center', width: '60px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                                Belum ada data rute yang tersimpan.
                                            </td>
                                        </tr>
                                    ) : (
                                        routes.map((r) => (
                                            <tr key={r.id}>
                                                <td style={{ textAlign: 'center' }}>
                                                    <img
                                                        src={r.image_url ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5000${r.image_url}`) : 'https://placehold.co/60x40'}
                                                        className="route-img-thumb"
                                                        alt={r.pickup_location}
                                                    />
                                                </td>
                                                <td style={{ fontWeight: 600 }} className="cell-truncate" title={r.pickup_location}>
                                                    {r.pickup_location}
                                                </td>
                                                <td style={{ fontWeight: 600 }} className="cell-truncate" title={r.dropoff_location}>
                                                    {r.dropoff_location}
                                                </td>
                                                <td style={{ fontWeight: 800, color: '#0284c7' }}>
                                                    Rp {Number(r.price).toLocaleString('id-ID')}
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="dropdown-wrapper" ref={activeDropdownId === r.id ? dropdownRef : null}>
                                                        <button
                                                            className="btn-dropdown-toggle"
                                                            onClick={(e) => toggleDropdown(r.id, e)}
                                                            aria-label="Opsi"
                                                        >
                                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                                        </button>

                                                        {activeDropdownId === r.id && (
                                                            <div className="dropdown-menu-list">
                                                                <button className="dropdown-item-btn edit" onClick={() => handleOpenModal(r)}>
                                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                                </button>
                                                                <button className="dropdown-item-btn delete" onClick={() => handleDelete(r.id)}>
                                                                    <i className="fa-solid fa-trash"></i> Hapus
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal Form Tambah/Edit */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '16px' }}>
                        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxSizing: 'border-box', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                                {editingId ? 'Edit Data Rute' : 'Tambah Rute Baru'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Lokasi Penjemputan</label>
                                    <input type="text" required value={formData.pickup_location} onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Lokasi Tujuan</label>
                                    <input type="text" required value={formData.dropoff_location} onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Tarif (Rp)</label>
                                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Gambar Rute (Opsional)</label>
                                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ width: '100%', fontSize: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>Batal</button>
                                    <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>Simpan Rute</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminRoutes;
