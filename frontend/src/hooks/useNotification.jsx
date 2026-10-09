import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useNotification = (autoCloseDuration = 4000) => {
  const location = useLocation();
  const [notification, setNotification] = useState(null);
  const isProcessedRef = useRef(false);

  useEffect(() => {
    // Tangkap pesan dari navigation state hanya SEKALI per navigasi
    if (location.state?.message && !isProcessedRef.current) {
      setNotification({
        type: location.state.type || 'success',
        message: location.state.message,
      });

      isProcessedRef.current = true;

      // Hapus state message dari memori router secara diam-diam tanpa memicu re-render
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    // Reset flag penanda saat rute berpindah
    isProcessedRef.current = false;
  }, [location.pathname]);

  useEffect(() => {
    // Timer otomatis tutup notifikasi
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [notification, autoCloseDuration]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Komponen Floating Toast dengan Desain Hijau Awal
  const NotificationToast = () => {
    if (!notification) return null;

    const isSuccess = notification.type === 'success';

    return (
      <div
        style={{ position: 'fixed', zIndex: 99999 }}
        className={`bottom-6 right-6 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white font-bold text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4 duration-200 border border-white/20 ${
          isSuccess ? 'bg-[#00B973]' : 'bg-rose-500'
        }`}
      >
        <i className={`fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'} text-base shrink-0`}></i>

        <span className="leading-snug">{notification.message}</span>

        <button
          type="button"
          onClick={closeNotification}
          className="ml-2 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    );
  };

  return { notification, showNotification, closeNotification, NotificationToast };
}
