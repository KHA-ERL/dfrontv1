import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount] = useState(0); // This would come from cart context
  const [wishlistCount] = useState(0); // This would come from wishlist context

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
      <div className="bg-orange text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a href="tel:125-874-9658" className="flex items-center space-x-2 hover:text-orange-100">
                <Phone size={16} />
                <span>125-874-9658</span>
              </a>
              <a href="mailto:contact@gmail.com" className="flex items-center space-x-2 hover:text-orange-100">
                <Mail size={16} />
                <span>contact@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/about" className="hover:text-orange-100">Contact Us</Link>
              {user ? (
                <>
                  <Link to="/account" className="hover:text-orange-100 flex items-center space-x-1">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                  <button onClick={handleLogout} className="hover:text-orange-100 flex items-center space-x-1">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-orange-100 flex items-center space-x-1">
                  <User size={16} />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/browse"} className="flex items-center space-x-3">
              <div className="relative">
                <ShoppingCart className="h-10 w-10 text-primary-600" />
                <div className="absolute -top-1 -right-1 bg-secondary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  T
                </div>
              </div>
              <div>
                <div className="text-xs text-primary-600 font-semibold">TOP</div>
                <div className="text-lg font-bold text-gray-800 -mt-1">COMMERCE</div>
              </div>
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
                  className="px-6 bg-orange hover:bg-orange-dark text-white transition-colors"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Icons - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/wishlist" className="relative hover:text-orange transition-colors">
                <Heart size={24} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative hover:text-orange transition-colors">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="text-right">
                <div className="text-xs text-gray-500">Call Us Now:</div>
                <a href="tel:562-745-8659" className="text-sm font-bold text-gray-900 hover:text-orange">
                  562-745-8659
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
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
                className="px-4 bg-orange hover:bg-orange-dark text-white transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center h-12">
            {/* Browse Categories */}
            <div className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="bg-orange px-6 h-12 flex items-center space-x-2 hover:bg-orange-dark transition-colors"
              >
                <Menu size={20} />
                <span className="font-medium">Browse Categories</span>
                <ChevronDown size={18} className={`transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Dropdown */}
              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 left-0 w-64 bg-white shadow-xl rounded-b-lg z-50"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        onClick={() => setCategoryMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange hover:text-white transition-colors border-b border-gray-100 last:border-0"
                      >
                        <category.icon size={18} />
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-8 ml-8">
              <Link to="/" className="hover:text-orange-light transition-colors">
                Home
              </Link>
              <Link to="/browse" className="hover:text-orange-light transition-colors">
                Shop
              </Link>
              <Link to="/sellers" className="hover:text-orange-light transition-colors">
                Sellers
              </Link>
              <Link to="/blog" className="hover:text-orange-light transition-colors">
                Blog
              </Link>
              <Link to="/campaign" className="hover:text-orange-light transition-colors">
                Campaign
              </Link>
            </nav>

            {/* Right Side Links */}
            <div className="ml-auto flex items-center space-x-6">
              <Link to="/track-order" className="hover:text-orange-light transition-colors">
                Track Order
              </Link>
              <Link to="/flash-deal" className="bg-orange px-4 py-2 rounded hover:bg-orange-dark transition-colors">
                Flash Deal
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 md:hidden bg-white"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <category.icon size={18} />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>

                {user && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
