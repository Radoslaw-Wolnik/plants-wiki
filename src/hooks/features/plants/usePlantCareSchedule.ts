// usePlantCareSchedule.ts
import { useApi, useToast } from '@/hooks';
import { CareSchedule } from '@/types';
import { updateUserPlant } from '@/lib/api';

export function usePlantCareSchedule(plantId: number) {
  const { data, error, isLoading, get, put } = 
    useApi<CareSchedule>(`/users/library/plants/${plantId}/schedule`);
  const toast = useToast();

  const updateSchedule = async (updates: Partial<Omit<CareSchedule, 'plantId'>>) => {
    try {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      await updateUserPlant(plantId, formData);
      toast.success('Care schedule updated successfully');
      await get();
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