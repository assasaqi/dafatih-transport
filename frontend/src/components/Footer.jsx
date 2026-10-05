import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer-container {
          background: var(--neutral-900, #0f172a);
          color: var(--white, #ffffff);
          padding: 40px 5% 100px 5%;
          margin-top: auto;
        }

        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
        }

        .footer-col h4 {
          font-size: 1.05rem;
          margin-bottom: 12px;
          color: var(--accent, #f59e0b);
        }

        .footer-brand {
          color: var(--white, #ffffff);
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-brand i {
          color: var(--accent, #f59e0b);
        }

        .footer-col p {
          color: var(--neutral-400, #94a3b8);
          font-size: 0.88rem;
          margin-top: 10px;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col ul li {
          margin-bottom: 8px;
          font-size: 0.88rem;
        }

        .footer-col ul li a {
          color: var(--neutral-400, #94a3b8);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-col ul li a:hover {
          color: var(--primary, #0284c7);
        }

        .footer-socials {
          margin-top: 14px;
          display: flex;
          gap: 10px;
        }

        .footer-socials a {
          color: var(--white, #ffffff);
          background: rgba(255, 255, 255, 0.1);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
          text-decoration: none;
        }

        .footer-socials a:hover {
          background: var(--primary, #0284c7) !important;
          color: var(--white, #ffffff) !important;
          transform: translateY(-2px);
        }

        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin-top: 8px;
        }

        .footer-contact-list li {
          margin-bottom: 6px;
        }

        .footer-contact-list a {
          color: var(--neutral-400, #94a3b8);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s ease;
        }

        .footer-contact-list a:hover {
          color: var(--primary, #0284c7);
        }

        .copyright {
          max-width: 1200px;
          margin: 30px auto 0 auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.78rem;
          color: var(--neutral-500, #64748b);
          text-align: center;
        }

        @media (min-width: 769px) {
          .footer-container {
            padding-bottom: 40px;
          }
        }
      `}</style>

      <footer className="footer-container">
        <div className="footer-grid">
          {/* Kolom 1: Profil Brand & Sosmed */}
          <div className="footer-col">
            <h4 className="footer-brand">
              <i className="fa-solid fa-car-side"></i>
              Dafatih Transport
            </h4>
            <p>
              Penyedia jasa transportasi dan antar-jemput terpercaya di Pulau Lombok.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="footer-col">
            <h4>Navigasi</h4>
            <ul>
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/tarif">Daftar Tarif</Link></li>
              <li><Link to="/galeri">Galeri</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Metode Pembayaran */}
          <div className="footer-col">
            <h4>Metode Pembayaran</h4>
            <p>
              <i className="fa-solid fa-wallet" style={{ color: 'var(--accent, #f59e0b)', marginRight: '6px' }}></i>
              Cash dan Transfer
            </p>
          </div>

          {/* Kolom 4: Kontak & Lokasi */}
          <div className="footer-col">
            <h4>Kontak & Lokasi</h4>
            <p>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--accent, #f59e0b)', marginRight: '6px' }}></i>
              Lombok, NTB
            </p>
            <ul className="footer-contact-list">
              <li>
                <a href="https://wa.me/6287757004214" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }}></i> +62 877-5700-4214
                </a>
              </li>
              <li>
                <a href="https://wa.me/6287862358975" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-whatsapp" style={{ color: '#25d366' }}></i> +62 878-6235-8975
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          &copy; {new Date().getFullYear()} Dafatih Transport. All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
