const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route  POST /api/orders
// @desc   Create a new order (COD / WhatsApp)
// @access Public
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, paymentMethod, orderType, notes } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No order items' });

    // Calculate total
    let totalAmount = 0;
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product ${item.product} not found`);
        const price = product.discountPrice || product.price;
        totalAmount += price * item.qty;
        return {
          product: product._id,
          name: product.name,
          image: product.images[0] || '',
          price,
          qty: item.qty,
        };
      })
    );

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: enrichedItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cod',
      orderType: orderType || 'regular',
      notes,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  POST /api/orders/razorpay/create
// @desc   Create Razorpay order
// @access Public
router.post('/razorpay/create', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `svgifts_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ orderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  POST /api/orders/razorpay/verify
// @desc   Verify Razorpay payment & save order
// @access Public
router.post('/razorpay/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Save order with payment info
    const { customerName, customerEmail, customerPhone, shippingAddress, items, orderType } = orderData;
    let totalAmount = 0;
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        const price = product.discountPrice || product.price;
        totalAmount += price * item.qty;
        return { product: product._id, name: product.name, image: product.images[0] || '', price, qty: item.qty };
      })
    );

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: enrichedItems,
      totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      orderType: orderType || 'regular',
      status: 'confirmed',
    });

    res.json({ message: 'Payment verified & order placed!', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/orders/my-orders
// @desc   Get logged in user orders
// @access Public (Using email query param)
router.get('/my-orders', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });
    
    // Find all orders for this email
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/orders  (Admin only)
// @access Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.product', 'name images');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/orders/:id  (Admin only)
// @access Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  PUT /api/orders/:id/status  (Admin only)
// @access Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, trackingId } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (trackingId !== undefined) updateData.trackingId = trackingId;
    
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route  DELETE /api/orders/:id  (Admin only)
// @access Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
