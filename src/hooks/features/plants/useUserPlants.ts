// useUserPlants.ts
import { useApi } from '@/hooks';
import { UserPlant } from '@/types';
import { 
  createUserPlant,
  updateUserPlant as updateUserPlantApi,
  getUserPlantById,
  moveUserPlantToRoom,
  addPlantToGraveyard
} from '@/lib/api';

interface UserPlantInput {
  plantId: number;
  nickname?: string;
  roomId?: number;
  notes?: string;
}

export function useUserPlants() {
  const { data, error, isLoading, get } = useApi<UserPlant[]>('/users/library/plants');

  const addPlant = async (plantData: UserPlantInput) => {
    return await createUserPlant(plantData); // Pass plantData directly
  };

  const updatePlant = async (
    plantId: number,
    updates: Partial<Omit<UserPlant, 'id' | 'plantId'>>
  ) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {  // Check for both undefined and null
        formData.append(key, value.toString());
      }
    });
    return await updateUserPlantApi(plantId, formData);
  };
  

  return {
    userPlants: data ?? [],
    isLoading,
    error,
    addPlant,
    updatePlant,
    refreshPlants: get,
  };
}