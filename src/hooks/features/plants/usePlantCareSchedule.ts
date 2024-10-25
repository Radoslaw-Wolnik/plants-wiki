// src/hooks/usePlantCareSchedule.ts
import { useApi, useToast } from '@/hooks';

interface CareSchedule {
  plantId: number;
  wateringInterval: number;
  fertilizingInterval: number;
  lastWatered?: string;
  lastFertilized?: string;
  nextWatering?: string;
  nextFertilizing?: string;
}

export function usePlantCareSchedule(plantId: number) {
  const { data, error, isLoading, get, put } = 
    useApi<CareSchedule>(`/users/plants/${plantId}/schedule`);
  const toast = useToast();

  const updateSchedule = async (updates: Partial<CareSchedule>) => {
    try {
      await put(updates);
      toast.success('Care schedule updated successfully');
    } catch (err) {
      toast.error('Failed to update care schedule');
      throw err;
    }
  };

  return {
    schedule: data,
    updateSchedule,
    isLoading,
    error,
    refresh: get,
  };
}
