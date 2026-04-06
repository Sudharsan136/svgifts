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
export const createProduct = (formData) => adminAPI.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, formData) => adminAPI.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => adminAPI.delete(`/products/${id}`);

// Orders
export const getOrders = () => adminAPI.get('/orders');
export const getOrder = (id) => adminAPI.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => adminAPI.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => adminAPI.delete(`/orders/${id}`);

export default adminAPI;
