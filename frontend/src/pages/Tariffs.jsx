import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '@/services/api';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
    const navigate = useNavigate();
    const {
        visibleCount,
        setVisibleCount,
        searchQuery,
        setSearchQuery
    } = useTariff();

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitialLimit = useCallback(() => (window.innerWidth <= 768 ? 3 : 6), []);

    // 1. Inisialisasi visibleCount jika null
    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }
    }, [visibleCount, setVisibleCount, getInitialLimit]);

    // 2. Fetch data API hanya 1x saat pertama di-mount
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

    const handleSelectTariff = (pickupPoint, dropPoint, routePrice) => {
        navigate('/pesan', {
            state: {
                pickup: pickupPoint,
                drop: dropPoint,
                price: Number(routePrice)
            }
        });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(getInitialLimit());
    };

    // 3. Memoize filter pencarian rute
    const filteredRoutes = useMemo(() => {
        if (!searchQuery.trim()) return routes;

        const q = searchQuery.toLowerCase();
        return routes.filter((r) => {
            const dropLoc = (r.dropoff_location || '').toLowerCase();
            const pickupLoc = (r.pickup_location || '').toLowerCase();
            return dropLoc.includes(q) || pickupLoc.includes(q);
        });
    }, [routes, searchQuery]);

    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedRoutes = useMemo(
        () => filteredRoutes.slice(0, currentLimit),
        [filteredRoutes, currentLimit]
    );
    const hasMore = currentLimit < filteredRoutes.length;

    return (
        <div className="w-full overflow-x-hidden min-h-screen bg-slate-50 text-slate-800">
            {/* Banner Compact */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 py-6 sm:py-8 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Daftar Tarif Transportasi Lombok
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto opacity-90">
                    Rute perjalanan &amp; harga transparan layanan antar-jemput (Maks 4 Pax + Bagasi).
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Search Bar */}
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="relative flex items-center w-full">
                        <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-slate-400 text-xs pointer-events-none"></i>
                        <input
                            type="text"
                            className="w-full h-10 pl-9 pr-8 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 outline-none focus:border-sky-600 transition-colors shadow-xs"
                            placeholder="Cari rute penjemputan / tujuan..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> Memuat tarif rute...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {!loading && !error && displayedRoutes.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Tidak ada rute yang ditemukan.
                    </div>
                )}

                {!loading && !error && displayedRoutes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {displayedRoutes.map((route) => (
                            <div
                                key={route.id}
                                className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200 mb-3">
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                        <i className="fa-solid fa-circle-dot text-sky-600 text-[10px] shrink-0"></i>
                                        <span className="text-xs text-slate-700 font-medium truncate">
                                            {route.pickup_location}
                                        </span>
                                    </div>
                                    <i className="fa-solid fa-arrow-right text-slate-400 text-xs shrink-0"></i>
                                    <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                                        <i className="fa-solid fa-location-dot text-amber-500 text-xs shrink-0"></i>
                                        <span className="text-xs text-slate-700 font-medium truncate">
                                            {route.dropoff_location}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div>
                                        <span className="block text-[10px] text-slate-400">Harga All-In</span>
                                        <strong className="text-sm sm:text-base font-extrabold text-sky-600">
                                            Rp {Number(route.price || 0).toLocaleString('id-ID')}
                                        </strong>
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                        onClick={() => handleSelectTariff(route.pickup_location, route.dropoff_location, route.price)}
                                    >
                                        <i className="fa-solid fa-car text-[10px]"></i> Pesan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="text-center mt-6">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-full border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-200 cursor-pointer"
                            onClick={() => setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit())}
                        >
                            Tampilkan Lebih Banyak
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Tariffs;
