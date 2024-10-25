// src/hooks/usePlantDetails.ts
import { useApi, useToast } from '@/hooks';
import { Plant, CareTip } from '@/types';

export function usePlantDetails(plantId: number) {
  const { data: plant, isLoading, error, get: refreshPlant } = 
    useApi<Plant>(`/plants/${plantId}`);
  const { data: careTips } = useApi<CareTip[]>(`/plants/${plantId}/care-tips`);
  const toast = useToast();

  const addCareTip = async (content: string) => {
    try {
      await fetch(`/api/plants/${plantId}/care-tips`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      toast.success('Care tip added successfully');
      await refreshPlant();
    } catch (err) {
      toast.error('Failed to add care tip');
      throw err;
    }
  };

  return {
    plant,
    careTips: careTips ?? [],
    isLoading,
    error,
    addCareTip,
    refreshPlant,
  };
}