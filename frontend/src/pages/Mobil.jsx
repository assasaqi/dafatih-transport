import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles } from '@/services/api';

const Mobil = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getVehicles()
            .then((res) => {
                if (res.data.success) {
                    setVehicles(res.data.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Gagal mengambil data armada:', err);
                setError('Gagal memuat data armada dari server.');
                setLoading(false);
            });
    }, []);

    const handleSelectCar = (car) => {
        navigate('/pesan', {
            state: {
                pickup: 'Sewa Mobil ' + car.name,
                drop: 'Area Lombok',
                price: Number(car.price_per_day)
            }
        });
    };

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

        .fleet-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; width: 100%; }
        .fleet-card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .fleet-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
        .fleet-card-img { position: relative; height: 160px; overflow: hidden; background: #f1f5f9; }
        .fleet-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .fleet-card:hover .fleet-card-img img { transform: scale(1.05); }

        .fleet-badge { position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
        .fleet-body { padding: 14px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }
        .fleet-body h3 { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; }
        .fleet-body p { font-size: 0.8rem; color: #64748b; margin: 0 0 10px 0; line-height: 1.4; }

        .fleet-specs { list-style: none; padding: 8px 0; margin: 0 0 12px 0; font-size: 0.76rem; color: #475569; border-top: 1px dashed #e2e8f0; border-bottom: 1px dashed #e2e8f0; display: flex; flex-direction: column; gap: 4px; }
        .fleet-specs li { display: flex; align-items: center; gap: 6px; }

        .fleet-footer-action { display: flex; align-items: center; justify-content: space-between; padding-top: 4px; }
        .price-label { display: flex; flex-direction: column; }
        .price-label span { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
        .price-label strong { font-size: 0.98rem; font-weight: 800; color: #0284c7; }
        .btn-card-order { background: #0284c7; color: #ffffff; border: none; padding: 8px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 0.2s ease; }
        .btn-card-order:hover { background: #0369a1; }

        .status-box { text-align: center; padding: 50px 20px; color: #64748b; font-size: 0.9rem; }

        @media (max-width: 768px) {
          .section { padding: 12px 3% 80px 3%; }
          .fleet-cards-grid { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

            <div className="page-view">
                <div className="page-banner-compact">
                    <h1>Pilihan Armada Mobil Lombok</h1>
                    <p>Kondisi kendaraan prima, bersih, dan terawat untuk kenyamanan perjalanan Anda.</p>
                </div>

                <section className="section">
                    {loading && (
                        <div className="status-box">
                            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px', color: '#0284c7' }}></i>
                            Memuat daftar armada...
                        </div>
                    )}

                    {error && <div className="status-box" style={{ color: '#ef4444' }}>{error}</div>}

                    {!loading && !error && (
                        <div className="fleet-cards-grid">
                            {vehicles.map((car) => (
                                <div key={car.id} className="fleet-card">
                                    <div className="fleet-card-img">
                                        <img
                                            src={car.image_url || 'https://via.placeholder.com/300x200?text=Armada+Mobil'}
                                            alt={car.name}
                                            loading="lazy"
                                        />
                                        <span className="fleet-badge">{car.category || 'MPV'}</span>
                                    </div>

                                    <div className="fleet-body">
                                        <div>
                                            <h3>{car.name}</h3>
                                            <p>{car.description || 'Armada siap pakai dengan driver profesional berpengalaman.'}</p>

                                            <ul className="fleet-specs">
                                                <li>
                                                    <i className="fa-solid fa-users" style={{ color: '#0284c7' }}></i>
                                                    Kapasitas {car.capacity} Penumpang
                                                </li>
                                                <li>
                                                    <i className="fa-solid fa-gear" style={{ color: '#0284c7' }}></i>
                                                    Transmisi {car.transmission}
                                                </li>
                                                <li>
                                                    <i className="fa-solid fa-snowflake" style={{ color: '#0284c7' }}></i>
                                                    AC Cold & Clean Interior
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="fleet-footer-action">
                                            <div className="price-label">
                                                <span>Sewa / Hari</span>
                                                <strong>Rp {Number(car.price_per_day).toLocaleString('id-ID')}</strong>
                                            </div>
                                            <button className="btn-card-order" onClick={() => handleSelectCar(car)}>
                                                <i className="fa-solid fa-car"></i>
                                                <span>Pesan</span>
                                            </button>
                                        </div>
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

export default Mobil;
