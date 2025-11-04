import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  whatsapp: z.string().min(11, 'Please enter a valid WhatsApp number'),
  houseAddress: z.string().min(10, 'Please enter your complete house address'),
  substituteAddress: z.string().min(10, 'Please enter a substitute address'),
  bankAccount: z.string().min(10, 'Please enter a valid bank account number'),
  bankName: z.string().min(2, 'Please enter your bank name'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signup(data);
      navigate('/dashboard');
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="flex justify-center items-center space-x-2">
            <ShoppingBag className="h-12 w-12 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Declutter</span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
            </div>
            
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              {...register('password')}
              error={errors.password?.message}
              helperText="Must contain uppercase, lowercase, and number"
            />
            
            <Input
              label="WhatsApp Number"
              placeholder="+1234567890"
              {...register('whatsapp')}
              error={errors.whatsapp?.message}
            />
            
            <Input
              label="Bank Name"
              placeholder="Enter your bank name"
              {...register('bankName')}
              error={errors.bankName?.message}
            />
            
            <div className="md:col-span-2">
              <Input
                label="House Address"
                placeholder="Enter your complete house address"
                {...register('houseAddress')}
                error={errors.houseAddress?.message}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Substitute Address"
                placeholder="Enter an alternative address"
                {...register('substituteAddress')}
                error={errors.substituteAddress?.message}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Bank Account Number"
                placeholder="Enter your bank account number"
                {...register('bankAccount')}
                error={errors.bankAccount?.message}
              />
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Create Account
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
};