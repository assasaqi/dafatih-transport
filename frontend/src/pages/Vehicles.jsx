import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { getVehicles } from '@/services/api';
import RentalCard from '@/components/cards/RentalCard';

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
        navigate(window.location.pathname, { replace: true, state: {} });
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

    const hasActiveFilter = Boolean(filterLocation || filterArmada || filterDuration);

    // Format Teks Filter Aktif
    const formatFilterText = () => {
        const parts = [];
        if (filterLocation) parts.push(filterLocation);
        if (filterArmada) parts.push(filterArmada);
        if (filterDuration) parts.push(`${filterDuration} Hari`);
        return parts.join(' ➔ ');
    };

    return (
        <div className="w-full min-h-screen bg-[#F2F4F7] text-slate-800 pt-24 sm:pt-28 pb-16">
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-4">

                {/* Judul Halaman */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Pilihan Armada
                    </h1>
                </div>

                {/* KOTAK PENCARIAN DENGAN BADGE FILTER AKTIF & RESET FILTER DI DALAMNYA */}
                <div className="mb-8">
                    <div className="relative bg-white border border-slate-300 rounded-full px-4 sm:px-5 py-2.5 flex items-center gap-2.5 shadow-xs focus-within:border-[#00a2ff] focus-within:ring-2 focus-within:ring-sky-100 transition-all">

                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm sm:text-base shrink-0"></i>

                        {/* BADGE FILTER AKTIF DI DALAM BAR PENCARIAN */}
                        {hasActiveFilter && (
                            <div className="bg-[#f0f8ff] border border-[#bce3ff] text-[#0a355c] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 max-w-[200px] sm:max-w-[380px] truncate">
                                <span className="truncate">Filter Aktif: {formatFilterText()}</span>
                            </div>
                        )}

                        {/* INPUT TEKS PENCARIAN */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={hasActiveFilter ? "Cari lagi..." : "Cari armada / jenis mobil..."}
                            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
                        />

                        {/* TOMBOL CLEAR QUERY TEKS */}
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 shrink-0 cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}

                        {/* TOMBOL RESET FILTER DI DALAM BAR PENCARIAN */}
                        {hasActiveFilter && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-xs sm:text-sm text-[#00a2ff] hover:text-blue-700 font-extrabold shrink-0 transition-colors cursor-pointer pl-3 border-l border-slate-200"
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

                {/* DAFTAR CARD ARMADA HORIZONTAL */}
                {!loading && !error && filteredVehicles.length > 0 && (
                    <div className="space-y-4">
                        {filteredVehicles.map((car) => (
                            <RentalCard
                                key={car.id}
                                car={car}
                                filterDuration={filterDuration}
                                onSelect={handleSelectCar}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Mobil;
