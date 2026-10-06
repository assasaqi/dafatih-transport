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
    const [activeDropdownId, setActiveDropdownId] = useState(null);

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

    // Tutup dropdown saat pengguna mengklik area di luar dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-container')) {
                setActiveDropdownId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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
        <div className="min-h-screen bg-slate-100 text-slate-800 md:pl-60 transition-all">
            <AdminNavbar />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Galeri Foto
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Unggah dan edit foto kegiatan serta destinasi wisata Pulau Lombok.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        <span>Tambah Foto Baru</span>
                    </button>
                </div>

                {/* Content Table / Loading State */}
                {loading ? (
                    <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <i className="fa-solid fa-spinner fa-spin text-xl text-[#0194F3] mr-2"></i>
                        <span className="text-xs font-semibold">Memuat galeri...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="overflow-x-auto min-h-[220px] p-1">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[450px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                                        <th className="py-3 px-4 text-center w-16">Foto</th>
                                        <th className="py-3 px-4">Judul Foto / Keterangan</th>
                                        <th className="py-3 px-4 w-32">Kategori</th>
                                        <th className="py-3 px-4 text-center w-20">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {galleries.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-12 text-slate-400">
                                                Belum ada foto galeri yang ditambahkan.
                                            </td>
                                        </tr>
                                    ) : (
                                        galleries.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-2.5 px-4 text-center">
                                                    <img
                                                        src={
                                                            item.image_url
                                                                ? item.image_url.startsWith('http')
                                                                    ? item.image_url
                                                                    : `http://localhost:5000${item.image_url}`
                                                                : 'https://placehold.co/60x40?text=Foto'
                                                        }
                                                        className="w-12 h-8 object-cover rounded-lg border border-slate-200 mx-auto"
                                                        alt={item.title}
                                                    />
                                                </td>
                                                <td className="py-2.5 px-4 font-extrabold text-slate-900 max-w-[180px] sm:max-w-[220px] truncate" title={item.title}>
                                                    {item.title}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <span className="text-[11px] bg-sky-50 text-[#0194F3] px-2.5 py-1 rounded-lg font-bold inline-block whitespace-nowrap">
                                                        {item.category || 'Destinasi'}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="dropdown-container relative inline-block text-left">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => toggleDropdown(item.id, e)}
                                                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-ellipsis-vertical text-xs pointer-events-none"></i>
                                                        </button>

                                                        {activeDropdownId === item.id && (
                                                            <div className="absolute right-0 sm:right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenModal(item)}
                                                                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 cursor-pointer transition-colors"
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                    <span>Edit</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                    <span>Hapus</span>
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
                    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                                    {editingId ? 'Edit Foto Galeri' : 'Tambah Foto Galeri'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="text-slate-400 hover:text-slate-600 text-base p-1 cursor-pointer"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3.5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Judul Foto / Keterangan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Contoh: Keindahan Pantai Kuta Lombok"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors bg-white"
                                    >
                                        <option value="Destinasi">Destinasi Wisata</option>
                                        <option value="Armada">Armada &amp; Layanan</option>
                                        <option value="Aktivitas">Aktivitas Pelanggan</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Upload Berkas Gambar{' '}
                                        {editingId && (
                                            <span className="font-normal text-slate-400">
                                                (Biarkan kosong jika tidak diubah)
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required={!editingId}
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#0194F3] hover:file:bg-sky-100 cursor-pointer"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                                    >
                                        {editingId ? 'Simpan Perubahan' : 'Unggah Foto'}
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

export default AdminGallery;
