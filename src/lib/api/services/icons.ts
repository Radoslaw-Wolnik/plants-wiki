// src/lib/api/services/icons.ts
import { apiClient } from '../client';
// import { PlantIcon } from '../types';

export async function loadIcon(plantId: number, version: number) {
  const { data } = await apiClient.get(`/icon/load/${plantId}/${version}`);
  return data;
}

export async function saveIcon(plantId: number, iconData: {
  imageData: string;
  layers: any[];
  userId: number;
}) {
  const { data } = await apiClient.post(`/icon/save/${plantId}`, iconData);
  return data;
}