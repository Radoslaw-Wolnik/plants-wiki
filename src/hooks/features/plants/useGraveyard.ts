// src/hooks/useGraveyard.ts
import { useApi, useToast } from '@/hooks';
import { GraveyardPlant } from '@/types';

export function useGraveyard() {
  const { data, error, isLoading, get, post, delete: del } = 
    useApi<GraveyardPlant[]>('/users/graveyard');
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