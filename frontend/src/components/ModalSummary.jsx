import React from 'react';

const ModalSummary = ({ formData, onClose, onConfirm }) => {
  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 16px;
        }

        .modal-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          animation: modalPop 0.25s ease-out forwards;
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }

        .summary-details-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #f8fafc;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          margin-bottom: 16px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          color: #334155;
        }

        .summary-item span.label {
          color: #64748b;
          font-weight: 500;
        }

        .summary-item span.value {
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        .summary-item.price-item {
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px dashed #cbd5e1;
        }

        .summary-item.price-item span.value {
          color: var(--primary, #0284c7);
          font-size: 1rem;
          font-weight: 800;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .btn-modal-cancel {
          flex: 1;
          padding: 10px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-modal-confirm {
          flex: 1.2;
          padding: 10px;
          background: #25d366;
          border: none;
          color: #ffffff;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .modal-card {
            padding: 16px;
            border-radius: 14px;
          }

          .modal-header h3 {
            font-size: 1rem;
          }

          .summary-details-list {
            padding: 10px 12px;
            gap: 6px;
            margin-bottom: 14px;
          }

          .summary-item {
            font-size: 0.78rem;
          }

          .summary-item.price-item span.value {
            font-size: 0.92rem;
          }

          .btn-modal-cancel,
          .btn-modal-confirm {
            padding: 9px;
            font-size: 0.8rem;
            height: 40px;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-card">
          {/* Header Modal */}
          <div className="modal-header">
            <h3>
              <i className="fa-solid fa-file-invoice" style={{ color: 'var(--primary, #0284c7)' }}></i>
              Ringkasan Pemesanan
            </h3>
            <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
              &times;
            </button>
          </div>

          {/* Daftar Detail Rincian */}
          <div className="summary-details-list">
            <div className="summary-item">
              <span className="label">Nama Pemesan:</span>
              <span className="value">{formData.custName}</span>
            </div>

            <div className="summary-item">
              <span className="label">No. WhatsApp:</span>
              <span className="value">+{formData.countryCode} {formData.custWa}</span>
            </div>

            <div className="summary-item">
              <span className="label">Jadwal Penjemputan:</span>
              <span className="value">{formData.pickupDate} ({formData.pickupTime} WITA)</span>
            </div>

            <div className="summary-item">
              <span className="label">Lokasi Jemput (From):</span>
              <span className="value">{formData.pickupLoc}</span>
            </div>

            <div className="summary-item">
              <span className="label">Lokasi Tujuan (To):</span>
              <span className="value">{formData.dropLoc}</span>
            </div>

            <div className="summary-item price-item">
              <span className="label">Estimasi Tarif:</span>
              <span className="value">
                Rp {new Intl.NumberFormat('id-ID').format(formData.price)}
              </span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Ubah Data
            </button>
            <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
              <i className="fa-brands fa-whatsapp"></i> Kirim ke WA
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalSummary;
