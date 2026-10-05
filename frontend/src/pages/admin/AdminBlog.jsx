import React, { useEffect, useState } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', excerpt: '', content: '' });
    const [imageFile, setImageFile] = useState(null);

    const loadBlogs = () => {
        setLoading(true);
        getBlogs()
            .then((res) => {
                if (res.data.success) setBlogs(res.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const handleOpenModal = (blog = null) => {
        setImageFile(null);
        if (blog) {
            setEditingId(blog.id);
            setFormData({ title: blog.title, excerpt: blog.excerpt || '', content: blog.content || '' });
        } else {
            setEditingId(null);
            setFormData({ title: '', excerpt: '', content: '' });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('excerpt', formData.excerpt);
        submitData.append('content', formData.content);
        if (imageFile) submitData.append('image', imageFile);

        try {
            if (editingId) await updateBlog(editingId, submitData);
            else await createBlog(submitData);
            setModalOpen(false);
            loadBlogs();
        } catch (err) {
            alert('Gagal menyimpan artikel.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus artikel ini?')) {
            try {
                await deleteBlog(id);
                loadBlogs();
            } catch (err) {
                alert('Gagal menghapus artikel.');
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
        .mobile-blogs-grid {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .blog-card-mobile {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .blog-card-content {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .blog-card-img {
          width: 65px;
          height: 55px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .blog-card-info {
          flex-grow: 1;
        }

        .blog-card-title {
          font-weight: 700;
          font-size: 0.88rem;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .blog-card-excerpt {
          font-size: 0.78rem;
          color: #64748b;
        }

        .blog-card-actions {
          display: flex;
          flex-direction: row;
          gap: 10px;
          width: 100%;
        }

        .blog-card-actions .btn-action-edit,
        .blog-card-actions .btn-action-delete {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.8rem;
        }

        @media (max-width: 600px) {
          .tablet-table-wrapper {
            display: none;
          }

          .mobile-blogs-grid {
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
                        <h2>Kelola Artikel Blog</h2>
                        <p>Tulis dan perbarui artikel tips seputar wisata Lombok.</p>
                    </div>
                    <button className="btn-add-primary" onClick={() => handleOpenModal()}>
                        <i className="fa-solid fa-plus"></i> Tulis Artikel
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Memuat artikel...
                    </div>
                ) : (
                    <>
                        {/* Tampilan Desktop / Tablet (Tabel) */}
                        <div className="tablet-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '70px' }}>Foto</th>
                                        <th>Judul</th>
                                        <th>Ringkasan</th>
                                        <th style={{ textAlign: 'center', minWidth: '150px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogs.map((b) => (
                                        <tr key={b.id}>
                                            <td>
                                                <img
                                                    src={b.image_url ? (b.image_url.startsWith('http') ? b.image_url : `http://localhost:5000${b.image_url}`) : 'https://placehold.co/60x40'}
                                                    style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                                                    alt={b.title}
                                                />
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{b.title}</td>
                                            <td style={{ color: '#64748b' }}>{b.excerpt ? (b.excerpt.length > 40 ? b.excerpt.substring(0, 40) + '...' : b.excerpt) : '-'}</td>
                                            <td>
                                                <div className="action-buttons-cell">
                                                    <button className="btn-action-edit" onClick={() => handleOpenModal(b)}>Edit</button>
                                                    <button className="btn-action-delete" onClick={() => handleDelete(b.id)}>Hapus</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tampilan Mobile (< 600px) */}
                        <div className="mobile-blogs-grid">
                            {blogs.map((b) => (
                                <div key={b.id} className="blog-card-mobile">
                                    <div className="blog-card-content">
                                        <img
                                            src={b.image_url ? (b.image_url.startsWith('http') ? b.image_url : `http://localhost:5000${b.image_url}`) : 'https://placehold.co/60x40'}
                                            className="blog-card-img"
                                            alt={b.title}
                                        />
                                        <div className="blog-card-info">
                                            <div className="blog-card-title">{b.title}</div>
                                            <div className="blog-card-excerpt">
                                                {b.excerpt ? (b.excerpt.length > 45 ? b.excerpt.substring(0, 45) + '...' : b.excerpt) : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-card-actions">
                                        <button className="btn-action-edit" onClick={() => handleOpenModal(b)}>Edit</button>
                                        <button className="btn-action-delete" onClick={() => handleDelete(b.id)}>Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Modal Form */}
                {modalOpen && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '440px', boxSizing: 'border-box' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a' }}>{editingId ? 'Edit Artikel' : 'Tulis Artikel'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Judul Artikel</label>
                                    <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Ringkasan Singkat</label>
                                    <input type="text" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '12px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>Isi Konten</label>
                                    <textarea required rows="4" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.85rem' }} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#334155' }}>File Foto Sampul</label>
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

export default AdminBlogs;
