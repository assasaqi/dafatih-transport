import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { getGalleries } from '@/services/api';

const Gallery = () => {
    const { visibleCount, setVisibleCount } = useGallery();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitialLimit = useCallback(() => (window.innerWidth <= 768 ? 3 : 6), []);

    // 1. Inisialisasi limit saat mount
    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }
    }, [visibleCount, setVisibleCount, getInitialLimit]);

    // 2. Fetch data API hanya 1 kali
    useEffect(() => {
        let isMounted = true;

        getGalleries()
            .then((res) => {
                if (isMounted) {
                    if (res.data?.success) {
                        setGalleries(res.data.data || []);
                    } else {
                        setError('Gagal memuat galeri foto.');
                    }
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Gagal mengambil data galeri:', err);
                    setError('Gagal memuat galeri foto.');
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const currentLimit = visibleCount ?? getInitialLimit();

    const displayedItems = useMemo(
        () => galleries.slice(0, currentLimit),
        [galleries, currentLimit]
    );

    const hasMore = currentLimit < galleries.length;

    const loadMore = () => {
        setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
    };

    // Helper URL Gambar
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x300?text=Galeri+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-800">
            {/* Banner Compact */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 py-6 sm:py-8 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Galeri Perjalanan Wisatawan
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto opacity-90">
                    Momen kebahagiaan para tamu kami selama menjelajahi destinasi terindah di Pulau Lombok.
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {isLoading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Memuat galeri foto...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {!isLoading && !error && displayedItems.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Belum ada foto galeri yang tersedia.
                    </div>
                )}

                {!isLoading && !error && displayedItems.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {displayedItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
                            >
                                <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                                    <img
                                        src={getImageUrl(item.image_url)}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                                    />
                                    <span className="absolute top-2.5 left-2.5 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <i className="fa-solid fa-camera text-amber-500"></i>
                                        {item.category || 'Momen Tamu'}
                                    </span>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Dokumentasi perjalanan wisata bersama Dafatih Transport.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="text-center mt-8 min-h-[44px] flex items-center justify-center">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-full border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-200 cursor-pointer inline-flex items-center gap-2"
                            onClick={loadMore}
                        >
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>Tampilkan Lebih Banyak</span>
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Gallery;
