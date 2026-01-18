import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/validation';
import type { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Check if current user is the seller of this product
  const isOwnProduct = user && product && (
    String(product.sellerId) === String(user.id) ||
    String(product.seller?.id) === String(user.id)
  );

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const p = await productService.getProduct(id);
        setProduct(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Card className="py-20 flex justify-center">
        <LoadingSpinner />
      </Card>
    );
  }

  if (!product) {
    return <Card className="p-8 text-center">Product not found</Card>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-500"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt="preview"
            className="max-h-[90vh] rounded-lg transition-transform duration-500 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Media */}
        <div>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg cursor-pointer"
            onClick={() => setLightbox(product.images?.[0] ?? null)}
          />

          {/* Thumbnails */}
          <div className="mt-3 flex space-x-2 overflow-x-auto">
            {product.images?.slice(1).map((u, i) => (
              <img
                key={i}
                src={u}
                alt={`thumb-${i}`}
                className="w-20 h-20 object-cover rounded-md cursor-pointer"
                onClick={() => setLightbox(u)}
              />
            ))}
          </div>

          {/* Videos */}
          {product.videos && product.videos.length > 0 && (
            <div className="mt-4 space-y-2">
              {product.videos.map((vid, i) => (
                <video key={i} controls className="w-full rounded-lg">
                  <source src={vid} type="video/mp4" />
                  Your browser does not support video.
                </video>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="text-xl text-blue-600 mt-2">
            {formatCurrency(product.price)}
          </div>

          {product.type === 'Online Store' && (
            <div className="text-sm text-gray-700 mt-1">
              Available Quantity: {product.quantity}
            </div>
          )}

          <div className="text-sm text-gray-600 mt-2">
            {product.condition} • {product.location_state}
          </div>

          <div className="mt-6 text-gray-700 whitespace-pre-line">
            {product.description}
          </div>

          <div className="mt-6 space-x-2">
            <Button onClick={() => navigate(-1)}>Back</Button>
            {isOwnProduct ? (
              <span className="inline-block px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
                Your Product
              </span>
            ) : (
              <Button
                onClick={async () => {
                  // Check if user is logged in
                  if (!user) {
                    toast.warning("Please log in to make a purchase");
                    navigate('/login', { state: { from: { pathname: `/products/${product.id}` } } });
                    return;
                  }

                  try {
                    toast.info("Initiating payment...");
                    const res = await productService.purchaseProduct(String(product.id));

                    console.log("Payment initialization response:", res);

                    if (res.authorization_url) {
                      // Redirect to payment gateway
                      toast.success("Redirecting to payment gateway...");
                      window.location.href = res.authorization_url;
                    } else if (res.success && res.orderId) {
                      // Direct order creation (no payment gateway)
                      toast.success("Order created successfully!");
                      navigate(`/orders/${res.orderId}`);
                    } else {
                      // Fallback: go to orders page
                      toast.warning("Payment initiated. Check your orders page.");
                      navigate(`/orders`);
                    }
                  } catch (err: any) {
                    console.error("Purchase failed:", err);
                    console.error("Error response:", err.response?.data);

                    // Extract error message from various possible formats
                    let errorMessage = err.response?.data?.detail ||
                                       err.response?.data?.error ||
                                       (typeof err.response?.data === 'string' ? err.response.data : null) ||
                                       err.message ||
                                       "Something went wrong while initiating purchase. Please try again.";

                    // Handle array of messages
                    if (Array.isArray(err.response?.data?.message)) {
                      errorMessage = err.response.data.message.join('. ');
                    } else if (err.response?.data?.message) {
                      errorMessage = err.response.data.message;
                    }

                    toast.error(errorMessage, { autoClose: 8000 });
                  }
                }}
                className="bg-blue-600 text-white"
              >
                Buy Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
        <div className="flex items-center space-x-3">
          <img
            src={'/default-avatar.png'}
            alt={product.seller?.fullName || 'Seller'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">
              {product.seller?.fullName || 'Unknown Seller'}
            </div>
            <div className="text-sm text-gray-500">{product.seller?.email}</div>
            {product.seller?.whatsapp && (
              <div className="text-sm text-green-600">
                WhatsApp: {product.seller.whatsapp}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
