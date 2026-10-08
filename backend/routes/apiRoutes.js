const express = require('express');
const router = express.Router();

// Import Controllers (CommonJS)
const authController = require('../controllers/authController');
const routeController = require('../controllers/routeController');
const vehicleController = require('../controllers/vehicleController');
const bookingController = require('../controllers/bookingController');
const blogController = require('../controllers/blogController');
const galleryController = require('../controllers/galleryController');
const clientController = require('../controllers/clientController');

// Import Middleware Upload Multer
const upload = require('../middleware/upload');

// =========================================
// 1. Auth & Admin Profile Routes
// =========================================
router.post('/login', authController.loginAdmin || authController.login);
router.post('/register', authController.registerAdmin || authController.register);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

// =========================================
// 1. Auth & Client Profile Routes (Dengan Pengaman Safety Check)
// =========================================
if (clientController) {
    if (clientController.registerClient) {
        router.post('/client/register', clientController.registerClient);
    }
    if (clientController.loginClient) {
        router.post('/client/login', clientController.loginClient);
    }
    if (clientController.getClientProfile) {
        router.get('/client/profile', clientController.getClientProfile);
    }
    if (clientController.updateClientProfile) {
        router.put('/client/profile', clientController.updateClientProfile);
    }
}

// =========================================
// 2. Route & Tarif Management (CRUD + Upload)
// =========================================
router.get('/routes', routeController.getAllRoutes || routeController.getRoutes);
router.post('/routes', upload.single('image'), routeController.createRoute);
router.put('/routes/:id', upload.single('image'), routeController.updateRoute);
router.delete('/routes/:id', routeController.deleteRoute);

// =========================================
// 3. Vehicle / Armada Routes (CRUD Lengkap + Upload)
// =========================================
router.get('/vehicles', vehicleController.getAllVehicles || vehicleController.getVehicles);
router.post('/vehicles', upload.single('image'), vehicleController.createVehicle);
router.put('/vehicles/:id', upload.single('image'), vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

// =========================================
// 4. Booking Routes
// =========================================
router.get('/bookings', bookingController.getAllBookings || bookingController.getBookings);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.delete('/bookings/:id', bookingController.deleteBooking);

// =========================================
// 5. Blog Routes (CRUD + Upload)
// =========================================
router.get('/blogs', blogController.getAllBlogs || blogController.getBlogs);
router.post('/blogs', upload.single('image'), blogController.createBlog);
router.put('/blogs/:id', upload.single('image'), blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// =========================================
// 6. Gallery Management (CRUD + Upload)
// =========================================
router.get('/galleries', galleryController.getAllGalleries || galleryController.getGalleries);
router.post('/galleries', upload.single('image'), galleryController.createGallery);
router.put('/galleries/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/galleries/:id', galleryController.deleteGallery);

module.exports = router;
