import axios from 'axios';

// 1. Inisialisasi Axios Instance
const API = axios.create({
    // Ganti dengan URL endpoint backend Express Anda jika berbeda
        baseURL: 'https://dafatih-transport.rasmantech.web.id/api',
        baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Interceptor: Menyisipkan Token Authorization Secara Otomatis
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Mengambil token login
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ==========================================
// API ENDPOINTS
// ==========================================

// Admin Auth & Profile API
export const getProfile = (email) => API.get(`/profile?email=${email}`);
export const updateProfile = (data) => API.put('/profile', data);
export const loginAdmin = (data) => API.post('/login', data);
export const registerAdmin = (data) => API.post('/register', data);

// Vehicle API
export const getVehicles = () => API.get('/vehicles');

// Route & Tarif API
export const getRoutes = () => API.get('/routes');
export const createRoute = (data) => API.post('/routes', data);
export const updateRoute = (id, data) => API.put(`/routes/${id}`, data);
export const deleteRoute = (id) => API.delete(`/routes/${id}`);

// Booking API
export const getBookings = () => API.get('/bookings');
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Gallery API (Mendukung Upload File Gambar)
export const getGalleries = () => API.get('/galleries');
export const createGallery = (formData) => API.post('/galleries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateGallery = (id, formData) => API.put(`/galleries/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteGallery = (id) => API.delete(`/galleries/${id}`);

// Blog API (Mendukung Upload File Gambar)
export const getBlogs = () => API.get('/blogs');
export const createBlog = (formData) => API.post('/blogs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateBlog = (id, formData) => API.put(`/blogs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export default API;
