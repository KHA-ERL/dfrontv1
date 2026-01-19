import api from './api';
import { mapProduct } from './mappers';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    deliveryFee: number;
    images: string[];
    condition: string;
    locationState: string;
    type: string;
    availableQuantity: number;
    outOfStock: boolean;
    seller: {
      id: number;
      fullName: string;
    };
  };
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryTotal: number;
  total: number;
  itemCount: number;
}

export const cartService = {
  async getCart(): Promise<Cart> {
    const resp = await api.get('/cart');
    return resp.data;
  },

  async getCartCount(): Promise<number> {
    const resp = await api.get('/cart/count');
    return resp.data.count;
  },

  async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
    const resp = await api.post('/cart/add', { productId, quantity });
    return resp.data;
  },

  async updateCartItem(productId: number, quantity: number): Promise<CartItem> {
    const resp = await api.put(`/cart/${productId}`, { quantity });
    return resp.data;
  },

  async removeFromCart(productId: number): Promise<{ success: boolean }> {
    const resp = await api.delete(`/cart/${productId}`);
    return resp.data;
  },

  async clearCart(): Promise<{ success: boolean }> {
    const resp = await api.delete('/cart');
    return resp.data;
  },
};
