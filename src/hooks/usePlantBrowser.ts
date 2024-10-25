// src/hooks/usePlantBrowser.ts
import { useApi } from '@/hooks/useApi';
import { Plant, PaginatedResponse } from '@/types/global';
import { useState } from 'react';

interface PlantFilters {
  petSafe?: boolean;
  light?: string;
  difficulty?: string;
  type?: string;
  search?: string;
}

export function usePlantBrowser() {
  const [filters, setFilters] = useState<PlantFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, error, get } = useApi<PaginatedResponse<Plant>>('/plants');

  const fetchPlants = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters,
    });
    await get(`?${params.toString()}`);
  };

  return {
    plants: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    fetchPlants,
  };
}
