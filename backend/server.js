const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Koneksi Database MySQL & Rute Utama
const db = require('./config/db'); //[cite: 1]
const apiRoutes = require('./routes/apiRoutes'); //[cite: 1]

const app = express();

// ==========================================
// 1. Middlewares Global
// ==========================================
// Mengizinkan Cross-Origin Resource Sharing dari Frontend React[cite: 1]
const allowedOrigins = [
    'https://dafatih-transport.rasmantech.web.id',
    'http://dafatih-transport.rasmantech.web.id',
    'http://localhost:5173',
    'http://localhost:3000'
]; //[cite: 1]

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti curl, mobile app, atau browser direct load)[cite: 1]
        if (!origin) return callback(null, true); //[cite: 1]
        if (allowedOrigins.indexOf(origin) !== -1) { //[cite: 1]
            return callback(null, true); //[cite: 1]
        } else {
            return callback(null, true); // Setel true jika ingin mengizinkan semua origin di produksi[cite: 1]
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //[cite: 1]
    allowedHeaders: ['Content-Type', 'Authorization'], //[cite: 1]
    credentials: true //[cite: 1]
}));

// Body Parser untuk menangani payload JSON dan URL-encoded Form Data[cite: 1]
app.use(express.json()); //[cite: 1]
app.use(express.urlencoded({ extended: true })); //[cite: 1]

// Menyediakan akses statis publik ke folder penyimpanan file gambar terunggah dengan Header CORS Statis[cite: 1]
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { //[cite: 1]
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); //[cite: 1]
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); //[cite: 1]
    }
}));

// ==========================================
// 2. Main API Routes
// ==========================================
app.use('/api', apiRoutes); //[cite: 1]

// Health Check Endpoint (Pengecekan Server Aktif)[cite: 1]
app.get('/', (req, res) => { //[cite: 1]
    res.json({
        status: 'Success',
        message: 'API Backend Dafatih Transport Running OK',
        timestamp: new Date()
    }); //[cite: 1]
});

// Endpoint Diagnosa Koneksi Database MySQL[cite: 1]
app.get('/api/test-db', async (req, res) => { //[cite: 1]
    try {
        const [rows] = await db.query('SHOW TABLES'); //[cite: 1]
        res.json({
            success: true,
            message: 'Koneksi ke database MySQL berhasil!',
            tables: rows
        }); //[cite: 1]
    } catch (error) {
        console.error('Error Test DB:', error); //[cite: 1]
        res.status(500).json({
            success: false,
            message: 'Gagal terhubung ke database MySQL.',
            error: error.message
        }); //[cite: 1]
    }
});

// ==========================================
// 3. Handling Errors & Route Fallbacks
// ==========================================
// Handling 404 Route Not Found (Rute tidak ditemukan)[cite: 1]
app.use((req, res) => { //[cite: 1]
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} tidak ditemukan di server.`
    }); //[cite: 1]
});

// Global Server Error Handler (Menangani Internal Error & Multer Error)[cite: 1]
app.use((err, req, res, next) => {
    // Penanganan khusus error upload dari Multer (Misal: ukuran file berlebih)
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Ukuran berkas gambar terlalu besar! Maksimal 5MB.'
        });
    }

    if (err.message && err.message.includes('Hanya berkas gambar')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    console.error('Unhandled Internal Server Error:', err.stack); //[cite: 1]
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal pada server.',
        error: err.message
    }); //[cite: 1]
});

// ==========================================
// 4. Start & Run Server
// ==========================================
const PORT = process.env.PORT || 5000; //[cite: 1]

app.listen(PORT, async () => {
    console.log(`=================================`); //[cite: 1]
    console.log(`🚀 Server Dafatih Transport Aktif`); //[cite: 1]
    console.log(`🌐 URL Server : http://localhost:${PORT}`); //[cite: 1]
    console.log(`=================================`); //[cite: 1]

    // Verifikasi otomatis koneksi database saat pertama kali menyalakan server[cite: 1]
    try {
        await db.query('SELECT 1'); //[cite: 1]
        console.log(`✅ Database MySQL (dafatih_transport_db) Terhubung!`); //[cite: 1]
    } catch (err) {
        console.error(`❌ Gagal terhubung ke MySQL:`, err.message); //[cite: 1]
    }
});
