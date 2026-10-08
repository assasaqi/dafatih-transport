import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, registerAdmin, loginClient, registerClient } from '@/services/api';

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [regRole, setRegRole] = useState('client'); // 'client' | 'admin'

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isRegister) {
        // --- PROSES REGISTRASI ---
        if (regRole === 'admin') {
          const res = await registerAdmin({ name, email, password });
          setMessage({
            type: 'success',
            text: res.data?.message || 'Registrasi Admin berhasil! Silakan login.'
          });
        } else {
          const res = await registerClient({ name, email, phone, password });
          setMessage({
            type: 'success',
            text: res.data?.message || 'Registrasi Pelanggan berhasil! Silakan login.'
          });
        }

        setIsRegister(false);
        resetForm();
      } else {
        // --- PROSES LOGIN (Satu Pintu / Universal) ---
        let loginSuccess = false;

        // 1. Coba Login sebagai Client
        try {
          const resClient = await loginClient({ email, password });
          if (resClient.data?.success || resClient.data?.token) {
            const clientData = resClient.data.client || resClient.data.user || { email };
            localStorage.setItem('clientToken', resClient.data.token);
            localStorage.setItem('clientUser', JSON.stringify(clientData));
            loginSuccess = true;

            // Arahkan akun client ke halaman baru (MyOrders)
            navigate('/client/myorders');
            return;
          }
        } catch (clientErr) {
          // Jika login client gagal, lanjut mencoba login sebagai admin
        }

        // 2. Coba Login sebagai Admin jika login client tidak berhasil
        if (!loginSuccess) {
          try {
            const resAdmin = await loginAdmin({ email, password });
            if (resAdmin.data?.success || resAdmin.data?.token) {
              const adminData = resAdmin.data.data || resAdmin.data.user || { email };
              localStorage.setItem('adminToken', resAdmin.data.token || resAdmin.data.data?.token);
              localStorage.setItem('adminUser', JSON.stringify(adminData));
              loginSuccess = true;
              navigate('/admin/dashboard'); // Arahkan ke dasbor admin
              return;
            }
          } catch (adminErr) {
            throw adminErr;
          }
        }
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Email atau password salah / akun tidak ditemukan.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-200/80">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 text-center">
          {isRegister ? 'Daftar Akun Baru' : 'Masuk ke Akun Anda'}
        </h2>
        <p className="text-xs text-slate-500 mb-5 text-center">
          Dafatih Transport Management & Reservation
        </p>

        {message.text && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold mb-4 text-center border ${
              message.type === 'error'
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {isRegister && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setRegRole('client')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                regRole === 'client'
                  ? 'bg-white text-[#0194F3] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pelanggan
            </button>
            <button
              type="button"
              onClick={() => setRegRole('admin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                regRole === 'admin'
                  ? 'bg-white text-[#0194F3] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Administrator
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white transition-colors"
                />
              </div>

              {regRole === 'client' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white transition-colors"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#0194F3] hover:bg-sky-600 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              resetForm();
            }}
            className="text-xs font-semibold text-[#0194F3] hover:underline cursor-pointer bg-transparent border-none"
          >
            {isRegister ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar Akun Baru'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
