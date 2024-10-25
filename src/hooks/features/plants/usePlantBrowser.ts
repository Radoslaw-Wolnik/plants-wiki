// src/hooks/usePlantBrowser.ts
import { useApi } from '@/hooks';
import { Plant, PaginatedResponse, PlantFilters } from '@/types';
import { useState } from 'react';

export function usePlantBrowser() {
  const [filters, setFilters] = useState<PlantFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, error, get } = useApi<PaginatedResponse<Plant>>('/plants');

  const fetchPlants = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(filters.petSafe ? { petSafe: filters.petSafe.toString() } : {}),
      ...(filters.light ? { light: filters.light } : {}),
      ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.search ? { search: filters.search } : {})
    });
    await get(filters);
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
