import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-lg shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SV Gifts Logo" className="w-12 h-12 object-contain" />
            <span className="font-display font-bold text-3xl text-primary-700">SV Gifts by SV</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-primary-700 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search + Cart */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gifts..."
                className="pl-4 pr-10 py-2 rounded-full border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-orange-50 w-48"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600">
                <FiSearch size={16} />
              </button>
            </form>
            
            {/* Auth section */}
            {currentUser ? (
              <div className="relative group p-2">
                <button className="flex items-center gap-2 text-primary-700 font-medium hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <FiUser />}
                  </div>
                </button>
                {/* Dropdown outline */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right z-50">
                  <div className="p-3 border-b border-gray-100 bg-gray-50 flex flex-col">
                    <span className="text-sm font-bold text-gray-900 truncate">{currentUser.displayName || 'User'}</span>
                    <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
                  </div>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-gray-50">
                    <FiUser size={16} /> My Orders
                  </Link>
                  <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="ml-2 btn-primary text-sm py-2 px-5 !rounded-full shadow-md hover:shadow-lg flex items-center gap-2">
                <FiUser size={16} /> Login
              </Link>
            )}

            <Link to="/cart" className="relative p-2 rounded-full hover:bg-orange-50 transition-colors ml-2">
              <FiShoppingCart size={22} className="text-primary-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-pink text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart size={22} className="text-primary-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-700 text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="p-2 text-primary-700">
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gifts..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-orange-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-orange-50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600">
                <FiSearch size={16} />
              </button>
            </form>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block py-3 text-gray-700 hover:text-primary-700 font-medium border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <FiUser />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{currentUser.displayName || 'User'}</div>
                      <div className="text-xs text-gray-500">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to="/profile" onClick={() => setOpen(false)} className="w-full text-center py-2 rounded-xl text-gray-700 font-medium hover:bg-orange-50 flex items-center justify-center gap-2 border border-gray-100">
                      <FiUser size={18} /> My Orders
                    </Link>
                    <button onClick={() => { logout(); setOpen(false); }} className="w-full text-center py-2 rounded-xl text-red-600 font-medium hover:bg-red-50 flex items-center justify-center gap-2">
                      <FiLogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full text-center py-2.5">Sign In</Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-secondary w-full text-center py-2.5">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
