import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';
import { getRoutes, getBlogs, API_BASE_URL } from '@/services/api';

// Secara dinamis membaca semua berkas gambar dari folder /public/images/
const localImagesModules = import.meta.glob('/public/images/*.{png,jpg,jpeg,webp,avif}', {
    eager: true,
    import: 'default'
});

// Mengubah objek modul menjadi array string URL gambar publik
const localImageUrls = Object.keys(localImagesModules).map((filePath) =>
    filePath.replace('/public', '')
);

const Home = () => {
    const navigate = useNavigate();

    const [currentSlide, setCurrentSlide] = useState(0);
    // Menginisialisasi heroSlides dari gambar lokal publik yang ditemukan
    const [heroSlides, setHeroSlides] = useState(localImageUrls);

    const { searchQuery, setSearchQuery } = useHome();

    const [routes, setRoutes] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State Form Pencarian Hero
    const [activeTab, setActiveTab] = useState('airport');
    const [pickupInput, setPickupInput] = useState('');
    const [dropoffInput, setDropoffInput] = useState('');

    // Ref untuk slider
    const sliderRef = useRef(null);

    // State visibilitas tombol slide kiri & kanan
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

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

    // Load Data Rute & Blog dari Backend
    useEffect(() => {
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
    }, []);

    // Slideshow Background Otomatis Berganti Setiap 5 Detik
    useEffect(() => {
        if (heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const handleTabClick = (tabKey) => {
        if (tabKey === 'rental' || tabKey === 'tour') {
            navigate('/not-found');
        } else {
            setActiveTab(tabKey);
        }
    };

    const handleHeroSearchSubmit = (e) => {
        e.preventDefault();

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

    const updateScrollButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftBtn(scrollLeft > 5);
            setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    useEffect(() => {
        updateScrollButtons();
    }, [filteredRoutes]);

    const scrollSlider = (direction) => {
        if (sliderRef.current) {
            const container = sliderRef.current;
            const cardWidth = container.firstElementChild?.clientWidth || 280;
            const gap = 16;
            const scrollAmount = cardWidth + gap;

            container.scrollBy({
                left: direction === 'next' ? scrollAmount : -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

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

    // Mengambil URL Gambar Dinamis berdasarkan base URL dari API
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x250?text=Transport+Lombok';
        let fullUrl = imageUrl;
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
            const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
            fullUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
        }
        return encodeURI(fullUrl);
    };

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-[#F2F4F7] text-slate-800 min-h-screen">
            {/* HERO SECTION DENGAN TAG IMG TAJAM & TAJAN */}
            <section className="relative min-h-[480px] md:min-h-[520px] flex items-center justify-center px-4 py-12 md:py-20 overflow-hidden bg-slate-900">

                {/* Render Slideshow Gambar dengan Elemen <img> untuk Resolusi Maksimal */}
                <div className="absolute inset-0 z-0">
                    {heroSlides.length > 0 ? (
                        heroSlides.map((imagePath, index) => (
                            <img
                                key={index}
                                src={imagePath}
                                alt="Lombok Background"
                                translate="no"
                                className={`notranslate absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out blur-xs scale-105 ${
                                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ imageRendering: 'auto' }}
                            />
                        ))
                    ) : (
                        <div className="absolute inset-0 bg-slate-800" />
                    )}
                    {/* Dark Overlay agar Teks & Form tetap terlihat kontras */}
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-brightness-95" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 drop-shadow-lg tracking-tight leading-snug">
                        Pilihan Terbaik Jelajahi Keindahan Lombok
                    </h1>

                    {/* Floating Search Card */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20">
                        {/* Tab Kategori Layanan */}
                        <div className="flex gap-2 border-b border-slate-200 pb-3.5 mb-5 overflow-x-auto">
                            <button
                                type="button"
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                                    activeTab === 'airport'
                                        ? 'bg-[#0194F3] text-white'
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
                                        ? 'bg-[#0194F3] text-white'
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
                                        ? 'bg-[#0194F3] text-white'
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
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-[#0194F3] transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Lokasi Penjemputan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot text-[#0194F3] text-sm"></i>
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
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-[#0194F3] transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Lokasi Tujuan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-arrow text-[#0194F3] text-sm"></i>
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
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-[#0194F3] transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Tanggal Perjalanan
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-calendar-days text-[#0194F3] text-sm"></i>
                                    <input
                                        type="date"
                                        min={todayStr}
                                        className="w-full text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent"
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Jumlah Penumpang */}
                            <div className="border border-slate-300 rounded-xl p-2.5 bg-white flex flex-col focus-within:border-[#0194F3] transition-colors">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Jumlah Penumpang
                                </span>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-user-group text-[#0194F3] text-sm"></i>
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
                                className="w-full lg:w-auto h-full px-6 py-3 bg-[#0194F3] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <span>Cari</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* SECTION HASIL RUTE */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10" id="routes-section">
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        {pickupInput || dropoffInput ? 'Hasil Pencarian Perjalanan' : 'Rute Penjemputan Populer'}
                    </h2>
                </div>

                {isLoading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#0194F3]"></i> Memuat rute...
                    </div>
                )}

                {error && <div className="text-center py-6 text-red-500">{error}</div>}

                {!isLoading && !error && filteredRoutes.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Rute perjalanan yang Anda cari tidak ditemukan.
                    </div>
                )}

                {/* SLIDER RUTE PERJALANAN */}
                {!isLoading && !error && filteredRoutes.length > 0 && (
                    <div className="relative group/slider">
                        {showLeftBtn && (
                            <button
                                type="button"
                                onClick={() => scrollSlider('prev')}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-[#0194F3] text-slate-800 hover:text-white shadow-lg border border-slate-200 transition-all flex items-center justify-center cursor-pointer backdrop-blur-xs hover:scale-110"
                                title="Sebelumnya"
                            >
                                <i className="fa-solid fa-chevron-left text-sm"></i>
                            </button>
                        )}

                        {showRightBtn && (
                            <button
                                type="button"
                                onClick={() => scrollSlider('next')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-[#0194F3] text-slate-800 hover:text-white shadow-lg border border-slate-200 transition-all flex items-center justify-center cursor-pointer backdrop-blur-xs hover:scale-110"
                                title="Berikutnya"
                            >
                                <i className="fa-solid fa-chevron-right text-sm"></i>
                            </button>
                        )}

                        <div
                            ref={sliderRef}
                            onScroll={updateScrollButtons}
                            className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar scrollbar-none snap-x snap-mandatory"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {filteredRoutes.map((route) => (
                                <div
                                    key={route.id}
                                    onClick={() => handleSelectRoute(route)}
                                    className="snap-start shrink-0 w-[260px] sm:w-[280px] lg:w-[calc(25%-15px)] group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-slate-200/80 cursor-pointer flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                                            <img
                                                src={getImageUrl(route.image_url)}
                                                alt={`${route.pickup_location} - ${route.dropoff_location}`}
                                                translate="no"
                                                className="notranslate w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="p-3.5 sm:p-4">
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0194F3] transition-colors line-clamp-1 mb-1">
                                                {route.pickup_location} - {route.dropoff_location}
                                            </h3>

                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 font-medium">
                                                <i className="fa-regular fa-calendar text-[10px] text-amber-600"></i>
                                                <span>{formatDisplayDate(travelDate)}</span>
                                            </div>

                                            <div className="pt-1">
                                                <span className="text-base sm:text-lg font-extrabold text-[#F96D01] block leading-tight">
                                                    Rp {Number(route.price).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
