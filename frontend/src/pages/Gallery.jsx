import React, { useEffect, useState } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { getGalleries } from '@/services/api';

const Gallery = () => {
    const { visibleCount, setVisibleCount } = useGallery();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }

        // Ambil data galeri dari database MySQL via API backend
        getGalleries()
            .then((res) => {
                if (res.data.success) {
                    setGalleries(res.data.data);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data galeri:', err);
                setError('Gagal memuat galeri foto.');
                setIsLoading(false);
            });
    }, [visibleCount, setVisibleCount]);

    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedItems = galleries.slice(0, currentLimit);
    const hasMore = currentLimit < galleries.length;

    const loadMore = () => {
        setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
    };

    // Helper untuk merender URL Gambar dengan benar (Lokal Uploads vs External HTTP)
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x300?text=Galeri+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    return (
        <>
            <style>{`
        .page-view { display: block; }
        .page-banner-compact { background: linear-gradient(180deg, var(--neutral-900, #0f172a) 0%, #1e293b 100%); color: var(--white, #ffffff); padding: 18px 5% 14px; text-align: center; }
        .page-banner-compact h1 { font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem); font-weight: 800; margin-bottom: 2px; }
        .page-banner-compact p { color: var(--neutral-100, #f1f5f9); font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem); max-width: 550px; margin: 0 auto; opacity: 0.9; }
        .section { padding: 20px 5%; max-width: 1200px; margin: 0 auto; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; align-items: stretch; }
        .gallery-card { background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .gallery-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
        .gallery-img-wrapper { position: relative; height: 160px; overflow: hidden; background: #f1f5f9; }
        .gallery-img-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .gallery-card:hover .gallery-img-wrapper img { transform: scale(1.05); }
        .gallery-badge { position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 5px; }
        .gallery-badge i { color: var(--accent, #f59e0b); }
        .gallery-body { padding: 14px 16px; display: flex; flex-direction: column; flex: 1; }
        .gallery-body h3 { font-size: 0.98rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; line-height: 1.3; }
        .gallery-body p { font-size: 0.8rem; color: #64748b; line-height: 1.45; margin: 0; }
        .pagination-status-wrapper { text-align: center; margin-top: 24px; min-height: 44px; display: flex; align-items: center; justify-content: center; }
        .btn-load-more { padding: 8px 20px; border-radius: 30px; border: 1px solid var(--primary, #0284c7); background-color: transparent; color: var(--primary, #0284c7); font-weight: 600; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; }
        .btn-load-more:hover { background-color: var(--primary, #0284c7); color: #ffffff; }
        .status-box { text-align: center; padding: 40px; color: #64748b; }
        @media (max-width: 768px) {
          .section { padding: 14px 4%; }
          .gallery-grid { grid-template-columns: 1fr; gap: 12px; }
          .gallery-img-wrapper { height: 150px; }
        }
      `}</style>

            <div className="page-view">
                <div className="page-banner-compact">
                    <h1>Galeri Perjalanan Wisatawan</h1>
                    <p>Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.</p>
                </div>

                <section className="section">
                    {isLoading && (
                        <div className="status-box">
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            Memuat galeri foto...
                        </div>
                    )}

                    {error && <div className="status-box" style={{ color: 'red' }}>{error}</div>}

                    {!isLoading && !error && displayedItems.length > 0 && (
                        <div className="gallery-grid">
                            {displayedItems.map((item) => (
                                <div key={item.id} className="gallery-card">
                                    <div className="gallery-img-wrapper">
                                        <img
                                            src={getImageUrl(item.image_url)}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                        <span className="gallery-badge">
                                            <i className="fa-solid fa-camera"></i> {item.category || 'Momen Tamu'}
                                        </span>
                                    </div>
                                    <div className="gallery-body">
                                        <h3>{item.title}</h3>
                                        <p>Dokumentasi perjalanan wisata bersama Dafatih Transport.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="pagination-status-wrapper">
                            <button className="btn-load-more" onClick={loadMore}>
                                <i className="fa-solid fa-arrows-rotate"></i>
                                <span>Tampilkan Lebih Banyak</span>
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Gallery;
