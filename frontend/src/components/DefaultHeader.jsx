import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

export default function DefaultHeader() {
  const navigate = useNavigate();

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
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

