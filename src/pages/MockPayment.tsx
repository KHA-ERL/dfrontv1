// frontend/src/pages/MockPayment.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const MockPayment: React.FC = () => {
  const { reference } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!reference) return;

    const verifyPayment = async () => {
      try {
        // ✅ Call backend /payments/verify/{reference}
        const { data } = await api.get(`/payments/verify/${reference}`);

        if (data?.ok) {
          toast.success("Payment successful and verified!");
        } else {
          toast.error("Payment not verified");
        }

        navigate("/orders");
      } catch (err) {
        console.error("Payment verification failed:", err);
        toast.error("Payment verification failed. Please contact support.");
        navigate("/orders");
      }
    };

    // Simulate short delay before verifying
    const timer = setTimeout(() => {
      verifyPayment();
    }, 2000);

    return () => clearTimeout(timer);
  }, [reference, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-bold">Processing Mock Payment...</h2>
        <p>Please wait while we verify your transaction.</p>
      </div>
    </div>
  );
};

export default MockPayment;
