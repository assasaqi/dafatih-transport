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
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-5">

                {/* KIRI: GAMBAR & DETAIL SPESIFIKASI */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* GAMBAR MOBIL */}
                    <div className="w-5/12 sm:w-40 h-20 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
                        <img
                            src={getImageUrl(car)}
                            alt={car?.name || 'Mobil'}
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* DETAIL (NAMA MOBIL, KURSI, BAGASI, TRANSMISI) */}
                    <div className="w-7/12 sm:flex-1 space-y-1 min-w-0">
                        {/* NAMA MOBIL */}
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {car?.name}
                        </h3>

                        {/* Kursi & Bagasi */}
                        <div className="flex items-center gap-2.5 text-slate-700 font-bold text-[11px]">
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-chair text-slate-500 text-[10px]"></i>
                                {capacity}
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-suitcase text-slate-500 text-[10px]"></i>
                                {luggage}
                            </span>
                        </div>

                        {/* Transmisi */}
                        <div className="flex items-center gap-1 font-extrabold text-slate-800 uppercase tracking-tight text-[10px]">
                            <i className="fa-solid fa-dharmachakra text-slate-600"></i>
                            <span>{isAutomatic ? 'AUTOMATIC' : 'MANUAL'}</span>
                        </div>
                    </div>
                </div>

                {/* KANAN: STATUS DINAMIS, HARGA, & TOMBOL PESAN */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">

                    {/* 1. STATUS DINAMIS DARI API BACKEND */}
                    <div className="text-[#00a2ff] font-bold text-[10px] sm:text-xs text-right capitalize">
                        {statusText}
                    </div>

                    {/* 2. HARGA */}
                    <div className="text-right">
                        <div className="flex items-baseline gap-1 justify-end">
                            <span className="text-sm sm:text-lg font-black text-[#FF5E1F]">
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
                        onClick={() => onSelect(car)}
                        className="bg-[#00a2ff] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-2xs hover:shadow-md transition-all cursor-pointer"
                    >
                        Pesan
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RentalCard;
