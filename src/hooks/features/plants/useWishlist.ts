// useWishlist.ts
import { useApi, useToast } from '@/hooks';
import { WishlistItemResponse } from '@/types';
import { 
  getWishlist,
  addToWishlist as addToWishlistApi,
  removeFromWishlist as removeFromWishlistApi
} from '@/lib/api';

export function useWishlist() {
  const { data, error, isLoading, get } = useApi<WishlistItemResponse[]>('/users/wishlist');
  const toast = useToast();

  const addToWishlist = async (plantData: { 
    plantName: string;
    notes?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }) => {
    try {
      await addToWishlistApi(plantData.plantName);
      toast.success('Added to wishlist successfully');
      await getWishlist();
    } catch (err) {
      toast.error('Failed to add to wishlist');
      throw err;
    }
  };

  const removeFromWishlist = async (itemId: number) => {
    try {
      await removeFromWishlistApi(itemId);
      toast.success('Removed from wishlist');
      await getWishlist();
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
    refresh: getWishlist,
  };
}