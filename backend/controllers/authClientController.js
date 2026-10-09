const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret Key untuk JWT Client
const JWT_SECRET = process.env.JWT_SECRET || 'dafatih_client_secret_key_123';

/**
 * 1. REGISTRASI KLIEN BARU
 * Route: POST /api/client/register
 */
exports.registerClient = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Harap isi semua kolom wajib (Nama, WA/HP, Email, dan Password).'
            });
        }

        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan data pengguna baru (default role 'user')
        const [result] = await db.query(
            'INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [name.trim(), phone.trim(), email.toLowerCase().trim(), hashedPassword, 'user']
        );

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
            data: {
                id: result.insertId,
                name,
                email,
                phone
            }
        });

    } catch (error) {
        console.error('Error registerClient:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat registrasi.'
        });
    }
};

/**
 * 2. LOGIN KLIEN (Memblokir akun Admin)
 * Route: POST /api/client/login
 */
exports.loginClient = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan kata sandi wajib diisi.'
            });
        }

        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? LIMIT 1',
            [email.toLowerCase().trim()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau kata sandi tidak cocok.'
            });
        }

        const user = users[0];

        // --- VALIDASI ROLE KLIEN ---
        // Tolak jika akun memiliki role 'admin'
        const currentRole = String(user.role || '').toLowerCase().trim();
        if (currentRole === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Akses ditolak! Akun Administrator tidak dapat login melalui halaman Klien. Silakan masuk via Halaman Admin.'
            });
        }

        // Verifikasi kata sandi
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email atau kata sandi tidak cocok.'
            });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role || 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login berhasil!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Error loginClient:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server saat login.'
        });
    }
};

/**
 * 3. GET PROFIL KLIEN
 * Route: GET /api/client/profile
 */
exports.getClientProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.id;

        const [users] = await db.query(
            'SELECT id, name, phone, email, created_at FROM users WHERE id = ? LIMIT 1',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.'
            });
        }

        return res.status(200).json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Error getClientProfile:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data profil.'
        });
    }
};

/**
 * 4. UPDATE PROFIL KLIEN
 * Route: PUT /api/client/profile
 */
exports.updateClientProfile = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.id;
        const { name, phone } = req.body;

        await db.query(
            'UPDATE users SET name = ?, phone = ? WHERE id = ?',
            [name, phone, userId]
        );

        return res.status(200).json({
            success: true,
            message: 'Profil berhasil diperbarui.'
        });
    } catch (error) {
        console.error('Error updateClientProfile:', error);
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui profil.'
        });
    }
};
