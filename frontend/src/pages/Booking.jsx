import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormAntarJemput from "@/components/booking/FormAntarJemput";
import FormSewaMobil from "@/components/booking/FormSewaMobil";
import FormPaketTour from "@/components/booking/FormPaketTour";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('airport');
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const stateData = location.state;

      const isRental = stateData.jenisLayanan === 'Sewa Mobil' || !!stateData.carType || !!stateData.namaArmada;
      const isTour = stateData.jenisLayanan === 'Paket Tour' || !!stateData.packageTour || !!stateData.packageName;

      if (isTour) {
        setActiveTab('tour');
      } else if (isRental) {
        setActiveTab('rental');
      } else if (stateData.pickup || stateData.pickupLoc || stateData.dropoff || stateData.dropLoc) {
        setActiveTab('airport');
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-3 sm:py-8 px-3 sm:px-6 lg:px-8 text-slate-800 pt-20 sm:pt-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-start">

        {/* SIDEBAR TAB NAVIGASI */}
        <div className="md:col-span-4 lg:col-span-3 space-y-3 sm:space-y-6">
          <div className="flex items-center justify-between md:block">
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900">
              Cek &amp; Pesan Layanan
            </h1>
          </div>

          <div>
            <nav className="flex md:flex-col gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('airport')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'airport'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-plane-arrival text-xs sm:text-base"></i>
                <span>Antar-Jemput</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rental')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'rental'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-car text-xs sm:text-base"></i>
                <span>Sewa Mobil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tour')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'tour'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-umbrella-beach text-xs sm:text-base"></i>
                <span>Paket Tour Lombok</span>
              </button>
            </nav>
          </div>
        </div>

        {/* AREA KONTEN UTAMA */}
        <div className="md:col-span-8 lg:col-span-9 space-y-3 sm:space-y-4">
          {showInfoBanner && (
            <div className="relative bg-[#0194F3] text-white rounded-xl p-3 sm:p-5 flex items-start justify-between gap-2.5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg border border-white/20 shrink-0 items-center justify-center hidden sm:flex">
                  <i className="fa-solid fa-shield-halved text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm mb-0.5 leading-tight">
                    Pesan Layanan Transportasi &amp; Wisata Lombok
                  </h3>
                  <p className="text-[11px] sm:text-xs text-sky-100 leading-normal">
                    Lengkapi formulir pemesanan di bawah ini.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoBanner(false)}
                className="text-white/80 hover:text-white text-base p-1 shrink-0 cursor-pointer -mt-1 -mr-1"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* RENDER FORM TANPA MODAL */}
          {activeTab === 'airport' && <FormAntarJemput />}
          {activeTab === 'rental' && <FormSewaMobil />}
          {activeTab === 'tour' && <FormPaketTour />}
        </div>

      </div>
    </div>
  );
};

export default Booking;
