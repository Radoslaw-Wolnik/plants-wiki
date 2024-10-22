// src/lib/api/services/moderation.ts
import { apiClient } from '../client';
interface ModeratorRequest {
    id: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    user: {
      id: number;
      username: string;
    };
  }
  
  export const moderation = {
    submitRequest: async () => {
      const { data } = await apiClient.post<ModeratorRequest>('/moderator-requests');
      return data;
    },
  
    getRequests: async () => {
      const { data } = await apiClient.get<ModeratorRequest[]>('/moderator-requests');
      return data;
    },
  
    processRequest: async (requestId: number, action: 'approve' | 'reject') => {
      const { data } = await apiClient.put(`/moderator-requests?id=${requestId}&action=${action}`);
      return data;
    },
  
    reviewFlag: async (flagId: number, action: 'APPROVE' | 'REJECT', strikeUser?: boolean) => {
      const { data } = await apiClient.post('/flags', { flagId, action, strikeUser });
      return data;
    },
  };