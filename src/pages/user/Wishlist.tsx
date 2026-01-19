import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlist, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your wishlist.</p>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="py-20 flex justify-center">
          <LoadingSpinner />
        </Card>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">Save items you like to your wishlist.</p>
          <Button onClick={() => navigate('/browse')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = async (productId: number) => {
    const success = await addToCart(productId);
    if (success) {
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(productId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          <Heart className="inline-block mr-2 text-red-500" size={28} />
          My Wishlist ({wishlist.itemCount} items)
        </h1>
        {wishlist.items.length > 0 && (
          <Button variant="outline" onClick={() => clearWishlist()} className="text-red-600">
            <Trash2 size={16} />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <Link to={`/products/${item.productId}`}>
              <img
                src={(item.product.images as string[])?.[0] || '/placeholder-product.jpg'}
                alt={item.product.name}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link
                to={`/products/${item.productId}`}
                className="font-semibold hover:text-blue-600 line-clamp-2"
              >
                {item.product.name}
              </Link>

              {/* Condition Rating */}
              {item.product.conditionRating !== null && (
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{item.product.conditionRating}/10</span>
                </div>
              )}

              <div className="text-sm text-gray-500 mt-1">
                {item.product.locationState}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="text-blue-600 font-bold">
                    ₦{item.product.price.toLocaleString()}
                  </div>
                  {item.product.deliveryFee > 0 && (
                    <div className="text-xs text-gray-500">
                      +₦{item.product.deliveryFee.toLocaleString()} delivery
                    </div>
                  )}
                </div>

                {item.product.outOfStock && (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(item.productId)}
                  disabled={item.product.outOfStock || !item.product.active}
                  className="flex-1 bg-blue-600 text-white"
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </Button>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
