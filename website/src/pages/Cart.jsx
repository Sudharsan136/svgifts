import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useCart();

  if (cart.length === 0) return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="font-display text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
      <p className="text-gray-500 mb-8">Add some amazing gifts to get started!</p>
      <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
        <FiShoppingBag /> Start Shopping
      </Link>
    </main>
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemPrice = item.discountPrice || item.price;
            return (
              <div key={item._id} className="card flex gap-4 p-4">
                <img
                  src={item.images?.[0] || 'https://placehold.co/100x100/fed7aa/9a3412?text=Gift'}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover bg-orange-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-primary-700 line-clamp-2 leading-snug">
                    {item.name}
                  </Link>
                  <div className="text-xs text-primary-600 mt-1">{item.category}</div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item._id, item.qty - 1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors">
                        <FiMinus size={14} />
                      </button>
                      <span className="px-4 py-1.5 font-semibold text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item._id, item.qty + 1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors">
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary-700">₹{itemPrice * item.qty}</span>
                      <button onClick={() => removeFromCart(item._id)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium mt-2">
            Clear all items
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-28 p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              Order Summary
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((a, i) => a + i.qty, 0)} items)</span>
                <span className="font-medium text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={cartTotal > 999 ? 'text-[#25D366] font-medium' : 'font-medium text-gray-900'}>
                  {cartTotal > 999 ? 'FREE' : '₹99'}
                </span>
              </div>
              {cartTotal <= 999 && (
                <p className="text-xs text-brand-pink bg-pink-50 p-3 rounded-xl border border-pink-100 flex items-center gap-2">
                  <span className="animate-pulse">✨</span> Add ₹{999 - cartTotal} more for FREE delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center text-lg text-gray-900">
                <span className="font-bold">Total</span>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] to-[#ff758c] text-2xl">
                  ₹{cartTotal + (cartTotal > 999 ? 0 : 99)}
                </span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center flex items-center justify-center gap-2 mb-3">
              Proceed to Checkout <FiArrowRight />
            </Link>
            <Link to="/shop" className="btn-secondary w-full text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
