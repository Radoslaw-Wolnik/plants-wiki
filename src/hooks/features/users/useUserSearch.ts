// useUserSearch.ts
import { useApi } from '@/hooks/api/useApi';
import { useDebounce } from '@/hooks/utils/useDebounce';
import { UserProfileResponse, UserFilters } from '@/types';
import { searchUsers } from '@/lib/api';
import { useState, useEffect } from 'react';

export function useUserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data, isLoading, error, get } = useApi<UserProfileResponse[]>('/users/search');

  useEffect(() => {
    if (debouncedSearch) {
      searchUsers(debouncedSearch);
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