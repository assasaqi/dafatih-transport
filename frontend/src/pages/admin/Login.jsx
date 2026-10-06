import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, registerAdmin } from '@/services/api';

const Login = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (isRegister) {
                const res = await registerAdmin({ name, email, password });
                setMessage({ type: 'success', text: res.data.message || 'Registrasi berhasil! Silakan login.' });
                setIsRegister(false);
                setName('');
            } else {
                const res = await loginAdmin({ email, password });
                if (res.data.success) {
                    localStorage.setItem('adminToken', res.data.token);
                    localStorage.setItem('adminUser', JSON.stringify(res.data.data));
                    navigate('/admin/dashboard');
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Terjadi kesalahan sistem.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#ffffff', width: '100%', maxWidth: '380px', borderRadius: '12px', padding: '28px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <h2 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                    {isRegister ? 'Registrasi Admin' : 'Login Admin'}
                </h2>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                    Dafatih Transport Management System
                </p>

                {message.text && (
                    <div style={{ background: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#ef4444' : '#16a34a', border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`, padding: '10px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '14px', textAlign: 'center' }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Nama Lengkap</label>
                            <input type="text" placeholder="Masukkan nama" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', boxSizing: 'border-box' }} />
                        </div>
                    )}

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Email</label>
                        <input type="email" required placeholder="admin@dafatihtransport.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Password</label>
                        <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', height: '40px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                        {loading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk Dashboard')}
                    </button>
                </form>

                {/* <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <button type="button" onClick={() => { setIsRegister(!isRegister); setMessage({ type: '', text: '' }); }} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                        {isRegister ? 'Sudah punya akun? Login di sini' : 'Belum punya akun? Daftar Admin'}
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Login;
