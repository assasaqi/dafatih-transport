const db = require('../config/db');

// Login Admin
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query(
            'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?',
            [username, username, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau password salah!' });
        }

        const user = rows[0];

        res.json({
            success: true,
            message: 'Login berhasil!',
            data: {
                id: user.id,
                // Utamakan nama pengelola (name), jika kosong gunakan username/email
                name: user.name || user.username || 'Admin',
                username: user.username,
                email: user.email,
                token: 'token-admin-dafatih-secret'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Register Admin Baru
exports.register = async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const fullName = name || username.split('@')[0];

        await db.query(
            'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
            [fullName, username, password]
        );

        res.status(201).json({ success: true, message: 'Registrasi admin berhasil!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 1. Get Profile Admin Detail
exports.getProfile = async (req, res) => {
    try {
        const { username } = req.query;

        // Cari admin berdasarkan username atau email
        const [rows] = await db.query(
            'SELECT id, name, username, email FROM users WHERE username = ? OR email = ? LIMIT 1',
            [username, username]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Akun admin tidak ditemukan.' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil profil: ' + error.message });
    }
};

// 2. Update Profile & Password Admin
exports.updateProfile = async (req, res) => {
    try {
        const { currentUsername, name, newUsername, oldPassword, newPassword } = req.body;

        // Cari user lama berdasarkan username / email saat ini
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
            [currentUsername, currentUsername]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Akun admin tidak ditemukan.' });
        }

        const user = users[0];
        const updatedName = name || user.name;
        const updatedUsername = newUsername || user.username;

        // Jika admin mengisi kata sandi baru
        if (newPassword && newPassword.trim() !== '') {
            if (!oldPassword || oldPassword !== user.password) {
                return res.status(400).json({ success: false, message: 'Password lama Anda salah!' });
            }

            await db.query(
                'UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?',
                [updatedName, updatedUsername, updatedUsername, newPassword, user.id]
            );
        } else {
            // Hanya perbarui nama, username / email
            await db.query(
                'UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?',
                [updatedName, updatedUsername, updatedUsername, user.id]
            );
        }

        res.json({
            success: true,
            message: 'Profil berhasil diperbarui!',
            updatedUsername: updatedUsername
        });
    } catch (error) {
        console.error('Error pada updateProfile:', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
    }
};
