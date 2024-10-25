// usePlants.ts
import { useApi } from '@/hooks';
import { Plant, PaginatedResponse, PaginationParams } from '@/types';
import { getAllPlants, getPlantById } from '@/lib/api';

export function usePlants(params?: PaginationParams) {
  const { data, error, isLoading, get } = 
    useApi<PaginatedResponse<Plant>>('/plants');

  const fetchPlants = async () => {
    return await getAllPlants(params || {});
  };

  const fetchPlant = async (id: number) => {
    return await getPlantById(id);
  };

  return {
    plants: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    fetchPlants,
    fetchPlant,
  };
}