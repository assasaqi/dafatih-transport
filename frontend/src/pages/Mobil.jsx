import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVehicles, API_BASE_URL } from '@/services/api';

const Mobil = () => {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        getVehicles()
            .then((res) => {
                if (isMounted) {
                    if (res.data?.success) {
                        setVehicles(res.data.data || []);
                    } else {
                        setError('Gagal memuat data armada.');
                    }
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Gagal mengambil data armada:', err);
                    setError('Gagal memuat data armada dari server.');
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
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

    // Helper URL Gambar Dinamis: Menggunakan domain aktif browser jika API_BASE_URL tidak tersedia
    const getImageUrl = (car) => {
        const imageUrl = typeof car === 'string' ? car : car?.image_url || car?.image || car?.image_path || '';
        if (!imageUrl) return 'https://placehold.co/400x250?text=Armada+Mobil';

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

    return (
        <div className="w-full min-h-screen bg-[#F2F4F7] text-slate-800">
            {/* Banner Compact Ala Traveloka */}
            <div className="bg-[#0194F3] text-white px-5 py-6 sm:py-8 text-center shadow-xs">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 tracking-tight">
                    Pilihan Armada Mobil Lombok
                </h1>
                <p className="text-sky-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
                    Kondisi kendaraan prima, bersih, dan terawat untuk kenyamanan perjalanan Anda.
                </p>
            </div>

            {/* Main Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {loading && (
                    <div className="text-center py-12 text-slate-500">
                        <i className="fa-solid fa-spinner fa-spin mr-2 text-[#0194F3]"></i>
                        Memuat daftar armada...
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-500 font-semibold">
                        {error}
                    </div>
                )}

                {!loading && !error && vehicles.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        Belum ada armada mobil yang tersedia saat ini.
                    </div>
                )}

                {!loading && !error && vehicles.length > 0 && (
                    /* Grid 4 Kolom Seragam dengan Card Traveloka */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                        {vehicles.map((car) => (
                            <div
                                key={car.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Gambar Ukuran Proporsional */}
                                    <div className="relative h-40 sm:h-44 overflow-hidden bg-slate-100">
                                        <img
                                            src={getImageUrl(car)}
                                            alt={car.name}
                                            translate="no"
                                            loading="lazy"
                                            className="notranslate w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase">
                                            {car.category || 'MPV'}
                                        </span>
                                    </div>

                                    {/* Detail Teks */}
                                    <div className="p-3.5 sm:p-4">
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0194F3] transition-colors mb-1">
                                            {car.name}
                                        </h3>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                            {car.description || 'Armada siap pakai dengan driver profesional berpengalaman.'}
                                        </p>

                                        {/* List Spesifikasi */}
                                        <ul className="space-y-1.5 py-2.5 my-2 border-y border-dashed border-slate-200 text-[11px] text-slate-600 font-medium">
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-users text-[#0194F3] text-xs w-4 text-center"></i>
                                                <span>Kapasitas {car.capacity || 6} Penumpang</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-gear text-[#0194F3] text-xs w-4 text-center"></i>
                                                <span>Transmisi {car.transmission || 'Manual / Matic'}</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <i className="fa-solid fa-snowflake text-[#0194F3] text-xs w-4 text-center"></i>
                                                <span>AC Cold &amp; Clean Interior</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="p-3.5 sm:p-4 pt-0 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] text-slate-400 font-medium">Sewa / Hari</span>
                                        <span className="text-base font-extrabold text-[#F96D01]">
                                            Rp {Number(car.price_per_day || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCar(car)}
                                        className="bg-[#0194F3] hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                                    >
                                        <i className="fa-solid fa-car"></i>
                                        <span>Pesan</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Mobil;
