import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = React.useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please log in</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your cart.</p>
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Start shopping to add items to your cart.</p>
          <Button onClick={() => navigate('/browse')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  const handleCheckout = async (productId: number) => {
    setCheckingOut(true);
    try {
      toast.info("Initiating payment...");
      const res = await productService.purchaseProduct(String(productId));

      if (res.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = res.authorization_url;
      } else if (res.success && res.orderId) {
        toast.success("Order created successfully!");
        navigate(`/orders`);
      } else {
        toast.warning("Payment initiated. Check your orders page.");
        navigate(`/orders`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.detail || "Failed to initiate payment";
      toast.error(errorMessage);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart ({cart.itemCount} items)</h1>
        <Button variant="outline" onClick={() => clearCart()} className="text-red-600">
          <Trash2 size={16} />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <Link to={`/products/${item.productId}`}>
                  <img
                    src={(item.product.images as string[])?.[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${item.productId}`} className="font-semibold hover:text-blue-600">
                    {item.product.name}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.product.type === 'Online Store' ? 'Online Store' : 'Declutter'}
                    {item.product.locationState && ` • ${item.product.locationState}`}
                  </div>
                  <div className="text-blue-600 font-semibold mt-1">
                    ₦{item.product.price.toLocaleString()}
                  </div>
                  {item.product.deliveryFee > 0 && (
                    <div className="text-xs text-gray-500">
                      +₦{item.product.deliveryFee.toLocaleString()} delivery
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    {/* Quantity controls for Online Store items */}
                    {item.product.type === 'Online Store' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 rounded-full border hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 rounded-full border hover:bg-gray-100"
                          disabled={item.quantity >= item.product.availableQuantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Qty: 1</span>
                    )}

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Buy Now for individual item */}
                <div className="flex flex-col justify-between items-end">
                  <div className="text-right font-semibold">
                    ₦{((item.product.price + item.product.deliveryFee) * item.quantity).toLocaleString()}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCheckout(item.productId)}
                    disabled={checkingOut || item.product.outOfStock}
                    className="bg-blue-600 text-white"
                  >
                    Buy Now
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span>₦{cart.deliveryTotal.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-blue-600">₦{cart.total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              * Each item requires a separate payment. Click "Buy Now" on individual items to purchase.
            </p>

            <Button
              onClick={() => navigate('/browse')}
              variant="outline"
              className="w-full mt-4"
            >
              Continue Shopping
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
