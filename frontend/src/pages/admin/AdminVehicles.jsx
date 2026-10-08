import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  API_BASE_URL
} from '@/services/api';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast, showToast, hideToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'MPV',
    capacity: '6',
    transmission: 'Manual',
    price_per_day: '',
    description: '',
    status: 'Tersedia'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchVehiclesData = async () => {
    setLoading(true);
    try {
      const res = await getVehicles();
      if (res.data?.success) {
        setVehicles(res.data.data || []);
      } else {
        setVehicles(res.data || []);
      }
    } catch (err) {
      console.error('Gagal memuat data armada:', err);
      showToast('Gagal memuat data armada dari server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getImageUrl = (car) => {
    const imageUrl = typeof car === 'string' ? car : car?.image_url || car?.image || car?.image_path || '';
    if (!imageUrl) return 'https://placehold.co/400x250?text=Armada+Mobil';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return encodeURI(imageUrl);
    }
    let baseUrl = '';
    if (API_BASE_URL) {
      baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    } else if (typeof window !== 'undefined') {
      baseUrl = window.location.origin;
    }
    const fullUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    return encodeURI(fullUrl);
  };

  const handleOpenAddModal = () => {
    setSelectedVehicle(null);
    setFormData({
      name: '',
      category: 'MPV',
      capacity: '6',
      transmission: 'Manual',
      price_per_day: '',
      description: '',
      status: 'Tersedia'
    });
    setImageFile(null);
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      name: vehicle.name || '',
      category: vehicle.category || 'MPV',
      capacity: vehicle.capacity || '6',
      transmission: vehicle.transmission || 'Manual',
      price_per_day: vehicle.price_per_day || '',
      description: vehicle.description || '',
      status: vehicle.status || 'Tersedia'
    });
    setImageFile(null);
    setImagePreview(getImageUrl(vehicle));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('capacity', formData.capacity);
      data.append('transmission', formData.transmission);
      data.append('price_per_day', formData.price_per_day);
      data.append('description', formData.description);
      data.append('status', formData.status);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (selectedVehicle) {
        await updateVehicle(selectedVehicle.id, data);
        showToast('Armada berhasil diperbarui!', 'success');
      } else {
        await createVehicle(data);
        showToast('Armada baru berhasil ditambahkan!', 'success');
      }

      setIsModalOpen(false);
      fetchVehiclesData();
    } catch (err) {
      console.error('Gagal menyimpan armada:', err);
      showToast('Gagal menyimpan data armada.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus armada "${name}"?`)) {
      try {
        await deleteVehicle(id);
        showToast(`Armada ${name} berhasil dihapus.`, 'success');
        fetchVehiclesData();
      } catch (err) {
        console.error('Gagal menghapus armada:', err);
        showToast('Gagal menghapus armada.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative">
      <AdminNavbar />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <main className="flex-1 md:pl-60 w-full min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-car text-[#0194F3]"></i>
                <span>Kelola Armada Mobil</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Tambah, sunting, atau hapus armada kendaraan sewa Dafatih Transport.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="bg-[#0194F3] hover:bg-sky-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Tambah Armada Baru</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                <i className="fa-solid fa-spinner fa-spin mr-2 text-[#0194F3]"></i>
                Memuat data armada...
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-medium">
                Belum ada armada mobil yang tersimpan. Klik "Tambah Armada Baru" untuk menambah data.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Gambar</th>
                      <th className="py-3.5 px-4">Nama Armada</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Spesifikasi</th>
                      <th className="py-3.5 px-4">Tarif / Hari</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 text-xs sm:text-sm font-medium">
                    {vehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <img
                              src={getImageUrl(v)}
                              alt={v.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {v.name}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-sky-50 text-[#0194F3] border border-sky-100 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                            {v.category || 'MPV'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600">
                          <div>{v.capacity || 6} Seat</div>
                          <div className="text-slate-400 text-[11px]">{v.transmission || 'Manual / Matic'}</div>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#F96D01]">
                          Rp {Number(v.price_per_day || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              v.status === 'Disewa'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : v.status === 'Maintenance'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {v.status || 'Tersedia'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(v)}
                              className="w-8 h-8 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0194F3] transition-colors flex items-center justify-center cursor-pointer"
                              title="Edit Armada"
                            >
                              <i className="fa-solid fa-pen-to-square text-xs"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(v.id, v.name)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center cursor-pointer"
                              title="Hapus Armada"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-car text-[#0194F3]"></i>
                    <span>{selectedVehicle ? 'Edit Data Armada' : 'Tambah Armada Baru'}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg p-1 cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Armada / Mobil *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Contoh: Toyota Innova Reborn"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-[#0194F3]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kategori / Tipe
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-[#0194F3] bg-white"
                      >
                        <option value="MPV">MPV</option>
                        <option value="SUV">SUV</option>
                        <option value="Minibus">Minibus / HiAce</option>
                        <option value="Sedan">Sedan / Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Transmisi
                      </label>
                      <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-[#0194F3] bg-white"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic (Matic)</option>
                        <option value="Manual / Matic">Manual / Matic</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kapasitas (Seat) *
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        required
                        min="1"
                        placeholder="Contoh: 6"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-[#0194F3]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tarif Sewa / Hari (Rp) *
                      </label>
                      <input
                        type="number"
                        name="price_per_day"
                        required
                        placeholder="Contoh: 500000"
                        value={formData.price_per_day}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold outline-none focus:border-[#0194F3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Status Ketersediaan
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:border-[#0194F3] bg-white"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Disewa">Disewa</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi / Fasilitas
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      placeholder="AC dingin, Reclining seat, Audio Bluetooth, termasuk driver..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium outline-none focus:border-[#0194F3]"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Foto Kendaraan
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#0194F3] hover:file:bg-sky-100 cursor-pointer"
                    />
                    {imagePreview && (
                      <div className="mt-2.5 w-full h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl bg-[#0194F3] hover:bg-sky-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {submitting && <i className="fa-solid fa-spinner fa-spin text-xs"></i>}
                      <span>{selectedVehicle ? 'Simpan Perubahan' : 'Tambah Armada'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminVehicles;
