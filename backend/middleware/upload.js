const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Pastikan direktori 'uploads' ada
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Gunakan memoryStorage agar gambar ditampung di RAM saat proses kompresi
const storage = multer.memoryStorage();

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

// Middleware pemrosesan gambar ke format WebP
const compressImage = async (req, res, next) => {
    if (!req.file) return next();

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `file-${uniqueSuffix}.webp`;
    const outputPath = path.join(uploadDir, filename);

    try {
        await sharp(req.file.buffer)
            .resize({ width: 1200, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Menyesuaikan properti req.file agar siap digunakan di controller
        req.file.filename = filename;
        req.file.path = outputPath;
        req.file.destination = uploadDir;

        next();
    } catch (error) {
        next(error);
    }
};

// Helper Function: Menghapus File Fisik Gambar
const deleteImageFile = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', imageUrl);
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Gagal menghapus file gambar fisik:', err.message);
            }
        });
    }
};

module.exports = {
    upload,
    compressImage,
    deleteImageFile
};
