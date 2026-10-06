import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';
import { getRoutes, getBlogs } from '@/services/api';

import heroData from '@/data/hero.json';

const Home = () => {
    const navigate = useNavigate();

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = heroData.heroSlides || [];

    const {
        visibleCount,
        setVisibleCount,
        searchQuery,
        setSearchQuery
    } = useHome();

    const [routes, setRoutes] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State Form Pencarian Hero
    const [activeTab, setActiveTab] = useState('airport');
    const [pickupInput, setPickupInput] = useState('');
    const [dropoffInput, setDropoffInput] = useState('');

    // Dapatkan tanggal hari ini dalam format YYYY-MM-DD berbasis zona waktu lokal
    const getLocalTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalTodayString();
    const [travelDate, setTravelDate] = useState(todayStr);
    const [passengers, setPassengers] = useState('1');

    const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }

        Promise.all([getRoutes(), getBlogs()])
            .then(([routesRes, blogsRes]) => {
                if (routesRes.data?.success) setRoutes(routesRes.data.data);
                if (blogsRes.data?.success) setBlogs(blogsRes.data.data.slice(0, 3));
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data:', err);
                setError('Gagal memuat data perjalanan.');
                setIsLoading(false);
            });
    }, [visibleCount, setVisibleCount]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    // Handler klik tab kategori
    const handleTabClick = (tabKey) => {
        if (tabKey === 'rental' || tabKey === 'tour') {
            navigate('/not-found');
        } else {
            setActiveTab(tabKey);
        }
    };

    const handleHeroSearchSubmit = (e) => {
        e.preventDefault();

        // Jika tab aktif bukan airport, alihkan ke notfound
        if (activeTab === 'rental' || activeTab === 'tour') {
            navigate('/not-found');
            return;
        }

        const queryCombined = `${pickupInput} ${dropoffInput}`.trim();
        setSearchQuery(queryCombined);

        const routesSection = document.getElementById('routes-section');
        if (routesSection) {
            routesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getFilteredRoutes = () => {
        let routesList = [...routes];

        if (pickupInput.trim() !== '' || dropoffInput.trim() !== '') {
            const p = pickupInput.toLowerCase().trim();
            const d = dropoffInput.toLowerCase().trim();
            routesList = routesList.filter((r) => {
                const pickLoc = (r.pickup_location || '').toLowerCase();
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                const matchPickup = p === '' || pickLoc.includes(p);
                const matchDrop = d === '' || dropLoc.includes(d);
                return matchPickup && matchDrop;
            });
        } else if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            routesList = routesList.filter((r) => {
                const pickLoc = (r.pickup_location || '').toLowerCase();
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                return pickLoc.includes(q) || dropLoc.includes(q);
            });
        }

        return routesList;
    };

    const filteredRoutes = getFilteredRoutes();
    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedRoutes = filteredRoutes.slice(0, currentLimit);

    const handleSelectRoute = (route) => {
        navigate('/pesan', {
            state: {
                pickup: route.pickup_location,
                drop: route.dropoff_location,
                price: Number(route.price),
                date: travelDate,
                passengers: passengers,
                carType: route.car_type || route.vehicle_name || 'Standar'
            }
        });
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x250?text=Transport+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    return (
        <div className="bg-slate-50 text-slate-800 min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[480px] md:min-h-[520px] flex items-center justify-center px-4 py-10 md:py-16 overflow-hidden">
                {/* Background Slideshow */}
                <div className="absolute inset-0 z-0">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{ backgroundImage: `url('${slide.image}')` }}
                        />
                    ))}
                    <div className="absolute inset-0 bg-slate-900/50" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <h1 className="text-center text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 drop-shadow-md tracking-tight leading-snug">
                        Pilihan Terbaik Jelajahi Keindahan Lombok
                    </h1>

                    {/* Floating Search Card ala Traveloka */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl">
                        {/* Tab Kategori Layanan */}
                        <div className="flex gap-2 border-b border-slate-200 pb-3.5 mb-5 overflow-x-auto">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                                    activeTab === 'airport'
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                                onClick={() => handleTabClick('airport')}
                            >
                                <i className="fa-solid fa-plane-arrival"></i> Antar-Jemput
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                                    activeTab === 'rental'
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                                onClick={() => handleTabClick('rental')}
                            >
                                <i className="fa-solid fa-car"></i> Sewa Mobil
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                                    activeTab === 'tour'
                                        ? 'bg-sky-600 text-white'
                                        : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                                onClick={() => handleTabClick('tour')}
                            >
                                <i className="fa-solid fa-route"></i> Paket Tour Lombok
                            </button>
                        </div>

                        {/* Form Grid Responsive */}
                        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.2fr_1fr_auto] gap-3 items-center" onSubmit={handleHeroSearchSubmit}>
                            {/* Lokasi Penjemputan */}
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-sky-600 transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Lokasi Penjemputan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot text-sky-600 text-sm"></i>
                                    <input
                                        type="text"
                                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent placeholder-slate-400"
                                        placeholder="Dari mana? (mis: Bandara Lombok)"
                                        value={pickupInput}
                                        onChange={(e) => setPickupInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Lokasi Tujuan */}
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-sky-600 transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Lokasi Tujuan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-arrow text-sky-600 text-sm"></i>
                                    <input
                                        type="text"
                                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent placeholder-slate-400"
                                        placeholder="Ke mana? (mis: Kuta Mandalika)"
                                        value={dropoffInput}
                                        onChange={(e) => setDropoffInput(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Tanggal Perjalanan */}
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-sky-600 transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Tanggal Perjalanan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-calendar-days text-sky-600 text-sm"></i>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Jumlah Penumpang (1-4) */}
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-sky-600 transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Jumlah Penumpang
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-user-group text-sky-600 text-sm"></i>
                                    <select
                                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent cursor-pointer"
                                        value={passengers}
                                        onChange={(e) => setPassengers(e.target.value)}
                                    >
                                        <option value="1">1 Orang</option>
                                        <option value="2">2 Orang</option>
                                        <option value="3">3 Orang</option>
                                        <option value="4">4 Orang (Maksimal)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Tombol Cari */}
                            <button
                                type="submit"
                                className="bg-sky-600 hover:bg-sky-700 text-white w-full lg:w-13 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-colors shadow-md sm:col-span-2 lg:col-span-1 cursor-pointer"
                                title="Cari Perjalanan"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* SECTION HASIL RUTE */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14" id="routes-section">
                <div className="text-center mb-8">
                    <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">
                        Rute Pilihan
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {pickupInput || dropoffInput ? 'Hasil Pencarian Perjalanan' : 'Pilihan Rute Penjemputan Populer'}
                    </h2>
                </div>

                {isLoading && (
                    <div className="text-center py-10 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i> Memuat rute...
                    </div>
                )}

                {error && <div className="text-center py-6 text-red-500">{error}</div>}

                {!isLoading && !error && displayedRoutes.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        Rute perjalanan yang Anda cari tidak ditemukan.
                    </div>
                )}

                {!isLoading && !error && displayedRoutes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedRoutes.map((route) => (
                            <div key={route.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                <div className="relative h-40 bg-slate-200">
                                    <img
                                        src={getImageUrl(route.image_url)}
                                        alt={route.dropoff_location || 'Rute Lombok'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <span className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white px-3 py-1 rounded-lg font-extrabold text-xs sm:text-sm">
                                        Rp {Number(route.price).toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sky-600 text-xs font-bold flex items-center gap-1">
                                            <i className="fa-solid fa-location-dot"></i> Transfer Area
                                        </span>
                                        {(route.car_type || route.vehicle_name) && (
                                            <span className="text-[11px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">
                                                {route.car_type || route.vehicle_name}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-4">
                                        {route.pickup_location} ➔ {route.dropoff_location}
                                    </h4>

                                    <button
                                        type="button"
                                        className="w-full mt-auto py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                        onClick={() => handleSelectRoute(route)}
                                    >
                                        <i className="fa-solid fa-car-side"></i>
                                        <span>Pesan Rute Ini</span>
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

export default Home;
