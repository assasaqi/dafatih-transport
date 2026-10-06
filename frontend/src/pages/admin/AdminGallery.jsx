import React, { useEffect, useState, useRef } from 'react';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminGallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({ title: '', category: 'Destinasi' });
    const [imageFile, setImageFile] = useState(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    const containerRef = useRef(null);

    const loadGalleries = () => {
        setLoading(true);
        getGalleries()
            .then((res) => {
                if (res.data?.success) setGalleries(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadGalleries();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-wrapper')) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setActiveDropdownId((prev) => (prev === id ? null : id));
    };

    const handleOpenModal = (item = null) => {
        setActiveDropdownId(null);
        setImageFile(null);
        if (item) {
            setEditingId(item.id);
            setFormData({
                title: item.title || '',
                category: item.category || 'Destinasi'
            });
        } else {
            setEditingId(null);
            setFormData({ title: '', category: 'Destinasi' });
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editingId && !imageFile) {
            alert('Silakan pilih file gambar!');
            return;
        }

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('category', formData.category);
        if (imageFile) {
            submitData.append('image', imageFile);
        }

        try {
            if (editingId) {
                await updateGallery(editingId, submitData);
            } else {
                await createGallery(submitData);
            }
            handleCloseModal();
            loadGalleries();
        } catch (err) {
            alert('Gagal menyimpan foto galeri.');
        }
    };

    const handleDelete = async (id) => {
        setActiveDropdownId(null);
        if (window.confirm('Hapus foto dari galeri ini?')) {
            try {
                await deleteGallery(id);
                loadGalleries();
            } catch (err) {
                alert('Gagal menghapus foto.');
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
          padding-bottom: 60px;
          margin-bottom: -60px;
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
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-table tbody tr:hover {
          background-color: #f8fafc;
        }

        .gallery-img-thumb {
          width: 46px;
          height: 32px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          display: block;
          margin: 0 auto;
        }

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
          top: 36px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
          min-width: 120px;
          z-index: 999;
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
            max-width: 110px;
          }
        }
      `}</style>

            <AdminNavbar />

            <div className="admin-container" ref={containerRef}>
                <div className="admin-header-bar">
                    <div className="admin-title-area">
                        <h2>Kelola Galeri Foto</h2>
                        <p>Unggah dan edit foto kegiatan serta destinasi wisata Lombok.</p>
                    </div>
                    <button className="btn-add-primary" onClick={() => handleOpenModal()}>
                        <i className="fa-solid fa-plus"></i> Tambah Foto Baru
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px', fontSize: '1.2rem' }}></i> Memuat galeri...
                    </div>
                ) : (
                    <div className="table-card-wrapper">
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '55px', textAlign: 'center' }}>Foto</th>
                                        <th>Judul Foto / Keterangan</th>
                                        <th style={{ width: '140px' }}>Kategori</th>
                                        <th style={{ textAlign: 'center', width: '60px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {galleries.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                                Belum ada foto galeri yang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        galleries.map((item) => (
                                            <tr key={item.id}>
                                                <td style={{ textAlign: 'center' }}>
                                                    <img
                                                        src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : 'https://placehold.co/60x40?text=Foto'}
                                                        className="gallery-img-thumb"
                                                        alt={item.title}
                                                    />
                                                </td>
                                                <td style={{ fontWeight: 700, color: '#0f172a' }} className="cell-truncate" title={item.title}>
                                                    {item.title}
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '5px', fontWeight: 700 }}>
                                                        {item.category || 'Destinasi'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div className="dropdown-wrapper">
                                                        <button
                                                            className="btn-dropdown-toggle"
                                                            onClick={(e) => toggleDropdown(item.id, e)}
                                                            aria-label="Opsi"
                                                        >
                                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                                        </button>

                                                        {activeDropdownId === item.id && (
                                                            <div className="dropdown-menu-list">
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item-btn edit"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleOpenModal(item);
                                                                    }}
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square"></i> Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="dropdown-item-btn delete"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDelete(item.id);
                                                                    }}
                                                                >
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

                {/* Modal Form Tambah/Edit Foto */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1300, padding: '16px' }}>
                        <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxSizing: 'border-box', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                                {editingId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Judul Foto / Keterangan</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '14px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '6px', border: '1.5px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }}
                                    >
                                        <option value="Destinasi">Destinasi Wisata</option>
                                        <option value="Armada">Armada & Layanan</option>
                                        <option value="Aktivitas">Aktivitas Pelanggan</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#334155' }}>
                                        Upload Berkas Gambar {editingId && <span style={{ fontWeight: 400, color: '#64748b' }}>(Biarkan kosong jika tidak diubah)</span>}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required={!editingId}
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        style={{ width: '100%', fontSize: '0.8rem' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                                    >
                                        {editingId ? 'Simpan Perubahan' : 'Unggah Foto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminGallery;
