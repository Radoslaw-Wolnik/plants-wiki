// src/types/global.ts

export interface User {
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    createdAt: string;
  }
  
  export interface Plant {
    id: number;
    name: string;
    scientificName: string;
    commonName: string;
    family: string;
    icon: string;
    light: string;
    temperature: string;
    soil: string;
    climate: string;
    humidity: string;
    growthCycle: string;
    toxicity: string;
    petSafe: boolean;
    plantType: string;
  }
  
  export interface Article {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    authorId: number;
    plantId: number;
  }
  
  export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    articleId: number;
  }
  
  export interface Room {
    id: number;
    name: string;
    type: 'LIVING_ROOM' | 'BEDROOM' | 'BATHROOM' | 'KITCHEN' | 'BALCONY' | 'OUTDOOR' | 'GREENHOUSE';
    sunlight: string;
    humidity: string;
    userId: number;
  }
  
  export interface UserPlant {
    id: number;
    libraryId: number;
    plantId: number;
    nickname?: string;
    acquiredDate: string;
    notes?: string;
  }