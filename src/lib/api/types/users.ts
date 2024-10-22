// src/lib/api/types/users.ts
export interface UserProfile {
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    createdAt: string;
    strikes: number;
    isBanned: boolean;
    banExpiresAt?: string;
    lastActive: string;
    library?: {
      _count: {
        userPlants: number;
      };
    };
    _count: {
      friends: number;
      articles: number;
    };
  }
  
  export interface WishlistItem {
    id: number;
    plantName: string;
  }
  
  export interface GraveyardItem {
    id: number;
    plantName: string;
    startDate: string;
    endDate: string;
  }
  
  export interface CalendarEvent {
    type: 'watering' | 'fertilizing';
    date: string;
    plantName: string;
    plantId: number;
    fertilizer?: string;
  }