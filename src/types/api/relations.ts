// types/api/relations.ts
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Plant, UserPlant, Room, WateringLog, FertilizingLog } from '@/types/prisma';
import { UserPlantPhoto } from "@prisma/client";
import { PublicUser } from '@/types/api/auth';

export type UserWithLibrary = Prisma.UserGetPayload<{
  include: { 
    library: {
      include: {
        userPlants: true;
      };
    };
  };
}>;

export type ArticleWithDetails = Prisma.ArticleGetPayload<{
  include: {
    plant: true;
    contributors: true;
    comments: {
      include: {
        user: true;
      };
    };
    photos: true;
  };
}>;


// Extend the base UserPlant type with all its relations
export interface ExtendedUserPlant extends Omit<UserPlant, 'plant' | 'room'> {
  plant: Pick<Plant, 
    | 'id' 
    | 'name' 
    | 'scientificName' 
    | 'commonName'
    | 'icon'
    | 'petSafe'
    | 'light'
    | 'humidity'
    | 'temperature'
  >;
  room?: Pick<Room, 'id' | 'name' | 'type' | 'sunlight' | 'humidity'> | null;
  photos: Array<Pick<UserPlantPhoto, 'id' | 'url' | 'description' | 'takenAt'>>;
  wateringLogs: Array<Pick<WateringLog, 'id' | 'date' | 'amount' | 'notes'>>;
  fertilizingLogs: Array<Pick<FertilizingLog, 'id' | 'date' | 'amount' | 'fertilizer' | 'notes'>>;
  lastWatering?: Date;
  lastFertilizing?: Date;
}

// Input type for creating/updating user plants
export interface UserPlantInput {
  plantId: number;
  nickname?: string | null;
  roomId?: number | null;
  notes?: string | null;
  acquiredDate?: Date;
}

// Response type that includes counts and other useful information
export interface UserPlantResponse extends ExtendedUserPlant {
  _count?: {
    wateringLogs: number;
    fertilizingLogs: number;
    photos: number;
  };
}