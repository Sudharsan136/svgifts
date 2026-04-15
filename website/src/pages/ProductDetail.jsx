import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiPlus, FiMinus, FiShare2, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getProduct, addReview, deleteReview } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const WA_NUMBER = '919047529439';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (product && currentUser && product.reviews) {
      const existing = product.reviews.find(r => r.userEmail && r.userEmail === currentUser.email);
      if (existing) {
        setRating(existing.rating);
        setComment(existing.comment);
        setIsUpdating(true);
      } else {
        setIsUpdating(false);
      }
    }
  }, [product, currentUser]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteReview(id, reviewId, currentUser.email);
      toast.success("Review deleted successfully!");
      setComment('');
      setRating(5);
      setIsUpdating(false);
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Please login to leave a review");
    if (!comment.trim()) return toast.error("Please add a comment");
    
    setSubmittingReview(true);
    try {
      await addReview(id, {
        rating, 
        comment,
        name: currentUser.displayName || 'SV Gifts Customer',
        email: currentUser.email
      });
      toast.success(isUpdating ? "Review updated successfully! ⭐️" : "Review added successfully! ⭐️");
      if (!isUpdating) setComment('');
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-orange-100 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-6 bg-orange-100 rounded w-1/4" />
          <div className="h-10 bg-orange-100 rounded" />
          <div className="h-8 bg-orange-100 rounded w-1/3" />
          <div className="h-32 bg-orange-100 rounded" />
          <div className="h-12 bg-orange-100 rounded-xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😢</div>
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Link to="/shop" className="btn-primary inline-block mt-6">Back to Shop</Link>
    </div>
  );

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPct = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to cart!`, { icon: '🛍️' });
  };

  const handleBulkOrder = () => {
    const msg = `Hi SV Gifts! 👋\n\nI want to place a BULK ORDER:\n\n🎁 Product: ${product.name}\n💰 Price: ₹${displayPrice} each\n📦 Quantity: [Please mention qty]\n\nKindly share bulk pricing and availability. Thank you!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/shop" className="inline-flex items-center gap-2 text-primary-700 font-medium mb-6 hover:underline">
        <FiArrowLeft /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden bg-orange-50 shadow-xl mb-4">
            <img
              src={product.images?.[activeImage] || 'https://placehold.co/600x600/fed7aa/9a3412?text=SV+Gifts'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-primary-700 scale-105' : 'border-gray-200'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {product.category}
          </span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-primary-700">₹{displayPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">{discountPct}% OFF</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className={`inline-flex items-center gap-1 text-sm font-medium mb-5 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-orange-50 text-primary-700 text-xs px-3 py-1 rounded-full border border-orange-200">{tag}</span>
              ))}
            </div>
          )}

          {/* Qty selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-2 hover:bg-orange-50 transition-colors text-gray-600">
                <FiMinus />
              </button>
              <span className="px-5 py-2 font-semibold text-gray-800 bg-white">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="px-4 py-2 hover:bg-orange-50 transition-colors text-gray-600">
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 btn-secondary flex items-center justify-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 btn-primary">
                Buy Now
              </button>
            </div>
            <button onClick={handleBulkOrder}
              className="btn-whatsapp justify-center w-full text-base">
              <FaWhatsapp size={20} /> Bulk Order via WhatsApp
            </button>
          </div>

          {/* Delivery info */}
          <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">🚚 <span><strong>Free Delivery</strong> on all orders!</span></p>
            <p className="flex items-center gap-2">💬 <span><strong>Order via WhatsApp</strong> for quick processing</span></p>
            <p className="flex items-center gap-2">💵 <span><strong>Cash on Delivery (COD)</strong> exclusively available</span></p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t border-gray-100 pt-10">
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-8 text-center">Customer Reviews</h2>
        
        <div className="grid md:grid-cols-3 gap-10">
          {/* Write a Review */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">{isUpdating ? 'Update Your Review' : 'Write a Review'}</h3>
              {!currentUser ? (
                <div className="text-sm text-gray-500 mb-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  Please <Link to="/login" className="text-primary-600 font-bold hover:underline">log in</Link> to share your thoughts about this product.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <FiStar className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Your Review</label>
                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      className="input resize-none h-24" 
                      placeholder="What did you like or dislike?" 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" disabled={submittingReview} className="btn-primary w-full text-sm">
                    {submittingReview ? (isUpdating ? 'Updating...' : 'Submitting...') : (isUpdating ? 'Update Review' : 'Submit Review')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="md:col-span-2">
            {!product.reviews || product.reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-4xl mb-3">⭐</div>
                <h4 className="font-bold mb-1">No reviews yet</h4>
                <p className="text-sm text-gray-500">Be the first to review {product.name}!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-gray-900">{review.name}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-400 font-medium">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        {currentUser && review.userEmail === currentUser.email && (
                          <button 
                            onClick={() => handleDeleteReview(review._id)} 
                            className="text-red-500 hover:text-red-600 text-xs font-bold transition-colors uppercase tracking-wider block"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, index) => (
                        <FiStar key={index} className={`w-4 h-4 ${index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
