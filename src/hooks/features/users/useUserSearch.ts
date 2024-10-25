// src/hooks/useUserSearch.ts
import { useApi } from '@/hooks/useApi';
import { User } from '@/types/global';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data, isLoading, error, get } = useApi<User[]>('/users/search');

  useEffect(() => {
    if (debouncedSearch) {
      get(`?query=${debouncedSearch}`);
    }
  }, [debouncedSearch]);

  return {
    users: data ?? [],
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
  };
}