// src/hooks/useUserPlants.ts
import { useApi } from '@/hooks/useApi';
import { UserPlant } from '@/types/global';

export function useUserPlants() {
  const { data, error, isLoading, get, post, put, delete: del } = 
    useApi<UserPlant[]>('/users/library/plants');

  const addPlant = async (plantData: {
    plantId: number;
    nickname?: string;
    roomId?: number;
    notes?: string;
  }) => {
    return await post(plantData);
  };

  const updatePlant = async (
    plantId: number,
    updates: Partial<Omit<UserPlant, 'id' | 'plantId'>>
  ) => {
    return await put(updates);
  };

  const deletePlant = async (plantId: number) => {
    return await del();
  };

  return {
    userPlants: data ?? [],
    isLoading,
    error,
    addPlant,
    updatePlant,
    deletePlant,
    refreshPlants: get,
  };
}