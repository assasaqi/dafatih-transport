const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

// 1. Ambil URL database (Hati-hati dengan URL palsu dari Prisma Studio/Accelerate)
let dbUrlString = process.env.DATABASE_URL || "mysql://root@localhost:3306/dafatih_transport_db";

if (!dbUrlString || dbUrlString.includes('prisma+postgres')) {
    dbUrlString = "mysql://root@localhost:3306/dafatih_transport_db";
}
if (dbUrlString.includes('?')) {
    dbUrlString = dbUrlString.split('?')[0];
}

// 2. Parsing URL menjadi komponen agar sesuai dengan format baru Prisma v7
const dbUrl = new URL(dbUrlString);

const adapterConfig = {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 3306,
    user: dbUrl.username,
    database: dbUrl.pathname.substring(1) // Hapus karakter '/' di awal nama database
};

// Tambahkan password hanya jika ada
if (dbUrl.password) {
    adapterConfig.password = decodeURIComponent(dbUrl.password);
}

// 3. Inisialisasi adapter HANYA dengan objek konfigurasi (Tanpa membuat pool manual)
const adapter = new PrismaMariaDb(adapterConfig);

// 4. Inisialisasi Prisma Client (Adapter bersifat wajib di Prisma v7)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
