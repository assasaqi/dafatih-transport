import React, { useEffect, useState, useRef } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute, getImageUrl } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ pickup_location: '', dropoff_location: '', price: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [activeDropdownId, setActiveDropdownId] = useState(null);

    // State Toast Notification
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    const loadRoutes = () => {
        setLoading(true);
        getRoutes()
            .then((res) => {
                if (res.data?.success) setRoutes(res.data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadRoutes();

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
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        if (route) {
            setEditingId(route.id);
            setFormData({
                pickup_location: route.pickup_location || '',
                dropoff_location: route.dropoff_location || '',
                price: route.price || ''
            });
            if (route.image_url) {
                setImagePreview(getImageUrl(route.image_url));
            }
        } else {
            setEditingId(null);
            setFormData({ pickup_location: '', dropoff_location: '', price: '' });
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
        submitData.append('pickup_location', formData.pickup_location);
        submitData.append('dropoff_location', formData.dropoff_location);
        submitData.append('price', formData.price);

        // Tambahkan berkas gambar jika dipilih oleh pengguna
        if (imageFile) {
            submitData.append('image', imageFile);
        }

        try {
            if (editingId) {
                await updateRoute(editingId, submitData);
                showToast('Data rute berhasil diperbarui!', 'success');
            } else {
                await createRoute(submitData);
                showToast('Rute baru berhasil ditambahkan!', 'success');
            }
            setModalOpen(false);
            loadRoutes();
        } catch (err) {
            console.error('Submit error:', err);
            showToast('Gagal menyimpan rute. Silakan coba lagi.', 'error');
        }
    };

    const handleDelete = async (id) => {
        setActiveDropdownId(null);
        if (window.confirm('Apakah Anda yakin ingin menghapus rute ini?')) {
            try {
                await deleteRoute(id);
                showToast('Rute berhasil dihapus!', 'success');
                loadRoutes();
            } catch (err) {
                showToast('Gagal menghapus rute.', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 md:pl-60 transition-all relative">
            <AdminNavbar />

            {/* Toast Notification Container */}
            {toast.show && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-bold transition-all animate-bounce ${
                        toast.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                >
                    <i
                        className={`fa-solid ${
                            toast.type === 'success' ? 'fa-circle-check text-emerald-500' : 'fa-circle-exclamation text-rose-500'
                        } text-base`}
                    ></i>
                    <span>{toast.message}</span>
                </div>
            )}

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                            Kelola Rute &amp; Tarif
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Atur daftar rute transfer dan tarif resmi aplikasi Dafatih Transport.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        <span>Tambah Rute</span>
                    </button>
                </div>

                {/* Content Table / Loading State */}
                {loading ? (
                    <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <i className="fa-solid fa-spinner fa-spin text-xl text-[#0194F3] mr-2"></i>
                        <span className="text-xs font-semibold">Memuat daftar rute...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[550px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                                        <th className="py-3 px-4 text-center w-28">Foto Rute</th>
                                        <th className="py-3 px-4">Penjemputan</th>
                                        <th className="py-3 px-4">Tujuan</th>
                                        <th className="py-3 px-4">Tarif</th>
                                        <th className="py-3 px-4 text-center w-16">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {routes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-12 text-slate-400">
                                                Belum ada data rute yang tersimpan.
                                            </td>
                                        </tr>
                                    ) : (
                                        routes.map((r) => (
                                            <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3 px-4 text-center">
                                                    <div className="w-20 h-12 rounded-lg overflow-hidden border border-slate-200 mx-auto bg-slate-50 shadow-2xs group relative">
                                                        <img
                                                            src={getImageUrl(r.image_url)}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            alt={r.pickup_location}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-900 max-w-[140px] truncate" title={r.pickup_location}>
                                                    {r.pickup_location}
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-900 max-w-[140px] truncate" title={r.dropoff_location}>
                                                    {r.dropoff_location}
                                                </td>
                                                <td className="py-3 px-4 font-extrabold text-[#0194F3]">
                                                    Rp {Number(r.price).toLocaleString('id-ID')}
                                                </td>
                                                <td className="py-3 px-4 text-center relative">
                                                    <div className="inline-block text-left" ref={activeDropdownId === r.id ? dropdownRef : null}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => toggleDropdown(r.id, e)}
                                                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                                                        >
                                                            <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                                                        </button>

                                                        {activeDropdownId === r.id && (
                                                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleOpenModal(r)}
                                                                    className="w-full text-left px-3.5 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2 cursor-pointer transition-colors"
                                                                >
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                    <span>Edit</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(r.id)}
                                                                    className="w-full text-left px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
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

                {/* Modal Form Tambah/Edit */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                                    {editingId ? 'Edit Data Rute' : 'Tambah Rute Baru'}
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
                                        Lokasi Penjemputan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.pickup_location}
                                        onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                                        placeholder="Contoh: Bandara Lombok"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Lokasi Tujuan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.dropoff_location}
                                        onChange={(e) => setFormData({ ...formData, dropoff_location: e.target.value })}
                                        placeholder="Contoh: Senggigi"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Tarif (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="Contoh: 250000"
                                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Gambar Rute (Opsional)
                                    </label>

                                    {/* Preview Gambar Dalam Modal Form */}
                                    {imagePreview && (
                                        <div className="mb-2 relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
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
                                        Simpan Rute
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

export default AdminRoutes;
