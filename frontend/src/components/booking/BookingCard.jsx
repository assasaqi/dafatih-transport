import React from 'react';

const BookingCard = ({ item, isExpanded, onToggleExpand }) => {
  const bookingCode = item.booking_code || item.bookingCode || item.code || `DFT-${item.id}`;
  const totalPrice = Number(item.total_price || item.totalPrice || item.price || 0);

  const vehicleName = item.vehicle?.name || item.vehicle?.model || item.vehicleName || 'Armada Standar';
  const passengerCount = item.passenger_count || item.passengerCount || item.passengers || 1;

  const pickupAddress =
    item.pickup_address ||
    item.pickupAddress ||
    item.pickup_location ||
    item.pickupLocation ||
    item.route?.pickup_location ||
    item.route?.origin ||
    '-';

  const dropoffAddress =
    item.dropoff_location ||
    item.dropoffLocation ||
    item.route?.dropoff_location ||
    item.route?.destination;

  // Cek apakah lokasi tujuan ada dan valid (bukan '-' atau kosong)
  const hasDropoff = Boolean(dropoffAddress && dropoffAddress.trim() !== '' && dropoffAddress !== '-');

  // Helper Format Tanggal (e.g. 15 Mar 2026)
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

  // Helper Format Jam (HH:mm)
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

  // Helper Format Judul Layanan
  const getBookingTitle = (data) => {
    if (data.route?.title || data.route?.name) return data.route.title || data.route.name;
    if (data.tour_package?.title || data.tour_package?.name || data.tourPackage?.title) {
      return data.tour_package?.title || data.tour_package?.name || data.tourPackage?.title;
    }
    if (data.vehicle?.name || data.vehicle?.model) return `Sewa ${data.vehicle.name || data.vehicle.model}`;

    const rawService = (data.service_type || data.serviceType || '').replace(/_/g, ' ').toLowerCase();
    if (rawService.includes('sewa')) return 'Sewa Mobil';
    if (rawService.includes('antar')) return 'Antar-Jemput';
    if (rawService.includes('tour') || rawService.includes('paket')) return 'Paket Tour Wisata';

    return data.packageName || data.title || 'Layanan Transportasi & Wisata';
  };

  // Render Badge Status
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

  // Render Stepper Status
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

  const pickupDateStr = formatDate(item.pickup_date || item.pickupDate);
  const pickupTimeStr = formatTime(item.pickup_time || item.pickupTime);

  return (
    <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 overflow-hidden transition-all duration-200 hover:border-sky-300">
      {/* HEADER KARTU PESANAN */}
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
            onClick={onToggleExpand}
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

          {/* GRID DINAMIS (3 KOLOM JIKA SEWA MOBIL / TANPA TUJUAN, 4 KOLOM JIKA ADA TUJUAN) */}
          <div
            className={`grid grid-cols-2 ${
              hasDropoff ? 'lg:grid-cols-4' : 'sm:grid-cols-3 lg:grid-cols-3'
            } gap-2.5 text-[11px] sm:text-xs text-slate-600 my-2.5 bg-slate-50 p-2.5 sm:p-3.5 rounded-xl border border-slate-100`}
          >
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

            {/* DITAMPILKAN HANYA JIKA ADA DATA TUJUAN (Misal: Rute / Antar-Jemput) */}
            {hasDropoff && (
              <div>
                <span className="block text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tujuan
                </span>
                <p className="font-semibold text-slate-800 mt-0.5 truncate flex items-center gap-1" title={dropoffAddress}>
                  <i className="fas fa-flag-checkered text-emerald-500"></i> {dropoffAddress}
                </p>
              </div>
            )}
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
};

export default BookingCard;
