const express = require('express');
const router = express.Router();

// Import Controllers (CommonJS)
const authController = require('../controllers/authController');
const routeController = require('../controllers/routeController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const blogController = require('../controllers/blogController');
const galleryController = require('../controllers/galleryController');

// Import Middleware Upload Multer
const upload = require('../middleware/upload');

// =========================================
// 1. Auth & Admin Profile Routes
// =========================================
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

// =========================================
// 2. Route & Tarif Management (CRUD + Upload)
// =========================================
router.get('/routes', routeController.getAllRoutes);
router.post('/routes', upload.single('image'), routeController.createRoute);
router.put('/routes/:id', upload.single('image'), routeController.updateRoute);
router.delete('/routes/:id', routeController.deleteRoute);

// =========================================
// 3. Vehicle / Armada Routes
// =========================================
router.get('/vehicles', vehicleController.getAllVehicles);
router.post('/vehicles', upload.single('image'), vehicleController.createVehicle);

// =========================================
// 4. Booking Routes
// =========================================
router.get('/bookings', bookingController.getAllBookings);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.delete('/bookings/:id', bookingController.deleteBooking);

// =========================================
// 5. Blog Routes (CRUD + Upload)
// =========================================
router.get('/blogs', blogController.getAllBlogs);
router.post('/blogs', upload.single('image'), blogController.createBlog);
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// =========================================
// 6. Gallery Management (CRUD + Upload)
// =========================================
router.get('/galleries', galleryController.getAllGalleries);
router.post('/galleries', upload.single('image'), galleryController.createGallery);
router.put('/galleries/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/galleries/:id', galleryController.deleteGallery);

module.exports = router;
