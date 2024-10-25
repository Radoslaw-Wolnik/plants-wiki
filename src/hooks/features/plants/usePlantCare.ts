// usePlantCare.ts
import { useApi } from '@/hooks';
import { WateringLog, FertilizingLog } from '@/types';
import { 
  addWateringLog as addWateringLogApi,
  addFertilizingLog as addFertilizingLogApi 
} from '@/lib/api';

interface WateringLogInput {
  id?: number; // Add the id property
  userPlantId: number;
  date: Date;
  amount: number | null;
  notes: string | null;
}

interface FertilizingLogInput {
  id?: number; // Add the id property
  userPlantId: number;
  date: Date;
  amount: number | null;
  notes: string | null;
  fertilizer: string;
}


export function usePlantCare(plantId: number) {
  const wateringApi = useApi<WateringLog[]>(`/users/library/plants/${plantId}/watering`);
  const fertilizingApi = useApi<FertilizingLog[]>(`/users/library/plants/${plantId}/fertilizing`);

  const addWateringLog = async (log: Omit<WateringLogInput, 'userPlantId'>) => {
    return await addWateringLogApi(plantId, {
      id: log.id ?? 0, // Default or use passed id
      ...log,
      userPlantId: plantId
    });
  };
  
  const addFertilizingLog = async (log: Omit<FertilizingLogInput, 'userPlantId'>) => {
    return await addFertilizingLogApi(plantId, {
      id: log.id ?? 0, // Default or use passed id
      ...log,
      userPlantId: plantId
    });
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
