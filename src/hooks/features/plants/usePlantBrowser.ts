// usePlantBrowser.ts
import { useApi } from '@/hooks';
import { Plant, PaginatedResponse, PlantFilters } from '@/types';
import { getAllPlants } from '@/lib/api';
import { useState } from 'react';

export function usePlantBrowser() {
  const [filters, setFilters] = useState<PlantFilters>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, error, get } = useApi<PaginatedResponse<Plant>>('/plants');

  const fetchPlants = async () => {
    await getAllPlants({ ...filters, page });
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