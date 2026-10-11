const prisma = require('../config/prisma');
const { ServiceType } = require('@prisma/client');

// Helper untuk format respon booking (fleksibel snake_case & camelCase)
const formatBooking = (item) => {
  if (!item) return null;
  return {
    ...item,
    booking_code: item.booking_code || item.bookingCode || '',
    customer_name: item.customer_name || item.customerName || '',
    customer_phone: item.customer_phone || item.customerPhone || '',
    customer_email: item.customer_email || item.customerEmail || '',
    service_type: item.service_type || item.serviceType || 'Sewa Mobil',
    vehicle_id: item.vehicle_id !== undefined ? item.vehicle_id : item.vehicleId,
    route_id: item.route_id !== undefined ? item.route_id : item.routeId,
    tour_package_id: item.tour_package_id !== undefined ? item.tour_package_id : item.tourPackageId,
    passenger_count: item.passenger_count || item.passengerCount || 1,
    pickup_date: item.pickup_date || item.pickupDate,
    pickup_time: item.pickup_time || item.pickupTime,
    pickup_address: item.pickup_address || item.pickupAddress || item.pickup_location || '',
    total_price: item.total_price !== undefined ? item.total_price : item.totalPrice,
    status: item.status || 'pending',
    created_at: item.created_at || item.createdAt,

    // Relasi aman
    vehicle: item.vehicle || null,
    route: item.route || null,
    tour_package: item.tour_package || item.tourPackage || item.tour_packages || null
  };
};

const parsePickupTime = (timeStr) => {
  if (!timeStr) return new Date('1970-01-01T00:00:00Z');
  if (timeStr instanceof Date) return timeStr;
  const cleanTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  return new Date(`1970-01-01T${cleanTime}Z`);
};

// Disesuaikan dengan Enum ServiceType Prisma (ANTAR_JEMPUT, SEWA_MOBIL, PAKET_TOUR)
const parseServiceType = (typeStr) => {
  if (!typeStr) typeStr = 'SEWA_MOBIL';
  const clean = typeStr.toString().trim();
  const normalized = clean.toLowerCase().replace(/[\s_]+/g, '');

  // 1. Pencocokan langsung dengan Enum resmi Prisma
  if (ServiceType && typeof ServiceType === 'object') {
    const matchedKey = Object.keys(ServiceType).find(key => {
      const kClean = key.toLowerCase().replace(/[\s_]+/g, '');
      const vClean = String(ServiceType[key]).toLowerCase().replace(/[\s_]+/g, '');
      return kClean === normalized || vClean === normalized;
    });

    if (matchedKey) {
      return ServiceType[matchedKey];
    }
  }

  // 2. Fallback pencocokan manual ke nilai Enum standar Prisma
  if (normalized.includes('antar') || normalized.includes('jemput')) {
    return 'ANTAR_JEMPUT';
  }
  if (normalized.includes('paket') || normalized.includes('tour')) {
    return 'PAKET_TOUR';
  }
  return 'SEWA_MOBIL';
};

const parseBookingStatus = (statusStr) => {
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];
  if (statusStr && validStatuses.includes(statusStr.toLowerCase())) {
    return statusStr.toLowerCase();
  }
  return 'pending';
};

// Helper internal untuk fetch include relasi secara aman
const fetchBookingsWithInclude = async (queryOptions = {}) => {
  try {
    return await prisma.booking.findMany({
      ...queryOptions,
      include: { vehicle: true, route: true, tour_package: true }
    });
  } catch (err1) {
    try {
      return await prisma.booking.findMany({
        ...queryOptions,
        include: { vehicle: true, route: true, tourPackage: true }
      });
    } catch (err2) {
      return await prisma.booking.findMany({
        ...queryOptions,
        include: { vehicle: true, route: true }
      });
    }
  }
};

// 1. Ambil Semua Data Booking (Read All)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await fetchBookingsWithInclude({ orderBy: { id: 'desc' } });

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

