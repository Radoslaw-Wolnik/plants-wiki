// src/hooks/useWishlist.ts
import { useApi, useToast } from '@/hooks';
import { WishlistPlant } from '@/types';

export function useWishlist() {
  const { data, error, isLoading, get, post, delete: del } = 
    useApi<WishlistPlant[]>('/users/wishlist');
  const toast = useToast();

  const addToWishlist = async (plantData: { 
    plantName: string;
    notes?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) => {
    try {
      await post(plantData);
      toast.success('Added to wishlist successfully');
      await get();
    } catch (err) {
      toast.error('Failed to add to wishlist');
      throw err;
    }
  };

  const removeFromWishlist = async (itemId: number) => {
    try {
      await del();
      toast.success('Removed from wishlist');
      await get();
    } catch (err) {
      toast.error('Failed to remove from wishlist');
      throw err;
    }
  };

  return {
    wishlistItems: data ?? [],
    addToWishlist,
    removeFromWishlist,
    isLoading,
    error,
    refresh: get,
  };
}