import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes, API_BASE_URL } from '@/services/api';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
    const navigate = useNavigate();
    const {
        visibleCount,
        setVisibleCount,
        searchQuery,
        setSearchQuery
    } = useTariff();

    // Tab Aktif: 'airport' (Antar-Jemput), 'tour' (Paket Wisata), 'rental' (Sewa Mobil)
    const [activeTab, setActiveTab] = useState('airport');

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setVisibleCount(getInitialLimit());
    };

    // 3. Memoize filter pencarian rute untuk kategori Antar-Jemput
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
        <div className="w-full overflow-x-hidden min-h-screen bg-[#F2F4F7] text-slate-800">
            {/* Banner Compact Ala Traveloka */}
            <div className="bg-[#0194F3] text-white px-5 py-6 sm:py-8 text-center shadow-xs">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Daftar Tarif Layanan Transportasi Lombok
                </h1>
                <p className="text-sky-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                    Pilihan rute perjalanan &amp; harga transparan untuk kenyamanan liburan Anda di Pulau Lombok.
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Kategori Tab Navigasi */}
                <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => handleTabChange('airport')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'airport'
                                ? 'bg-[#0194F3] text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <i className="fa-solid fa-plane-arrival"></i> Antar-Jemput
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('tour')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'tour'
                                ? 'bg-[#0194F3] text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <i className="fa-solid fa-route"></i> Paket Wisata
                    </button>

                    <button
                        type="button"
                        onClick={() => handleTabChange('rental')}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'rental'
                                ? 'bg-[#0194F3] text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        <i className="fa-solid fa-car"></i> Sewa Mobil
                    </button>
                </div>

                {/* 1. KATEGORI: ANTAR-JEMPUT */}
                {activeTab === 'airport' && (
                    <>
                        {/* Search Bar khusus Antar-Jemput */}
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="relative flex items-center w-full max-w-xl mx-auto">
                                <i className="fa-solid fa-magnifying-glass absolute left-3.5 text-slate-400 text-xs pointer-events-none"></i>
                                <input
                                    type="text"
                                    className="w-full h-10 pl-9 pr-8 rounded-full border border-slate-300 bg-white text-xs sm:text-sm text-slate-700 outline-none focus:border-[#0194F3] transition-colors shadow-xs"
                                    placeholder="Cari rute penjemputan / tujuan..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

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

                        {!loading && !error && displayedRoutes.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                Tidak ada rute penjemputan yang ditemukan.
                            </div>
                        )}

                        {!loading && !error && displayedRoutes.length > 0 && (
                            /* Grid Kartu Tanpa Gambar */
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                                {displayedRoutes.map((route) => (
                                    <div
                                        key={route.id}
                                        onClick={() => handleSelectTariff(route.pickup_location, route.dropoff_location, route.price)}
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
                    </>
                )}

                {/* 2. KATEGORI: PAKET WISATA */}
                {activeTab === 'tour' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center my-4 shadow-xs">
                        <div className="w-16 h-16 bg-sky-50 text-[#0194F3] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fa-solid fa-route"></i>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                            Daftar Paket Wisata Lombok
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                            Layanan paket tour pilihan sedang dipersiapkan untuk memberikan pengalaman liburan terbaik bagi Anda.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/pesan')}
                            className="bg-[#0194F3] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
                        >
                            Konsultasi Custom Tour via WA
                        </button>
                    </div>
                )}

                {/* 3. KATEGORI: SEWA MOBIL */}
                {activeTab === 'rental' && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center my-4 shadow-xs">
                        <div className="w-16 h-16 bg-sky-50 text-[#0194F3] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fa-solid fa-car"></i>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
                            Daftar Tarif Sewa Mobil
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                            Layanan rental mobil lepas kunci maupun dengan driver sedang disiapkan.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/pesan')}
                            className="bg-[#0194F3] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
                        >
                            Tanya Ketersediaan Mobil
                        </button>
                    </div>
                )}

            </section>
        </div>
    );
};

export default Tariffs;
