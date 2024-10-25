// src/hooks/useAdminUsers.ts
import { useApi } from '@/hooks';
import { User, AdminUser, QueryParams } from '@/types';
import { useState } from 'react';

interface UserFilters extends QueryParams {
  role?: string;
  status?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

export function useAdminUsers() {
  const [filters, setFilters] = useState<UserFilters>({});
  const { data, isLoading, error, get } = useApi<AdminUser[]>('/admin/users');

  const fetchUsers = async () => {
    // Now this is type-safe
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