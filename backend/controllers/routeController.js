const prisma = require('../config/prisma');
const { deleteImageFile } = require('../middleware/upload');

// Helper format respon komprehensif agar 100% kompatibel dengan Frontend React Beranda & Admin
const formatRoute = (item) => {
  if (!item) return null;

  const pickup = item.pickup_location || item.pickupLocation || item.origin || '';
  const dropoff = item.dropoff_location || item.dropoffLocation || item.destination || '';
  const routeName = pickup && dropoff ? `${pickup} - ${dropoff}` : (item.name || item.title || '-');
  const routeImage = item.image_url || item.imageUrl || item.image || '';

  return {
    ...item,
    // Alias untuk Frontend React
    origin: pickup,
    destination: dropoff,
    title: routeName,
    name: routeName,
    image: routeImage,

    // Schema standar Prisma
    pickup_location: pickup,
    dropoff_location: dropoff,
    estimated_time: item.estimated_time || item.estimatedTime || item.duration || '',
    image_url: routeImage,
    is_active: item.is_active !== undefined ? item.is_active : (item.isActive !== undefined ? item.isActive : true)
  };
};

// 1. Ambil Semua Data Rute (Read All)
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { id: 'desc' }
    });

    res.json({
      success: true,
      data: routes.map(formatRoute)
    });
  } catch (error) {
    console.error('Error pada getAllRoutes:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data rute: ' + error.message
    });
  }
};

// 2. Tambah Rute Baru (Create)
exports.createRoute = async (req, res) => {
  try {
    const {
      pickup_location, pickupLocation, origin,
      dropoff_location, dropoffLocation, destination,
      price,
      estimated_time, estimatedTime, duration,
      is_active, isActive
    } = req.body;

    const uploadedImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const finalPickup = pickup_location || pickupLocation || origin || '';
    const finalDropoff = dropoff_location || dropoffLocation || destination || '';
    const finalTime = estimated_time || estimatedTime || duration || '';
    const finalIsActive = is_active !== undefined ? Boolean(is_active) : (isActive !== undefined ? Boolean(isActive) : true);

    if (!finalPickup || !finalDropoff) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        success: false,
        message: 'Lokasi Penjemputan dan Lokasi Tujuan wajib diisi!'
      });
    }

    const priceNum = price ? parseFloat(price) : 0;
    let newRoute;

    // Lapisan 1: Coba simpan skema snake_case (pickup_location)
    try {
      newRoute = await prisma.route.create({
        data: {
          pickup_location: finalPickup,
          dropoff_location: finalDropoff,
          price: priceNum,
          estimated_time: finalTime,
          image_url: uploadedImageUrl,
          is_active: finalIsActive
        }
      });
    } catch (err1) {
      // Lapisan 2: Fallback ke camelCase (pickupLocation)
      try {
        newRoute = await prisma.route.create({
          data: {
            pickupLocation: finalPickup,
            dropoffLocation: finalDropoff,
            price: priceNum,
            estimatedTime: finalTime,
            imageUrl: uploadedImageUrl,
            isActive: finalIsActive
          }
        });
      } catch (err2) {
        // Lapisan 3: Fallback ke legacy (origin)
        newRoute = await prisma.route.create({
          data: {
            origin: finalPickup,
            destination: finalDropoff,
            price: priceNum,
            duration: finalTime,
            image: uploadedImageUrl
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Rute berhasil ditambahkan!',
      data: formatRoute(newRoute)
    });
  } catch (error) {
    if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
    console.error('Error pada createRoute:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan rute: ' + error.message
    });
  }
};

// 3. Perbarui Data Rute (Update)
exports.updateRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'ID rute tidak valid' });
    }

    const {
      pickup_location, pickupLocation, origin,
      dropoff_location, dropoffLocation, destination,
      price,
      estimated_time, estimatedTime, duration,
      is_active, isActive
    } = req.body;

    const existing = await prisma.route.findUnique({ where: { id } });

    if (!existing) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Data rute tidak ditemukan!' });
    }

    const oldImage = existing.image_url || existing.imageUrl || existing.image;
    let newImageUrl = oldImage;

    if (req.file) {
      newImageUrl = `/uploads/${req.file.filename}`;
      if (oldImage) deleteImageFile(oldImage);
    }

    const finalPickup = pickup_location || pickupLocation || origin;
    const finalDropoff = dropoff_location || dropoffLocation || destination;
    const finalTime = estimated_time || estimatedTime || duration;
    const finalIsActive = is_active !== undefined ? is_active : isActive;

    let updatedRoute;

    // Lapisan 1: Coba update skema snake_case (pickup_location)
    try {
      const updateData = {};
      if (finalPickup !== undefined) updateData.pickup_location = finalPickup;
      if (finalDropoff !== undefined) updateData.dropoff_location = finalDropoff;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (finalTime !== undefined) updateData.estimated_time = finalTime;
      if (finalIsActive !== undefined) updateData.is_active = Boolean(finalIsActive);
      updateData.image_url = newImageUrl;

      updatedRoute = await prisma.route.update({
        where: { id },
        data: updateData
      });
    } catch (err1) {
      // Lapisan 2: Fallback ke camelCase (pickupLocation)
      try {
        const updateData = {};
        if (finalPickup !== undefined) updateData.pickupLocation = finalPickup;
        if (finalDropoff !== undefined) updateData.dropoffLocation = finalDropoff;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (finalTime !== undefined) updateData.estimatedTime = finalTime;
        if (finalIsActive !== undefined) updateData.isActive = Boolean(finalIsActive);
        updateData.imageUrl = newImageUrl;

        updatedRoute = await prisma.route.update({
          where: { id },
          data: updateData
        });
      } catch (err2) {
        // Lapisan 3: Fallback ke legacy (origin)
        const updateData = {};
        if (finalPickup !== undefined) updateData.origin = finalPickup;
        if (finalDropoff !== undefined) updateData.destination = finalDropoff;
        if (price !== undefined) updateData.price = parseFloat(price);
        if (finalTime !== undefined) updateData.duration = finalTime;
        updateData.image = newImageUrl;

        updatedRoute = await prisma.route.update({
          where: { id },
          data: updateData
        });
      }
    }

    res.json({
      success: true,
      message: 'Rute berhasil diperbarui!',
      data: formatRoute(updatedRoute)
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

// 4. Hapus Data Rute (Delete)
exports.deleteRoute = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID rute tidak valid' });

    const existing = await prisma.route.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ success: false, message: 'Data rute tidak ditemukan!' });

    await prisma.route.delete({ where: { id } });

    const imageToDelete = existing.image_url || existing.imageUrl || existing.image;
    if (imageToDelete) deleteImageFile(imageToDelete);

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
