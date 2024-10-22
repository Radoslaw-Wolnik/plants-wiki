// src/lib/api/services/rooms.ts
import { Room } from '../types/room';
import { apiClient } from '../client';

export const rooms = {
  getAll: async () => {
    const { data } = await apiClient.get<Room[]>('/users/rooms');
    return data;
  },

  create: async (roomData: {
    name: string;
    type: Room['type'];
    sunlight: string;
    humidity: string;
  }) => {
    const { data } = await apiClient.post<Room>('/users/rooms', roomData);
    return data;
  },

  update: async (roomId: number, roomData: {
    name?: string;
    type?: Room['type'];
    sunlight?: string;
    humidity?: string;
  }) => {
    const { data } = await apiClient.put<Room>(`/users/rooms?id=${roomId}`, roomData);
    return data;
  },

  delete: async (roomId: number) => {
    await apiClient.delete(`/users/rooms?id=${roomId}`);
  },
};