import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!', { style: { borderRadius: '12px' } });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Invalid email or password', { style: { borderRadius: '12px' } });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // If this Google account is brand new, it means they haven't signed up yet
      if (result.additionalUserInfo?.isNewUser) {
        // Delete the auto-created Firebase account so they must sign up properly
        await result.user.delete();
        toast.error("No account found. Please sign up first! 👇", { style: { borderRadius: '12px' } });
        navigate('/signup');
        return;
      }
      toast.success('Welcome back! 🎁', { style: { borderRadius: '12px' } });
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Google sign-in failed. Please try again.', { style: { borderRadius: '12px' } });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 -left-10 w-96 h-96 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-brand-softpink/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/50 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <img src={logo} alt="SV Gifts Logo" className="w-20 h-20 mx-auto mb-4 object-contain filter drop-shadow-md" />
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to SV Gifts to track your orders</p>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all duration-200 mb-5"
        >
          {googleLoading ? (
            <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white/60 text-gray-400 font-medium">or sign in with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input w-full bg-white/80" placeholder="hello@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password *</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input w-full bg-white/80" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full shadow-lg">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          New to SV Gifts? <Link to="/signup" className="text-brand-pink font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
