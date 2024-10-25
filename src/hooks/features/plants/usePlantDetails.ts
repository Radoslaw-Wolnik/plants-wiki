// usePlantDetails.ts
import { useApi, useToast } from '@/hooks';
import { Plant, CareTip } from '@/types';
import { getPlantById, getPlantCareTips, createCareTip } from '@/lib/api';

export function usePlantDetails(plantId: number) {
  const { data: plant, isLoading, error, get: refreshPlant } = 
    useApi<Plant>(`/plants/${plantId}`);
  const { data: careTips } = useApi<CareTip[]>(`/plants/${plantId}/care-tips`);
  const toast = useToast();

  const addCareTip = async (tipData: { title: string; content: string; }) => {
    try {
      await createCareTip(plantId, tipData);
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