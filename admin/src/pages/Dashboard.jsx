import { useState, useEffect } from 'react';
import { getProducts, getOrders } from '../api';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClock } from 'react-icons/fi';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getOrders()])
      .then(([pRes, oRes]) => {
        const orders = oRes.data;
        setStats({
          products: pRes.data.length,
          orders: orders.length,
          revenue: orders.filter(o => o.paymentStatus === 'paid' || o.status === 'delivered').reduce((a, o) => a + (o.totalAmount || 0), 0),
          pending: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.products, icon: FiPackage, color: 'text-blue-600 bg-blue-100' },
    { label: 'Total Orders', value: stats.orders, icon: FiShoppingBag, color: 'text-primary-600 bg-primary-100' },
    { label: 'Revenue (Paid)', value: `₹${stats.revenue.toLocaleString()}`, icon: FiDollarSign, color: 'text-green-600 bg-green-100' },
    { label: 'Pending Orders', value: stats.pending, icon: FiClock, color: 'text-yellow-600 bg-yellow-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={22} />
            </div>
            {loading ? (
              <div className="h-7 bg-gray-100 rounded animate-pulse mb-1" />
            ) : (
              <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            )}
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-gray-500 font-medium pb-2">Order ID</th>
                <th className="text-left text-gray-500 font-medium pb-2">Customer</th>
                <th className="text-left text-gray-500 font-medium pb-2">Amount</th>
                <th className="text-left text-gray-500 font-medium pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3 font-semibold">₹{o.totalAmount}</td>
                  <td className="py-3">
                    <span className={`badge badge-status-${o.status} px-2 py-0.5 rounded text-xs font-medium`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
