// src/lib/api/services/plants.ts
import { apiClient } from '../client';
import { Plant, PlantVerification } from '../types/plant';
import { PaginatedResponse, PaginationParams } from '../types/common';
export const plants = {
  getAll: async (params: PaginationParams) => {
    const { data } = await apiClient.get<PaginatedResponse<Plant>>('/plants', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Plant>(`/plants/${id}`);
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await apiClient.post<Plant>('/plants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  submitVerification: async (formData: FormData) => {
    const { data } = await apiClient.post<PlantVerification>('/plants/verify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadPhoto: async (plantId: number, formData: FormData) => {
    const { data } = await apiClient.post(`/plants/${plantId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadIcon: async (plantId: number, formData: FormData) => {
    const { data } = await apiClient.post(`/plants/${plantId}/icon`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};