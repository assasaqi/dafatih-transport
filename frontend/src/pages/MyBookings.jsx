import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import resmi dari src/services/api.js
import API, { getBookings } from '../services/api';

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State untuk menyimpan ID pesanan yang sedang dibuka detailnya (Accordion)
  const [expandedBookingIds, setExpandedBookingIds] = useState({});

  const fetchBookingsData = async () => {
    setLoading(true);

    // 1. Cek Token: Jika tidak ada, langsung alihkan ke halaman /login
    const token = localStorage.getItem('token') || localStorage.getItem('clientToken');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      let response;
      try {
        response = await getBookings();
      } catch (err) {
        if (err.response?.status === 404) {
          response = await API.get('/client/bookings');
        } else {
          throw err;
        }
      }

      const data = response.data?.data || response.data?.bookings || response.data || [];

      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Gagal mengambil data booking dari API:', error);

      // 2. Jika Token Kadaluarsa / Tidak Valid (401/403), hapus token & langsung alihkan ke /login
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('clientToken');
        navigate('/login', { replace: true });
        return;
      } else {
        const errorMsg = error.response?.data?.message || 'Gagal memuat riwayat pesanan dari server.';
        showMessage('error', errorMsg);
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const toggleExpand = (id) => {
    setExpandedBookingIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: 'Menunggu Pembayaran', bg: 'bg-amber-500/10 text-amber-700 border-amber-300' },
      WAITING_CONFIRMATION: { label: 'Menunggu Verifikasi', bg: 'bg-sky-500/10 text-sky-700 border-sky-300' },
      CONFIRMED: { label: 'Dikonfirmasi', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
      PAID: { label: 'Lunas', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
      COMPLETED: { label: 'Perjalanan Selesai', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' },
      CANCELLED: { label: 'Dibatalkan', bg: 'bg-rose-500/10 text-rose-700 border-rose-300' }
    };

    const current = statusMap[status] || { label: status || 'PENDING', bg: 'bg-slate-100 text-slate-700 border-slate-300' };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  const renderStatusStepper = (status) => {
    if (status === 'CANCELLED') {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center text-xs text-rose-700 font-medium my-2">
          Pesanan ini telah dibatalkan.
        </div>
      );
    }

    const steps = [
      { key: 'PENDING', label: '1. Isi Form & Bayar' },
      { key: 'WAITING_CONFIRMATION', label: '2. Verifikasi Admin' },
      { key: 'CONFIRMED', label: '3. Siap Jalan' },
      { key: 'COMPLETED', label: '4. Selesai' }
    ];

    const getStepIndex = (st) => {
      if (st === 'PENDING') return 0;
      if (st === 'WAITING_CONFIRMATION') return 1;
      if (st === 'CONFIRMED' || st === 'PAID') return 2;
      if (st === 'COMPLETED') return 3;
      return 0;
    };

    const activeIndex = getStepIndex(status);

    return (
      <div className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-3 my-3">
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
          {steps.map((step, idx) => {
            const isDone = idx <= activeIndex;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mb-1 transition-colors ${
                    isDone ? 'bg-[#00a2ff] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <i className="fas fa-check text-xs"></i> : idx + 1}
                </div>
                <span className={isDone ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] font-sans pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Toast Alert */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-2xl shadow-sm text-sm flex items-center justify-between transition-all ${
              message.type === 'error'
                ? 'bg-rose-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-lg leading-none">
              ×
            </button>
          </div>
        )}

        {/* Layout Grid 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SISI KIRI: Judul Halaman */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Cek & Pesan<br />Layanan
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1.5">
                <i className="fas fa-file-lines text-slate-400"></i> Riwayat Pesanan Saya
              </p>
            </div>
          </div>

          {/* SISI KANAN: Daftar Pesanan */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm">
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#00a2ff] border-t-transparent mb-3"></div>
                  <p className="text-slate-500 text-sm">Sedang mengambil data pesanan Anda...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-sky-50 text-[#00a2ff] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    <i className="fas fa-car"></i>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">Belum Ada Pesanan</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                    Tidak ditemukan data pemesanan. Silakan buat pesanan baru melalui halaman utama kami.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((item) => {
                    const bookingId = item.id || item.bookingCode || item.code;
                    const isExpanded = !!expandedBookingIds[bookingId];

                    return (
                      <div
                        key={bookingId}
                        className="bg-slate-50/70 rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-200 hover:border-sky-300 hover:shadow-sm"
                      >
                        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                #{bookingId}
                              </span>
                              {renderStatusBadge(item.status)}
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                              {item.route?.title || item.route?.name || item.packageName || item.title || item.tourPackage?.title || 'Layanan Transportasi & Wisata'}
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <i className="far fa-calendar-alt text-sky-500"></i>{' '}
                              {item.pickupDate
                                ? new Date(item.pickupDate).toLocaleString('id-ID', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                  })
                                : '-'}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 ml-auto sm:ml-0">
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                              <span className="text-base sm:text-lg font-extrabold text-[#00a2ff]">
                                Rp {(item.totalPrice || item.price || item.total_price || 0).toLocaleString('id-ID')}
                              </span>
                            </div>

                            <button
                              onClick={() => toggleExpand(bookingId)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                isExpanded
                                  ? 'bg-sky-50 text-[#00a2ff] border-sky-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{isExpanded ? 'Sembunyikan' : 'Detail'}</span>
                              <i
                                className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              ></i>
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-5 sm:px-5 border-t border-slate-200/60 pt-3 bg-white">
                            {renderStatusStepper(item.status)}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600 my-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                              <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Armada Kendaraan
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                                  <i className="fas fa-bus text-sky-500"></i> {item.vehicle?.name || item.vehicle?.type || item.vehicleName || 'Armada Standar'}
                                </p>
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Jumlah Penumpang
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                                  <i className="fas fa-users text-sky-500"></i> {item.passengerCount || item.passengers || 1} Orang
                                </p>
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Lokasi Penjemputan
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={item.pickupLocation}>
                                  <i className="fas fa-location-dot text-rose-500"></i> {item.pickupLocation || '-'}
                                </p>
                              </div>

                              <div>
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Lokasi Tujuan
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={item.dropoffLocation}>
                                  <i className="fas fa-flag-checkered text-emerald-500"></i> {item.dropoffLocation || '-'}
                                </p>
                              </div>
                            </div>

                            {item.notes && (
                              <div className="text-xs text-slate-600 bg-amber-500/10 border border-amber-200/60 rounded-lg p-2.5 flex items-start gap-1.5">
                                <i className="fas fa-comment-dots text-amber-600 mt-0.5"></i>
                                <div>
                                  <strong className="text-amber-900">Catatan Khusus:</strong> {item.notes}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyBookings;
