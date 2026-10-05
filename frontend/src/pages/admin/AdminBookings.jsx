import React, { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus, deleteBooking } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBookings = () => {
        setLoading(true);
        getBookings()
            .then((res) => {
                if (res.data.success) setBookings(res.data.data);
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
            loadBookings();
        } catch (err) {
            alert('Gagal mengubah status pemesanan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus transaksi pemesanan ini?')) {
            try {
                await deleteBooking(id);
                loadBookings();
            } catch (err) {
                alert('Gagal menghapus transaksi.');
            }
        }
    };

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: '24px 5%', maxWidth: '1100px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                    Kelola Transaksi Pemesanan
                </h2>

                {loading ? (
                    <div>Memuat data pemesanan...</div>
                ) : (
                    <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px' }}>Kode</th>
                                    <th style={{ padding: '12px' }}>Pelanggan</th>
                                    <th style={{ padding: '12px' }}>Telepon</th>
                                    <th style={{ padding: '12px' }}>Rute / Penjemputan</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontWeight: 700, color: '#0284c7' }}>{b.booking_code}</td>
                                        <td style={{ padding: '12px', fontWeight: 600 }}>{b.customer_name}</td>
                                        <td style={{ padding: '12px' }}>{b.customer_phone}</td>
                                        <td style={{ padding: '12px' }}>{b.pickup_location} ➡️ {b.dropoff_location}</td>
                                        <td style={{ padding: '12px' }}>
                                            <select
                                                value={b.status}
                                                onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminBookings;
