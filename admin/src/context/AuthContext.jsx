import { createContext, useContext, useEffect, useState } from 'react';
import API from '../api/index';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('svgifts_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Verify token with backend
    API.get('/auth/me')
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('svgifts_admin_token');
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('svgifts_admin_token', token);
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('svgifts_admin_token');
    setCurrentUser(null);
  };

  const value = { currentUser, login, logout, loading };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">Checking SV Gifts Admin credentials...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
