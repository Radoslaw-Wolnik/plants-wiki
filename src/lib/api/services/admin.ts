// src/lib/api/services/admin.ts
import { apiClient } from '../client';
interface SiteStatistics {
    totalUsers: number;
    activeUsers: number;
    totalPlants: number;
    totalArticles: number;
    totalComments: number;
    flaggedContent: number;
    topContributors: Array<{
      id: number;
      username: string;
      contributions: number;
    }>;
  }
  
  export const admin = {
    getStatistics: async () => {
      const { data } = await apiClient.get<SiteStatistics>('/admin/statistics');
      return data;
    },
  
    banUser: async (userId: number, banDuration: number) => {
      const { data } = await apiClient.post(`/admin/users/${userId}/ban`, { banDuration });
      return data;
    },
  
    unbanUser: async (userId: number) => {
      const { data } = await apiClient.post(`/admin/users/${userId}/unban`);
      return data;
    },
  };