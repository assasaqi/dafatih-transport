const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register Admin
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const fullName = name || email.split('@')[0];

        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, 'admin']
        );

        res.status(201).json({ success: true, message: 'Registrasi admin berhasil!' });
    } catch (error) {
        console.error('Error Register Admin:', error);
        res.status(500).json({ success: false, message: 'Gagal registrasi: ' + error.message });
    }
};

// 2. Login Admin (Memblokir akun dengan role 'user' / 'client')
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
        }

        // Cari user berdasarkan email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Email atau password salah!' });
        }

        const user = rows[0];

        // --- HAK AKSES DITERAPKAN DI SINI ---
        // Normalisasi teks role agar tidak luput dari pengecekan
        const currentRole = String(user.role || '').toLowerCase().trim();

        if (currentRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak! Halaman ini khusus untuk Administrator.'
            });
        }

        // Verifikasi password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email atau password salah!' });
        }

        // Buat token JWT khusus admin
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'dafatih-secret-key',
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login Admin berhasil!',
            token,
            data: {
                id: user.id,
                name: user.name || 'Admin',
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error Login Admin:', error);
        res.status(500).json({ success: false, message: 'Gagal login: ' + error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const { email } = req.query;

        const [rows] = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil profil: ' + error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { currentEmail, name, newEmail, oldPassword, newPassword } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [currentEmail]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Akun tidak ditemukan.' });
        }

        const user = users[0];
        const updatedName = name || user.name;
        const updatedEmail = newEmail || user.email;

        if (newPassword && newPassword.trim() !== '') {
            const isOldMatch = await bcrypt.compare(oldPassword || '', user.password);
            if (!isOldMatch) {
                return res.status(400).json({ success: false, message: 'Password lama Anda salah!' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await db.query(
                'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
                [updatedName, updatedEmail, hashedNewPassword, user.id]
            );
        } else {
            await db.query(
                'UPDATE users SET name = ?, email = ? WHERE id = ?',
                [updatedName, updatedEmail, user.id]
            );
        }

        res.json({
            success: true,
            message: 'Profil berhasil diperbarui!',
            updatedEmail: updatedEmail
        });
    } catch (error) {
        console.error('Error pada updateProfile:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
    }
};

module.exports = {
    register,
    login,
    registerAdmin: register,
    loginAdmin: login,
    getProfile,
    updateProfile
};
