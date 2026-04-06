import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const WA_NUMBER = '241974967849040';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛍️',
      style: { borderRadius: '12px', fontFamily: 'Inter', fontSize: '14px' },
    });
  };

  const handleBulkOrder = (e) => {
    e.preventDefault();
    const msg = `Hi! I want to place a bulk order for:\n\n🎁 Product: ${product.name}\n💰 Price: ₹${product.discountPrice || product.price}\n\nPlease confirm availability and bulk pricing. Thank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5] bg-gray-50">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://placehold.co/400x500/fafafa/d4d4d8?text=SV+Gifts'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="badge bg-red-500 text-white shadow-lg">{discountPct}% OFF</span>
          )}
          {product.isFeatured && (
            <span className="badge bg-gray-900 text-white shadow-lg">Featured</span>
          )}
        </div>
        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
          <Link to={`/product/${product._id}`}
            className="px-6 py-2 bg-white rounded-full flex items-center justify-center gap-2 text-gray-900 hover:text-white hover:bg-brand-pink transition-colors shadow-2xl hover:scale-105 active:scale-95 duration-200 font-medium">
            <FiEye size={18} /> Quick View
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</span>
        <Link to={`/product/${product._id}`} className="mt-1">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-brand-pink transition-colors leading-relaxed">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-auto pt-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            ₹{hasDiscount ? product.discountPrice : product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>
        
        {/* Persistent Actions */}
        <div className="flex gap-2 w-full">
          <button onClick={handleAddToCart}
            className="flex-1 btn-primary text-sm py-2.5 px-3 flex items-center justify-center gap-2 rounded-xl shadow-none hover:shadow-md">
            <FiShoppingCart size={16} /> <span className="hidden sm:inline">Add</span>
          </button>
          <button onClick={handleBulkOrder}
            className="btn-whatsapp text-sm py-2.5 px-4 flex items-center justify-center gap-2 rounded-xl shadow-none hover:shadow-md">
            <FaWhatsapp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
