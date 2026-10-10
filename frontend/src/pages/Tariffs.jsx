import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoutes } from '@/services/api';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Mengambil state filter yang dikirim dari Home.jsx (jika ada)
    const initialFilter = location.state || {};

    const {
        visibleCount,
        setVisibleCount,
        searchQuery,
        setSearchQuery
    } = useTariff();

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State filter lokal dari pencarian Home
    const pickupFilter = initialFilter.pickup || '';
    const dropoffFilter = initialFilter.dropoff || initialFilter.drop || '';
    const travelDate = initialFilter.travelDate || initialFilter.date || '';
    const passengers = initialFilter.passengers || '';

    const getInitialLimit = useCallback(() => (window.innerWidth <= 768 ? 4 : 8), []);

    // 1. Inisialisasi visibleCount jika null
    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }
    }, [visibleCount, setVisibleCount, getInitialLimit]);

    // 2. Fetch data API rute antar-jemput
    useEffect(() => {
        let isMounted = true;

        getRoutes()
            .then((res) => {
                if (isMounted) {
                    if (res.data?.success) {
                        setRoutes(res.data.data || []);
                    } else {
                        setError('Gagal memuat data rute.');
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Gagal mengambil data rute:', err);
                    setError('Gagal memuat data tarif dari server.');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSelectTariff = (route) => {
        navigate('/pesan', {
            state: {
                jenisLayanan: 'Antar-Jemput',
                pickupLoc: route.pickup_location,
                dropLoc: route.dropoff_location,
                pickup: route.pickup_location,
                drop: route.dropoff_location,
                dropoff: route.dropoff_location,
                price: Number(route.price || 0),
                date: travelDate,
                passengers: passengers
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(getInitialLimit());
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setVisibleCount(getInitialLimit());
        navigate(location.pathname, { replace: true, state: {} });
    };

    // 3. Memoize filter pencarian rute gabungan
    const filteredRoutes = useMemo(() => {
        let list = [...routes];

        if (pickupFilter.trim() || dropoffFilter.trim()) {
            const p = pickupFilter.toLowerCase().trim();
            const d = dropoffFilter.toLowerCase().trim();
            list = list.filter((r) => {
                const pickLoc = (r.pickup_location || '').toLowerCase().trim();
                const dropLoc = (r.dropoff_location || '').toLowerCase().trim();
                const matchPickup = !p || pickLoc.includes(p);
                const matchDrop = !d || dropLoc.includes(d);
                return matchPickup && matchDrop;
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter((r) => {
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                const pickupLoc = (r.pickup_location || '').toLowerCase();
                return dropLoc.includes(q) || pickupLoc.includes(q);
            });
        }

        return list;
    }, [routes, pickupFilter, dropoffFilter, searchQuery]);

    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedRoutes = useMemo(
        () => filteredRoutes.slice(0, currentLimit),
        [filteredRoutes, currentLimit]
    );
    const hasMore = currentLimit < filteredRoutes.length;

    // Cek keberadaan filter aktif
    const hasActiveFilter = Boolean(pickupFilter || dropoffFilter || searchQuery);

    // Format Teks Filter Aktif
    const formatFilterText = () => {
        const parts = [];
        if (pickupFilter) parts.push(pickupFilter);
        if (dropoffFilter) parts.push(dropoffFilter);
        if (!pickupFilter && !dropoffFilter && searchQuery) parts.push(`"${searchQuery}"`);
        return parts.join(' ➔ ');
    };

    return (
        <div className="w-full overflow-x-hidden min-h-screen bg-[#F2F4F7] text-slate-800 pt-24 sm:pt-28 pb-16">
            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                {/* Judul Halaman */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Rute &amp; Tarif
                    </h1>
                </div>

                {/* BAR PENCARIAN DENGAN BADGE FILTER AKTIF DI DALAMNYA */}
                <div className="mb-8">
                    <div className="relative bg-white border border-slate-300/80 rounded-full px-4 sm:px-5 py-2.5 flex items-center gap-2.5 shadow-xs focus-within:border-[#0194F3] focus-within:ring-2 focus-within:ring-sky-100 transition-all">

                        <i className="fa-solid fa-magnifying-glass text-slate-400 text-sm sm:text-base shrink-0"></i>

                        {/* BADGE FILTER AKTIF DI DALAM KOTAK INPUT */}
                        {hasActiveFilter && (
                            <div className="bg-[#f0f8ff] border border-[#bce3ff] text-[#0a355c] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 max-w-[200px] sm:max-w-[320px] truncate">
                                <span className="truncate">Filter: {formatFilterText()}</span>
                            </div>
                        )}

                        {/* INPUT PENCARIAN TEKS */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder={hasActiveFilter ? "Cari rute lagi..." : "Cari rute penjemputan / tujuan..."}
                            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
                        />

                        {/* TOMBOL CLEAR QUERY TEKS */}
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 shrink-0"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}

                        {/* TOMBOL RESET FILTER DI DALAM KOTAK INPUT */}
                        {hasActiveFilter && (
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="text-xs sm:text-sm text-[#0194F3] hover:text-sky-700 font-bold shrink-0 transition-colors cursor-pointer pl-2 border-l border-slate-200"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* INDIKATOR LOADING & ERROR */}
                {loading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#0194F3]"></i> Memuat tarif rute...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {/* HASIL KOSONG */}
                {!loading && !error && displayedRoutes.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 my-6">
                        <i className="fa-solid fa-route text-4xl text-slate-300 mb-3"></i>
                        <p className="text-slate-600 font-bold text-sm">
                            Tidak ada rute penjemputan yang ditemukan sesuai kriteria pencarian Anda.
                        </p>
                        <button
                            type="button"
                            onClick={handleResetFilter}
                            className="mt-3 text-xs bg-[#0194F3] text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-600 transition-all cursor-pointer"
                        >
                            Tampilkan Semua Rute
                        </button>
                    </div>
                )}

                {/* GRID KARTU RUTE */}
                {!loading && !error && displayedRoutes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {displayedRoutes.map((route) => (
                            <div
                                key={route.id}
                                onClick={() => handleSelectTariff(route)}
                                className="group bg-white rounded-2xl p-4 shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 cursor-pointer flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    {/* Rute Penjemputan ke Tujuan */}
                                    <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-[9px] uppercase font-bold text-slate-400">Penjemputan</span>
                                            <span className="text-xs font-bold text-slate-800 truncate block">
                                                {route.pickup_location}
                                            </span>
                                        </div>
                                        <i className="fa-solid fa-arrow-right text-slate-400 text-xs shrink-0"></i>
                                        <div className="flex-1 min-w-0 text-right">
                                            <span className="block text-[9px] uppercase font-bold text-slate-400">Tujuan</span>
                                            <span className="text-xs font-bold text-slate-800 truncate block">
                                                {route.dropoff_location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Info Kapasitas */}
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                                        <i className="fa-solid fa-user-group text-[10px] text-sky-600"></i>
                                        <span>Harga All-In (Maks 4 Pax + Bagasi)</span>
                                    </div>
                                </div>

                                {/* Harga & Tombol Pesan */}
                                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] text-slate-400 font-medium">Tarif</span>
                                        <span className="text-base font-extrabold text-[#F96D01]">
                                            Rp {Number(route.price || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelectTariff(route);
                                        }}
                                        className="bg-[#0194F3] group-hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                    >
                                        <span>Pesan</span>
                                        <i className="fa-solid fa-chevron-right text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="text-center mt-8">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-xl border border-[#0194F3] text-[#0194F3] hover:bg-[#0194F3] hover:text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-xs"
                            onClick={() => setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit())}
                        >
                            Tampilkan Lebih Banyak Rute
                        </button>
                    </div>
                )}

            </section>
        </div>
    );
};

export default Tariffs;
