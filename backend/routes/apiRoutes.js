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
const adminController = require('../controllers/adminController');

// Import Middleware Upload Multer & Kompresi WebP
const { upload, compressImage } = require('../middleware/upload');

// Import Middleware Rate Limiter & Validasi Skema Zod
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validate,
  loginSchema,
  registerSchema,
  routeSchema,
  vehicleSchema,
  bookingSchema,
  blogSchema,
  gallerySchema
} = require('../middleware/validate');

// Import Middleware Otentikasi & Otorisasi JWT
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Helper untuk mencegah crash jika fungsi controller undefined / belum dibuat
const getHandler = (controller, ...fnNames) => {
  for (const name of fnNames) {
    if (controller && typeof controller[name] === 'function') {
      return controller[name];
    }
  }
  return (req, res) => {
    res.status(501).json({
      success: false,
      message: `Handler belum diimplementasikan untuk route ${req.originalUrl}`
    });
  };
};

// ==========================================
// 1. Auth & Admin Profile Routes
// ==========================================
router.post('/login', authLimiter, validate(loginSchema), getHandler(authController, 'loginAdmin', 'login'));
router.post('/register', validate(registerSchema), getHandler(authController, 'registerAdmin', 'register'));
router.get('/profile', authenticateToken, getHandler(authController, 'getProfile'));
router.put('/profile', authenticateToken, getHandler(authController, 'updateProfile'));

// ==========================================
// 2. Auth & Client Profile Routes
// ==========================================
router.post('/client/register', validate(registerSchema), getHandler(authClientController, 'registerClient'));
router.post('/client/login', authLimiter, validate(loginSchema), getHandler(authClientController, 'loginClient'));
router.get('/client/profile', authenticateToken, getHandler(authClientController, 'getClientProfile', 'getProfile'));

// ==========================================
// 3. Route & Tarif Management (Publik Read, Admin Write)
// ==========================================
router.get('/routes', getHandler(routeController, 'getAllRoutes', 'getRoutes'));
router.post('/routes', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(routeSchema), getHandler(routeController, 'createRoute'));
router.put('/routes/:id', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(routeSchema), getHandler(routeController, 'updateRoute'));
router.delete('/routes/:id', authenticateToken, isAdmin, getHandler(routeController, 'deleteRoute'));

// ==========================================
// 4. Vehicle / Armada Routes (Publik Read, Admin Write)
// ==========================================
router.get('/vehicles', getHandler(vehicleController, 'getAllVehicles', 'getVehicles'));
router.get('/vehicles/:vehicleId/availability', getHandler(bookingController, 'getVehicleAvailability'));
router.post('/vehicles', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(vehicleSchema), getHandler(vehicleController, 'createVehicle'));
router.put('/vehicles/:id', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(vehicleSchema), getHandler(vehicleController, 'updateVehicle'));
router.delete('/vehicles/:id', authenticateToken, isAdmin, getHandler(vehicleController, 'deleteVehicle'));

// ==========================================
// 5. Booking Routes (Publik Create, Admin Manage)
// ==========================================
router.get('/bookings', authenticateToken, isAdmin, getHandler(bookingController, 'getAllBookings', 'getBookings'));
router.post('/bookings', validate(bookingSchema), getHandler(bookingController, 'createBooking'));
router.put('/bookings/:id/status', authenticateToken, isAdmin, getHandler(bookingController, 'updateBookingStatus'));
router.delete('/bookings/:id', authenticateToken, isAdmin, getHandler(bookingController, 'deleteBooking'));

// ==========================================
// 6. Blog Routes (Publik Read, Admin Write)
// ==========================================
router.get('/blogs', getHandler(blogController, 'getAllBlogs', 'getBlogs'));
router.post('/blogs', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(blogSchema), getHandler(blogController, 'createBlog'));
router.put('/blogs/:id', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(blogSchema), getHandler(blogController, 'updateBlog'));
router.delete('/blogs/:id', authenticateToken, isAdmin, getHandler(blogController, 'deleteBlog'));

// ==========================================
// 7. Gallery Management (Publik Read, Admin Write)
// ==========================================
router.get('/galleries', getHandler(galleryController, 'getAllGalleries', 'getGalleries'));
router.post('/galleries', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(gallerySchema), getHandler(galleryController, 'createGallery'));
router.put('/galleries/:id', authenticateToken, isAdmin, upload.single('image'), compressImage, validate(gallerySchema), getHandler(galleryController, 'updateGallery'));
router.delete('/galleries/:id', authenticateToken, isAdmin, getHandler(galleryController, 'deleteGallery'));

// ==========================================
// 8. Admin Analytics & Dashboard Routes
// ==========================================
router.get('/admin/analytics', authenticateToken, isAdmin, getHandler(adminController, 'getDashboardAnalytics'));

module.exports = router;
