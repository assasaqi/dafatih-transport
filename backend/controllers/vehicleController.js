const prisma = require('../config/prisma');
const { deleteImageFile } = require('../middleware/upload');

// Helper format respon agar selalu memiliki properti yang sesuai untuk Frontend
const formatVehicle = (item) => {
  if (!item) return null;
  return {
    ...item,
    image_url: item.image_url || item.imageUrl || '',
    price_per_day: item.price_per_day !== undefined ? item.price_per_day : item.pricePerDay,
    is_available: item.is_available !== undefined ? item.is_available : item.isAvailable
  };
};

// 1. Ambil Semua Data Armada (Read All)
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { id: 'desc' }
    });

    res.json({
      success: true,
      data: vehicles.map(formatVehicle)
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
    const {
      name, category, capacity, transmission,
      price_per_day, pricePerDay, description, status,
      is_available, isAvailable
    } = req.body;

    const uploadedImageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const finalPrice = price_per_day || pricePerDay;
    const finalIsAvailable = is_available !== undefined ? Boolean(is_available) : (isAvailable !== undefined ? Boolean(isAvailable) : true);
    const validTransmission = ['Manual', 'Automatic'].includes(transmission) ? transmission : 'Manual';
    const validStatus = ['Tersedia', 'Disewa', 'Maintenance'].includes(status) ? status : 'Tersedia';

    const baseData = {
      name: name || '',
      category: category || 'MPV',
      capacity: capacity ? Number(capacity) : 6,
      transmission: validTransmission,
      description: description || '',
      status: validStatus
    };

    let newVehicle;
    try {
      // Coba simpan menggunakan skema baru (snake_case)
      newVehicle = await prisma.vehicle.create({
        data: {
          ...baseData,
          price_per_day: finalPrice ? parseFloat(finalPrice) : 0,
          is_available: finalIsAvailable,
          image_url: uploadedImageUrl
        }
      });
    } catch (err) {
      // Fallback jika Prisma Client di node_modules masih membaca skema lama (camelCase)
      if (err.message && err.message.includes('Unknown field')) {
        newVehicle = await prisma.vehicle.create({
          data: {
            ...baseData,
            pricePerDay: finalPrice ? parseFloat(finalPrice) : 0,
            isAvailable: finalIsAvailable,
            imageUrl: uploadedImageUrl
          }
        });
      } else {
        throw err;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Armada berhasil ditambahkan!',
      data: formatVehicle(newVehicle)
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

// 3. Perbarui Data Armada (Update)
exports.updateVehicle = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ success: false, message: 'ID armada tidak valid' });
    }

    const {
      name, category, capacity, transmission,
      price_per_day, pricePerDay, description, status,
      is_available, isAvailable
    } = req.body;

    // Ambil data lama tanpa select spesifik agar terhindar dari error validasi field
    const existing = await prisma.vehicle.findUnique({ where: { id } });

    if (!existing) {
      if (req.file) deleteImageFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'Data armada tidak ditemukan!' });
    }

    const oldImage = existing.image_url || existing.imageUrl;
    let newImageUrl = oldImage;

    if (req.file) {
      newImageUrl = `/uploads/${req.file.filename}`;
      if (oldImage) deleteImageFile(oldImage);
    }

    const finalPrice = price_per_day || pricePerDay;
    const finalIsAvailable = is_available !== undefined ? is_available : isAvailable;

    const baseUpdate = {};
    if (name !== undefined) baseUpdate.name = name;
    if (category !== undefined) baseUpdate.category = category;
    if (capacity !== undefined) baseUpdate.capacity = Number(capacity);
    if (transmission && ['Manual', 'Automatic'].includes(transmission)) baseUpdate.transmission = transmission;
    if (description !== undefined) baseUpdate.description = description;
    if (status && ['Tersedia', 'Disewa', 'Maintenance'].includes(status)) baseUpdate.status = status;

    let updated;
    try {
      // Coba update dengan skema baru (snake_case)
      const updateData = { ...baseUpdate, image_url: newImageUrl };
      if (finalPrice !== undefined) updateData.price_per_day = parseFloat(finalPrice);
      if (finalIsAvailable !== undefined) updateData.is_available = Boolean(finalIsAvailable);

      updated = await prisma.vehicle.update({
        where: { id },
        data: updateData
      });
    } catch (err) {
      // Fallback ke skema lama (camelCase) jika Prisma Client belum diperbarui
      if (err.message && err.message.includes('Unknown field')) {
        const updateData = { ...baseUpdate, imageUrl: newImageUrl };
        if (finalPrice !== undefined) updateData.pricePerDay = parseFloat(finalPrice);
        if (finalIsAvailable !== undefined) updateData.isAvailable = Boolean(finalIsAvailable);

        updated = await prisma.vehicle.update({
          where: { id },
          data: updateData
        });
      } else {
        throw err;
      }
    }

    res.json({
      success: true,
      message: 'Armada berhasil diperbarui!',
      data: formatVehicle(updated)
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
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID armada tidak valid' });

    const existing = await prisma.vehicle.findUnique({ where: { id } });

    if (!existing) return res.status(404).json({ success: false, message: 'Data armada tidak ditemukan!' });

    await prisma.vehicle.delete({ where: { id } });

    const imageToDelete = existing.image_url || existing.imageUrl;
    if (imageToDelete) deleteImageFile(imageToDelete);

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
