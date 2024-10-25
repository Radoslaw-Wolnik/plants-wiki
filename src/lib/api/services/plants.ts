// src/lib/api/services/plants.ts
import { apiClient } from '../client';
import { Plant, PlantVerification, PaginatedResponse, PaginationParams } from '@/types';

export async function getAllPlants(params: PaginationParams) {
  const { data } = await apiClient.get<PaginatedResponse<Plant>>('/plants', { params });
  return data;
}

export async function getPlantById(id: number) {
  const { data } = await apiClient.get<Plant>(`/plants/${id}`);
  return data;
}

export async function createPlant(formData: FormData) {
  const { data } = await apiClient.post<Plant>('/plants', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function submitPlantVerification(formData: FormData) {
  const { data } = await apiClient.post<PlantVerification>('/plants/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadPlantPhoto(plantId: number, formData: FormData) {
  const { data } = await apiClient.post(`/plants/${plantId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function uploadPlantIcon(plantId: number, formData: FormData) {
  const { data } = await apiClient.post(`/plants/${plantId}/icon`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
