import React, { useEffect, useState } from 'react';
import { getGalleries, createGallery, updateGallery, deleteGallery } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminGallery = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({ title: '', category: 'Destinasi' });
    const [imageFile, setImageFile] = useState(null);

    const loadGalleries = () => {
        setLoading(true);
        getGalleries()
            .then((res) => {
                if (res.data.success) setGalleries(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadGalleries();
    }, []);

    const handleOpenModal = (item = null) => {
        setImageFile(null);
        if (item) {
            setEditingId(item.id);
            setFormData({
                title: item.title,
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
            <AdminNavbar />
            <div style={{ padding: '24px 5%', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Kelola Galeri Foto</h2>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>Unggah dan edit foto kegiatan serta destinasi wisata Lombok.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                    >
                        + Tambah Foto Baru
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Memuat galeri...</div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px' }}>Foto</th>
                                    <th style={{ padding: '12px' }}>Judul Foto / Keterangan</th>
                                    <th style={{ padding: '12px' }}>Kategori</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {galleries.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Belum ada foto galeri.</td>
                                    </tr>
                                ) : (
                                    galleries.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '8px 12px' }}>
                                                <img
                                                    src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : 'https://placehold.co/60x40?text=Foto'}
                                                    alt={item.title}
                                                    style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{item.title}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                                    {item.category || 'Destinasi'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '0.75rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', width: '100%', maxWidth: '420px' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem' }}>
                                {editingId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Judul Foto / Keterangan</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', height: '36px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                                    >
                                        <option value="Destinasi">Destinasi Wisata</option>
                                        <option value="Armada">Armada & Layanan</option>
                                        <option value="Aktivitas">Aktivitas Pelanggan</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
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
                                        style={{ background: '#94a3b8', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        {editingId ? 'Simpan Perubahan' : 'Unggah'}
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
