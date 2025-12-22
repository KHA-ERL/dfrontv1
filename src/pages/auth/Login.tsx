import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingCart, Mail, Lock, ArrowRight, CheckCircle, TrendingUp, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    // Show info toast about backend being slow
    const infoToast = toast.info('Connecting to server... This may take up to 60 seconds if the backend is waking up.', {
      autoClose: false,
      closeButton: false,
    });

    try {
      await login(data);
      toast.dismiss(infoToast);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.dismiss(infoToast);

      // Better error messages
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error('Connection timed out. The server may be slow or unavailable. Please try again.', {
          autoClose: 10000,
        });
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 404) {
        toast.error('Account not found. Please sign up first.');
      } else if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network.');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Package,
      title: 'Wide Selection',
      description: 'Browse thousands of products from trusted sellers'
    },
    {
      icon: TrendingUp,
      title: 'Best Deals',
      description: 'Get the best prices and exclusive discounts'
    },
    {
      icon: CheckCircle,
      title: 'Secure Payments',
      description: 'Safe and secure payment processing'
    },
    {
      icon: Users,
      title: 'Trusted Community',
      description: 'Join thousands of satisfied buyers and sellers'
    }
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 py-12"
        >
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <ShoppingCart className="h-12 w-12 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <span className="text-2xl font-bold text-gray-900">Cribhub</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to continue shopping
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              fullWidth
              size="lg"
              className="flex items-center justify-center space-x-2 group"
            >
              <span>Sign In</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors group"
              >
                <span>Create a new account</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.form>
        </motion.div>
      </div>

      {/* Right Side - Hero/Marketing */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Your Marketplace for Everything
            </h1>
            <p className="text-xl text-primary-100 mb-12">
              Buy and sell with confidence. Join thousands of users in the most trusted e-commerce platform.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 hover:bg-opacity-20 transition-all"
                >
                  <feature.icon className="h-8 w-8 text-orange mb-3" />
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-primary-100">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div>
                <div className="text-4xl font-bold text-orange">10K+</div>
                <div className="text-sm text-primary-100 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange">50K+</div>
                <div className="text-sm text-primary-100 mt-1">Products Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange">98%</div>
                <div className="text-sm text-primary-100 mt-1">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
