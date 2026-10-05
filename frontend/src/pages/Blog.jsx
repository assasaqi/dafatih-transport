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
                if (res.data.success) {
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
        <>
            <style>{`
        .page-view { display: block; }
        .page-banner-compact { background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 18px 5% 14px; text-align: center; }
        .page-banner-compact h1 { font-size: clamp(1.1rem, 2vw + 0.4rem, 1.35rem); font-weight: 800; margin-bottom: 2px; }
        .page-banner-compact p { color: #f1f5f9; font-size: clamp(0.75rem, 0.8vw + 0.3rem, 0.82rem); max-width: 550px; margin: 0 auto; opacity: 0.9; }
        .section { padding: 20px 5%; max-width: 1200px; margin: 0 auto; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; align-items: stretch; }
        .blog-card { background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .blog-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
        .blog-card-img { height: 160px; overflow: hidden; background: #f1f5f9; }
        .blog-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s ease; }
        .blog-card:hover .blog-card-img img { transform: scale(1.05); }
        .blog-body { padding: 14px 16px; display: flex; flex-direction: column; flex: 1; justify-content: space-between; }
        .blog-body h3 { font-size: 0.98rem; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; line-height: 1.35; }
        .blog-body p { font-size: 0.8rem; color: #64748b; line-height: 1.5; margin: 0 0 12px 0; }
        .status-box { text-align: center; padding: 40px; color: #64748b; }
        .btn-load-more { padding: 8px 20px; border-radius: 30px; border: 1px solid #0284c7; background-color: transparent; color: #0284c7; font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease; }
        .btn-load-more:hover { background-color: #0284c7; color: #ffffff; }
        @media (max-width: 768px) {
          .section { padding: 14px 4%; }
          .blog-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

            <div className="page-view">
                <div className="page-banner-compact">
                    <h1>Panduan & Tips Wisata Lombok</h1>
                    <p>Artikel dan informasi menarik seputar destinasi impian Anda di Pulau Lombok.</p>
                </div>

                <section className="section">
                    {isLoading && (
                        <div className="status-box">
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                            Memuat artikel blog...
                        </div>
                    )}
                    {error && <div className="status-box" style={{ color: 'red' }}>{error}</div>}

                    {!isLoading && !error && displayedArticles.length > 0 && (
                        <div className="blog-grid">
                            {displayedArticles.map((article) => (
                                <div key={article.id} className="blog-card">
                                    <div className="blog-card-img">
                                        <img
                                            src={getImageUrl(article.image_url)}
                                            alt={article.title}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="blog-body">
                                        <div>
                                            <h3>{article.title}</h3>
                                            <p>{article.excerpt || article.content?.substring(0, 100) + '...'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <button className="btn-load-more" onClick={loadMore}>
                                Tampilkan Lebih Banyak
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default Blog;
