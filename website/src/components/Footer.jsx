import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp, FaGoogle } from 'react-icons/fa';
import logo from '../assets/logo.jpg';

const CATEGORIES = ['Festival Gifts', 'Home Decor', 'Corporate Gifts', 'Personalised Gifts', 'Pooja Items'];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 mt-20 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="SV Gifts Logo" className="w-14 h-14 object-contain" />
              <span className="font-display font-bold text-2xl tracking-tight text-white">SV Gifts by SV</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              A signature touch in every gift. Premium gifting experiences crafted with love from Thanjavur, Tamil Nadu.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://wa.me/919047529439" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <FaWhatsapp size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors">
                <FaGoogle size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[{ to: '/shop', label: 'Shop Now' }, { to: '/cart', label: 'My Cart' }, { to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <FiMapPin className="mt-0.5 text-primary-400 shrink-0" />
                Thanjavur, Tamil Nadu, India
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiPhone className="text-primary-400 shrink-0" />
                <a href="tel:919047529439" className="hover:text-white transition-colors">SV Gifts by SV WhatsApp</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMail className="text-primary-400 shrink-0" />
                svgifts@email.com
              </li>
            </ul>
            <a
              href="https://wa.me/919047529439"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <FaWhatsapp size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SV Gifts by SV. All rights reserved.</p>
          <p>Made with ❤️ in Thanjavur</p>
        </div>
      </div>
    </footer>
  );
}
