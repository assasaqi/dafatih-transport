const db = require('../config/db');
const { deleteImageFile } = require('../middleware/upload'); // Mengimpor helper unlink

// 1. Mengambil Semua Data Rute (Read All)
exports.getAllRoutes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM routes ORDER BY id DESC');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error pada getAllRoutes:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data rute: ' + error.message
        });
    }
};

// 2. Menambahkan Rute Baru (Create + File Upload)
exports.createRoute = async (req, res) => {
    try {
        const { pickup_location, dropoff_location, price } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : '';

        const [result] = await db.query(
            'INSERT INTO routes (pickup_location, dropoff_location, price, image_url) VALUES (?, ?, ?, ?)',
            [pickup_location, dropoff_location, price || 0, image_url]
        );

        res.status(201).json({
            success: true,
            message: 'Rute berhasil ditambahkan!',
            id: result.insertId
        });
    } catch (error) {
        // Jika insert ke database gagal, hapus gambar baru yang terlanjur terunggah
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        console.error('Error pada createRoute:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan rute: ' + error.message
        });
    }
};

// 3. Memperbarui Data Rute (Update + fs.unlink untuk gambar lama)
exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const { pickup_location, dropoff_location, price } = req.body;

        // Cari data rute lama dari database
        const [existing] = await db.query('SELECT image_url FROM routes WHERE id = ?', [id]);

        if (existing.length === 0) {
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({
                success: false,
                message: 'Data rute tidak ditemukan!'
            });
        }

        const oldImageUrl = existing[0].image_url;
        let newImageUrl = oldImageUrl;

        // Jika user mengunggah gambar baru
        if (req.file) {
            newImageUrl = `/uploads/${req.file.filename}`;
            // HAPUS GAMBAR FISIK LAMA MENGGUNAKAN fs.unlink
            deleteImageFile(oldImageUrl);
        }

        await db.query(
            'UPDATE routes SET pickup_location = ?, dropoff_location = ?, price = ?, image_url = ? WHERE id = ?',
            [pickup_location, dropoff_location, price || 0, newImageUrl, id]
        );

        res.json({
            success: true,
            message: 'Rute berhasil diperbarui!'
        });
    } catch (error) {
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        console.error('Error pada updateRoute:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui rute: ' + error.message
        });
    }
};

// 4. Menghapus Data Rute (Delete + fs.unlink untuk gambar fisik)
exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        // Ambil data gambar terlebih dahulu dari database
        const [existing] = await db.query('SELECT image_url FROM routes WHERE id = ?', [id]);

        const [result] = await db.query('DELETE FROM routes WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Data rute tidak ditemukan!'
            });
        }

        // HAPUS BERKAS FISIK GAMBAR DI FOLDER UPLOADS MENGGUNAKAN fs.unlink
        if (existing.length > 0) {
            deleteImageFile(existing[0].image_url);
        }

        res.json({
            success: true,
            message: 'Rute berhasil dihapus!'
        });
    } catch (error) {
        console.error('Error pada deleteRoute:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus rute: ' + error.message
        });
    }
};
