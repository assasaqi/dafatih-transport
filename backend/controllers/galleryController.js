const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Helper untuk menghapus file fisik di folder uploads
const deleteImageFile = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Gagal menghapus file gambar galeri:', err.message);
        });
    }
};

// 1. Get All Galleries
exports.getAllGalleries = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM galleries ORDER BY id DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error pada getAllGalleries:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data galeri: ' + error.message
        });
    }
};

// 2. Create Gallery Item
exports.createGallery = async (req, res) => {
    try {
        const { title, category } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : '';

        if (!image_url) {
            return res.status(400).json({
                success: false,
                message: 'File gambar wajib diunggah!'
            });
        }

        const [result] = await db.query(
            'INSERT INTO galleries (title, category, image_url) VALUES (?, ?, ?)',
            [title || 'Momen Wisata', category || 'Destinasi', image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Foto berhasil ditambahkan ke galeri!',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error pada createGallery:', error);
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan foto ke galeri: ' + error.message
        });
    }
};

// 3. Update Gallery Item (Fungsi Edit Baru)
exports.updateGallery = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category } = req.body;

        const [existing] = await db.query('SELECT image_url FROM galleries WHERE id = ?', [id]);
        if (existing.length === 0) {
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({
                success: false,
                message: 'Data galeri tidak ditemukan!'
            });
        }

        const oldImageUrl = existing[0].image_url;
        let newImageUrl = oldImageUrl;

        // Jika user mengunggah foto baru, gunakan yang baru & hapus foto lama dari disk
        if (req.file) {
            newImageUrl = `/uploads/${req.file.filename}`;
            deleteImageFile(oldImageUrl);
        }

        await db.query(
            'UPDATE galleries SET title = ?, category = ?, image_url = ? WHERE id = ?',
            [title, category, newImageUrl, id]
        );

        res.json({
            success: true,
            message: 'Foto galeri berhasil diperbarui!'
        });
    } catch (error) {
        console.error('Error pada updateGallery:', error);
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui foto galeri: ' + error.message
        });
    }
};

// 4. Delete Gallery Item
exports.deleteGallery = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT image_url FROM galleries WHERE id = ?', [id]);
        const [result] = await db.query('DELETE FROM galleries WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data galeri tidak ditemukan!'
            });
        }

        if (existing.length > 0) {
            deleteImageFile(existing[0].image_url);
        }

        res.json({
            success: true,
            message: 'Foto galeri berhasil dihapus!'
        });
    } catch (error) {
        console.error('Error pada deleteGallery:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus foto galeri: ' + error.message
        });
    }
};
