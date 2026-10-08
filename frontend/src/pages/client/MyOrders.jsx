import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientNavbar from '@/components/client/ClientNavbar';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientUserStr = localStorage.getItem('clientUser');
    if (!clientUserStr) {
      navigate('/login');
      return;
    }

    setTimeout(() => {
      setOrders([
        {
          id: 'BOOK-001',
          serviceName: 'Antar-Jemput Bandara LOP - Senggigi',
          date: '2026-10-15',
          status: 'Selesai',
          price: 250000,
        },
        {
          id: 'BOOK-002',
          serviceName: 'Sewa Mobil Toyota HiAce',
          date: '2026-11-01',
          status: 'Diproses',
          price: 1100000,
        },
      ]);
      setLoading(false);
    }, 500);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F2F4F7] text-slate-800">
      {/* Navbar Khusus Client */}
      <ClientNavbar />

      {/* Container utama dengan padding-top agar tidak tertutup Navbar */}
      <main className="pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200/80 mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
              <i className="fa-solid fa-receipt text-[#0194F3]"></i>
              <span>Riwayat Pesanan Saya</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Daftar seluruh reservasi dan pemesanan layanan Dafatih Transport Anda.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-semibold text-xs sm:text-sm">
              <i className="fa-solid fa-spinner fa-spin text-[#0194F3] mr-2"></i>
              Memuat data pesanan...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80">
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-4">
                Anda belum memiliki riwayat pemesanan.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {orders.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-50 text-[#0194F3] border border-sky-100">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.serviceName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tanggal Perjalanan: {item.date}
                    </p>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-medium">Total Biaya</span>
                    <span className="text-sm font-extrabold text-[#F96D01]">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
