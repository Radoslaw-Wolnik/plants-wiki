// useGraveyard.ts
import { useApi, useToast } from '@/hooks';
import { GraveyardItemResponse } from '@/types';
import { 
  getGraveyard,
  addToGraveyard as addToGraveyardApi,
  removeFromGraveyard as removeFromGraveyardApi
} from '@/lib/api';

export function useGraveyard() {
  const { data, error, isLoading, get } = useApi<GraveyardItemResponse[]>('/users/graveyard');
  const toast = useToast();

  const addToGraveyard = async (graveyardData: {
    plantName: string;
    startDate: string;
    endDate: string;
  }) => {
    try {
      await addToGraveyardApi(graveyardData);
      toast.success('Plant added to graveyard');
      await getGraveyard();
    } catch (err) {
      toast.error('Failed to add plant to graveyard');
      throw err;
    }
  };

  const removeFromGraveyard = async (itemId: number) => {
    try {
      await removeFromGraveyardApi(itemId);
      toast.success('Entry removed from graveyard');
      await getGraveyard();
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
    refresh: getGraveyard,
  };
}