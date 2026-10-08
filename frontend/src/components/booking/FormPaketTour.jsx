import React from 'react';

const FormPaketTour = () => {
  const handleWAConsultation = () => {
    const phoneNumber = '6287757004214'; // Sesuaikan dengan nomor WhatsApp Dafatih Transport
    const message = encodeURIComponent(
      'Halo Dafatih Transport, saya ingin konsultasi mengenai Paket Wisata Lombok.'
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
      {/* Icon Lingkaran */}
      <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-5 text-[#0194F3] text-2xl shadow-xs">
        <i className="fa-solid fa-route"></i>
      </div>

      {/* Judul Utama */}
      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
        Daftar Paket Wisata Lombok
      </h3>

      {/* Deskripsi Teks */}
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        Layanan paket tour pilihan sedang dipersiapkan untuk memberikan pengalaman liburan terbaik bagi Anda.
      </p>

      {/* Tombol Konsultasi WA */}
      <button
        type="button"
        onClick={handleWAConsultation}
        className="px-6 py-3 bg-[#0194F3] hover:bg-sky-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer"
      >
        <i className="fa-brands fa-whatsapp text-base"></i>
        <span>Konsultasi Custom Tour via WA</span>
      </button>
    </div>
  );
};

export default FormPaketTour;
