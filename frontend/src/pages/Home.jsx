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
    const [heroSlides, setHeroSlides] = useState(localImageUrls);

    const { searchQuery } = useHome();

    const [routes, setRoutes] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // State Form Pencarian Hero (Semua KOSONG secara default)
    const [activeTab, setActiveTab] = useState('airport');
    const [pickupInput, setPickupInput] = useState('');
    const [dropoffInput, setDropoffInput] = useState('');
    const [travelDate, setTravelDate] = useState('');     // <-- Diset KOSONG
    const [passengers, setPassengers] = useState('');     // <-- Diset KOSONG

    // State kriteria filter aktif untuk slider bawah
    const [searchFilter, setSearchFilter] = useState({ pickup: '', dropoff: '' });

    // State untuk Custom Dropdown Open/Close
    const [isPickupOpen, setIsPickupOpen] = useState(false);
    const [isDropoffOpen, setIsDropoffOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isPassengerOpen, setIsPassengerOpen] = useState(false);

    // Ref untuk click outside handler
    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);
    const calendarRef = useRef(null);
    const passengerRef = useRef(null);
    const sliderRef = useRef(null);

    // State visibilitas tombol slide
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

    // Helper untuk memformat objek Date ke ISO string 'YYYY-MM-DD'
    const formatDateToISO = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayObj = new Date();

    // State Navigasi Bulan untuk Kalender Kustom
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date(todayObj.getFullYear(), todayObj.getMonth(), 1));

    // Load Data Rute & Blog dari Backend API
    useEffect(() => {
        Promise.all([getRoutes(), getBlogs()])
            .then(([routesRes, blogsRes]) => {
                if (routesRes.data?.success && Array.isArray(routesRes.data.data)) {
                    setRoutes(routesRes.data.data);
                }
                if (blogsRes.data?.success && Array.isArray(blogsRes.data.data)) {
                    setBlogs(blogsRes.data.data.slice(0, 3));
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data:', err);
                setError('Gagal memuat data perjalanan.');
                setIsLoading(false);
            });
    }, []);

    // Close dropdown saat klik di luar area input
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickupRef.current && !pickupRef.current.contains(e.target)) {
                setIsPickupOpen(false);
            }
            if (dropoffRef.current && !dropoffRef.current.contains(e.target)) {
                setIsDropoffOpen(false);
            }
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                setIsCalendarOpen(false);
            }
            if (passengerRef.current && !passengerRef.current.contains(e.target)) {
                setIsPassengerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mengambil daftar unik lokasi penjemputan
    const uniquePickupLocations = Array.from(
        new Set(routes.map((r) => r.pickup_location).filter(Boolean))
    );

    // Mengambil daftar lokasi tujuan yang tersedia berdasarkan penjemputan terpilih
    const availableDropoffLocations = Array.from(
        new Set(
            routes
                .filter((r) => !pickupInput || r.pickup_location === pickupInput)
                .map((r) => r.dropoff_location)
                .filter(Boolean)
        )
    );

    // Handler ketika lokasi penjemputan dipilih
    const handleSelectPickup = (selectedPickup) => {
        setPickupInput(selectedPickup);
        setIsPickupOpen(false);

        const matchingRoutes = routes.filter((r) => r.pickup_location === selectedPickup);
        if (matchingRoutes.length > 0) {
            setDropoffInput(matchingRoutes[0].dropoff_location || '');
        } else {
            setDropoffInput('');
        }
    };

    // Handler ketika lokasi tujuan dipilih
    const handleSelectDropoff = (selectedDropoff) => {
        setDropoffInput(selectedDropoff);
        setIsDropoffOpen(false);
    };

    // Logika Pembuatan Grid Tanggal untuk Kalender Kustom
    const generateCalendarDays = () => {
        const year = currentCalendarMonth.getFullYear();
        const month = currentCalendarMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(new Date(year, month, d));
        }
        return days;
    };

    const calendarDays = generateCalendarDays();

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1));
    };

    // Slideshow Background Otomatis
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

    // Handler saat tombol Cari diklik
    const handleHeroSearchSubmit = (e) => {
        e.preventDefault();

        if (activeTab === 'rental' || activeTab === 'tour') {
            navigate('/not-found');
            return;
        }

        setSearchFilter({
            pickup: pickupInput,
            dropoff: dropoffInput
        });

        const routesSection = document.getElementById('routes-section');
        if (routesSection) {
            routesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Menyaring rute untuk slider
    const getFilteredRoutes = () => {
        let routesList = [...routes];

        if (searchFilter.pickup.trim() !== '' || searchFilter.dropoff.trim() !== '') {
            const p = searchFilter.pickup.toLowerCase().trim();
            const d = searchFilter.dropoff.toLowerCase().trim();
            routesList = routesList.filter((r) => {
                const pickLoc = (r.pickup_location || '').toLowerCase();
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                const matchPickup = p === '' || pickLoc === p;
                const matchDrop = d === '' || dropLoc === d;
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

    const getImageUrl = (route) => {
        const imageUrl = route?.image_url || route?.image || route?.image_path || '';
        if (!imageUrl) return 'https://placehold.co/400x250?text=Transport+Lombok';

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

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        if (!y || !m || !d) return dateStr;
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        return dateObj.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-[#F2F4F7] text-slate-800 min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[480px] md:min-h-[520px] flex items-center justify-center px-4 py-12 md:py-20 bg-slate-900">

                {/* Background Slideshow */}
                <div className="absolute inset-0 z-0 overflow-hidden">
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
                    <div className="absolute inset-0 bg-slate-950/45 backdrop-brightness-95" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-6xl mx-auto">
                    <h1 className="text-center text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 drop-shadow-lg tracking-tight leading-snug">
                        Pilihan Terbaik Jelajahi Keindahan Lombok
                    </h1>

                    {/* Floating Search Card */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 relative z-20">
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

                            {/* CUSTOM DROPDOWN: LOKASI PENJEMPUTAN */}
                            <div className="relative" ref={pickupRef}>
                                <div
                                    onClick={() => {
                                        setIsPickupOpen(!isPickupOpen);
                                        setIsDropoffOpen(false);
                                        setIsCalendarOpen(false);
                                        setIsPassengerOpen(false);
                                    }}
                                    className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
                                        isPickupOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Lokasi Penjemputan
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <i className="fa-solid fa-location-dot text-[#0194F3] text-sm shrink-0"></i>
                                            <span className={`text-xs sm:text-sm font-semibold truncate ${pickupInput ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {pickupInput || 'Pilih Penjemputan'}
                                            </span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isPickupOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
                                    </div>
                                </div>

                                {isPickupOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="max-h-56 overflow-y-auto py-1">
                                            {uniquePickupLocations.length > 0 ? (
                                                uniquePickupLocations.map((loc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectPickup(loc)}
                                                        className={`px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                                                            pickupInput === loc ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'
                                                        }`}
                                                    >
                                                        <span>{loc}</span>
                                                        {pickupInput === loc && <i className="fa-solid fa-check text-xs"></i>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-3 text-xs text-slate-400 text-center">
                                                    Tidak ada lokasi penjemputan
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM DROPDOWN: LOKASI TUJUAN */}
                            <div className="relative" ref={dropoffRef}>
                                <div
                                    onClick={() => {
                                        setIsDropoffOpen(!isDropoffOpen);
                                        setIsPickupOpen(false);
                                        setIsCalendarOpen(false);
                                        setIsPassengerOpen(false);
                                    }}
                                    className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
                                        isDropoffOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Lokasi Tujuan
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <i className="fa-solid fa-location-arrow text-[#0194F3] text-sm shrink-0"></i>
                                            <span className={`text-xs sm:text-sm font-semibold truncate ${dropoffInput ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {dropoffInput || 'Pilih Tujuan'}
                                            </span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isDropoffOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
                                    </div>
                                </div>

                                {isDropoffOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="max-h-56 overflow-y-auto py-1">
                                            {availableDropoffLocations.length > 0 ? (
                                                availableDropoffLocations.map((loc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleSelectDropoff(loc)}
                                                        className={`px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                                                            dropoffInput === loc ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'
                                                        }`}
                                                    >
                                                        <span>{loc}</span>
                                                        {dropoffInput === loc && <i className="fa-solid fa-check text-xs"></i>}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-3 text-xs text-slate-400 text-center">
                                                    Tidak ada tujuan tersedia
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM KALENDER POPOVER */}
                            <div className="relative" ref={calendarRef}>
                                <div
                                    onClick={() => {
                                        setIsCalendarOpen(!isCalendarOpen);
                                        setIsPickupOpen(false);
                                        setIsDropoffOpen(false);
                                        setIsPassengerOpen(false);
                                    }}
                                    className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
                                        isCalendarOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Tanggal Perjalanan
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <i className="fa-solid fa-calendar-days text-[#0194F3] text-sm shrink-0"></i>
                                            <span className={`text-xs sm:text-sm font-semibold truncate ${travelDate ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {travelDate ? formatDisplayDate(travelDate) : 'Pilih Tanggal'}
                                            </span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isCalendarOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
                                    </div>
                                </div>

                                {/* POPOVER KALENDER KUSTOM */}
                                {isCalendarOpen && (
                                    <div className="absolute left-0 sm:left-auto sm:right-0 lg:left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {/* Header Navigasi Bulan */}
                                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                                            <button
                                                type="button"
                                                onClick={handlePrevMonth}
                                                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                                            >
                                                <i className="fa-solid fa-chevron-left text-xs"></i>
                                            </button>
                                            <span className="text-xs font-bold text-slate-800">
                                                {currentCalendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleNextMonth}
                                                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                                            >
                                                <i className="fa-solid fa-chevron-right text-xs"></i>
                                            </button>
                                        </div>

                                        {/* Nama Hari */}
                                        <div className="grid grid-cols-7 text-center mb-1">
                                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((dayName, index) => (
                                                <span key={index} className="text-[10px] font-bold text-slate-400">
                                                    {dayName}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Grid Tanggal Bulan */}
                                        <div className="grid grid-cols-7 gap-1 text-center">
                                            {calendarDays.map((dateObj, idx) => {
                                                if (!dateObj) {
                                                    return <div key={idx} className="h-8" />;
                                                }

                                                const isoStr = formatDateToISO(dateObj);
                                                const isSelected = isoStr === travelDate;
                                                const isPast = dateObj < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());

                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        disabled={isPast}
                                                        onClick={() => {
                                                            setTravelDate(isoStr);
                                                            setIsCalendarOpen(false);
                                                        }}
                                                        className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                                            isSelected
                                                                ? 'bg-[#0194F3] text-white shadow-sm'
                                                                : isPast
                                                                ? 'text-slate-300 cursor-not-allowed'
                                                                : 'text-slate-700 hover:bg-sky-50 hover:text-[#0194F3]'
                                                        }`}
                                                    >
                                                        {dateObj.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CUSTOM DROPDOWN: JUMLAH PENUMPANG */}
                            <div className="relative" ref={passengerRef}>
                                <div
                                    onClick={() => {
                                        setIsPassengerOpen(!isPassengerOpen);
                                        setIsPickupOpen(false);
                                        setIsDropoffOpen(false);
                                        setIsCalendarOpen(false);
                                    }}
                                    className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
                                        isPassengerOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Jumlah Penumpang
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <i className="fa-solid fa-user-group text-[#0194F3] text-sm shrink-0"></i>
                                            <span className={`text-xs sm:text-sm font-semibold truncate ${passengers ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {passengers ? `${passengers} Orang` : 'Pilih Penumpang'}
                                            </span>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isPassengerOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
                                    </div>
                                </div>

                                {isPassengerOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                                        {['1', '2', '3', '4'].map((num) => (
                                            <div
                                                key={num}
                                                onClick={() => {
                                                    setPassengers(num);
                                                    setIsPassengerOpen(false);
                                                }}
                                                className={`px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                                                    passengers === num ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'
                                                }`}
                                            >
                                                <span>{num} Orang {num === '4' ? '(Maksimal)' : ''}</span>
                                                {passengers === num && <i className="fa-solid fa-check text-xs"></i>}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                        {searchFilter.pickup || searchFilter.dropoff ? 'Hasil Pencarian Perjalanan' : 'Rute Penjemputan Populer'}
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
                                                src={getImageUrl(route)}
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

                                            {travelDate && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 font-medium">
                                                    <i className="fa-regular fa-calendar text-[10px] text-amber-600"></i>
                                                    <span>{formatDisplayDate(travelDate)}</span>
                                                </div>
                                            )}

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
