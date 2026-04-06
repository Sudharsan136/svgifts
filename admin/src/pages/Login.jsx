import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '../assets/logo.jpg';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin({ email, password });
      
      // Update global context & track standard JWT session
      login({ 
        _id: res.data._id, 
        name: res.data.name, 
        email: res.data.email 
      }, res.data.token);

      toast.success('Welcome back, Admin!');
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Invalid admin credentials');
      } else {
        toast.error(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Pink decorative elements to match the new brand */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-softpink/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <img src={logo} alt="SV Gifts Logo" className="w-24 h-24 mx-auto mb-3 object-contain filter drop-shadow-md" />
          <h1 className="text-2xl font-bold text-gray-900">SV Gifts Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your store</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@svgifts.com"
                id="admin-email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password" required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                id="admin-password"
              />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 shadow-lg">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
