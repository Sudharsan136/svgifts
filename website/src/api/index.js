import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews`, data);
export const deleteReview = (productId, reviewId, email) => API.delete(`/products/${productId}/reviews/${reviewId}`, { params: { email } });

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const createRazorpayOrder = (amount) => API.post('/orders/razorpay/create', { amount });
export const verifyRazorpayPayment = (data) => API.post('/orders/razorpay/verify', data);
export const getMyOrders = (email) => API.get('/orders/my-orders', { params: { email } });

// Reviews
export const getReviews = () => API.get('/reviews');

export default API;
