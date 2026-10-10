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

  // Normalisasi string status ke UPPERCASE
  const renderStatusBadge = (statusStr) => {
    const rawStatus = (statusStr || 'PENDING').toUpperCase();

    const statusMap = {
      PENDING: { label: 'Menunggu Bayar', bg: 'bg-amber-500/10 text-amber-700 border-amber-300' },
      WAITING_CONFIRMATION: { label: 'Verifikasi Admin', bg: 'bg-sky-500/10 text-sky-700 border-sky-300' },
      CONFIRMED: { label: 'Dikonfirmasi', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
      PAID: { label: 'Lunas', bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
      COMPLETED: { label: 'Selesai', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' },
      CANCELLED: { label: 'Dibatalkan', bg: 'bg-rose-500/10 text-rose-700 border-rose-300' }
    };

    const current = statusMap[rawStatus] || { label: rawStatus, bg: 'bg-slate-100 text-slate-700 border-slate-300' };

    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${current.bg}`}>
        {current.label}
      </span>
    );
  };

  const renderStatusStepper = (statusStr) => {
    const st = (statusStr || 'PENDING').toUpperCase();

    if (st === 'CANCELLED') {
      return (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center text-[11px] text-rose-700 font-medium my-1.5">
          Pesanan ini telah dibatalkan.
        </div>
      );
    }

    const steps = [
      { key: 'PENDING', label: '1. Bayar' },
      { key: 'WAITING_CONFIRMATION', label: '2. Verifikasi' },
      { key: 'CONFIRMED', label: '3. Siap' },
      { key: 'COMPLETED', label: '4. Selesai' }
    ];

    const getStepIndex = (statusKey) => {
      if (statusKey === 'PENDING') return 0;
      if (statusKey === 'WAITING_CONFIRMATION') return 1;
      if (statusKey === 'CONFIRMED' || statusKey === 'PAID') return 2;
      if (statusKey === 'COMPLETED') return 3;
      return 0;
    };

    const activeIndex = getStepIndex(st);

    return (
      <div className="w-full bg-slate-50 border border-slate-200/60 rounded-xl p-2 sm:p-3 my-2">
        <div className="grid grid-cols-4 gap-1 text-center text-[9px] sm:text-xs">
          {steps.map((step, idx) => {
            const isDone = idx <= activeIndex;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold mb-0.5 sm:mb-1 text-[10px] transition-colors ${
                    isDone ? 'bg-[#00a2ff] text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isDone ? <i className="fas fa-check text-[9px] sm:text-xs"></i> : idx + 1}
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

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeVal) => {
    if (!timeVal) return '';
    if (typeof timeVal === 'string' && timeVal.includes('T')) {
      const dateObj = new Date(timeVal);
      if (!isNaN(dateObj.getTime())) {
        const hours = String(dateObj.getUTCHours()).padStart(2, '0');
        const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }
    if (typeof timeVal === 'string') {
      return timeVal.substring(0, 5);
    }
    return timeVal;
  };

  const getBookingTitle = (item) => {
    if (item.route?.title || item.route?.name) return item.route.title || item.route.name;
    if (item.tour_package?.title || item.tour_package?.name || item.tourPackage?.title) {
      return item.tour_package?.title || item.tour_package?.name || item.tourPackage?.title;
    }
    if (item.vehicle?.name || item.vehicle?.model) return `Sewa ${item.vehicle.name || item.vehicle.model}`;

    const rawService = (item.service_type || item.serviceType || '').replace(/_/g, ' ').toLowerCase();
    if (rawService.includes('sewa')) return 'Sewa Mobil';
    if (rawService.includes('antar')) return 'Antar-Jemput';
    if (rawService.includes('tour') || rawService.includes('paket')) return 'Paket Tour Wisata';

    return item.packageName || item.title || 'Layanan Transportasi & Wisata';
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] font-sans pt-20 sm:pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Toast Alert */}
        {message.text && (
          <div
            className={`p-3 sm:p-4 mb-4 rounded-xl shadow-sm text-xs sm:text-sm flex items-center justify-between transition-all ${
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">

          {/* SISI KIRI: Judul Halaman */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Cek & Pesan Layanan
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                <i className="fas fa-file-lines text-slate-400"></i> Riwayat Pesanan Saya
              </p>
            </div>
          </div>

          {/* SISI KANAN: Daftar Pesanan */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">

            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border border-slate-200/60 shadow-sm">
              {loading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-7 w-7 border-3 border-[#00a2ff] border-t-transparent mb-2"></div>
                  <p className="text-slate-500 text-xs">Sedang mengambil data pesanan Anda...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 bg-sky-50 text-[#00a2ff] rounded-xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    <i className="fas fa-car"></i>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-800">Belum Ada Pesanan</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                    Tidak ditemukan data pemesanan. Silakan buat pesanan baru melalui halaman utama kami.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((item) => {
                    const bookingCode = item.booking_code || item.bookingCode || item.code || `DFT-${item.id}`;
                    const bookingId = item.id || bookingCode;
                    const isExpanded = !!expandedBookingIds[bookingId];

                    const totalPrice = Number(item.total_price || item.totalPrice || item.price || 0);
                    const pickupDateStr = formatDate(item.pickup_date || item.pickupDate);
                    const pickupTimeStr = formatTime(item.pickup_time || item.pickupTime);

                    const vehicleName = item.vehicle?.name || item.vehicle?.model || item.vehicleName || 'Armada Standar';
                    const passengerCount = item.passenger_count || item.passengerCount || item.passengers || 1;

                    const pickupAddress = item.pickup_address || item.pickupAddress || item.pickup_location || item.pickupLocation || item.route?.pickup_location || item.route?.origin || '-';
                    const dropoffAddress = item.dropoff_location || item.dropoffLocation || item.route?.dropoff_location || item.route?.destination || '-';

                    return (
                      <div
                        key={bookingId}
                        className="bg-slate-50/80 rounded-xl border border-slate-200/80 overflow-hidden transition-all duration-200 hover:border-sky-300"
                      >
                        {/* HEADER KARTU PESANAN RINGKAS */}
                        <div className="p-3 sm:p-5">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              #{bookingCode}
                            </span>
                            {renderStatusBadge(item.status)}
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h2 className="text-sm sm:text-lg font-bold text-slate-900 leading-snug">
                                {getBookingTitle(item)}
                              </h2>
                              <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <i className="far fa-calendar-alt text-sky-500"></i>{' '}
                                <span>{pickupDateStr}</span>
                                {pickupTimeStr && (
                                  <span className="ml-0.5 font-semibold text-slate-700">• Pukul {pickupTimeStr}</span>
                                )}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Total</span>
                              <span className="text-sm sm:text-lg font-extrabold text-[#00a2ff]">
                                Rp {totalPrice.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>

                          {/* TOMBOL DETAIL RINGKAS */}
                          <div className="mt-2.5 pt-2 border-t border-slate-200/50 flex justify-end">
                            <button
                              onClick={() => toggleExpand(bookingId)}
                              className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold border transition-all flex items-center gap-1 ${
                                isExpanded
                                  ? 'bg-sky-50 text-[#00a2ff] border-sky-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{isExpanded ? 'Sembunyikan' : 'Lihat Detail'}</span>
                              <i
                                className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              ></i>
                            </button>
                          </div>
                        </div>

                        {/* DETAIL KARTU EXPANDED */}
                        {isExpanded && (
                          <div className="px-3 pb-3.5 sm:px-5 sm:pb-5 border-t border-slate-200/60 pt-2 bg-white">
                            {renderStatusStepper(item.status)}

                            {/* GRID 2 KOLOM DI MOBILE */}
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] sm:text-xs text-slate-600 my-2.5 bg-slate-50 p-2.5 sm:p-3.5 rounded-xl border border-slate-100">
                              <div>
                                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Armada
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1">
                                  <i className="fas fa-bus text-sky-500"></i> {vehicleName}
                                </p>
                              </div>

                              <div>
                                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Penumpang
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                                  <i className="fas fa-users text-sky-500"></i> {passengerCount} Orang
                                </p>
                              </div>

                              <div>
                                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Jemput
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={pickupAddress}>
                                  <i className="fas fa-location-dot text-rose-500"></i> {pickupAddress}
                                </p>
                              </div>

                              <div>
                                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Tujuan
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={dropoffAddress}>
                                  <i className="fas fa-flag-checkered text-emerald-500"></i> {dropoffAddress}
                                </p>
                              </div>
                            </div>

                            {item.notes && (
                              <div className="text-[11px] text-slate-600 bg-amber-500/10 border border-amber-200/60 rounded-lg p-2 flex items-start gap-1.5">
                                <i className="fas fa-comment-dots text-amber-600 mt-0.5"></i>
                                <div>
                                  <strong className="text-amber-900">Catatan:</strong> {item.notes}
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
