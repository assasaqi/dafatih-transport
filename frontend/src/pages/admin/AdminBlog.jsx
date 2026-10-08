import React, { useEffect, useState } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog, API_BASE_URL } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Menggunakan custom hook Toast terpisah
    const { toast, showToast, hideToast } = useToast();

    const loadBlogs = () => {
        setLoading(true);
        getBlogs()
            .then((res) => {
                if (res.data?.success) setBlogs(res.data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadBlogs();
    }, []);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/120x80?text=No+Cover';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
        return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    };

    const handleOpenModal = (blog = null) => {
        setImageFile(null);
        setImagePreview(null);

        if (blog) {
            setEditingId(blog.id);
            setFormData({ title: blog.title, content: blog.content || '' });
            if (blog.image_url) {
                setImagePreview(getImageUrl(blog.image_url));
            }
        } else {
            setEditingId(null);
            setFormData({ title: '', content: '' });
        }
        setModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('content', formData.content);
        if (imageFile) submitData.append('image', imageFile);

        try {
            if (editingId) {
                await updateBlog(editingId, submitData);
                showToast('Artikel blog berhasil diperbarui!', 'success');
            } else {
                await createBlog(submitData);
                showToast('Artikel blog baru berhasil ditambahkan!', 'success');
            }
            setModalOpen(false);
            loadBlogs();
        } catch (err) {
            showToast('Gagal menyimpan artikel. Silakan coba lagi.', 'error');
        }
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Hapus artikel "${title}" ini?`)) {
            try {
                await deleteBlog(id);
                showToast('Artikel blog berhasil dihapus!', 'success');
                loadBlogs();
            } catch (err) {
                showToast('Gagal menghapus artikel.', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 md:pl-60 transition-all relative">
            <AdminNavbar />

            {/* Panggil komponen Toast terpisah */}
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Artikel Blog
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Tulis dan perbarui artikel serta panduan tips seputar wisata Lombok.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        <span>Tulis Artikel</span>
                    </button>
                </div>

                {/* Content Table / Loading State */}
                {loading ? (
                    <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <i className="fa-solid fa-spinner fa-spin text-xl text-[#0194F3] mr-2"></i>
                        <span className="text-xs font-semibold">Memuat daftar artikel...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[550px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                                        <th className="py-3 px-4 text-center w-28">Sampul</th>
                                        <th className="py-3 px-4">Judul Artikel</th>
                                        <th className="py-3 px-4">Ringkasan Konten</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {blogs.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-slate-400">
                                                Belum ada artikel blog yang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        blogs.map((b) => (
                                            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 text-center">
                                                    <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-200 mx-auto bg-slate-50 shadow-2xs group relative">
                                                        <img
                                                            src={getImageUrl(b.image_url)}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            alt={b.title}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-extrabold text-slate-900 max-w-[200px] truncate" title={b.title}>
                                                    {b.title}
                                                </td>
                                                <td className="py-3 px-4 text-slate-500 max-w-[240px] truncate" title={b.content}>
                                                    {b.content || '-'}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenModal(b)}
                                                            className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0194F3] transition-colors flex items-center justify-center cursor-pointer"
                                                            title="Edit Artikel"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square text-xs"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(b.id, b.title)}
                                                            className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center cursor-pointer"
                                                            title="Hapus Artikel"
                                                        >
                                                            <i className="fa-solid fa-trash-can text-xs"></i>
                                                        </button>
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

                {/* Modal Form Tambah/Edit Artikel */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-lg shadow-xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                                    {editingId ? 'Edit Artikel Blog' : 'Tulis Artikel Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-base p-1 cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Judul Artikel *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Contoh: 5 Tempat Wisata Hits di Lombok"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Isi Konten Artikel *
                                    </label>
                                    <textarea
                                        required
                                        rows="6"
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Tulis artikel lengkap di sini..."
                                        className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Foto Sampul (Opsional)
                                    </label>

                                    {imagePreview && (
                                        <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src={imagePreview} alt="Preview Sampul" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#0194F3] hover:file:bg-sky-100 cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                                    >
                                        Simpan Artikel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBlogs;
