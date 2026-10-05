import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
      <style>{`
        .notfound-container {
          text-align: center;
          padding: 80px 20px;
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .notfound-title {
          font-size: 5rem;
          font-weight: 800;
          color: var(--primary, #0284c7);
          margin-bottom: 0;
          line-height: 1;
        }

        .notfound-subtitle {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--neutral-900, #0f172a);
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .notfound-desc {
          color: var(--neutral-500, #64748b);
          margin-bottom: 25px;
          max-width: 450px;
        }

        .btn-home {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background-color: var(--primary, #0284c7);
          color: #ffffff;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 700;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .btn-home:hover {
          background-color: var(--primary-dark, #0369a1);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="notfound-container">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Halaman Tidak Ditemukan</h2>
        <p className="notfound-desc">
          Maaf, halaman yang Anda cari tidak ada atau rute tujuan telah dipindahkan.
        </p>
        <Link to="/" className="btn-home">
          <i className="fa-solid fa-house"></i>
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </>
  );
}
