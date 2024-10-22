// src/lib/api/types/room.ts
import { UserPlant } from "./user-plant";

export interface Room {
    id: number;
    name: string;
    type: 'LIVING_ROOM' | 'BEDROOM' | 'BATHROOM' | 'KITCHEN' | 'BALCONY' | 'OUTDOOR' | 'GREENHOUSE';
    sunlight: string;
    humidity: string;
    userPlants: UserPlant[];
  }