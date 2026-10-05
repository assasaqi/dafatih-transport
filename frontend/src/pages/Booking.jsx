import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import countriesData from '../data/countries.json';
import ModalSummary from '@/components/ModalSummary';

const Booking = () => {
  const location = useLocation();
  const PHONE_NUMBER = "6287757004214";

  const todayStr = new Date().toISOString().split('T')[0];

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

  return (
    <>
      <style>{`
        .page-view {
          display: block;
        }

        .page-banner {
          background: linear-gradient(180deg, var(--neutral-900, #0f172a) 0%, #1e293b 100%);
          color: var(--white, #ffffff);
          padding: 14px 4% 12px;
          text-align: center;
        }

        .page-banner h1 {
          font-size: clamp(1.05rem, 1.8vw + 0.3rem, 1.25rem);
          font-weight: 800;
          margin-bottom: 2px;
        }

        .page-banner p {
          color: var(--neutral-100, #f1f5f9);
          font-size: clamp(0.72rem, 0.7vw + 0.3rem, 0.78rem);
          max-width: 500px;
          margin: 0 auto;
          opacity: 0.9;
        }

        .booking-section {
          padding: 12px 4% 30px;
          max-width: 500px;
          margin: 0 auto;
        }

        .booking-card {
          background: #ffffff;
          border-radius: 10px;
          padding: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          margin: 0 auto;
        }

        .booking-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .form-group label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #334155;
        }

        /* Styling Input Ringkas & Seragam */
        .form-control-input {
          width: 100% !important;
          max-width: 100% !important;
          height: 36px !important;
          padding: 0 8px 0 10px !important;
          border-radius: 6px !important;
          border: 1.5px solid #cbd5e1 !important;
          font-size: 0.78rem !important;
          font-family: inherit !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          box-sizing: border-box !important;
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          transition: border-color 0.2s ease;
        }

        .form-control-input:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1) !important;
        }

        /* ------------------------------------------------------------- */
        /* PERBAIKAN GRID TANGGAL & WAKTU (LEBIH PROPOSIONAL & LEBAR)   */
        /* ------------------------------------------------------------- */
        .date-time-grid {
          display: grid;
          /* Pembagian 58% (Tanggal) & 42% (Waktu) agar input tanggal lebih lebar */
          grid-template-columns: 1.4fr 1fr;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .date-time-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          box-sizing: border-box;
        }

        /* Merapikan Ikon Indikator Kalender agar Tidak Tertutup */
        input[type="date"].form-control-input {
          padding-right: 4px !important; /* Memberi ruang agar ikon kalender muat */
        }

        input[type="time"].form-control-input {
          padding-right: 4px !important;
        }

        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
          margin: 0;
          padding: 0;
          transform: scale(0.85); /* Mengecilkan sedikit skala ikon bawaan agar pas */
        }

        .input-clear-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-clear-wrapper input {
          width: 100%;
          padding-right: 30px !important;
        }

        .clear-input-btn {
          position: absolute;
          right: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Group Input Telepon */
        .phone-input-group {
          display: flex;
          align-items: center;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          overflow: hidden;
          box-sizing: border-box;
        }

        .phone-input-group select {
          border: none !important;
          background: #f1f5f9 !important;
          border-right: 1.5px solid #cbd5e1 !important;
          border-radius: 0 !important;
          height: 34px !important;
          padding: 0 6px !important;
          font-size: 0.78rem !important;
          font-weight: 700;
          color: #475569;
          outline: none !important;
        }

        .phone-input-group input {
          border: none !important;
          background: transparent !important;
          height: 34px !important;
          box-shadow: none !important;
        }

        /* Box Estimasi Tarif */
        .price-display-box {
          background: #f0f9ff;
          padding: 10px 12px;
          border-radius: 6px;
          margin: 10px 0 12px;
          text-align: left;
          border: 1.5px dashed #0284c7;
        }

        .price-summary-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #0f172a;
        }

        .btn-submit {
          background: #0284c7;
          color: #ffffff;
          border: none;
          height: 38px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          transition: background 0.2s ease;
          box-shadow: 0 3px 10px rgba(2, 132, 199, 0.2);
        }

        .btn-submit:hover {
          background: #0369a1;
        }

        @media (max-width: 768px) {
          .page-banner {
            padding: 12px 3% 10px;
          }

          .booking-section {
            padding: 10px 3% 24px;
          }

          .booking-card {
            padding: 12px;
          }
        }
      `}</style>

      <div className="page-view">
        <div className="page-banner">
          <h1>Formulir Pemesanan Transportasi</h1>
          <p>Lengkapi formulir di bawah ini untuk reservasi cepat via WhatsApp.</p>
        </div>

        <section className="section booking-section">
          <div className="booking-card">
            <form onSubmit={handleSubmit}>
              <div className="booking-grid">
                {/* Nama Lengkap */}
                <div className="form-group">
                  <label>Nama Lengkap Pemesan *</label>
                  <div className="input-clear-wrapper">
                    <input
                      type="text"
                      className="form-control-input"
                      name="custName"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={formData.custName}
                      onChange={handleChange}
                    />
                    {formData.custName && (
                      <button type="button" className="clear-input-btn" onClick={() => handleClear('custName')}>&times;</button>
                    )}
                  </div>
                </div>

                {/* Nomor WhatsApp */}
                <div className="form-group">
                  <label>Nomor WhatsApp *</label>
                  <div className="phone-input-group">
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ width: '100px', flexShrink: 0 }}>
                      {countriesData.countries?.map((c, i) => (
                        <option key={i} value={c.code}>{c.flag} +{c.code}</option>
                      ))}
                    </select>
                    <div className="input-clear-wrapper" style={{ flex: 1 }}>
                      <input
                        type="tel"
                        className="form-control-input"
                        name="custWa"
                        required
                        placeholder="8123456789"
                        value={formData.custWa}
                        onChange={handleChange}
                      />
                      {formData.custWa && (
                        <button type="button" className="clear-input-btn" onClick={() => handleClear('custWa')}>&times;</button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid Tanggal & Waktu (Tanggal Dibuat Lebih Lebar) */}
                <div className="date-time-grid">
                  <div className="date-time-item">
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Tanggal Jemput *</label>
                    <input
                      type="date"
                      className="form-control-input"
                      name="pickupDate"
                      min={todayStr}
                      required
                      value={formData.pickupDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="date-time-item">
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#334155' }}>Waktu (WITA) *</label>
                    <input
                      type="time"
                      className="form-control-input"
                      name="pickupTime"
                      required
                      value={formData.pickupTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Penjemputan */}
                <div className="form-group">
                  <label>Lokasi Penjemputan (From) *</label>
                  <input
                    type="text"
                    className="form-control-input"
                    name="pickupLoc"
                    required
                    readOnly
                    placeholder="Pilih dari Daftar Tarif"
                    value={formData.pickupLoc}
                    style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
                  />
                </div>

                {/* Tujuan */}
                <div className="form-group">
                  <label>Lokasi Tujuan (To) *</label>
                  <input
                    type="text"
                    className="form-control-input"
                    name="dropLoc"
                    required
                    readOnly
                    placeholder="Pilih dari Daftar Tarif"
                    value={formData.dropLoc}
                    style={{ backgroundColor: '#f8fafc', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Box Estimasi Tarif */}
              <div className="price-display-box">
                <div className="price-summary-info">
                  <span>Estimasi Tarif Sesuai Rute: </span>
                  <strong style={{ color: '#0284c7', fontSize: '0.9rem' }}>
                    {formData.price > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}` : 'Pilih dari Daftar Tarif'}
                  </strong>
                </div>
                <small style={{ color: '#64748b', fontSize: '0.7rem', display: 'block', marginTop: '2px' }}>
                  *Tarif otomatis terisi saat memilih rute (Maks 4 Pax & Bagasi).
                </small>
              </div>

              <button type="submit" className="btn-submit">
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1rem' }}></i> Konfirmasi Pemesanan
              </button>
            </form>
          </div>
        </section>

        {showModal && (
          <ModalSummary
            formData={formData}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirmWhatsApp}
          />
        )}
      </div>
    </>
  );
};

export default Booking;
