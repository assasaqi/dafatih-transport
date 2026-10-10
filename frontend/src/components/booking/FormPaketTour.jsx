import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FormPaketTour = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTour, setSelectedTour] = useState({
    title: '',
    price: 0
  });

  // Membaca data jika pengguna mengklik paket tour dari halaman lain
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const stateData = location.state;
      const isTourData =
        stateData.jenisLayanan === 'Paket Tour' ||
        !!stateData.tourName ||
        !!stateData.packageName ||
        !!stateData.title;

      if (!isTourData) return;

      setSelectedTour({
        title: stateData.tourName || stateData.packageName || stateData.title || '',
        price: Number(stateData.price || stateData.harga || 0)
      });
    }
  }, [location.state]);

  const handleReset = () => {
    setSelectedTour({ title: '', price: 0 });
    navigate(location.pathname, { replace: true, state: {} });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-8 shadow-xs relative overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-sky-50 text-[#0194F3] border border-sky-100">
            Segera Hadir
          </span>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Pemesanan langsung via form sedang dikembangkan
          </span>
        </div>

        {selectedTour.title && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <i className="fa-solid fa-rotate-left text-[10px]"></i>
            <span>Reset Pilihan</span>
          </button>
        )}
      </div>

      {/* BODY CONTENT */}
      <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-2 sm:py-4">
        {/* ICON */}
        <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-4 text-[#0194F3] text-2xl shadow-xs border border-sky-100">
          <i className="fa-solid fa-map-location-dot"></i>
        </div>

        {/* JUDUL */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
          {selectedTour.title ? selectedTour.title : 'Layanan Paket Tour & Wisata Lombok'}
        </h3>

        {/* INFORMASI TARIF TERPILIH (JIKA ADA) */}
        {selectedTour.title && selectedTour.price > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 bg-sky-50/80 border border-sky-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-600 font-medium">Estimasi Harga:</span>
            <strong className="text-[#0194F3] font-bold">
              Rp {new Intl.NumberFormat('id-ID').format(selectedTour.price)}
            </strong>
          </div>
        )}

        {/* DESKRIPSI */}
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          Fitur pemesanan langsung untuk <strong>Paket Tour Wisata</strong> sedang dalam tahap integrasi sistem dan akan segera dapat digunakan secara langsung.
        </p>

        {/* BENEFIT / PADA PAKET TOUR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mb-6 text-left">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <i className="fa-solid fa-route text-[#0194F3] text-sm mb-1 block"></i>
            <h4 className="text-xs font-bold text-slate-800">Custom Rute</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Bebas sesuaikan destinasi wisata favorit Anda.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <i className="fa-solid fa-user-shield text-[#0194F3] text-sm mb-1 block"></i>
            <h4 className="text-xs font-bold text-slate-800">Driver & BBM</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Sudah termasuk armada, BBM, dan driver ramah.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <i className="fa-solid fa-tags text-[#0194F3] text-sm mb-1 block"></i>
            <h4 className="text-xs font-bold text-slate-800">Harga Terbaik</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Penawaran harga terbaik untuk rombongan / keluarga.</p>
          </div>
        </div>

        {/* TOMBOL ACTION NAVIGASI */}
        <button
          type="button"
          onClick={() => navigate('/paket-tour')}
          className="w-full sm:w-auto px-6 py-3 bg-[#0194F3] hover:bg-sky-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <i className="fa-solid fa-compass text-sm"></i>
          <span>Lihat Daftar Paket Wisata</span>
        </button>
      </div>
    </div>
  );
};

export default FormPaketTour;
