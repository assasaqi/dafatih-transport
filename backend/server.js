const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

// Import Middleware Rate Limiter (disesuaikan ke folder 'middleware')
const { apiLimiter } = require('./middleware/rateLimiter');

// Import Instance Prisma Client & Rute Utama
const prisma = require('./config/prisma');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// ==========================================
// 1. Middlewares Global & Keamanan
// ==========================================
// Helmets untuk proteksi header HTTP (XSS, Clickjacking, Sniffing)
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Mengizinkan akses gambar statis dari frontend
}));

// Mengizinkan Cross-Origin Resource Sharing dari Frontend React
const allowedOrigins = [
    'https://dafatih-transport.rasmantech.web.id',
    'http://dafatih-transport.rasmantech.web.id',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti curl, mobile app, atau browser direct load)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Body Parser untuk menangani payload JSON dan URL-encoded Form Data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Batasi rate limit global untuk seluruh rute /api (Maksimal 100 request/15 menit)
app.use('/api', apiLimiter);

// Menyediakan akses statis publik ke folder penyimpanan file gambar terunggah dengan Header CORS Statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// ==========================================
// 2. Main API Routes
// ==========================================
app.use('/api', apiRoutes);

// Health Check Endpoint (Pengecekan Server Aktif)
app.get('/', (req, res) => {
    res.json({
        status: 'Success',
        message: 'API Backend Dafatih Transport Running OK',
        timestamp: new Date()
    });
});

// Endpoint Diagnosa Koneksi Database MySQL (Prisma)
app.get('/api/test-db', async (req, res) => {
    try {
        const tables = await prisma.$queryRaw`SHOW TABLES`;
        res.json({
            success: true,
            message: 'Koneksi ke database MySQL via Prisma berhasil!',
            tables: tables
        });
    } catch (error) {
        console.error('Error Test DB:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal terhubung ke database MySQL via Prisma.',
            error: error.message
        });
    }
});

// ==========================================
// 3. Handling Errors & Route Fallbacks
// ==========================================
// Handling 404 Route Not Found (Rute tidak ditemukan)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} tidak ditemukan di server.`
    });
});

// Global Server Error Handler (Menangani Internal Error & Multer Error)
app.use((err, req, res, next) => {
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

    console.error('Unhandled Internal Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal pada server.',
        error: err.message
    });
});

// ==========================================
// 4. Start & Run Server
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`=================================`);
    console.log(`🚀 Server Dafatih Transport Aktif`);
    console.log(`🌐 URL Server : http://localhost:${PORT}`);
    console.log(`=================================`);

    try {
        await prisma.$connect();
        console.log(`✅ Database MySQL (dafatih_transport_db) Terhubung via Prisma!`);
    } catch (err) {
        console.error(`❌ Gagal terhubung ke MySQL via Prisma:`, err.message);
    }
});
