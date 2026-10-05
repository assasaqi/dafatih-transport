import axios from 'axios';

const API = axios.create({
    baseURL: 'https://dev.dafatihtransport.com/api',
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    }

});

// Admin Auth & Profile API
export const loginAdmin = (credentials) => API.post('/login', credentials);
export const registerAdmin = (credentials) => API.post('/register', credentials);
export const getProfile = (username) => API.get(`/profile?username=${username}`);
export const updateProfile = (data) => API.put('/profile', data);

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

// Gallery API
export const getGalleries = () => API.get('/galleries');
export const createGallery = (formData) => API.post('/galleries', formData);
export const updateGallery = (id, formData) => API.put(`/galleries/${id}`, formData);
export const deleteGallery = (id) => API.delete(`/galleries/${id}`);

// Blog API
export const getBlogs = () => API.get('/blogs');
export const createBlog = (formData) => API.post('/blogs', formData);
export const updateBlog = (id, formData) => API.put(`/blogs/${id}`, formData);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export default API;
