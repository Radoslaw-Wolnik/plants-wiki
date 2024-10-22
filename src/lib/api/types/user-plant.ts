// src/lib/api/types/user-plant.ts
export interface UserPlant {
    id: number;
    nickname?: string;
    acquiredDate: string;
    notes?: string;
    plant: {
      name: string;
      scientificName: string;
      icon: string;
    };
    room?: {
      name: string;
    };
    lastWatering?: string;
    lastFertilizing?: string;
  }
  
  export interface WateringLog {
    date: string;
    amount?: number;
    notes?: string;
  }
  
  export interface FertilizingLog {
    date: string;
    fertilizer: string;
    amount?: number;
    notes?: string;
  }
  