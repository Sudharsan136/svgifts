import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../api';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const delivery = cartTotal > 999 ? 0 : 99;
  const total = cartTotal + delivery;

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getOrderItems = () =>
    cart.map((item) => ({ product: item._id, qty: item.qty }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Your cart is empty!');

    setLoading(true);
    try {
      if (paymentMethod === 'cod' || paymentMethod === 'whatsapp_cod') {
        const orderData = {
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
          items: getOrderItems(),
          paymentMethod,
        };
        const res = await createOrder(orderData);
        clearCart();
        navigate('/order-success', { state: { order: res.data, paymentMethod } });

        if (paymentMethod === 'whatsapp_cod') {
          const itemsList = cart.map((i) => `• ${i.name} x${i.qty} — ₹${(i.discountPrice || i.price) * i.qty}`).join('\n');
          const msg = `Hi SV Gifts! 🎁 I placed an order:\n\nName: ${form.customerName}\nPhone: ${form.customerPhone}\nAddress: ${form.address}, ${form.city}, ${form.pincode}\n\nItems:\n${itemsList}\n\nTotal: ₹${total}\n\nOrder ID: ${res.data._id}`;
          setTimeout(() => window.open(`https://wa.me/241974967849040?text=${encodeURIComponent(msg)}`, '_blank'), 500);
        }
      } else {
        // Razorpay flow
        const ok = await loadRazorpay();
        if (!ok) return toast.error('Razorpay failed to load. Please try again.');

        const rzpRes = await createRazorpayOrder(total);
        const { orderId, amount, currency } = rzpRes.data;

        const options = {
          key: RAZORPAY_KEY,
          amount,
          currency,
          name: 'SV Gifts',
          description: 'Gift Purchase',
          order_id: orderId,
          prefill: {
            name: form.customerName,
            email: form.customerEmail,
            contact: form.customerPhone,
          },
          theme: { color: '#c2410c' },
          handler: async (response) => {
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                customerName: form.customerName,
                customerEmail: form.customerEmail,
                customerPhone: form.customerPhone,
                shippingAddress: { address: form.address, city: form.city, state: form.state, pincode: form.pincode },
                items: getOrderItems(),
              },
            });
            clearCart();
            navigate('/order-success', { state: { order: verifyRes.data.order, paymentMethod: 'razorpay' } });
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="font-display text-3xl font-bold">Cart is empty</h2>
        <a href="/shop" className="btn-primary inline-block mt-6">Go Shopping</a>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="section-title mb-10 text-5xl">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Contact Details Card */}
            <div className="card p-10 md:p-12">
              <h3 className="font-semibold text-gray-900 mb-8 text-xl">📋 Contact Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name *</label>
                  <input name="customerName" required value={form.customerName} onChange={handleChange}
                    className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number *</label>
                  <input name="customerPhone" required value={form.customerPhone} onChange={handleChange}
                    className="input" placeholder="+91 XXXXX XXXXX" type="tel" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address (optional)</label>
                  <input name="customerEmail" value={form.customerEmail} onChange={handleChange}
                    className="input" placeholder="email@example.com" type="email" />
                </div>
              </div>
            </div>

            {/* Shipping Address Card */}
            <div className="card p-10 md:p-12">
              <h3 className="font-semibold text-gray-900 mb-8 text-xl">🏠 Shipping Address</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Street Address *</label>
                  <input name="address" required value={form.address} onChange={handleChange}
                    className="input" placeholder="House no., Street, Landmark" />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">City *</label>
                    <input name="city" required value={form.city} onChange={handleChange} className="input" placeholder="City" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">State *</label>
                    <input name="state" required value={form.state} onChange={handleChange} className="input" placeholder="State" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Pincode *</label>
                    <input name="pincode" required value={form.pincode} onChange={handleChange} className="input" placeholder="600001" maxLength={6} />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="card p-10 md:p-12">
              <h3 className="font-semibold text-gray-900 mb-8 text-xl">💳 Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'razorpay', label: '💳 Pay Online', desc: 'Secure Checkout' },
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay at Doorstep' },
                  { value: 'whatsapp_cod', label: '📱 WhatsApp COD', desc: 'Confirm via Chat' },
                ].map((opt) => (
                  <label key={opt.value}
                    className={`relative flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === opt.value
                        ? 'border-brand-pink bg-brand-pink/5 ring-4 ring-brand-pink/10'
                        : 'border-gray-100 hover:border-brand-pink/30 hover:bg-gray-50'
                    }`}>
                    <input type="radio" name="paymentMethod" value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only" />
                    <span className="font-bold text-gray-900 text-sm mb-1">{opt.label}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-relaxed">{opt.desc}</span>
                    {paymentMethod === opt.value && (
                      <span className="absolute top-3 right-3 w-5 h-5 bg-brand-pink rounded-full flex items-center justify-center shadow-lg">
                        <span className="w-2 h-2 bg-white rounded-full" />
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-24 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-6 pb-6 border-b border-gray-100">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 shadow-sm transition-transform hover:scale-105">
                      <img src={item.images?.[0] || 'https://placehold.co/100x100?text=SV'}
                        alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium italic">Qty: {item.qty} × ₹{item.discountPrice || item.price}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900 tracking-tight">
                      ₹{(item.discountPrice || item.price) * item.qty}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm border-t border-gray-100 pt-6">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium tracking-tight">
                  <span>Standard Delivery</span>
                  <span className={delivery === 0 ? 'text-green-500 font-bold' : ''}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-gray-100 tracking-tight">
                  <span>Total Due</span>
                  <div className="flex flex-col items-end">
                    <span className="text-brand-pink">₹{total}</span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-normal mt-0.5 italic">Incl. all taxes</span>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full mt-10 py-5 text-lg shadow-2xl hover:-translate-y-1 transition-transform">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Finalizing...</>
                ) : paymentMethod === 'razorpay' ? '💳 Pay Now Securely' :
                  paymentMethod === 'whatsapp_cod' ? '📱 Order via WhatsApp' : '📦 Confirm Order'}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                   <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 1.55l7.834 3.35a1 1 0 01.666.92v6.57a7.334 7.334 0 01-4 6.55L10 20l-4.5-1.11a7.334 7.334 0 01-4-6.55V5.82a1 1 0 01.666-.92zM10 3.103L3.834 5.74V12.44a5.334 5.334 0 002.909 4.76L10 18.23l3.257-1.03A5.334 5.334 0 0016.166 12.44V5.74L10 3.103zM10 7a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                   Secure Transaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>

  );
}
