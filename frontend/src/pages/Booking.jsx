import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ModalSummary from '@/components/ModalSummary';
import FormAntarJemput from "@/components/booking/FormAntarJemput";
import FormSewaMobil from "@/components/booking/FormSewaMobil";
import FormPaketTour from "@/components/booking/FormPaketTour";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Import status login
  const PHONE_NUMBER = "6287757004214";

  const [activeTab, setActiveTab] = useState('airport'); // 'airport' | 'rental' | 'tour'
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalFormData, setModalFormData] = useState(null);

  // 1. DETEKSI OTOMATIS TAB DARI NAVIGASI LUAR
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

  // 2. CEK PESANAN TERTUNDA (RESUME BOOKING DARI BEFORE LOGIN)
  useEffect(() => {
    const pendingBooking = localStorage.getItem('pending_booking');
    if (pendingBooking && isAuthenticated) {
      try {
        const parsedData = JSON.parse(pendingBooking);
        setModalFormData(parsedData);
        setShowModal(true);
        localStorage.removeItem('pending_booking'); // Bersihkan setelah dimuat
      } catch (err) {
        console.error('Gagal membaca data pesanan tersimpan:', err);
      }
    }
  }, [isAuthenticated]);

  // 3. HANDLER BUKA MODAL / PROTEKSI LOGIN
  const handleOpenModal = (data) => {
    if (!isAuthenticated) {
      // Simpan data form sementara
      localStorage.setItem('pending_booking', JSON.stringify(data));

      // Arahkan ke halaman login dengan menyertakan lokasi asal
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    // Jika sudah login, tampilkan modal summary
    setModalFormData(data);
    setShowModal(true);
  };

  // 4. HANDLER KONFIRMASI KIRIM KE WHATSAPP
  const handleConfirmWhatsApp = () => {
    if (!modalFormData) return;

    let message = `Halo Dafatih Transport, saya ingin memesan layanan *${modalFormData.jenisLayanan}* dengan detail berikut:%0A%0A*Nama:* ${modalFormData.custName}%0A*No. WA:* ${modalFormData.custWa}%0A*Tanggal:* ${modalFormData.pickupDate}%0A*Waktu:* ${modalFormData.pickupTime} WITA%0A*Lokasi Penjemputan:* ${modalFormData.pickupLoc}`;

    if (activeTab === 'airport' && modalFormData.dropLoc) {
      message += `%0A*Tujuan:* ${modalFormData.dropLoc}`;
    }
    if (activeTab === 'rental' && modalFormData.armada) {
      message += `%0A*Armada:* ${modalFormData.armada}`;
    }
    if (activeTab === 'tour' && modalFormData.packageTour) {
      message += `%0A*Paket Tour:* ${modalFormData.packageTour}`;
    }
    if (modalFormData.duration) {
      message += `%0A*Durasi:* ${modalFormData.duration} Hari`;
    }
    if (modalFormData.passengers) {
      message += `%0A*Jumlah Penumpang:* ${modalFormData.passengers} Orang`;
    }
    if (modalFormData.price > 0) {
      message += `%0A*Estimasi Tarif:* Rp ${new Intl.NumberFormat('id-ID').format(modalFormData.price)}`;
    }

    message += `%0A%0AMohon konfirmasinya, terima kasih.`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-3 sm:py-8 px-3 sm:px-6 lg:px-8 text-slate-800 pt-20 sm:pt-24">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-start">

        {/* SIDEBAR TAB NAVIGASI */}
        <div className="md:col-span-4 lg:col-span-3 space-y-3 sm:space-y-6">
          <div className="flex items-center justify-between md:block">
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900">
              Cek &amp; Pesan Layanan
            </h1>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#0194F3] text-xs font-semibold transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-list-check text-xs"></i>
              <span>Semua Layanan</span>
            </button>
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
                    Lengkapi formulir pemesanan di bawah ini atau pilih dari <button type="button" onClick={() => navigate('/tarif')} className="underline font-bold hover:text-white cursor-pointer">Daftar Tarif</button>.
                  </p>
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

          {/* RENDER FORM SESUAI TAB AKTIF */}
          {activeTab === 'airport' && <FormAntarJemput onOpenModal={handleOpenModal} />}
          {activeTab === 'rental' && <FormSewaMobil onOpenModal={handleOpenModal} />}
          {activeTab === 'tour' && <FormPaketTour onOpenModal={handleOpenModal} />}
        </div>

      </div>

      {showModal && (
        <ModalSummary
          formData={modalFormData}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmWhatsApp}
        />
      )}
    </div>
  );
};

export default Booking;
