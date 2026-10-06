import React, { useEffect, useState } from 'react';
import { useBlog } from '@/context/BlogContext';
import { getBlogs } from '@/services/api';

const Blog = () => {
    const { visibleCount, setVisibleCount } = useBlog();
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitialLimit = () => (window.innerWidth <= 768 ? 3 : 6);

    useEffect(() => {
        if (visibleCount === null) {
            setVisibleCount(getInitialLimit());
        }

        // Ambil data artikel dari database MySQL
        getBlogs()
            .then((res) => {
                if (res.data?.success) {
                    setArticles(res.data.data);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil artikel blog:', err);
                setError('Gagal memuat artikel blog.');
                setIsLoading(false);
            });
    }, [visibleCount, setVisibleCount]);

    const currentLimit = visibleCount ?? getInitialLimit();
    const displayedArticles = articles.slice(0, currentLimit);
    const hasMore = currentLimit < articles.length;

    const loadMore = () => {
        setVisibleCount((prev) => (prev ?? getInitialLimit()) + getInitialLimit());
    };

    // Helper untuk menangani URL Gambar Backend / Uploads
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://placehold.co/400x250?text=Wisata+Lombok';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        return `http://localhost:5000${imageUrl}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Banner Compact */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-5 py-6 sm:py-8 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Panduan &amp; Tips Wisata Lombok
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm max-w-xl mx-auto opacity-90">
                    Artikel dan informasi menarik seputar destinasi impian Anda di Pulau Lombok.
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {isLoading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Memuat artikel blog...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {!isLoading && !error && displayedArticles.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Belum ada artikel blog yang tersedia.
                    </div>
                )}

                {!isLoading && !error && displayedArticles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {displayedArticles.map((article) => (
                            <div
                                key={article.id}
                                className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                            >
                                <div className="h-40 sm:h-44 overflow-hidden bg-slate-100">
                                    <img
                                        src={getImageUrl(article.image_url)}
                                        alt={article.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4 flex flex-col flex-grow justify-between">
                                    <div>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 line-clamp-2 leading-snug">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                                            {article.excerpt || article.content?.substring(0, 100) + '...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="px-6 py-2.5 rounded-full border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-200 cursor-pointer"
                            onClick={loadMore}
                        >
                            Tampilkan Lebih Banyak
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Blog;
