// useArticles.ts
import { useApi } from '@/hooks';
import { Article, PaginatedResponse, PaginationParams } from '@/types';
import { getAllArticles } from '@/lib/api';

export function useArticles(params?: PaginationParams) {
  const { data, error, isLoading, get } = 
    useApi<PaginatedResponse<Article>>('/articles');
  
  const fetchArticles = async () => {
    if (params) {
      return await getAllArticles(params);
    }
    return await get();
  };

  return {
    articles: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    fetchArticles,
  };
}
