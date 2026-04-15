import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminAPI = axios.create({ baseURL: BASE_URL });

// Attach token to every request
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('svgifts_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginAdmin = (data) => adminAPI.post('/auth/login', data);
export const getMe = () => adminAPI.get('/auth/me');

// Products
export const getProducts = (params) => adminAPI.get('/products', { params });
export const getProduct = (id) => adminAPI.get(`/products/${id}`);
export const createProduct = (data) => adminAPI.post('/products', data);
export const updateProduct = (id, data) => adminAPI.put(`/products/${id}`, data);
export const deleteProduct = (id) => adminAPI.delete(`/products/${id}`);

// Categories
export const getCategories = () => adminAPI.get('/categories');
export const addCategory = (data) => adminAPI.post('/categories', data);
export const updateCategory = (id, data) => adminAPI.put(`/categories/${id}`, data);
export const deleteCategory = (id) => adminAPI.delete(`/categories/${id}`);

// Orders
export const getOrders = () => adminAPI.get('/orders');
export const getOrder = (id) => adminAPI.get(`/orders/${id}`);
export const updateOrderStatus = (id, status, trackingId) => adminAPI.put(`/orders/${id}/status`, { status, trackingId });
export const deleteOrder = (id) => adminAPI.delete(`/orders/${id}`);

// Reviews
export const getReviews = () => adminAPI.get('/reviews');
export const createReview = (data) => adminAPI.post('/reviews', data);
export const deleteReview = (id) => adminAPI.delete(`/reviews/${id}`);

export default adminAPI;
