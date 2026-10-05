const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat direktori 'uploads' secara otomatis jika belum ada di server
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Penyimpanan Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya berkas gambar yang diperbolehkan!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas maksimum 5MB
});

// Helper Function: Menghapus File Fisik Gambar menggunakan fs.unlink
const deleteImageFile = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Gagal menghapus file gambar fisik:', err.message);
            } else {
                console.log(`File fisik ${imageUrl} berhasil dihapus dari server.`);
            }
        });
    }
};

module.exports = upload;
module.exports.deleteImageFile = deleteImageFile;
