// src/lib/api/services/search.ts
import { apiClient } from '../client';
import { Plant, Article, User } from '@/types';

interface SearchResults {
  plants: Plant[];
  articles: Article[];
  users: User[];
}

export async function globalSearch(query: string, type: 'ALL' | 'PLANTS' | 'ARTICLES' | 'USERS' = 'ALL') {
  const { data } = await apiClient.get<SearchResults>('/search', {
    params: { query, type },
  });
  return data;
}