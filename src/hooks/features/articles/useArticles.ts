// src/hooks/useArticles.ts
import { useApi, useToast } from '@/hooks';
import { Article, PaginatedResponse } from '@/types';

export function useArticles(params?: { 
  page?: number; 
  limit?: number; 
  search?: string;
}) {
  const { data, error, isLoading, get } = 
    useApi<PaginatedResponse<Article>>('/articles');
  
  const fetchArticles = () => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    return get();
  };

  return {
    articles: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    fetchArticles,
  };
}