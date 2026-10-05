import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoutes } from '@/services/api';
import { useTariff } from '@/context/TariffContext';

const Tariffs = () => {
    const navigate = useNavigate();
    const {
        visibleCount,
        setVisibleCount,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery
    } = useTariff();

    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data rute:', err);
                setError('Gagal memuat data tarif dari server.');
                setLoading(false);
            });
    }, [visibleCount, setVisibleCount]);

    const handleSelectTariff = (pickupPoint, dropPoint, routePrice) => {
        navigate('/pesan', {
            state: {
                pickup: pickupPoint,
                drop: dropPoint,
                price: Number(routePrice)
            }
        });
    };

    const handleCategoryChange = (catId) => {
        setActiveCategory(catId);
        setVisibleCount(getInitialLimit());
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setVisibleCount(getInitialLimit());
    };

    // Filter rute berdasarkan pencarian & kategori
    const getFilteredRoutes = () => {
        let list = [...routes];

        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            list = list.filter((r) => {
                const dropLoc = (r.dropoff_location || '').toLowerCase();
                const pickupLoc = (r.pickup_location || '').toLowerCase();
                return dropLoc.includes(q) || pickupLoc.includes(q);
            });
        }

        return list;
    };

    const filteredRoutes = getFilteredRoutes();
    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedRoutes = filteredRoutes.slice(0, currentLimit);
    const hasMore = currentLimit < filteredRoutes.length;

    return (
        <>
            <style>{`
        .page-view { display: block; width: 100%; overflow-x: hidden; }
        .page-banner-compact {
          background: linear-gradient(180deg, var(--neutral-900, #0f172a) 0%, #1e293b 100%);
          color: #ffffff;
          padding: 18px 5% 14px;
          text-align: center;
        }
        .page-banner-compact h1 { font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem); font-weight: 800; margin-bottom: 2px; }
        .page-banner-compact p { color: #f1f5f9; font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem); max-width: 550px; margin: 0 auto; opacity: 0.9; }
        .section { padding: 20px 5%; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }

        .controls-container { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .search-box-wrapper { position: relative; display: flex; align-items: center; width: 100%; }
        .search-box-wrapper i.fa-search { position: absolute; left: 12px; color: #94a3b8; font-size: 0.75rem; pointer-events: none; }
        .search-input { width: 100%; height: 36px; padding: 0 30px 0 32px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #ffffff; font-size: 0.78rem; color: #334155; outline: none; }

        .tariff-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; width: 100%; }
        .tariff-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; justify-content: space-between; }

        .card-route-info-inline { display: flex; align-items: center; justify-content: space-between; gap: 6px; background: #f8fafc; padding: 8px 10px; border-radius: 8px; border: 1px dashed #e2e8f0; margin-bottom: 10px; }
        .route-point { display: flex; align-items: center; gap: 5px; flex: 1; min-width: 0; }
        .route-point span { font-size: 0.78rem; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .card-footer-action { display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #f1f5f9; }
        .price-label strong { font-size: 0.98rem; font-weight: 800; color: #0284c7; }
        .btn-card-order { background: #0284c7; color: #ffffff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
        .status-box { text-align: center; padding: 40px; color: #64748b; }
      `}</style>

            <div className="page-view">
                <div className="page-banner-compact">
                    <h1>Daftar Tarif Transportasi Lombok</h1>
                    <p>Rute perjalanan & harga transparan layanan antar-jemput (Maks 4 Pax + Bagasi).</p>
                </div>

                <section className="section">
                    <div className="controls-container">
                        <div className="search-box-wrapper">
                            <i className="fa-solid fa-magnifying-glass fa-search"></i>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari rute penjemputan / tujuan..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    {loading && <div className="status-box"><i className="fa-solid fa-spinner fa-spin"></i> Memuat tarif rute...</div>}
                    {error && <div className="status-box" style={{ color: 'red' }}>{error}</div>}

                    {!loading && !error && displayedRoutes.length > 0 && (
                        <div className="tariff-cards-grid">
                            {displayedRoutes.map((route) => (
                                <div key={route.id} className="tariff-card">
                                    <div className="card-route-info-inline">
                                        <div className="route-point">
                                            <i className="fa-solid fa-circle-dot" style={{ color: '#0284c7', fontSize: '0.65rem' }}></i>
                                            <span>{route.pickup_location}</span>
                                        </div>
                                        <i className="fa-solid fa-arrow-right" style={{ color: '#94a3b8', fontSize: '0.7rem' }}></i>
                                        <div className="route-point">
                                            <i className="fa-solid fa-location-dot" style={{ color: '#f59e0b', fontSize: '0.75rem' }}></i>
                                            <span>{route.dropoff_location}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer-action">
                                        <div className="price-label">
                                            <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Harga All-In</span>
                                            <strong>Rp {Number(route.price).toLocaleString('id-ID')}</strong>
                                        </div>
                                        <button
                                            className="btn-card-order"
                                            onClick={() => handleSelectTariff(route.pickup_location, route.dropoff_location, route.price)}
                                        >
                                            <i className="fa-solid fa-car"></i> Pesan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <button
                                onClick={() => setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit())}
                                style={{ padding: '8px 20px', borderRadius: '30px', border: '1px solid #0284c7', background: 'transparent', color: '#0284c7', cursor: 'pointer' }}
                            >
                                Tampilkan Lebih Banyak
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Tariffs;
