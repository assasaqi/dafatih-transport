import React from 'react';
import { API_BASE_URL } from '@/services/api';

const RentalCard = ({ car, filterDuration, onSelect }) => {
    const isAutomatic = (car?.transmission || 'Automatic').toLowerCase().includes('auto');
    const capacity = car?.capacity || 6;
    const luggage = car?.luggage || 2;
    const durationNumber = Number(filterDuration) || 1;
    const totalPrice = Number(car?.price_per_day || car?.price || 0) * durationNumber;

    // Ambil data status secara dinamis dari API backend
    const statusText = car?.status || car?.status_armada || (car?.is_available === false ? 'Tidak Tersedia' : 'Siap dipesan');

    // Helper Penyesuaian Warna & Ikon Status Berdasarkan Kondisi
    const getStatusConfig = (statusStr, isAvailable) => {
        const lower = String(statusStr || '').toLowerCase();

        if (
            isAvailable === false ||
            lower.includes('tidak') ||
            lower.includes('disewa') ||
            lower.includes('booked') ||
            lower.includes('penuh')
        ) {
            return {
                textColor: 'text-rose-600',
                iconClass: 'fa-solid fa-circle-xmark text-rose-500',
                isAvailable: false
            };
        }

        if (lower.includes('pending') || lower.includes('proses') || lower.includes('perbaikan') || lower.includes('maintenance')) {
            return {
                textColor: 'text-amber-600',
                iconClass: 'fa-solid fa-triangle-exclamation text-amber-500',
                isAvailable: false
            };
        }

        return {
            textColor: 'text-emerald-600',
            iconClass: 'fa-solid fa-circle-check text-emerald-500',
            isAvailable: true
        };
    };

    const statusConfig = getStatusConfig(statusText, car?.is_available);

    // Helper URL Gambar Dinamis
    const getImageUrl = (vehicle) => {
        const imageUrl = typeof vehicle === 'string' ? vehicle : vehicle?.image_url || vehicle?.image || vehicle?.image_path || '';
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

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 relative overflow-hidden transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">

                {/* KIRI: GAMBAR & DETAIL SPESIFIKASI */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* GAMBAR MOBIL */}
                    <div className="w-5/12 sm:w-40 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-100">
                        <img
                            src={getImageUrl(car)}
                            alt={car?.name || 'Mobil'}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* DETAIL (NAMA MOBIL, KURSI, BAGASI, TRANSMISI) */}
                    <div className="w-7/12 sm:flex-1 space-y-1.5 min-w-0">
                        {/* NAMA MOBIL */}
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                            {car?.name}
                        </h3>

                        {/* Kursi & Bagasi */}
                        <div className="flex items-center gap-3 text-slate-600 font-bold text-[11px]">
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-users text-[#0194F3] text-[10px]"></i>
                                {capacity} Kursi
                            </span>
                            <span className="flex items-center gap-1.5">
                                <i className="fa-solid fa-suitcase text-[#0194F3] text-[10px]"></i>
                                {luggage} Bagasi
                            </span>
                        </div>

                        {/* Transmisi */}
                        <div className="flex items-center gap-1.5 font-extrabold text-slate-700 uppercase tracking-tight text-[10px]">
                            <i className="fa-solid fa-gear text-[#0194F3] text-[11px]"></i>
                            <span>{isAutomatic ? 'AUTOMATIC' : 'MANUAL'}</span>
                        </div>
                    </div>
                </div>

                {/* KANAN: STATUS DINAMIS, HARGA, & TOMBOL PESAN */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">

                    {/* 1. STATUS DINAMIS BERDASARKAN KONDISI */}
                    <div className={`font-bold text-[10px] sm:text-xs text-right capitalize flex items-center gap-1.5 ${statusConfig.textColor}`}>
                        <i className={`${statusConfig.iconClass} text-[11px]`}></i>
                        <span>{statusText}</span>
                    </div>

                    {/* 2. HARGA */}
                    <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-sm sm:text-lg font-extrabold text-[#FF5E1F]">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
                                /{durationNumber > 1 ? `${durationNumber}hari` : 'hari'}
                            </span>
                        </div>
                    </div>

                    {/* 3. TOMBOL PESAN */}
                    <button
                        type="button"
                        disabled={!statusConfig.isAvailable}
                        onClick={() => onSelect(car)}
                        className={`font-bold text-xs px-5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                            statusConfig.isAvailable
                                ? 'bg-[#0194F3] hover:bg-sky-600 text-white shadow-2xs hover:shadow-md active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <span>{statusConfig.isAvailable ? 'Pesan' : 'Penuh'}</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RentalCard;
