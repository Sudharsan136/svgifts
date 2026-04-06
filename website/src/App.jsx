import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

// If logged in, redirect away from /login and /signup to home
function GuestRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

// If NOT logged in, redirect to /login (for checkout etc.)
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-orange-50">
            <Navbar />
            <div className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/order-success" element={<OrderSuccess />} />

                {/* Guest only — redirect to home if already logged in */}
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

                {/* Protected — must be logged in */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="text-8xl mb-6">🎁</div>
                    <h2 className="font-display text-4xl font-bold text-gray-800 mb-3">Page Not Found</h2>
                    <a href="/" className="btn-primary inline-block mt-4">Go Home</a>
                  </div>
                } />
              </Routes>
            </div>
            <Footer />
            <WhatsAppFloat />
          </div>
          <Toaster position="bottom-center" />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
