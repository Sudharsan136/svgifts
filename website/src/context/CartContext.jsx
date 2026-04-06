import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const CartContext = createContext();

// Returns a user-specific localStorage key, or a guest key if not logged in
const getCartKey = (uid) => uid ? `svgifts_cart_${uid}` : 'svgifts_cart_guest';

const loadCart = (uid) => {
  try {
    return JSON.parse(localStorage.getItem(getCartKey(uid))) || [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [userId, setUserId] = useState(undefined); // undefined = auth not yet resolved
  const [cart, setCart] = useState([]);

  // Listen to auth state and reload the correct cart whenever the user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const uid = user ? user.uid : null;
      setUserId(uid);
      setCart(loadCart(uid)); // load THIS user's cart
    });
    return unsubscribe;
  }, []);

  // Persist cart to the correct user-specific key whenever it changes
  useEffect(() => {
    if (userId === undefined) return; // wait until auth is resolved
    localStorage.setItem(getCartKey(userId), JSON.stringify(cart));
  }, [cart, userId]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
