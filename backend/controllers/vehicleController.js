const db = require('../config/db');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehicles WHERE is_available = TRUE ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new vehicle (Admin)
exports.createVehicle = async (req, res) => {
    const { name, slug, category, capacity, transmission, price_per_day, image_url, description } = req.body;
    try {
        const query = `
      INSERT INTO vehicles (name, slug, category, capacity, transmission, price_per_day, image_url, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.query(query, [name, slug, category, capacity, transmission, price_per_day, image_url, description]);
        res.status(201).json({ success: true, message: 'Mobil berhasil ditambahkan', vehicleId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
