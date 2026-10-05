const db = require('../config/db');

exports.getAllBookings = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bookings ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const {
            customer_name,
            customer_phone,
            pickup_date,
            pickup_time,
            pickup_location,
            dropoff_location,
            total_price
        } = req.body;

        const booking_code = 'DFT-' + Date.now().toString().slice(-6);

        const query = `
      INSERT INTO bookings
      (booking_code, customer_name, customer_phone, pickup_date, pickup_time, pickup_location, dropoff_location, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

        const [result] = await db.query(query, [
            booking_code,
            customer_name,
            customer_phone,
            pickup_date,
            pickup_time,
            pickup_location,
            dropoff_location,
            total_price || 0
        ]);

        res.status(201).json({
            success: true,
            message: 'Booking berhasil dibuat!',
            booking_code,
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: 'Status booking berhasil diperbarui!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM bookings WHERE id = ?', [id]);
        res.json({ success: true, message: 'Booking berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
