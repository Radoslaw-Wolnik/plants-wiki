// src/hooks/useAdminUsers.ts
import { useApi } from '@/hooks';
import { User } from '@/types';
import { useState } from 'react';

interface UserWithStats extends User {
  stats: {
    plants: number;
    articles: number;
    reports: number;
  };
}

export function useAdminUsers() {
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });

  const { data, isLoading, error, get } = 
    useApi<UserWithStats[]>('/admin/users');

  const fetchUsers = async () => {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    await get(`?${params.toString()}`);
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