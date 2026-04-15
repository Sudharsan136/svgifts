import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiPackage, FiShoppingBag, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';

const MENU = [
  { path: '/', label: 'Dashboard', icon: FiHome },
  { path: '/products', label: 'Products', icon: FiPackage },
  { path: '/orders', label: 'Orders', icon: FiShoppingBag },
  { path: '/reviews', label: 'Reviews', icon: FiMessageSquare },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('svgifts_admin_token');
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40 shadow-sm hidden md:flex">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50">
        <img src={logo} alt="SV Gifts Logo" className="w-8 h-8 object-contain rounded-md mr-3" />
        <span className="font-bold text-gray-900 text-lg">Admin Panel</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {/* eslint-disable-next-line no-unused-vars */}
        {MENU.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={20} className="shrink-0" /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
        >
          <FiLogOut size={20} className="shrink-0" /> Logout
        </button>
      </div>
    </aside>
  );
}
