import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 bg-slate-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center max-w-sm w-full shadow-sm">
                    <div className="w-16 h-16 bg-sky-50 text-[#0194F3] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i className="fa-solid fa-user-lock"></i>
                    </div>
                    <h2 className="text-lg font-extrabold text-slate-800 mb-1">Belum Login</h2>
                    <p className="text-xs text-slate-500 mb-6">Silakan masuk ke akun Anda untuk mengakses halaman profil.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-[#0194F3] hover:bg-sky-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="flex-1 border border-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Daftar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const initialLetter = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="min-h-screen pt-20 pb-24 bg-slate-50/60">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4">

                {/* HEADER PROFIL USER */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-14 h-14 bg-[#0194F3] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md shrink-0">
                            {initialLetter}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                                {user.name}
                            </h1>
                            <p className="text-xs font-semibold text-slate-500 truncate">
                                {user.email || user.no_hp || 'Pengguna Aktif'}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Akun Terverifikasi
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/profile/edit"
                        className="bg-sky-50 hover:bg-sky-100 text-[#0194F3] text-xs font-extrabold px-3 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
                    >
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                        <span className="hidden sm:inline">Edit</span>
                    </Link>
                </div>

                {/* SEKSI MENU UTAMA */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-2 shadow-xs space-y-1">
                    <p className="px-3 pt-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Aktivitas & Transaksi
                    </p>

                    <Link
                        to="/pesanan-saya"
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0194F3] flex items-center justify-center text-sm font-bold shrink-0">
                                <i className="fa-solid fa-receipt"></i>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-slate-800">Pesanan Saya</p>
                                <p className="text-[10px] font-semibold text-slate-400">Cek status pemesanan rental & airport transfer</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-[#0194F3] text-xs transition-colors"></i>
                    </Link>

                    <Link
                        to="/payments"
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0194F3] flex items-center justify-center text-sm font-bold shrink-0">
                                <i className="fa-regular fa-credit-card"></i>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-slate-800">Riwayat Pembayaran</p>
                                <p className="text-[10px] font-semibold text-slate-400">Daftar riwayat tagihan dan bukti bayar</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-[#0194F3] text-xs transition-colors"></i>
                    </Link>

                    <Link
                        to="/refunds"
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold shrink-0">
                                <i className="fa-solid fa-rotate-left"></i>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-slate-800">Pengajuan Refund</p>
                                <p className="text-[10px] font-semibold text-slate-400">Pengembalian dana pembatalan pesanan</p>
                            </div>
                        </div>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                            Baru!
                        </span>
                    </Link>
                </div>

                {/* SEKSI PENGATURAN & LAINNYA */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-2 shadow-xs space-y-1">
                    <p className="px-3 pt-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Pengaturan & Informasi
                    </p>

                    <Link
                        to="/profile/edit"
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0">
                                <i className="fa-regular fa-user"></i>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-slate-800">Edit Profil Saya</p>
                                <p className="text-[10px] font-semibold text-slate-400">Ubah nama, nomor HP, dan kata sandi</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-[#0194F3] text-xs transition-colors"></i>
                    </Link>

                    <Link
                        to="/promos"
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-slate-700 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-slate-800">Info Promo & Diskon</p>
                                <p className="text-[10px] font-semibold text-slate-400">Dapatkan promo menarik Dafatih Transport</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-[#0194F3] text-xs transition-colors"></i>
                    </Link>
                </div>

                {/* TOMBOL LOGOUT */}
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold text-xs py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
                >
                    <i className="fa-solid fa-power-off text-sm"></i>
                    <span>Keluar dari Akun</span>
                </button>

            </div>
        </div>
    );
};

export default Profile;
