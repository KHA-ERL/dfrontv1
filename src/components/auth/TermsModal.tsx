import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null; // ✅ don't show if not open

  const handleAccept = async () => {
    if (!accepted) {
      toast.error('Please accept the terms and conditions to continue');
      return;
    }

    setLoading(true);
    try {
      await onAccept(); // ✅ calls backend + updates user in context
      toast.success('Welcome to Cribhub!');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />

      <div className="relative z-10 w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Terms and Conditions
        </h3>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto text-sm text-gray-700">
            <p>
              By using our platform, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc ml-5 space-y-2">
              <li><strong>User Responsibility:</strong> You are responsible for accurate product and personal information.</li>
              <li><strong>Payment Terms:</strong> Transactions must be through our secure payment system.</li>
              <li><strong>Product Quality:</strong> Sellers must provide accurate item details.</li>
              <li><strong>Delivery and Returns:</strong> Buyers have a 1-hour window after receipt to confirm satisfaction or complaints.</li>
              <li><strong>Privacy Policy:</strong> We protect your data and only share as required by law.</li>
              <li><strong>Dispute Resolution:</strong> Admin decisions are final after complaint review.</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="accept-terms"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="accept-terms" className="text-sm text-gray-700">
              I have read and accept the terms and conditions.
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAccept}
              disabled={!accepted}
              loading={loading}
              className="w-full sm:w-auto"
            >
              Accept and Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
