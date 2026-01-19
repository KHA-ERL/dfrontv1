import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService, Wishlist } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface WishlistContextType {
  wishlist: Wishlist | null;
  loading: boolean;
  wishlistCount: number;
  wishlistIds: Set<number>;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<boolean>;
  clearWishlist: () => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist(null);
      setWishlistCount(0);
      setWishlistIds(new Set());
      return;
    }

    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
      setWishlistCount(data.itemCount);
      setWishlistIds(new Set(data.items.map(item => item.productId)));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: number): boolean => {
    return wishlistIds.has(productId);
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!user) {
      toast.warning('Please log in to save items');
      return false;
    }

    try {
      const result = await wishlistService.toggleWishlist(productId);

      // Update local state immediately for better UX
      setWishlistIds(prev => {
        const newSet = new Set(prev);
        if (result.isWishlisted) {
          newSet.add(productId);
          toast.success('Added to wishlist!');
        } else {
          newSet.delete(productId);
          toast.success('Removed from wishlist');
        }
        return newSet;
      });

      // Refresh full wishlist in background
      refreshWishlist();
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.detail || 'Failed to update wishlist';
      toast.error(message);
      return false;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    try {
      await wishlistService.removeFromWishlist(productId);
      toast.success('Removed from wishlist');
      await refreshWishlist();
      return true;
    } catch (err: any) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const clearWishlist = async (): Promise<boolean> => {
    try {
      await wishlistService.clearWishlist();
      toast.success('Wishlist cleared');
      await refreshWishlist();
      return true;
    } catch (err: any) {
      toast.error('Failed to clear wishlist');
      return false;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount,
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
