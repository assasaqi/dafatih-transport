const prisma = require('../config/prisma');

// Helper untuk format respon booking agar fleksibel mendukung snake_case & camelCase untuk Frontend React
const formatBooking = (item) => {
  if (!item) return null;
  return {
    ...item,
    booking_code: item.booking_code || item.bookingCode || '',
    customer_name: item.customer_name || item.customerName || '',
    customer_phone: item.customer_phone || item.customerPhone || '',
    customer_email: item.customer_email || item.customerEmail || '',
    service_type: item.service_type || item.serviceType || 'Sewa_Mobil',
    vehicle_id: item.vehicle_id !== undefined ? item.vehicle_id : item.vehicleId,
    route_id: item.route_id !== undefined ? item.route_id : item.routeId,
    pickup_date: item.pickup_date || item.pickupDate,
    pickup_time: item.pickup_time || item.pickupTime,
    pickup_address: item.pickup_address || item.pickupAddress || item.pickup_location || '',
    total_price: item.total_price !== undefined ? item.total_price : item.totalPrice,
    status: item.status || 'pending',
    created_at: item.created_at || item.createdAt
  };
};

const parsePickupTime = (timeStr) => {
  if (!timeStr) return new Date('1970-01-01T00:00:00Z');
  if (timeStr instanceof Date) return timeStr;
  const cleanTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  return new Date(`1970-01-01T${cleanTime}Z`);
};

const parseServiceType = (typeStr) => {
  if (!typeStr) return 'Sewa_Mobil';
  const normalized = typeStr.toString().replace(/\s+/g, '_');
  if (['Sewa_Mobil', 'Antar_Jemput'].includes(normalized)) return normalized;
  return 'Sewa_Mobil';
};

const parseBookingStatus = (statusStr) => {
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (statusStr && validStatuses.includes(statusStr.toLowerCase())) {
    return statusStr.toLowerCase();
  }
  return 'pending';
};

// 1. Ambil Semua Data Booking (Read All)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: 'desc' },
      include: {
        vehicle: true,
        route: true
      }
    });

    res.json({
      success: true,
      data: bookings.map(formatBooking)
    });
  } catch (error) {
    console.error('Error pada getAllBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking: ' + error.message
    });
  }
};

// 2. Buat Booking Baru (Create dengan Try-Catch Fallback)
exports.createBooking = async (req, res) => {
  try {
    const {
      customer_name, customerName,
      customer_phone, customerPhone,
      customer_email, customerEmail,
      service_type, serviceType,
      vehicle_id, vehicleId,
      route_id, routeId,
      pickup_date, pickupDate,
      pickup_time, pickupTime,
      pickup_address, pickupAddress, pickup_location,
      notes,
      total_price, totalPrice
    } = req.body;

    const name = customer_name || customerName;
    const phone = customer_phone || customerPhone;
    const address = pickup_address || pickupAddress || pickup_location;
    const rawDate = pickup_date || pickupDate;
    const rawTime = pickup_time || pickupTime;

    if (!name || !phone || !rawDate || !address) {
      return res.status(400).json({
        success: false,
        message: 'Nama, No. Telepon, Tanggal Jemput, dan Alamat Jemput wajib diisi!'
      });
    }

    const booking_code = 'DFT-' + Date.now().toString().slice(-6);
    const price = total_price || totalPrice;
    const validVehicleId = (vehicle_id || vehicleId) ? Number(vehicle_id || vehicleId) : null;
    const validRouteId = (route_id || routeId) ? Number(route_id || routeId) : null;

    let newBooking;
    try {
      // Coba simpan menggunakan skema baru (snake_case)
      newBooking = await prisma.booking.create({
        data: {
          booking_code,
          customer_name: name,
          customer_phone: phone,
          customer_email: customer_email || customerEmail || null,
          service_type: parseServiceType(service_type || serviceType),
          vehicle_id: validVehicleId,
          route_id: validRouteId,
          pickup_date: new Date(rawDate),
          pickup_time: parsePickupTime(rawTime),
          pickup_address: address,
          notes: notes || '',
          total_price: price ? parseFloat(price) : 0,
          status: 'pending'
        },
        include: { vehicle: true, route: true }
      });
    } catch (err) {
      // Fallback jika Prisma Client di node_modules belum di-generate (camelCase)
      if (err.message && err.message.includes('Unknown field')) {
        newBooking = await prisma.booking.create({
          data: {
            bookingCode: booking_code,
            customerName: name,
            customerPhone: phone,
            customerEmail: customer_email || customerEmail || null,
            serviceType: parseServiceType(service_type || serviceType),
            vehicleId: validVehicleId,
            routeId: validRouteId,
            pickupDate: new Date(rawDate),
            pickupTime: parsePickupTime(rawTime),
            pickupAddress: address,
            notes: notes || '',
            totalPrice: price ? parseFloat(price) : 0,
            status: 'pending'
          },
          include: { vehicle: true, route: true }
        });
      } else {
        throw err;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat!',
      booking_code,
      id: newBooking.id,
      data: formatBooking(newBooking)
    });
  } catch (error) {
    console.error('Error pada createBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat booking: ' + error.message
    });
  }
};

// 3. Perbarui Status Booking (Update Status)
exports.updateBookingStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID booking tidak valid' });
    }

    const { status } = req.body;
    const validStatus = parseBookingStatus(status);

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Data booking tidak ditemukan!' });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: validStatus },
      include: { vehicle: true, route: true }
    });

    res.json({
      success: true,
      message: 'Status booking berhasil diperbarui!',
      data: formatBooking(updated)
    });
  } catch (error) {
    console.error('Error pada updateBookingStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status booking: ' + error.message
    });
  }
};

// 4. Hapus Booking (Delete)
exports.deleteBooking = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID booking tidak valid' });
    }

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Data booking tidak ditemukan!' });
    }

    await prisma.booking.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Booking berhasil dihapus!'
    });
  } catch (error) {
    console.error('Error pada deleteBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus booking: ' + error.message
    });
  }
};
