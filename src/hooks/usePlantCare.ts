// src/hooks/usePlantCare.ts
import { useApi } from '@/hooks/useApi';
import { WateringLog, FertilizingLog } from '@/types/api';

export function usePlantCare(plantId: number) {
  const wateringApi = useApi<WateringLog[]>(`/users/library/plants/${plantId}/watering`);
  const fertilizingApi = useApi<FertilizingLog[]>(`/users/library/plants/${plantId}/fertilizing`);

  const addWateringLog = async (log: Omit<WateringLog, 'id'>) => {
    return await wateringApi.post(log);
  };

  const addFertilizingLog = async (log: Omit<FertilizingLog, 'id'>) => {
    return await fertilizingApi.post(log);
  };

  return {
    wateringLogs: wateringApi.data ?? [],
    fertilizingLogs: fertilizingApi.data ?? [],
    isLoading: wateringApi.isLoading || fertilizingApi.isLoading,
    error: wateringApi.error || fertilizingApi.error,
    addWateringLog,
    addFertilizingLog,
    refreshLogs: async () => {
      await Promise.all([wateringApi.get(), fertilizingApi.get()]);
    },
  };
}