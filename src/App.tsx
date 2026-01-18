import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { TermsModal } from './components/auth/TermsModal';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Payment Pages
import MockPayment from "./pages/MockPayment";
import { PaymentCallback } from "./pages/PaymentCallback";

// Public Pages
import { About } from './pages/About';

// User Pages
import { Dashboard } from './pages/user/Dashboard';
import { Browse } from './pages/user/Browse';
import { Orders } from './pages/user/Orders';
import { ProductDetail } from './pages/user/ProductDetail';
import { SellProduct } from './pages/user/SellProduct';
import { MyListings } from './pages/user/MyListings';
import { MySales } from './pages/user/MySales';
import { Account } from './pages/user/Account';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';

const AppContent: React.FC = () => {
  const { user, loading, acceptTerms } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    if (user && !user.hasAcceptedTerms) {
      setShowTermsModal(true);
    }
  }, [user]);

  const handleTermsAccept = async () => {
    try {
      await acceptTerms();
      setShowTermsModal(false);
    } catch (err) {
      console.error("Failed to accept terms", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
            />
            <Route path="/about" element={<About />} />

            {/* Payment Routes */}
            <Route path="/mock/pay/:reference" element={<MockPayment />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />

            {/* Public Browse Routes */}
            <Route path="/browse" element={<Browse />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sell/new"
              element={
                <ProtectedRoute>
                  <SellProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-sales"
              element={
                <ProtectedRoute>
                  <MySales />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={<Navigate to={user ? "/dashboard" : "/browse"} replace />}
            />
          </Routes>
        </main>
        <Footer />
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onAccept={handleTermsAccept}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
