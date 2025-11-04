import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../utils/validation';
import type { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { X } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

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
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <img src={lightbox} alt="preview" className="max-h-[90vh] rounded-lg" />
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
            <Button
              onClick={async () => {
                try {
                  const res = await productService.purchaseProduct(String(product.id));

                  if (res.authorization_url) {
                    
                    window.location.href = res.authorization_url;
                  } else if (res.success && res.orderId) {
                    
                    navigate(`/orders/${res.orderId}`);
                  } else {
                    
                    navigate(`/orders`);
                  }
                } catch (err) {
                  console.error("Purchase failed:", err);
                  alert("Something went wrong while initiating purchase.");
                }
              }}
              className="bg-blue-600 text-white"
            >
              Buy Now
            </Button>

          </div>
        </div>
      </div>

      {/* Seller Info */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
        <div className="flex items-center space-x-3">
          <img
            src={'/default-avatar.png'}
            alt={product.seller?.full_name || 'Seller'}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="font-medium">
              {product.seller?.full_name || 'Unknown Seller'}
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
