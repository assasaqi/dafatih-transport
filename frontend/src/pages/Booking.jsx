import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import countriesData from '../data/countries.json';
import ModalSummary from '@/components/ModalSummary';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const PHONE_NUMBER = "6287757004214";

  // Tanggal default YYYY-MM-DD
  const getLocalTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalTodayString();

  const [formData, setFormData] = useState({
    custName: '',
    countryCode: '62',
    custWa: '',
    pickupDate: todayStr,
    pickupTime: '08:00',
    pickupLoc: '',
    dropLoc: '',
    price: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('airport');

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        pickupLoc: location.state.pickup || '',
        dropLoc: location.state.drop || '',
        price: location.state.price || 0
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let waNumber = formData.custWa.trim();
    if (waNumber.startsWith('0')) {
      waNumber = waNumber.substring(1);
    }

    if (!formData.price || !formData.pickupLoc) {
      alert('Silakan pilih rute perjalanan terlebih dahulu dari Daftar Tarif!');
      return;
    }

    setFormData((prev) => ({ ...prev, custWa: waNumber }));
    setShowModal(true);
  };

  const handleConfirmWhatsApp = () => {
    const message = `Halo Dafatih Transport, saya ingin memesan layanan antar-jemput dengan detail berikut:%0A%0A*Nama:* ${formData.custName}%0A*No. WA:* +${formData.countryCode}${formData.custWa}%0A*Tanggal:* ${formData.pickupDate}%0A*Waktu:* ${formData.pickupTime} WITA%0A*Penjemputan:* ${formData.pickupLoc}%0A*Tujuan:* ${formData.dropLoc}%0A*Estimasi Tarif:* Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}%0A%0AMohon konfirmasinya, terima kasih.`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${message}`, '_blank');
  };

  const handleTabClick = (tabKey) => {
    if (tabKey === 'rental' || tabKey === 'tour' || tabKey === 'activities') {
      navigate('/not-found');
    } else {
      setActiveTab(tabKey);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] py-3 sm:py-8 px-3 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-start">

        {/* ================= SIDEBAR NAVIGASI ================= */}
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
              {/* Antar-Jemput (Aktif) */}
              <button
                type="button"
                onClick={() => handleTabClick('airport')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'airport'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-plane-arrival text-xs sm:text-base"></i>
                <span>Antar-Jemput</span>
              </button>

              {/* Sewa Mobil */}
              <button
                type="button"
                onClick={() => handleTabClick('rental')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'rental'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-car text-xs sm:text-base text-sky-600"></i>
                <span>Sewa Mobil</span>
              </button>

              {/* Paket Wisata */}
              <button
                type="button"
                onClick={() => handleTabClick('tour')}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'tour'
                    ? 'bg-[#0194F3] text-white shadow-xs'
                    : 'bg-white md:bg-transparent border border-slate-200 md:border-none text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <i className="fa-solid fa-route text-xs sm:text-base text-amber-500"></i>
                <span>Paket Wisata</span>
              </button>
            </nav>
          </div>
        </div>

        {/* ================= KONTEN UTAMA ================= */}
        <div className="md:col-span-8 lg:col-span-9 space-y-3 sm:space-y-4">

          {/* BANNER BIRU INFORMASI */}
          {showInfoBanner && (
            <div className="relative bg-[#0194F3] text-white rounded-xl p-3 sm:p-5 flex items-start justify-between gap-2.5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg border border-white/20 shrink-0 items-center justify-center hidden sm:flex">
                  <i className="fa-solid fa-shield-halved text-white text-lg"></i>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm mb-0.5 leading-tight">
                    Pesan Layanan Transportasi Lombok Lebih Praktis
                  </h3>
                  <p className="text-[11px] sm:text-xs text-sky-100 leading-normal">
                    Pilih rute dari <button onClick={() => navigate('/tarif')} className="underline font-bold hover:text-white">Daftar Tarif</button> atau lengkapi data pemesanan di bawah ini.
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

          {/* CARD UTAMA FORM PEMESANAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-6 shadow-xs">
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium border-b border-slate-100 pb-2.5 mb-3.5">
              Isi formulir di bawah ini sesuai rute perjalanan Anda. Pastikan nomor WhatsApp yang dimasukkan aktif.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

              {/* BARIS 1: NAMA PEMESAN & NOMOR WHATSAPP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Nama Pemesan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Nama Lengkap Pemesan *
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="custName"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.custName}
                      onChange={handleChange}
                      className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] transition-colors"
                    />
                    {formData.custName && (
                      <button
                        type="button"
                        className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-base p-1 cursor-pointer"
                        onClick={() => handleClear('custName')}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>

                {/* Nomor WhatsApp / HP */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Nomor WhatsApp / HP *
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-10 focus-within:border-[#0194F3] transition-colors bg-white">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="h-full bg-slate-50 border-r border-slate-300 px-2 text-xs font-bold text-slate-700 outline-none cursor-pointer shrink-0"
                    >
                      {countriesData.countries?.map((c, i) => (
                        <option key={i} value={c.code}>
                          {c.flag} +{c.code}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1 flex items-center h-full">
                      <input
                        type="tel"
                        name="custWa"
                        required
                        placeholder="8123456789"
                        value={formData.custWa}
                        onChange={handleChange}
                        className="w-full h-full px-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent"
                      />
                      {formData.custWa && (
                        <button
                          type="button"
                          className="absolute right-2 text-slate-400 hover:text-slate-600 text-base p-1 cursor-pointer"
                          onClick={() => handleClear('custWa')}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* BARIS 2: RUTE (PENJEMPUTAN & TUJUAN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Penjemputan (From) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Penjemputan (From) *
                  </label>
                  <div className="relative flex items-center border border-slate-300 rounded-xl px-3 h-10 bg-slate-50">
                    <i className="fa-solid fa-plane-departure text-slate-400 text-xs mr-2 shrink-0"></i>
                    <input
                      type="text"
                      name="pickupLoc"
                      required
                      readOnly
                      placeholder="Pilih di Tarif"
                      value={formData.pickupLoc}
                      className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none cursor-not-allowed truncate"
                    />
                  </div>
                </div>

                {/* Tujuan (To) */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Tujuan (To) *
                  </label>
                  <div className="relative flex items-center border border-slate-300 rounded-xl px-3 h-10 bg-slate-50">
                    <i className="fa-solid fa-plane-arrival text-slate-400 text-xs mr-2 shrink-0"></i>
                    <input
                      type="text"
                      name="dropLoc"
                      required
                      readOnly
                      placeholder="Pilih di Tarif"
                      value={formData.dropLoc}
                      className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none cursor-not-allowed truncate"
                    />
                  </div>
                </div>

              </div>

              {/* BARIS 3: WAKTU PENJEMPUTAN (TANGGAL & JAM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">

                {/* Tanggal Penjemputan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Tanggal Penjemputan *
                  </label>
                  <div className="relative flex items-center border border-slate-300 rounded-xl px-3 h-10 bg-white focus-within:border-[#0194F3] transition-colors">
                    <input
                      type="date"
                      name="pickupDate"
                      min={todayStr}
                      required
                      value={formData.pickupDate}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Jam Penjemputan */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-xs font-bold text-slate-700">
                    Waktu Penjemputan (WITA) *
                  </label>
                  <div className="relative flex items-center border border-slate-300 rounded-xl px-3 h-10 bg-white focus-within:border-[#0194F3] transition-colors">
                    <input
                      type="time"
                      name="pickupTime"
                      required
                      value={formData.pickupTime}
                      onChange={handleChange}
                      className="w-full text-xs font-semibold text-slate-800 outline-none bg-transparent"
                    />
                  </div>
                </div>

              </div>

              {/* ESTIMASI HARGA & TOMBOL ACTION */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
                <div className="text-left bg-sky-50/60 p-2.5 sm:p-0 rounded-xl sm:bg-transparent">
                  <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium">Estimasi Tarif Terpilih:</span>
                  <strong className="text-base sm:text-lg font-extrabold text-[#0194F3]">
                    {formData.price > 0
                      ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}`
                      : 'Pilih Rute dari Tarif'}
                  </strong>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {!formData.pickupLoc && (
                    <button
                      type="button"
                      onClick={() => navigate('/tarif')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#0194F3] text-[#0194F3] hover:bg-sky-50 font-bold text-xs transition-colors cursor-pointer text-center"
                    >
                      Pilih Tarif Rute
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Lanjutkan Pemesanan</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>

      </div>

      {showModal && (
        <ModalSummary
          formData={formData}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmWhatsApp}
        />
      )}
    </div>
  );
};

export default Booking;
