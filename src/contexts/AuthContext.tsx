import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, SignupData } from '../types';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  acceptTerms: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // initialize user from token
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: userData, token } = await authService.login(credentials);
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { user: userData, token } = await authService.signup(data);
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success('Signed up successfully');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out');
  };

  const acceptTerms = async () => {
    try {
      const updatedUser = await authService.acceptTerms();
      setUser(updatedUser); // <--- crucial
      toast.success('Terms accepted');
    } catch (error: any) {
      // if already accepted in backend, refresh user to sync
      if (error.response?.status === 400 && error.response?.data?.detail === 'Terms already accepted') {
        const refreshedUser = await authService.getCurrentUser();
        setUser(refreshedUser);
        toast.info('Terms already accepted');
      } else {
        toast.error(error.message || 'Failed to accept terms');
        throw error;
      }
    }
  };

  const value = { user, login, signup, logout, loading, acceptTerms };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
