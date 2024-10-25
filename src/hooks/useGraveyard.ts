// src/hooks/useGraveyard.ts
import { useApi } from '@/hooks/useApi';
import { GraveyardItem } from '@/types/global';
import { useToast } from '@/hooks/useToast';

export function useGraveyard() {
  const { data, error, isLoading, get, post, delete: del } = 
    useApi<GraveyardItem[]>('/users/graveyard');
  const toast = useToast();

  const addToGraveyard = async (plantData: {
    plantName: string;
    startDate: string;
    endDate: string;
    cause?: string;
    notes?: string;
  }) => {
    try {
      await post(plantData);
      toast.success('Plant added to graveyard');
      await get();
    } catch (err) {
      toast.error('Failed to add plant to graveyard');
      throw err;
    }
  };

  const removeFromGraveyard = async (itemId: number) => {
    try {
      await del();
      toast.success('Entry removed from graveyard');
      await get();
    } catch (err) {
      toast.error('Failed to remove entry');
      throw err;
    }
  };

  return {
    graveyardItems: data ?? [],
    addToGraveyard,
    removeFromGraveyard,
    isLoading,
    error,
    refresh: get,
  };
}