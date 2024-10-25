// src/hooks/features/users/useUserSearch.ts
import { useApi } from '@/hooks/api/useApi';
import { useDebounce } from '@/hooks/utils/useDebounce';
import { User, QueryParams, UserProfileResponse } from '@/types';
import { useState, useEffect } from 'react';

interface SearchFilters extends QueryParams {
  query?: string;
  [key: string]: string | number | boolean | undefined;
}

export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data, isLoading, error, get } = useApi<UserProfileResponse[]>('/users/search');

  useEffect(() => {
    if (debouncedSearch) {
      // Now using the proper query params object
      get({ query: debouncedSearch });
    }
  }, [debouncedSearch, get]);

  return {
    users: data ?? [],
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
  };
}