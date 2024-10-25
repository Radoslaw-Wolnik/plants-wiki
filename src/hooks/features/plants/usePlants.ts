// src/hooks/usePlants.ts
import { useApi } from '@/hooks';
import { PaginatedResponse, Plant } from '@/types';

interface UsePlantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function usePlants(params: UsePlantsParams = {}) {
  const { data, error, isLoading, get } = useApi<PaginatedResponse<Plant>>('/plants');

  const fetchPlants = async () => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    await get();
  };

  return {
    plants: data?.data ?? [],
    totalPages: data?.pagination.totalPages ?? 0,
    isLoading,
    error,
    fetchPlants,
  };
}

