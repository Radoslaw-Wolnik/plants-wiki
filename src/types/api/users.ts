// src/types/api/users.ts
import type { User, WishlistPlant, GraveyardPlant } from '@/types/prisma';
import type { SafeUser } from '@/types/api/auth';

export interface UserProfileResponse extends SafeUser {
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

export interface WishlistItemResponse extends Pick<WishlistPlant, 'id' | 'plantName'> {
  createdAt: string;
}

export interface GraveyardItemResponse extends Pick<GraveyardPlant, 'id' | 'plantName' | 'startDate' | 'endDate'> {
  createdAt: string;
}

