import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../services/api';

type PaymentStatus = 'verifying' | 'success' | 'failed' | 'error';

export const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderId, setOrderId] = useState<string | null>(null);

  const reference = searchParams.get('reference') || searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Please contact support.');
        return;
      }

      try {
        // Call backend to verify payment
        const response = await api.get(`/payments/verify/${reference}`);
        const data = response.data;

        if (data.status === 'success' || data.verified || data.order?.status === 'PAID') {
          setStatus('success');
          setMessage('Payment successful! Your order has been placed.');
          setOrderId(data.orderId || data.order?.id);
          toast.success('Payment verified successfully!');
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment verification failed. Please try again or contact support.');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);

        // Check if it's already paid (might get 400 if already verified)
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already')) {
          setStatus('success');
          setMessage('Payment already verified. Redirecting to your orders...');
          setTimeout(() => navigate('/orders'), 2000);
          return;
        }

        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          'Unable to verify payment. Please check your orders page or contact support.'
        );
      }
    };

    verifyPayment();
  }, [reference, navigate]);

  const getIcon = () => {
    switch (status) {
      case 'verifying':
        return <LoadingSpinner size="lg" />;
      case 'success':
        return <CheckCircle className="w-20 h-20 text-green-500" />;
      case 'failed':
        return <XCircle className="w-20 h-20 text-red-500" />;
      case 'error':
        return <AlertCircle className="w-20 h-20 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'error':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'verifying' && 'Verifying Payment'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
          {status === 'error' && 'Verification Error'}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {reference && (
          <p className="text-sm text-gray-500 mb-6">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        <div className="space-y-3">
          {status === 'success' && (
            <>
              {orderId ? (
                <Button
                  onClick={() => navigate(`/orders`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  View My Order
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/orders')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  View My Orders
                </Button>
              )}
            </>
          )}

          {(status === 'failed' || status === 'error') && (
            <>
              <Button
                onClick={() => navigate('/orders')}
                className="w-full"
              >
                Check My Orders
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/browse')}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </>
          )}

          {status === 'verifying' && (
            <p className="text-sm text-gray-500">
              Please wait while we confirm your payment...
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentCallback;
