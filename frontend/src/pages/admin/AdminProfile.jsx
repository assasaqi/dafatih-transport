import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar';

const AdminProfile = () => {
    // Membaca data user dari localStorage
    const getSavedAdmin = () => {
        try {
            const saved = localStorage.getItem('adminUser');
            if (!saved) return null;
            return saved.startsWith('{') ? JSON.parse(saved) : { email: saved, name: '' };
        } catch (e) {
            return null;
        }
    };

    const savedAdmin = getSavedAdmin();
    const currentEmail = savedAdmin?.email || '';

    const [formData, setFormData] = useState({
        name: savedAdmin?.name || '',
        email: currentEmail,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Hanya panggil API jika email di localStorage benar-benar ada
        if (!currentEmail) return;

        getProfile(currentEmail)
            .then((res) => {
                if (res.data.success && res.data.data) {
                    setFormData((prev) => ({
                        ...prev,
                        name: res.data.data.name || prev.name,
                        email: res.data.data.email || currentEmail
                    }));
                }
            })
            .catch((err) => {
                // Tangani 404 tanpa menghentikan aplikasi
                if (err.response?.status === 404) {
                    console.warn('Data profil belum ada di DB, menggunakan data sesi lokal.');
                } else {
                    console.error('Gagal mengambil data profil awal:', err);
                }
            });
    }, [currentEmail]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
            return;
        }

        setLoading(true);
        try {
            const res = await updateProfile({
                currentEmail: currentEmail,
                name: formData.name,
                newEmail: formData.email,
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });

                const updatedUser = {
                    ...savedAdmin,
                    name: formData.name,
                    email: res.data.updatedEmail || formData.email
                };
                localStorage.setItem('adminUser', JSON.stringify(updatedUser));

                setFormData((prev) => ({
                    ...prev,
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (err) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Gagal memperbarui profil admin.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminNavbar />
            <div style={{ padding: '24px 5%', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                        Pengaturan Profil Admin
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
                        Perbarui informasi akun dan kata sandi Anda.
                    </p>

                    {message.text && (
                        <div
                            style={{
                                padding: '10px 14px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                marginBottom: '16px',
                                background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: message.type === 'success' ? '#15803d' : '#b91c1c',
                                border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fca5a5'}`
                            }}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                                    Nama Pengelola / Admin
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                                    Email Admin
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px dashed #e2e8f0', margin: '8px 0' }} />

                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a' }}>Ubah Kata Sandi (Opsional)</h4>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                                    Password Lama
                                </label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="Masukkan password saat ini"
                                    value={formData.oldPassword}
                                    onChange={handleChange}
                                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="Masukkan password baru"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Ulangi password baru"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        height: '40px',
                                        padding: '0 20px',
                                        background: '#0284c7',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminProfile;
