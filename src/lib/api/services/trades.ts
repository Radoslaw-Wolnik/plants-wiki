// src/lib/api/services/trades.ts
import { apiClient } from '../client';
import { UserPlant } from '../types/user-plant';
interface TradeOffer {
    id: number;
    offeredPlant: UserPlant;
    requestedPlant: UserPlant;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    message?: string;
    createdAt: string;
  }
  
  export const trades = {
    getAll: async () => {
      const { data } = await apiClient.get<TradeOffer[]>('/trades');
      return data;
    },
  
    create: async (tradeData: {
      offeredPlantId: number;
      requestedPlantId: number;
      message?: string;
    }) => {
      const { data } = await apiClient.post<TradeOffer>('/trades', tradeData);
      return data;
    },
  
    respond: async (tradeId: number, action: 'accept' | 'reject') => {
      const { data } = await apiClient.put(`/trades?id=${tradeId}&action=${action}`);
      return data;
    },
  };