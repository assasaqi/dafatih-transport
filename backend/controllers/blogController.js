const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const deleteImageFile = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', imageUrl);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Gagal menghapus file lama:', err.message);
        });
    }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM blogs ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Blog Article
exports.createBlog = async (req, res) => {
    try {
        const { title, excerpt, content } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
        const image_url = req.file ? `/uploads/${req.file.filename}` : '';

        const [result] = await db.query(
            'INSERT INTO blogs (title, slug, excerpt, content, image_url) VALUES (?, ?, ?, ?, ?)',
            [title, slug, excerpt || '', content, image_url]
        );

        res.status(201).json({ success: true, message: 'Artikel berhasil diterbitkan!', id: result.insertId });
    } catch (error) {
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Blog Article
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content } = req.body;

        const [existing] = await db.query('SELECT image_url FROM blogs WHERE id = ?', [id]);
        if (existing.length === 0) {
            if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
            return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan!' });
        }

        const oldImageUrl = existing[0].image_url;
        let newImageUrl = oldImageUrl;

        if (req.file) {
            newImageUrl = `/uploads/${req.file.filename}`;
            deleteImageFile(oldImageUrl);
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        await db.query(
            'UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, image_url = ? WHERE id = ?',
            [title, slug, excerpt || '', content, newImageUrl, id]
        );

        res.json({ success: true, message: 'Artikel berhasil diperbarui!' });
    } catch (error) {
        if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Blog Article
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT image_url FROM blogs WHERE id = ?', [id]);

        const [result] = await db.query('DELETE FROM blogs WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan!' });
        }

        if (existing.length > 0) deleteImageFile(existing[0].image_url);

        res.json({ success: true, message: 'Artikel berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
