const db = require('../config/db');
const { deleteImageFile } = require('../middleware/upload');

// 1. Ambil Semua Data Armada (Read All)
exports.getAllVehicles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles ORDER BY id DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error pada getAllVehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data armada: ' + error.message
        });
    }
};

// 2. Tambah Armada Baru (Create)
exports.createVehicle = async (req, res) => {
    try {
        const { name, category, capacity, transmission, price_per_day, description, status } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : '';

        const [result] = await db.query(
            `INSERT INTO vehicles (name, category, capacity, transmission, price_per_day, description, status, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name || '',
                category || 'MPV',
                capacity || 6,
                transmission || 'Manual',
                price_per_day || 0,
                description || '',
                status || 'Tersedia',
                image_url
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Armada berhasil ditambahkan!',
            id: result.insertId
        });
    } catch (error) {
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        console.error('Error pada createVehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan armada: ' + error.message
        });
    }
};

// 3. Perbarui Data Armada (Update - Perbaikan Utama Error 500)
exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, capacity, transmission, price_per_day, description, status } = req.body;

        // Cari data armada lama di database
        const [existing] = await db.query('SELECT image_url FROM vehicles WHERE id = ?', [id]);

        if (existing.length === 0) {
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({
                success: false,
                message: 'Data armada tidak ditemukan!'
            });
        }

        const oldImageUrl = existing[0].image_url;
        let newImageUrl = oldImageUrl;

        // Jika mengunggah foto baru
        if (req.file) {
            newImageUrl = `/uploads/${req.file.filename}`;
            if (oldImageUrl) {
                deleteImageFile(oldImageUrl);
            }
        }

        // Eksekusi Update Query dengan Penanganan Nilai Default
        await db.query(
            `UPDATE vehicles
             SET name = ?, category = ?, capacity = ?, transmission = ?, price_per_day = ?, description = ?, status = ?, image_url = ?
             WHERE id = ?`,
            [
                name || '',
                category || 'MPV',
                capacity || 6,
                transmission || 'Manual',
                price_per_day || 0,
                description || '',
                status || 'Tersedia',
                newImageUrl || '',
                id
            ]
        );

        res.json({
            success: true,
            message: 'Armada berhasil diperbarui!'
        });
    } catch (error) {
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        console.error('Error pada updateVehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui armada: ' + error.message
        });
    }
};

// 4. Hapus Data Armada (Delete)
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT image_url FROM vehicles WHERE id = ?', [id]);
        const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data armada tidak ditemukan!'
            });
        }

        if (existing.length > 0 && existing[0].image_url) {
            deleteImageFile(existing[0].image_url);
        }

        res.json({
            success: true,
            message: 'Armada berhasil dihapus!'
        });
    } catch (error) {
        console.error('Error pada deleteVehicle:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus armada: ' + error.message
        });
    }
};
