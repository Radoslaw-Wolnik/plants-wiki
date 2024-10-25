// useAdminUsers.ts
import { useApi } from '@/hooks';
import { AdminUser, UserFilters } from '@/types';
import { useState } from 'react';

export function useAdminUsers() {
  const [filters, setFilters] = useState<UserFilters>({});
  const { data, isLoading, error, get } = useApi<AdminUser[]>('/admin/users');

  const fetchUsers = async () => {
    await get(filters);
  };

  return {
    users: data ?? [],
    isLoading,
    error,
    filters,
    setFilters,
    fetchUsers,
  };
}