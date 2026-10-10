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
                badgeBg: 'bg-rose-50 text-rose-600 border-rose-100',
                iconClass: 'fa-solid fa-circle-xmark text-rose-500',
                isAvailable: false
            };
        }

        if (lower.includes('pending') || lower.includes('proses') || lower.includes('perbaikan') || lower.includes('maintenance')) {
            return {
                badgeBg: 'bg-amber-50 text-amber-600 border-amber-100',
                iconClass: 'fa-solid fa-triangle-exclamation text-amber-500',
                isAvailable: false
            };
        }

        return {
            badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs relative overflow-hidden transition-all hover:border-sky-200">
            {/* BADGE STATUS TERPUSAT (MOBILE) */}
            <div className="flex justify-center sm:justify-start mb-2.5">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border ${statusConfig.badgeBg}`}>
                    <i className={`${statusConfig.iconClass} text-[10px]`}></i>
                    <span className="capitalize">{statusText}</span>
                </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">
                {/* UTAMA: GAMBAR & DETAIL SPESIFIKASI (TERPUSAT DI MOBILE) */}
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3.5 flex-1 min-w-0 text-center sm:text-left">
                    {/* GAMBAR MOBIL */}
                    <div className="w-full max-w-[200px] sm:w-36 h-28 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-50 relative border border-slate-100/80 mx-auto sm:mx-0">
                        <img
                            src={getImageUrl(car)}
                            alt={car?.name || 'Mobil'}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* DETAIL (NAMA MOBIL, SPESIFIKASI) */}
                    <div className="flex-1 space-y-2 min-w-0 w-full">
                        <h3 className="text-base sm:text-base font-extrabold text-slate-900 truncate leading-tight">
                            {car?.name}
                        </h3>

                        {/* BADGE SPESIFIKASI (TERPUSAT DI MOBILE) */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-slate-600 font-bold text-[10px] sm:text-[11px]">
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-slate-700 px-2.5 py-1 rounded-md border border-sky-100/60">
                                <i className="fa-solid fa-users text-[#0194F3]"></i>
                                {capacity} Kursi
                            </span>
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-slate-700 px-2.5 py-1 rounded-md border border-sky-100/60">
                                <i className="fa-solid fa-suitcase text-[#0194F3]"></i>
                                {luggage} Bagasi
                            </span>
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-slate-700 px-2.5 py-1 rounded-md border border-sky-100/60 uppercase">
                                <i className="fa-solid fa-gear text-[#0194F3]"></i>
                                {isAutomatic ? 'AT' : 'MT'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM / KANAN: HARGA & TOMBOL PESAN (TERPUSAT DI MOBILE) */}
                <div className="flex flex-col items-center sm:items-end justify-center gap-2.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100/80 mt-1 sm:mt-0 w-full sm:w-auto">
                    {/* HARGA */}
                    <div className="text-center sm:text-right">
                        <span className="text-[9px] font-bold text-slate-400 block sm:hidden uppercase tracking-wider mb-0.5">Total Biaya</span>
                        <div className="flex items-baseline justify-center sm:justify-end gap-1">
                            <span className="text-lg sm:text-lg font-black text-[#FF5E1F]">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">
                                /{durationNumber > 1 ? `${durationNumber}hari` : 'hari'}
                            </span>
                        </div>
                    </div>

                    {/* TOMBOL PESAN (LEBAR FULL PADA MOBILE) */}
                    <button
                        type="button"
                        disabled={!statusConfig.isAvailable}
                        onClick={() => onSelect(car)}
                        className={`w-full sm:w-auto font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
                            statusConfig.isAvailable
                                ? 'bg-[#0194F3] hover:bg-sky-600 text-white shadow-2xs hover:shadow-md active:scale-95'
                                : 'bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed'
                        }`}
                    >
                        <span>{statusConfig.isAvailable ? 'Pesan Sekarang' : 'Tidak Tersedia'}</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalCard;
