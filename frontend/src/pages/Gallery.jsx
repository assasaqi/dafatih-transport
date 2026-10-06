import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useGallery } from '@/context/GalleryContext';
import { getGalleries, API_BASE_URL } from '@/services/api';

const Gallery = () => {
    const { visibleCount, setVisibleCount } = useGallery();
    const [galleries, setGalleries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const getInitialLimit = useCallback(() => (window.innerWidth <= 768 ? 4 : 8), []);

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

    // Helper URL Gambar Dinamis berdasarkan API_BASE_URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x300?text=Galeri+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // Ambil domain dasar dari API_BASE_URL (misal: http://localhost:5000/api -> http://localhost:5000)
        const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
        return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    };

    return (
        <div className="w-full min-h-screen bg-[#F2F4F7] text-slate-800">
            {/* Banner Compact Ala Traveloka */}
            <div className="bg-[#0194F3] text-white px-5 py-6 sm:py-8 text-center shadow-xs">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Galeri Momen Wisatawan Lombok
                </h1>
                <p className="text-sky-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                    Dokumentasi kebahagiaan para tamu selama menikmati layanan antar-jemput dan perjalanan wisata bersama kami.
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {isLoading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#0194F3]"></i>
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
                    /* Grid 4 Kolom Seragam dengan Card Traveloka */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {displayedItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedImage(item)}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    {/* Wrapper Foto + Overlay Hover */}
                                    <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                                        <img
                                            src={getImageUrl(item.image_url)}
                                            alt={item.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase flex items-center gap-1.5">
                                            <i className="fa-solid fa-camera text-amber-400"></i>
                                            {item.category || 'MOMEN TAMU'}
                                        </span>

                                        {/* Overlay Hover Efek Zoom */}
                                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <i className="fa-solid fa-expand text-[#0194F3]"></i>
                                                <span>Lihat Foto</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detail Teks */}
                                    <div className="p-3.5 sm:p-4">
                                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0194F3] transition-colors line-clamp-1 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {item.description || 'Dokumentasi momen perjalanan menyenangkan di Pulau Lombok.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="text-center mt-8 min-h-[44px] flex items-center justify-center">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-xl border border-[#0194F3] text-[#0194F3] hover:bg-[#0194F3] hover:text-white font-bold text-xs transition-colors duration-200 cursor-pointer shadow-xs inline-flex items-center gap-2"
                            onClick={loadMore}
                        >
                            <i className="fa-solid fa-arrows-rotate"></i>
                            <span>Tampilkan Lebih Banyak Foto</span>
                        </button>
                    </div>
                )}
            </section>

            {/* MODAL LIGHTBOX VIEW FOTO */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative bg-slate-900 flex items-center justify-center max-h-[70vh] overflow-hidden">
                            <img
                                src={getImageUrl(selectedImage.image_url)}
                                alt={selectedImage.title}
                                className="max-h-[70vh] w-auto object-contain"
                            />
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <i className="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>
                        <div className="p-4 sm:p-5 bg-white">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-sky-100 text-[#0194F3] text-[10px] font-extrabold px-2 py-0.5 rounded">
                                    {selectedImage.category || 'MOMEN TAMU'}
                                </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                                {selectedImage.title}
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {selectedImage.description || 'Dokumentasi momen perjalanan menyenangkan di Pulau Lombok.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
