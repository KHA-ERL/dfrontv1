import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  Phone,
  Mail,
  ChevronDown,
  Package,
  LayoutDashboard,
  ListOrdered,
  Users,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0);
  const [wishlistCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'Electronics', icon: Package, href: '/browse?category=electronics' },
    { name: 'Mobile', icon: Package, href: '/browse?category=mobile' },
    { name: 'Television', icon: Package, href: '/browse?category=television' },
    { name: 'Bike', icon: Package, href: '/browse?category=bike' },
    { name: "Men's Fashion", icon: Package, href: '/browse?category=mens-fashion' },
    { name: "Women's Fashion", icon: Package, href: '/browse?category=womens-fashion' },
    { name: 'Home And Lifestyle', icon: Package, href: '/browse?category=home-lifestyle' },
    { name: 'Babies And Toys', icon: Package, href: '/browse?category=babies-toys' },
    { name: 'Plant & Animals', icon: Package, href: '/browse?category=plant-animals' },
    { name: 'Electronics Accessories', icon: Package, href: '/browse?category=electronics-accessories' },
    { name: 'Vehicles & Accessories', icon: Package, href: '/browse?category=vehicles-accessories' },
  ];

  const userNavigation = user?.role === 'admin'
    ? [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ListOrdered },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Browse', href: '/browse', icon: Package },
        { name: 'Orders', href: '/orders', icon: ListOrdered },
        { name: 'My Listings', href: '/my-listings', icon: Package },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-orange-500 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:+2348130233489" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                <Phone size={16} />
                <span>+234 813 023 3489</span>
              </a>
              <a href="mailto:contact@ourcribhub.com" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
                <Mail size={16} />
                <span>contact@ourcribhub.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/about" className="text-white hover:text-blue-200 transition-colors">Contact Us</Link>
              {user ? (
                <>
                  <Link to="/account" className="text-white hover:text-blue-200 transition-colors flex items-center space-x-1">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="text-white hover:text-blue-200 transition-colors flex items-center space-x-1 bg-transparent border border-white px-3 py-1 rounded hover:bg-white hover:text-orange-500"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-white hover:text-blue-200 transition-colors flex items-center space-x-1">
                  <User size={16} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/browse"} className="flex items-center space-x-2">
              <ShoppingCart className="h-10 w-10 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">Cribhub</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="flex w-full border border-gray-300 rounded-lg overflow-hidden">
                <select className="px-4 py-3 bg-gray-50 border-r border-gray-300 text-gray-700 focus:outline-none cursor-pointer">
                  <option>All Category</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Garden</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/wishlist" className="relative hover:text-orange-500 transition-colors">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative hover:text-orange-500 transition-colors">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Search Bar - Mobile */}
          <form onSubmit={handleSearch} className="md:hidden mt-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center h-12">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-700 text-white hover:bg-sky-800 rounded transition-colors"
              >
                <Menu size={20} />
                <span className="text-white">All Categories</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {categoryMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setCategoryMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 overflow-hidden"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={category.href}
                          onClick={() => setCategoryMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-500 hover:text-white transition-colors border-b border-gray-100 last:border-0"
                        >
                          <category.icon size={18} />
                          <span>{category.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center space-x-6 ml-8">
              <Link to="/browse" className="text-white hover:text-gray-200 transition-colors">
                Browse
              </Link>
              {user && (
                <Link to="/sell/new" className="text-white hover:text-gray-200 transition-colors">
                  Sell
                </Link>
              )}
              <Link to="/about" className="text-white hover:text-gray-200 transition-colors">
                About
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {user && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600">Menu</p>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-600">Categories</p>
                {categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <category.icon size={18} />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <User size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
