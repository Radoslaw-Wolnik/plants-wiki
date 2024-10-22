// src/lib/api/services/care-tips.ts
import { apiClient } from '../client';
interface CareTip {
    id: number;
    title: string;
    content: string;
    plant: {
      id: number;
      name: string;
    };
    author: {
      id: number;
      username: string;
    };
    likes: number;
    flags: number;
  }
  
  export const careTips = {
    getForPlant: async (plantId: number) => {
      const { data } = await apiClient.get<CareTip[]>(`/plants/${plantId}/care-tips`);
      return data;
    },
  
    create: async (plantId: number, tipData: {
      title: string;
      content: string;
    }) => {
      const { data } = await apiClient.post<CareTip>(`/plants/${plantId}/care-tips`, tipData);
      return data;
    },
  
    like: async (plantId: number, tipId: number) => {
      const { data } = await apiClient.put(`/plants/${plantId}/care-tips/${tipId}`);
      return data;
    },
  
    flag: async (plantId: number, tipId: number, reason: string) => {
      const { data } = await apiClient.patch(`/plants/${plantId}/care-tips/${tipId}`, { reason });
      return data;
    },
  };