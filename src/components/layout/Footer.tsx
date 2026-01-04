import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-white">Cribhub</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted marketplace for buying and selling everything.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="hover:text-orange-500 transition">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/sell/new" className="hover:text-orange-500 transition">
                  Sell Your Items
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orange-500 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-500 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-orange-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:contact@ourcribhub.com" className="hover:text-orange-500 transition">
                  Help Center
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-orange-500 transition">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-orange-500" />
                <a href="mailto:contact@ourcribhub.com" className="hover:text-orange-500 transition">
                  contact@ourcribhub.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-orange-500" />
                <a href="tel:+2348130233489" className="hover:text-orange-500 transition">
                  +234 813 023 3489
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-orange-500" />
                <span>17 Soji Oshodi Str, Lagos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {currentYear} Cribhub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
