// src/lib/api/services/trades.ts
import { apiClient } from '../client';
import { UserPlant } from '@/types';

interface TradeOffer {
  id: number;
  offeredPlant: UserPlant;
  requestedPlant: UserPlant;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
}

export async function getAllTrades() {
  const { data } = await apiClient.get<TradeOffer[]>('/trades');
  return data;
}

export async function createTrade(tradeData: {
  offeredPlantId: number;
  requestedPlantId: number;
  message?: string;
}) {
  const { data } = await apiClient.post<TradeOffer>('/trades', tradeData);
  return data;
}

export async function respondToTrade(tradeId: number, action: 'accept' | 'reject') {
  const { data } = await apiClient.put(`/trades?id=${tradeId}&action=${action}`);
  return data;
}
