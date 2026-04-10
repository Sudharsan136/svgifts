import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, deleteOrder } from '../api';
import toast from 'react-hot-toast';
import { FiEye, FiSearch, FiMessageCircle, FiTrash2, FiPhone, FiMail, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to completely delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(id);
      toast.success('Order deleted forever');
      fetchOrders();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.customerName.toLowerCase().includes(q) || o._id.includes(q) || o.customerPhone.includes(q);
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="input pl-10" placeholder="Search by name, ID or phone..." />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input md:w-48">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="card h-24 animate-pulse bg-white" />)
        ) : filteredOrders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-2">📥</div>
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((o) => (
            <div key={o._id} className="card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-semibold text-gray-700">#{o._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge badge-status-${o.status} bg-${o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'red' : 'yellow'}-100 text-${o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'red' : 'yellow'}-800 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider`}>
                      {o.status}
                    </span>
                    <span className="text-xs font-medium text-gray-500 px-2 py-0.5 bg-gray-100 rounded">
                      {o.paymentMethod === 'whatsapp_cod' ? 'WA COD' : o.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">{o.customerName}</h3>
                  <div className="flex flex-col gap-2 text-sm">
                    {/* Date & Amount */}
                    <div className="flex flex-wrap items-center gap-5 text-gray-600">
                      <div className="flex items-center gap-2"><FiCalendar className="text-gray-400" /> <span className="font-medium text-gray-700">{new Date(o.createdAt).toLocaleDateString()}</span></div>
                      <div className="flex items-center gap-2"><FiCreditCard className="text-primary-500" /> <span className="font-bold text-gray-900">₹{o.totalAmount}</span> <span className="text-gray-500 text-xs">({o.items.length} items)</span></div>
                    </div>
                    
                    {/* Contact Details */}
                    <div className="flex flex-wrap items-center gap-5 text-gray-600">
                      <div className="flex items-center gap-2 bg-green-50 text-green-800 px-2.5 py-1 rounded-md border border-green-100">
                        <FiPhone className="text-green-600 shrink-0" /> <a href={`tel:${o.customerPhone}`} className="font-semibold tracking-wide hover:underline">{o.customerPhone}</a>
                      </div>
                      {o.customerEmail && (
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md border border-blue-100 cursor-pointer">
                          <FiMail className="text-blue-500 shrink-0" /> <a href={`mailto:${o.customerEmail}`} className="font-medium hover:underline">{o.customerEmail}</a>
                        </div>
                      )}
                    </div>
                    
                    {/* Delivery Address */}
                    {o.shippingAddress && (
                      <div className="flex items-start gap-2.5 mt-2 bg-gradient-to-r from-orange-50 to-pink-50 p-3 rounded-lg border border-orange-100/50 max-w-xl">
                        <FiMapPin className="text-brand-pink shrink-0 mt-0.5 text-base" />
                        <div className="text-gray-700 leading-snug">
                          <span className="font-bold text-gray-900 block mb-0.5">Shipping Address:</span>
                          {o.shippingAddress.address}, {o.shippingAddress.city}, <br/>
                          {o.shippingAddress.state} - <span className="font-mono font-bold text-gray-900 text-[15px]">{o.shippingAddress.pincode}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[200px]">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="input py-1.5 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <a
                    href={`https://wa.me/${o.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hi ${o.customerName}, regarding your SV Gifts order #${o._id.slice(-8).toUpperCase()}.\n\n` +
                      (o.status === 'pending' ? 'We have received your order and it is pending review.' :
                       o.status === 'confirmed' ? 'Great news! Your order has been confirmed and is being prepared.' :
                       o.status === 'shipped' ? 'Your order has been shipped and is on its way!' :
                       o.status === 'delivered' ? 'Your order has been successfully delivered! We hope you love it 🎁.' :
                       o.status === 'cancelled' ? 'This is an update that your order has been cancelled.' :
                       'We are reaching out to you regarding your order.')
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost flex items-center justify-center gap-2 border border-green-200 text-green-700 hover:bg-green-50 py-1.5 text-sm"
                  >
                    <FaWhatsapp /> Contact Customer
                  </a>
                  <button 
                    onClick={() => handleDeleteOrder(o._id)}
                    className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 border border-red-100 rounded-lg py-1.5 text-sm transition-colors mt-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {o.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 min-w-max bg-gray-50 pr-4 rounded-lg overflow-hidden border border-gray-100">
                    <img src={item.image || 'https://placehold.co/40'} alt={item.name} className="w-10 h-10 object-cover" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-800 line-clamp-1 max-w-[150px]">{item.name}</div>
                      <div className="text-gray-500">Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
