import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;
  const paymentMethod = state?.paymentMethod;

  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="card py-12 px-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-lg mb-6">
          Thank you for shopping with SV Gifts. Your order has been confirmed!
        </p>

        {order && (
          <div className="bg-orange-50 rounded-2xl p-5 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">📦 Order Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Order ID:</span> #{order._id?.slice(-8).toUpperCase()}</p>
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
              <p><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
              <p><span className="font-medium">Payment:</span> {
                order.paymentMethod === 'razorpay' ? '💳 Paid Online' :
                order.paymentMethod === 'whatsapp_cod' ? '📱 WhatsApp COD' : '💵 Cash on Delivery'
              }</p>
            </div>
          </div>
        )}

        {paymentMethod !== 'razorpay' && (
          <a
            href={`https://wa.me/919047529439?text=Hi! I placed order #${order?._id?.slice(-8).toUpperCase()}. Please confirm it.`}
            target="_blank" rel="noopener noreferrer"
            className="btn-whatsapp justify-center w-full mb-4 text-base"
          >
            <FaWhatsapp size={20} /> Track Order on WhatsApp
          </a>
        )}

        <div className="flex gap-3">
          <Link to="/" className="flex-1 btn-secondary text-center">Back to Home</Link>
          <Link to="/shop" className="flex-1 btn-primary text-center">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
