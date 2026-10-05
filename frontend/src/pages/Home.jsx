import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHome } from '@/context/HomeContext';
import { getRoutes } from '@/services/api';

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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }

        // Ambil data rute dari database MySQL
        getRoutes()
            .then((res) => {
                if (res.data.success) {
                    setRoutes(res.data.data);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data rute:', err);
                setError('Gagal memuat rute perjalanan.');
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

    // Filter rute berdasarkan pencarian
    const getFilteredRoutes = () => {
        let routesList = [...routes];

        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            routesList = routesList.filter((r) => {
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                const pickupLoc = (r.pickup_location || '').toLowerCase();
                return dropLoc.includes(q) || pickupLoc.includes(q);
            });
        }

        return routesList;
    };

    const filteredRoutes = getFilteredRoutes();
    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedRoutes = filteredRoutes.slice(0, currentLimit);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(getInitialLimit());
    };

    const handleSelectRoute = (route) => {
        navigate('/pesan', {
            state: {
                pickup: route.pickup_location,
                drop: route.dropoff_location,
                price: Number(route.price)
            }
        });
    };

    // Helper untuk merender URL Gambar dengan benar
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/300x200?text=Rute+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    return (
        <>
            <style>{`
        .page-view { display: block; }
        .hero-section { position: relative; overflow: hidden; min-height: 360px; display: flex; align-items: center; border-radius: 0 0 16px 16px; }
        .hero-bg-slideshow { position: absolute; inset: 0; z-index: 1; }
        .hero-slide { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; transition: opacity 1.2s ease-in-out; }
        .hero-slide.active { opacity: 1; }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%); }
        .hero-content-wrapper { position: relative; z-index: 2; color: #fff; text-align: center; margin: 0 auto; padding: 30px 20px 24px; }
        .google-reviews-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.95); color: #0f172a; padding: 6px 14px; border-radius: 30px; font-size: 0.78rem; font-weight: 700; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); text-decoration: none; margin-bottom: 14px; }
        .google-stars { color: #f59e0b; display: flex; gap: 2px; font-size: 0.75rem; }
        .section { padding: 24px 5%; max-width: 1200px; margin: 0 auto; }
        .sub-section-title h2 { font-size: 1.15rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .controls-container { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .search-box-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .search-box-wrapper i.fa-search { position: absolute; left: 12px; color: #94a3b8; font-size: 0.75rem; pointer-events: none; }
        .search-input { width: 100%; height: 36px; padding: 0 30px 0 32px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #ffffff; font-size: 0.78rem; color: #334155; outline: none; }

        .tour-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .tour-card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; flex-direction: column; }

        /* Gambar Kartu Rute */
        .tour-card-img { position: relative; height: 150px; overflow: hidden; background: #f1f5f9; }
        .tour-card-img img { width: 100%; height: 100%; object-fit: cover; }
        .tour-price-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(15, 23, 42, 0.85); color: #fff; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.82rem; }

        .tour-card-body { padding: 14px 16px; display: flex; flex-direction: column; flex-grow: 1; }
        .btn-submit { width: 100%; padding: 8px 14px; border: none; border-radius: 6px; background-color: #0284c7; color: #fff; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .status-box { text-align: center; padding: 40px; color: #64748b; }
      `}</style>

            <div className="page-view home-page">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-bg-slideshow">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                                style={{ backgroundImage: `url('${slide.image}')` }}
                            />
                        ))}
                        <div className="hero-overlay" />
                    </div>

                    <div className="container hero-content-wrapper">
                        <a
                            href={heroData.heroData?.googleMapsUrl || "https://maps.google.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="google-reviews-badge"
                        >
                            <i className="fa-brands fa-google" style={{ color: '#4285F4' }}></i>
                            <span>5.0 Rating</span>
                            <div className="google-stars">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                            </div>
                        </a>

                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
                            {heroData.heroData?.title || 'Layanan Antar-Jemput Lombok Terbaik'}
                        </h1>
                        <p style={{ fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 14px', opacity: 0.9 }}>
                            {heroData.heroData?.subtitle || 'Spesialis antar-jemput bandara dan destinasi wisata Lombok.'}
                        </p>
                    </div>
                </section>

                {/* Section Pilihan Rute Penjemputan */}
                <section className="section container">
                    <div className="sub-section-title" style={{ marginBottom: '18px', textAlign: 'center' }}>
                        <h2>
                            <i className="fa-solid fa-route" style={{ color: '#0284c7' }}></i>
                            Pilihan Rute Penjemputan Populer
                        </h2>
                    </div>

                    <div className="controls-container">
                        <div className="search-box-wrapper">
                            <i className="fa-solid fa-magnifying-glass fa-search"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari rute penjemputan atau tujuan..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {isLoading && <div className="status-box"><i className="fa-solid fa-spinner fa-spin"></i> Memuat rute...</div>}
                    {error && <div className="status-box" style={{ color: 'red' }}>{error}</div>}

                    {!isLoading && !error && displayedRoutes.length > 0 && (
                        <div className="tour-cards-grid">
                            {displayedRoutes.map((route) => (
                                <div key={route.id} className="tour-card">
                                    {/* KARTU GAMBAR RUTE */}
                                    <div className="tour-card-img">
                                        <img
                                            src={getImageUrl(route.image_url)}
                                            alt={route.dropoff_location || 'Rute Lombok'}
                                            loading="lazy"
                                        />
                                        <span className="tour-price-tag">
                                            Rp {Number(route.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <div className="tour-card-body">
                                        <span style={{ color: '#0284c7', fontSize: '0.78rem', fontWeight: 600, marginBottom: '6px' }}>
                                            <i className="fa-solid fa-location-dot"></i> Transfer Area
                                        </span>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>
                                            {route.pickup_location} ➔ {route.dropoff_location}
                                        </h4>

                                        <button className="btn-submit" onClick={() => handleSelectRoute(route)}>
                                            <i className="fa-solid fa-car"></i>
                                            <span>Pesan Rute Ini</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Home;
