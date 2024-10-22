// src/lib/api/services/rooms.ts
import { Room } from '../types/room';
import { apiClient } from '../client';

export async function getAllRooms() {
  const { data } = await apiClient.get<Room[]>('/users/rooms');
  return data;
}

export async function createRoom(roomData: {
  name: string;
  type: Room['type'];
  sunlight: string;
  humidity: string;
}) {
  const { data } = await apiClient.post<Room>('/users/rooms', roomData);
  return data;
}

export async function updateRoom(
  roomId: number,
  roomData: {
    name?: string;
    type?: Room['type'];
    sunlight?: string;
    humidity?: string;
  }
) {
  const { data } = await apiClient.put<Room>(`/users/rooms?id=${roomId}`, roomData);
  return data;
}

export async function deleteRoom(roomId: number) {
  await apiClient.delete(`/users/rooms?id=${roomId}`);
}