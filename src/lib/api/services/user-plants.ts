// src/lib/api/services/user-plants.ts
import { apiClient } from '../client';
import { WateringLog, FertilizingLog, UserPlant, Plant } from '@/types';

export async function getUserPlantById(plantId: number) {
  const { data } = await apiClient.get<UserPlant>(`/users/library/plants/${plantId}`);
  return data;
}

export async function getUserPlants() {
  const { data } = await apiClient.get<UserPlant[]>(`/users/library`);
  return data;
}

export async function createUserPlant(plantData: {
  plantId: number;
  nickname?: string;
  roomId?: number;
  notes?: string;
}) {
  if (plantData.nickname == null){
     const tempPlant = await apiClient.get<Plant>(`/plants/${plantData.plantId}`);
     plantData.nickname = tempPlant.data.name
  }
  const { data } = await apiClient.post<UserPlant>('/users/library/plants', plantData);
  return data;
}

export async function updateUserPlant(plantId: number, formData: FormData) {
  const { data } = await apiClient.put<UserPlant>(
    `/users/library/plants/${plantId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function addWateringLog(plantId: number, log: WateringLog) {
  const { data } = await apiClient.post(`/users/library/plants/${plantId}/watering`, log);
  return data;
}

export async function addFertilizingLog(plantId: number, log: FertilizingLog) {
  const { data } = await apiClient.post(`/users/library/plants/${plantId}/fertilizing`, log);
  return data;
}

export async function moveUserPlantToRoom(plantId: number, roomId: number) {
  const { data } = await apiClient.put(`/users/library/plants/${plantId}/move`, { roomId });
  return data;
}

export async function addPlantToGraveyard(plantId: number, endDate: string) {
  const { data } = await apiClient.post(`/users/library/plants/${plantId}/graveyard`, { endDate });
  return data;
}
