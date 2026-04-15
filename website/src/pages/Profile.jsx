import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.email) {
      getMyOrders(currentUser.email)
        .then((res) => {
          setOrders(res.data);
        })
        .catch(() => {
          toast.error("Failed to load your orders");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center sticky top-24">
            <div className="w-24 h-24 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink text-4xl font-bold mx-auto mb-4">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{currentUser.displayName || 'User'}</h2>
            <p className="text-sm text-gray-500 mb-6">{currentUser.email}</p>
            
            <button 
              onClick={() => {
                logout();
                toast.success("Successfully logged out!", { style: { borderRadius: '12px' }});
              }} 
              className="w-full bg-red-50 text-red-600 hover:bg-red-500 hover:text-white font-medium py-2.5 rounded-xl transition-colors duration-200"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="w-full md:flex-1">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">
            My Orders
          </h1>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-32 rounded-2xl animate-pulse shadow-sm border border-gray-50" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-lg">You haven't placed any orders yet.</p>
              <a href="/shop" className="btn-primary inline-block mt-4">Start Shopping</a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Order Placed</span>
                      <span className="text-sm font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Amount</span>
                      <span className="text-sm font-semibold text-gray-700">₹{order.totalAmount}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Order ID</span>
                      <span className="text-sm font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                          'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                      {order.trackingId && (
                        <div className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md border border-blue-100 font-medium flex items-center gap-1.5">
                          🚚 Tracking ID: <span className="font-bold">{order.trackingId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center group">
                          <Link to={`/product/${item.product?._id || item.product}`} className="shrink-0 relative overflow-hidden rounded-xl border border-gray-100">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover transition-transform group-hover:scale-105" />
                          </Link>
                          <div className="flex-1">
                            <Link to={`/product/${item.product?._id || item.product}`}>
                              <h4 className="font-semibold text-gray-900 hover:text-brand-pink transition-colors">{item.name}</h4>
                            </Link>
                            <p className="text-sm text-gray-500 mt-0.5">Qty: {item.qty} × ₹{item.price}</p>
                          </div>
                          <div className="font-bold text-gray-900 text-right">
                            <div className="mb-2">₹{item.qty * item.price}</div>
                            <Link 
                              to={`/product/${item.product?._id || item.product}#reviews`} 
                              className="text-xs text-brand-pink font-semibold border border-brand-pink/30 bg-brand-pink/5 hover:bg-brand-pink hover:text-white px-3 py-1.5 rounded-full inline-block transition-colors"
                            >
                              ★ Write Review
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
