// src/hooks/useWishlist.ts
import { useApi } from '@/hooks/useApi';
import { WishlistItem } from '@/types/global';
import { useToast } from '@/hooks/useToast';

export function useWishlist() {
  const { data, error, isLoading, get, post, delete: del } = 
    useApi<WishlistItem[]>('/users/wishlist');
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