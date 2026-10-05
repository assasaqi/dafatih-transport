import React, { useEffect, useState } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ pickup_location: '', dropoff_location: '', price: '' });
    const [imageFile, setImageFile] = useState(null);

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
    }, []);

    const handleOpenModal = (route = null) => {
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
          padding: 20px 5%;
          max-width: 1100px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .admin-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
        }

        .admin-title-area h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .admin-title-area p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .btn-add-primary {
          background: #0284c7;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* 🖥️ Mode Tablet & Desktop (Tabel) */
        .tablet-table-wrapper {
          display: block;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        /* Jarak antar tombol di Mode Tabel Desktop/Tablet */
        .action-buttons-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-action-edit {
          background: #f59e0b;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-action-delete {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* 📱 Mode Mobile (< 600px) */
        .mobile-routes-grid {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .route-card-mobile {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .route-card-content {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .route-card-img {
          width: 65px;
          height: 55px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .route-card-info {
          flex-grow: 1;
        }

        .route-card-title {
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .route-card-price {
          font-weight: 800;
          color: #0284c7;
          font-size: 0.85rem;
        }

        .route-card-actions {
          display: flex;
          flex-direction: row;
          gap: 10px;
          width: 100%;
        }

        .route-card-actions .btn-action-edit,
        .route-card-actions .btn-action-delete {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        @media (max-width: 600px) {
          .tablet-table-wrapper {
            display: none;
          }

          .mobile-routes-grid {
            display: flex;
          }

          .admin-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .btn-add-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

            <AdminNavbar />

            <div className="admin-container">
                <div className="admin-header-bar">
                    <div className="admin-title-area">
                        <h2>Kelola Rute & Tarif</h2>
                        <p>Atur daftar rute transfer dan tarif resmi.</p>
                    </div>
                    <button className="btn-add-primary" onClick={() => handleOpenModal()}>
                        <i className="fa-solid fa-plus"></i> Tambah Rute
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Memuat rute...
                    </div>
                ) : (
                    <>
                        {/* Tampilan Desktop / Tablet (Tabel) */}
                        <div className="tablet-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '70px' }}>Foto</th>
                                        <th>Penjemputan</th>
                                        <th>Tujuan</th>
                                        <th>Harga</th>
                                        <th style={{ textAlign: 'center', minWidth: '150px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routes.map((r) => (
                                        <tr key={r.id}>
                                            <td>
                                                <img
                                                    src={r.image_url ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5000${r.image_url}`) : 'https://placehold.co/60x40'}
                                                    style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                                                    alt={r.pickup_location}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{r.pickup_location}</td>
                                            <td style={{ fontWeight: 600 }}>{r.dropoff_location}</td>
                                            <td style={{ fontWeight: 700, color: '#0284c7' }}>Rp {Number(r.price).toLocaleString('id-ID')}</td>
                                            <td>
                                                <div className="action-buttons-cell">
                                                    <button className="btn-action-edit" onClick={() => handleOpenModal(r)}>Edit</button>
                                                    <button className="btn-action-delete" onClick={() => handleDelete(r.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tampilan Mobile (< 600px) */}
                        <div className="mobile-routes-grid">
                            {routes.map((r) => (
                                <div key={r.id} className="route-card-mobile">
                                    <div className="route-card-content">
                                        <img
                                            src={r.image_url ? (r.image_url.startsWith('http') ? r.image_url : `http://localhost:5000${r.image_url}`) : 'https://placehold.co/60x40'}
                                            className="route-card-img"
                                            alt={r.pickup_location}
                                        />
                                        <div className="route-card-info">
                                            <div className="route-card-title">{r.pickup_location} ➔ {r.dropoff_location}</div>
                                            <div className="route-card-price">Rp {Number(r.price).toLocaleString('id-ID')}</div>
                                        </div>
                                    </div>
                                    <div className="route-card-actions">
                                        <button className="btn-action-edit" onClick={() => handleOpenModal(r)}>Edit</button>
                                        <button className="btn-action-delete" onClick={() => handleDelete(r.id)}>Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Modal Form */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a' }}>{editingId ? 'Edit Rute' : 'Tambah Rute'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Lokasi Penjemputan</label>
                                    <input type="text" required value={formData.pickup_location} onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Lokasi Tujuan</label>
                                    <input type="text" required value={formData.dropoff_location} onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Tarif (Rp)</label>
                                    <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>File Gambar</label>
                                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} style={{ width: '100%', fontSize: '0.8rem' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Batal</button>
                                    <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Simpan</button>
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
