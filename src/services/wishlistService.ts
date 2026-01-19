import api from './api';

export interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: number;
    deliveryFee: number;
    images: string[];
    condition: string;
    conditionRating: number | null;
    locationState: string;
    type: string;
    quantity: number;
    outOfStock: boolean;
    active: boolean;
    seller: {
      id: number;
      fullName: string;
    };
  };
  createdAt: string;
}

export interface Wishlist {
  items: WishlistItem[];
  itemCount: number;
}

export const wishlistService = {
  async getWishlist(): Promise<Wishlist> {
    const resp = await api.get('/wishlist');
    return resp.data;
  },

  async getWishlistCount(): Promise<number> {
    const resp = await api.get('/wishlist/count');
    return resp.data.count;
  },

  async isInWishlist(productId: number): Promise<boolean> {
    const resp = await api.get(`/wishlist/check/${productId}`);
    return resp.data.isWishlisted;
  },

  async addToWishlist(productId: number): Promise<{ success: boolean; isWishlisted: boolean }> {
    const resp = await api.post(`/wishlist/add/${productId}`);
    return { success: resp.data.success, isWishlisted: true };
  },

  async toggleWishlist(productId: number): Promise<{ success: boolean; isWishlisted: boolean }> {
    const resp = await api.post(`/wishlist/toggle/${productId}`);
    return resp.data;
  },

  async removeFromWishlist(productId: number): Promise<{ success: boolean }> {
    const resp = await api.delete(`/wishlist/${productId}`);
    return resp.data;
  },

  async clearWishlist(): Promise<{ success: boolean }> {
    const resp = await api.delete('/wishlist');
    return resp.data;
  },
};
