import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getVehicles, API_BASE_URL } from '@/services/api';

const Mobil = () => {
    const navigate = useNavigate();
    const locationState = useLocation().state || {};
    const [searchParams, setSearchParams] = useSearchParams();

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ambil parameter pencarian dari Query URL atau Location State
    const filterLocation = searchParams.get('location') || locationState.location || locationState.pickupLoc || '';
    const filterArmada = searchParams.get('armada') || locationState.armada || locationState.armadaName || '';
    const filterDuration = searchParams.get('duration') || locationState.duration || '';

    // State pencarian teks langsung (Search Input)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let isMounted = true;

        getVehicles()
            .then((res) => {
                if (isMounted) {
                    if (res.data?.success) {
                        setVehicles(res.data.data || []);
                    } else {
                        setError('Gagal memuat data armada.');
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Gagal mengambil data armada:', err);
                    setError('Gagal memuat data armada dari server.');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter Armada berdasarkan Filter dari Form + Teks Pencarian Input
    const filteredVehicles = useMemo(() => {
        return vehicles.filter((car) => {
            const carName = (car.name || car.nama_armada || '').toLowerCase();

            // Filter Armada dari Form
            const matchesArmadaFilter = !filterArmada || carName.includes(filterArmada.toLowerCase());

            // Filter Kata Kunci Teks dari Search Input Bar
            const matchesSearchInput = !searchTerm || carName.includes(searchTerm.toLowerCase());

            return matchesArmadaFilter && matchesSearchInput;
        });
    }, [vehicles, filterArmada, searchTerm]);

    const handleResetFilter = () => {
        setSearchTerm('');
        setSearchParams({});
    };

    const handleSelectCar = (car) => {
        const durationNumber = Number(filterDuration) || 1;
        const pricePerDay = Number(car.price_per_day || 0);

        navigate('/pesan', {
            state: {
                jenisLayanan: 'Sewa Mobil',
                carType: car.name,
                namaArmada: car.name,
                price: pricePerDay,
                totalPrice: pricePerDay * durationNumber,
                location: filterLocation || 'Area Lombok',
                duration: durationNumber,
                vehicleId: car.id
            }
        });
    };

    // Helper URL Gambar Dinamis
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

    const hasActiveFilter = Boolean(filterLocation || filterArmada || filterDuration);

    // Format Teks Filter Aktif Singkat
    const formatFilterText = () => {
        const parts = [];
        if (filterLocation) parts.push(filterLocation);
        if (filterArmada) parts.push(filterArmada);
        if (filterDuration) parts.push(`${filterDuration} Hari`);
        return parts.join(' ➔ ');
    };

    return (
        <div className="w-full min-h-screen bg-[#F2F4F7] text-slate-800 pt-24 sm:pt-28 pb-16">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                {/* Judul Halaman */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Pilihan Armada
                    </h1>
                </div>

                {/* KOTAK PENCARIAN DENGAN FILTER AKTIF DI DALAMNYA */}
                <div className="mb-8">
                    <div className="relative bg-white border border-slate-300/80 rounded-full px-4 sm:px-5 py-2.5 flex items-center gap-2.5 shadow-xs focus-within:border-[#00a2ff] focus-within:ring-2 focus-within:ring-sky-100 transition-all">

                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm sm:text-base shrink-0"></i>

                        {/* BADGE FILTER AKTIF DI DALAM INPUT BAR */}
                        {hasActiveFilter && (
                            <div className="bg-[#f0f8ff] border border-[#bce3ff] text-[#0a355c] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 max-w-[200px] sm:max-w-[320px] truncate">
                                <span className="truncate">Filter: {formatFilterText()}</span>
                            </div>
                        )}

                        {/* INPUT PENCARIAN TEKS */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={hasActiveFilter ? "Cari lagi..." : "Cari armada / jenis mobil..."}
                            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
                        />

                        {/* TOMBOL CLEAR INPUT ATAU RESET FILTER DI DALAM INPUT BAR */}
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 shrink-0"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}

                        {hasActiveFilter && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-xs sm:text-sm text-[#00a2ff] hover:text-blue-700 font-bold shrink-0 transition-colors cursor-pointer pl-2 border-l border-slate-200"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* INDIKATOR LOADING & ERROR */}
                {loading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#00a2ff]"></i>
                        Memuat daftar armada...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {/* TAMPILAN JIKA TIDAK ADA HASIL */}
                {!loading && !error && filteredVehicles.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-6">
                        <i className="fa-solid fa-car-side text-4xl text-slate-300 mb-3"></i>
                        <p className="text-slate-600 font-bold text-sm">
                            Armada mobil tidak ditemukan.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilter}
                            className="mt-3 text-xs bg-[#00a2ff] text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all cursor-pointer"
                        >
                            Tampilkan Semua Armada
                        </button>
                    </div>
                )}

                {/* GRID CARD DAFTAR ARMADA */}
                {!loading && !error && filteredVehicles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {filteredVehicles.map((car) => (
                            <div
                                key={car.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Gambar Ukuran Proporsional */}
                                    <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                                        <img
                                            src={getImageUrl(car)}
                                            alt={car.name}
                                            translate="no"
                                            loading="lazy"
                                            className="notranslate w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase">
                                            {car.category || 'MPV'}
                                        </span>
                                    </div>

                                    {/* Detail Teks */}
                                    <div className="p-3.5 sm:p-4">
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00a2ff] transition-colors mb-1">
                                            {car.name}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                            {car.description || 'Armada siap pakai dengan driver profesional berpengalaman.'}
                                        </p>

                                        {/* List Spesifikasi */}
                                        <ul className="space-y-1.5 py-2.5 my-2 border-y border-dashed border-slate-200 text-[11px] text-slate-600 font-medium">
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-users text-[#00a2ff] text-xs w-4 text-center"></i>
                                                <span>Kapasitas {car.capacity || 6} Penumpang</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-gear text-[#00a2ff] text-xs w-4 text-center"></i>
                                                <span>Transmisi {car.transmission || 'Manual / Matic'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-snowflake text-[#00a2ff] text-xs w-4 text-center"></i>
                                                <span>AC Cold &amp; Clean Interior</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] text-slate-400 font-medium">
                                            {filterDuration ? `Total (${filterDuration} Hari)` : 'Sewa / Hari'}
                                        </span>
                                        <span className="text-base font-extrabold text-[#F96D01]">
                                            Rp {(
                                                Number(car.price_per_day || 0) * (Number(filterDuration) || 1)
                                            ).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCar(car)}
                                        className="bg-[#00a2ff] hover:bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                    >
                                        <i className="fa-solid fa-car"></i>
                                        <span>Pesan</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Mobil;
