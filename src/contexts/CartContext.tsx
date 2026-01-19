import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, Cart, CartItem } from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  cartCount: number;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setCartCount(cartData.itemCount);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1): Promise<boolean> => {
    if (!user) {
      toast.warning('Please log in to add items to cart');
      return false;
    }

    try {
      await cartService.addToCart(productId, quantity);
      toast.success('Added to cart!');
      await refreshCart();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.detail || 'Failed to add to cart';
      toast.error(message);
      return false;
    }
  };

  const updateQuantity = async (productId: number, quantity: number): Promise<boolean> => {
    try {
      await cartService.updateCartItem(productId, quantity);
      await refreshCart();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.detail || 'Failed to update quantity';
      toast.error(message);
      return false;
    }
  };

  const removeFromCart = async (productId: number): Promise<boolean> => {
    try {
      await cartService.removeFromCart(productId);
      toast.success('Removed from cart');
      await refreshCart();
      return true;
    } catch (err: any) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      await cartService.clearCart();
      toast.success('Cart cleared');
      await refreshCart();
      return true;
    } catch (err: any) {
      toast.error('Failed to clear cart');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
