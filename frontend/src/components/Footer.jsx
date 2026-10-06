import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();

    // Sembunyikan footer utama jika sedang berada di halaman /admin/*
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-slate-900 text-white mt-auto pt-10 pb-20 md:pb-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                {/* Kolom 1: Profil Brand & Sosmed */}
                <div className="space-y-3">
                    <Link to="/" className="flex items-center gap-2 decoration-none group">
                        <div className="w-8 h-8 bg-[#0194F3] rounded-lg flex items-center justify-center text-white shadow-xs">
                            <i className="fa-solid fa-car-side text-sm"></i>
                        </div>
                        <span className="font-extrabold text-lg text-white tracking-tight">
                            Dafatih<span className="text-[#0194F3]">Transport</span>
                        </span>
                    </Link>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok dengan harga transparan.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-[#0194F3] hover:text-white transition-all flex items-center justify-center text-xs"
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-[#0194F3] hover:text-white transition-all flex items-center justify-center text-xs"
                        >
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 hover:bg-[#0194F3] hover:text-white transition-all flex items-center justify-center text-xs"
                        >
                            <i className="fa-brands fa-tiktok"></i>
                        </a>
                    </div>
                </div>

                {/* Kolom 2: Navigasi */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                        Navigasi
                    </h4>
                    <ul className="space-y-2 text-xs">
                        <li>
                            <Link to="/" className="text-slate-400 hover:text-[#0194F3] transition-colors">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link to="/tarif" className="text-slate-400 hover:text-[#0194F3] transition-colors">
                                Daftar Tarif
                            </Link>
                        </li>
                        <li>
                            <Link to="/galeri" className="text-slate-400 hover:text-[#0194F3] transition-colors">
                                Galeri
                            </Link>
                        </li>
                        <li>
                            <Link to="/blog" className="text-slate-400 hover:text-[#0194F3] transition-colors">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Kolom 3: Metode Pembayaran */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                        Metode Pembayaran
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-800 w-fit">
                        <i className="fa-solid fa-wallet text-amber-400 text-sm"></i>
                        <span className="font-medium text-slate-300">Cash dan Transfer Bank</span>
                    </div>
                </div>

                {/* Kolom 4: Kontak & Lokasi */}
                <div>
                    <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
                        Kontak &amp; Lokasi
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mb-2.5">
                        <i className="fa-solid fa-location-dot text-[#0194F3]"></i>
                        <span>Lombok, NTB, Indonesia</span>
                    </p>
                    <ul className="space-y-2 text-xs">
                        <li>
                            <a
                                href="https://wa.me/6287757004214"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                            >
                                <i className="fa-brands fa-whatsapp text-emerald-500 text-sm"></i>
                                <span>+62 877-5700-4214</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://wa.me/6287862358975"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2"
                            >
                                <i className="fa-brands fa-whatsapp text-emerald-500 text-sm"></i>
                                <span>+62 878-6235-8975</span>
                            </a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} Dafatih Transport. Hak Cipta Dilindungi Undang-Undang.
            </div>
        </footer>
    );
};

export default Footer;
