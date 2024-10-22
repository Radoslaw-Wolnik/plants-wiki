// src/lib/api/services/user-plants.ts
import { apiClient } from '../client';
import { WateringLog, FertilizingLog, UserPlant } from '../types/user-plant';

export const userPlants = {
  getById: async (plantId: number) => {
    const { data } = await apiClient.get<UserPlant>(`/users/library/plants/${plantId}`);
    return data;
  },

  create: async (plantData: { plantId: number; nickname?: string; roomId?: number; notes?: string }) => {
    const { data } = await apiClient.post<UserPlant>('/users/library/plants', plantData);
    return data;
  },

  update: async (plantId: number, formData: FormData) => {
    const { data } = await apiClient.put<UserPlant>(`/users/library/plants/${plantId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  addWateringLog: async (plantId: number, log: WateringLog) => {
    const { data } = await apiClient.post(`/users/library/plants/${plantId}/watering`, log);
    return data;
  },

  addFertilizingLog: async (plantId: number, log: FertilizingLog) => {
    const { data } = await apiClient.post(`/users/library/plants/${plantId}/fertilizing`, log);
    return data;
  },

  moveToRoom: async (plantId: number, roomId: number) => {
    const { data } = await apiClient.put(`/users/library/plants/${plantId}/move`, { roomId });
    return data;
  },

  addToGraveyard: async (plantId: number, endDate: string) => {
    const { data } = await apiClient.post(`/users/library/plants/${plantId}/graveyard`, { endDate });
    return data;
  },
};
