import React from 'react';

const TourPackageTab = () => {
  const handleWAConsultation = () => {
    const phoneNumber = '6281234567890';
    const message = encodeURIComponent('Halo Dafatih Transport, saya ingin konsultasi mengenai Paket Wisata Lombok.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="py-8 text-center flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-4 text-[#0194F3] text-2xl shadow-xs">
        <i className="fa-solid fa-route"></i>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
        Daftar Paket Wisata Lombok
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-lg mb-6 leading-relaxed">
        Layanan paket tour pilihan sedang dipersiapkan untuk memberikan pengalaman liburan terbaik bagi Anda.
      </p>

      <button
        type="button"
        onClick={handleWAConsultation}
        className="px-6 py-3 bg-[#0194F3] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
      >
        <i className="fa-brands fa-whatsapp text-base"></i>
        <span>Konsultasi Custom Tour via WA</span>
      </button>
    </div>
  );
};

export default TourPackageTab;
