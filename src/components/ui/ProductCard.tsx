import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  showWishlist?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showWishlist = true }) => {
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  // Get the first image or use placeholder
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';

  // Map condition to display label
  const getConditionLabel = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'new': return 'Pristine';
      case 'used': return 'Pre-owned';
      case 'refurbished': return 'Refurbished';
      default: return condition;
    }
  };

  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.condition && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.condition.toLowerCase() === 'new'
                  ? 'bg-green-500 text-white'
                  : product.condition.toLowerCase() === 'refurbished'
                  ? 'bg-blue-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}>
                {getConditionLabel(product.condition)}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Heart
                size={18}
                className={`transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Condition Rating */}
          {product.conditionRating !== null && product.conditionRating !== undefined && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{product.conditionRating}/10</span>
              </div>
              <span className="text-xs text-gray-500">condition</span>
            </div>
          )}

          {/* Location */}
          {product.locationState && (
            <div className="flex items-center gap-1 text-gray-500 mb-3">
              <MapPin size={14} />
              <span className="text-xs">{product.locationState}</span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <div className="text-xl font-bold text-primary-600">
                ₦{product.price.toLocaleString()}
              </div>
              {(product.deliveryFee ?? 0) > 0 && (
                <div className="text-xs text-gray-500">
                  +₦{(product.deliveryFee ?? 0).toLocaleString()} delivery
                </div>
              )}
            </div>

            <div className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-semibold group-hover:bg-primary-600 group-hover:text-white transition-colors">
              View
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
