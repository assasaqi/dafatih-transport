const express = require('express');
const router = express.Router();

// Import Controllers (CommonJS)
const authController = require('../controllers/authController');
const authClientController = require('../controllers/authClientController');
const routeController = require('../controllers/routeController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const blogController = require('../controllers/blogController');
const galleryController = require('../controllers/galleryController');

// Import Middleware Upload Multer & Kompresi WebP
const { upload, compressImage } = require('../middleware/upload');

// Helper untuk mencegah crash jika fungsi controller undefined / belum dibuat
const getHandler = (controller, ...fnNames) => {
  for (const name of fnNames) {
    if (controller && typeof controller[name] === 'function') {
      return controller[name];
    }
  }
  // Fallback handler jika fungsi belum di-export di controller
  return (req, res) => {
    res.status(501).json({
      success: false,
      message: `Handler belum diimplementasikan untuk route ${req.originalUrl}`
    });
  };
};

// 1. Auth & Admin Profile Routes
router.post('/login', getHandler(authController, 'loginAdmin', 'login'));
router.post('/register', getHandler(authController, 'registerAdmin', 'register'));
router.get('/profile', getHandler(authController, 'getProfile'));
router.put('/profile', getHandler(authController, 'updateProfile'));

// 2. Auth & Client Profile Routes
router.post('/client/register', getHandler(authClientController, 'registerClient'));
router.post('/client/login', getHandler(authClientController, 'loginClient'));
router.get('/client/profile', getHandler(authClientController, 'getClientProfile', 'getProfile'));

// 3. Route & Tarif Management (CRUD + Upload)
router.get('/routes', getHandler(routeController, 'getAllRoutes', 'getRoutes'));
router.post('/routes', upload.single('image'), compressImage, getHandler(routeController, 'createRoute'));
router.put('/routes/:id', upload.single('image'), compressImage, getHandler(routeController, 'updateRoute'));
router.delete('/routes/:id', getHandler(routeController, 'deleteRoute'));

// 4. Vehicle / Armada Routes (CRUD Lengkap + Upload)
router.get('/vehicles', getHandler(vehicleController, 'getAllVehicles', 'getVehicles'));
router.post('/vehicles', upload.single('image'), compressImage, getHandler(vehicleController, 'createVehicle'));
router.put('/vehicles/:id', upload.single('image'), compressImage, getHandler(vehicleController, 'updateVehicle'));
router.delete('/vehicles/:id', getHandler(vehicleController, 'deleteVehicle'));

// 5. Booking Routes
router.get('/bookings', getHandler(bookingController, 'getAllBookings', 'getBookings'));
router.post('/bookings', getHandler(bookingController, 'createBooking'));
router.put('/bookings/:id/status', getHandler(bookingController, 'updateBookingStatus'));
router.delete('/bookings/:id', getHandler(bookingController, 'deleteBooking'));

// 6. Blog Routes (CRUD + Upload)
router.get('/blogs', getHandler(blogController, 'getAllBlogs', 'getBlogs'));
router.post('/blogs', upload.single('image'), compressImage, getHandler(blogController, 'createBlog'));
router.put('/blogs/:id', upload.single('image'), compressImage, getHandler(blogController, 'updateBlog'));
router.delete('/blogs/:id', getHandler(blogController, 'deleteBlog'));

// 7. Gallery Management (CRUD + Upload)
router.get('/galleries', getHandler(galleryController, 'getAllGalleries', 'getGalleries'));
router.post('/galleries', upload.single('image'), compressImage, getHandler(galleryController, 'createGallery'));
router.put('/galleries/:id', upload.single('image'), compressImage, getHandler(galleryController, 'updateGallery'));
router.delete('/galleries/:id', getHandler(galleryController, 'deleteGallery'));

module.exports = router;