// 2. Buat Booking Baru (Dengan Transaksi & Proteksi Double Booking)
exports.createBooking = async (req, res) => {
  try {
    const {
      customer_name, customerName,
      customer_phone, customerPhone,
      customer_email, customerEmail,
      service_type, serviceType,
      vehicle_id, vehicleId,
      route_id, routeId,
      tour_package_id, tourPackageId,
      passenger_count, passengerCount,
      pickup_date, pickupDate, startDate,
      pickup_time, pickupTime,
      pickup_address, pickupAddress, pickup_location,
      notes,
      total_price, totalPrice
    } = req.body;

    const name = customer_name || customerName;
    const phone = customer_phone || customerPhone;
    const address = pickup_address || pickupAddress || pickup_location;
    const rawDate = pickup_date || pickupDate || startDate;
    const rawTime = pickup_time || pickupTime;

    if (!name || !phone || !rawDate) {
      return res.status(400).json({
        success: false,
        message: 'Nama, No. Telepon, dan Tanggal Jemput wajib diisi!'
      });
    }

    const booking_code = 'DFT-' + Date.now().toString().slice(-6);
    const price = total_price || totalPrice;
    const validVehicleId = (vehicle_id || vehicleId) ? Number(vehicle_id || vehicleId) : null;
    const validRouteId = (route_id || routeId) ? Number(route_id || routeId) : null;
    const validTourPackageId = (tour_package_id || tourPackageId) ? Number(tour_package_id || tourPackageId) : null;

    const parsedDate = new Date(rawDate);

    // Prisma Transaction untuk menjamin konsistensi
    const newBooking = await prisma.$transaction(async (tx) => {
      // Pengecekan Benturan Jadwal jika armada dipilih
      if (validVehicleId) {
        let existingBooking = await tx.booking.findFirst({
          where: {
            vehicle_id: validVehicleId,
            status: { notIn: ['cancelled', 'rejected'] },
            pickup_date: parsedDate
          }
        }).catch(() => null);

        if (!existingBooking) {
          existingBooking = await tx.booking.findFirst({
            where: {
              vehicleId: validVehicleId,
              status: { notIn: ['cancelled', 'rejected'] },
              pickupDate: parsedDate
            }
          }).catch(() => null);
        }

        if (existingBooking) {
          throw new Error('DOUBLE_BOOKING');
        }
      }

      // Format payload murni snake_case dengan Enum service_type yang tepat
      const bookingData = {
        booking_code,
        customer_name: name,
        customer_phone: phone,
        customer_email: customer_email || customerEmail || null,
        service_type: parseServiceType(service_type || serviceType),
        vehicle_id: validVehicleId,
        route_id: validRouteId,
        tour_package_id: validTourPackageId,
        passenger_count: Number(passenger_count || passengerCount) || 1,
        pickup_date: parsedDate,
        pickup_time: parsePickupTime(rawTime),
        pickup_address: address || '',
        notes: notes || '',
        total_price: price ? parseFloat(price) : 0,
        status: 'pending'
      };

      return await tx.booking.create({ data: bookingData });
    });

    return res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat!',
      booking_code,
      id: newBooking.id,
      data: formatBooking(newBooking)
    });

  } catch (error) {
    if (error.message === 'DOUBLE_BOOKING') {
      return res.status(409).json({
        success: false,
        message: 'Armada sudah memiliki pesanan aktif pada tanggal tersebut!'
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Gagal membuat booking: ID Relasi yang dimasukkan (seperti Rute/Armada) tidak ditemukan di database.'
      });
    }

    console.error('Error detail pada createBooking:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat booking: ' + error.message
    });
  }
};

// 3. Cek Booking Berdasarkan Kode Booking
exports.getBookingByCode = async (req, res) => {
  try {
    const { code } = req.params;
    let booking;

    try {
      booking = await prisma.booking.findFirst({
        where: { OR: [{ booking_code: code }, { bookingCode: code }] },
        include: { vehicle: true, route: true }
      });
    } catch (e) {
      booking = await prisma.booking.findFirst({
        where: { booking_code: code }
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Kode pemesanan tidak ditemukan!'
      });
    }

    res.json({
      success: true,
      data: formatBooking(booking)
    });
  } catch (error) {
    console.error('Error pada getBookingByCode:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data booking: ' + error.message
    });
  }
};

// 4. Perbarui Status Booking
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
      data: { status: validStatus }
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

// 5. Hapus Booking
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

// 6. Ambil Tanggal Terpesan untuk Kalender Ketersediaan Armada
exports.getVehicleAvailability = async (req, res) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    if (isNaN(vehicleId)) {
      return res.status(400).json({ success: false, message: 'ID kendaraan tidak valid' });
    }

    let bookings = [];
    try {
      bookings = await prisma.booking.findMany({
        where: {
          vehicle_id: vehicleId,
          status: { notIn: ['cancelled', 'rejected'] }
        },
        select: { pickup_date: true }
      });
    } catch (e) {
      bookings = await prisma.booking.findMany({
        where: {
          vehicleId: vehicleId,
          status: { notIn: ['cancelled', 'rejected'] }
        },
        select: { pickupDate: true }
      });
    }

    const bookedDates = bookings
      .map(b => b.pickup_date || b.pickupDate)
      .filter(Boolean);

    return res.json({ success: true, data: bookedDates });
  } catch (error) {
    console.error('Error pada getVehicleAvailability:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data ketersediaan: ' + error.message
    });
  }
};
