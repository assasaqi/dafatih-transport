import React, { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus, deleteBooking } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';
import Toast from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const { toast, showToast, hideToast } = useToast();

    const loadBookings = () => {
        setLoading(true);
        getBookings()
            .then((res) => {
                if (res.data?.success) setBookings(res.data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            showToast('Status pemesanan berhasil diperbarui!', 'success');
            loadBookings();
        } catch (err) {
            showToast('Gagal mengubah status pemesanan.', 'error');
        }
    };

    const handleDelete = async (id, code) => {
        if (window.confirm(`Hapus transaksi pemesanan [${code}] ini?`)) {
            try {
                await deleteBooking(id);
                showToast('Transaksi pemesanan berhasil dihapus!', 'success');
                loadBookings();
            } catch (err) {
                showToast('Gagal menghapus transaksi.', 'error');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed':
                return 'bg-sky-50 text-[#0194F3] border-sky-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F4F7] text-slate-800 md:pl-60 transition-all relative">
            <AdminNavbar />

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <i className="fa-solid fa-clipboard-list text-[#0194F3]"></i>
                            <span>Kelola Transaksi Pemesanan</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Pantau dan perbarui status pesanan sewa serta antar-jemput dari pelanggan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadBookings}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                        <i className="fa-solid fa-rotate-right text-xs text-[#0194F3]"></i>
                        <span>Muat Ulang Data</span>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <i className="fa-solid fa-spinner fa-spin text-xl text-[#0194F3] mr-2"></i>
                        <span className="text-xs font-semibold">Memuat data pemesanan...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[650px]">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider">
                                        <th className="py-3.5 px-4">Kode Booking</th>
                                        <th className="py-3.5 px-4">Pelanggan</th>
                                        <th className="py-3.5 px-4">Telepon / WA</th>
                                        <th className="py-3.5 px-4">Rute / Penjemputan</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4 text-center w-20">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {bookings.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-slate-400">
                                                Belum ada data pemesanan yang masuk.
                                            </td>
                                        </tr>
                                    ) : (
                                        bookings.map((b) => (
                                            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="py-3.5 px-4 font-extrabold text-[#0194F3]">
                                                    {b.booking_code}
                                                </td>
                                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                                    {b.customer_name}
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600">
                                                    <a
                                                        href={`https://wa.me/${b.customer_phone?.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="hover:text-[#0194F3] inline-flex items-center gap-1.5 font-semibold"
                                                    >
                                                        <i className="fa-brands fa-whatsapp text-emerald-500"></i>
                                                        {b.customer_phone}
                                                    </a>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-700">
                                                    <span className="font-semibold">{b.pickup_location}</span>
                                                    <i className="fa-solid fa-arrow-right text-[10px] text-slate-400 mx-2"></i>
                                                    <span className="font-semibold">{b.dropoff_location}</span>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <select
                                                        value={b.status}
                                                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer ${getStatusBadge(b.status)}`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(b.id, b.booking_code)}
                                                        className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors flex items-center justify-center cursor-pointer mx-auto"
                                                        title="Hapus Transaksi"
                                                    >
                                                        <i className="fa-solid fa-trash-can text-xs"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBookings;
