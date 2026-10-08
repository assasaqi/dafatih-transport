const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.registerClient = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email dan password wajib diisi!' });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, hashedPassword, 'user']
        );

        return res.status(201).json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
    } catch (error) {
        console.error('Error registerClient:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem.' });
    }
};

exports.loginClient = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT * FROM users WHERE email = ? AND role = "user"', [email]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Email atau password salah.' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email atau password salah.' });
        }

        return res.json({
            success: true,
            token: 'client-token-' + user.id,
            client: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('Error loginClient:', error);
        return res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem.' });
    }
};

exports.getClientProfile = async (req, res) => {
    return res.json({ success: true, message: 'Fitur profil client' });
};
