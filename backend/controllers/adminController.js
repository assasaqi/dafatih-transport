const prisma = require('../config/prisma');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    // 1. Total Pendapatan dari booking aktif/selesai
    const revenueAggregation = await prisma.booking.aggregate({
      where: { status: { in: ['confirmed', 'completed'] } },
      _sum: { total_price: true }
    });

    // 2. Total Jumlah Pemesanan
    const totalBookings = await prisma.booking.count();

    // 3. Armada Terfavorit (Dikelompokkan berdasarkan ID Kendaraan)
    const favoriteVehiclesRaw = await prisma.booking.groupBy({
      by: ['vehicle_id'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // Ambil detail nama kendaraan
    const favoriteVehicles = await Promise.all(
      favoriteVehiclesRaw.map(async (item) => {
        if (!item.vehicle_id) return null;
        const vehicle = await prisma.vehicle.findUnique({ where: { id: item.vehicle_id } });
        return {
          name: vehicle ? vehicle.name : 'Unknown',
          totalBookings: item._count.id
        };
      })
    );

    // 4. Data Statistik Ringkas untuk Grafik
    const allBookings = await prisma.booking.findMany({
      select: {
        created_at: true,
        total_price: true,
        status: true
      },
      orderBy: { id: 'asc' }
    });

    return res.json({
      success: true,
      data: {
        totalRevenue: revenueAggregation._sum.total_price || 0,
        totalBookings,
        favoriteVehicles: favoriteVehicles.filter(Boolean),
        monthlyData: allBookings
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal memuat analitik: ' + error.message });
  }
};
