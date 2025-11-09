import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About PrepTrack</h3>
            <p className="text-gray-400 text-sm">
              Your comprehensive platform for computer-based testing and exam preparation.
              Practice with real exam simulations and track your progress.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/preview" className="text-gray-400 hover:text-white transition-colors">
                  Exam Preview
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: [Company Email]</li>
              <li>Phone: [Phone Number]</li>
              <li>Address: [Address]</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} PrepTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

