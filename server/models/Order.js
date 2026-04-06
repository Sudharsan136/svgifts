const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  image: String,
  price: Number,
  qty: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'whatsapp_cod'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderType: {
      type: String,
      enum: ['regular', 'bulk'],
      default: 'regular',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
