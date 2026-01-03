import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext.jsx';

export default function DefaultHeader() {
  const navigate = useNavigate();
  const { logoutUser, user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-16 h-16 bg-gray-200 text-center rounded-lg flex items-center justify-center">
                <Logo width="100%" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                PrepTrack
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/performance"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Performance
            </Link>
            {!loading && user && (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center uppercase hover:bg-blue-700 focus:outline-none"
                  aria-label="User menu"
                >
                  {(user.full_name || user.mobile || '?').toString().slice(0, 1)}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 text-sm z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-semibold text-gray-900 truncate">{user.full_name || 'User'}</div>
                      <div className="text-xs text-gray-500">{user.role || 'student'} {user.grade ? `• ${user.grade}` : ''}</div>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

