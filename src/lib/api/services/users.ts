// src/lib/api/services/users.ts
import { apiClient } from '../client';
import { 
    UserProfile, 
    WishlistItem, 
    GraveyardItem, 
    CalendarEvent 
  } from '../types/users';
  
  export const users = {
    getProfile: async (userId: number) => {
      const { data } = await apiClient.get<UserProfile>(`/users/${userId}`);
      return data;
    },
  
    updateProfile: async (profileData: {
      username?: string;
      email?: string;
    }) => {
      const { data } = await apiClient.put<UserProfile>('/users/profile', profileData);
      return data;
    },
  
    uploadProfilePicture: async (photo: FormData) => {
      const { data } = await apiClient.post<{ fileUrl: string }>(
        '/users/profile/picture',
        photo,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return data;
    },
  
    // Wishlist operations
    getWishlist: async () => {
      const { data } = await apiClient.get<WishlistItem[]>('/users/wishlist');
      return data;
    },
  
    addToWishlist: async (plantName: string) => {
      const { data } = await apiClient.post<WishlistItem>('/users/wishlist', { plantName });
      return data;
    },
  
    removeFromWishlist: async (itemId: number) => {
      await apiClient.delete(`/users/wishlist?id=${itemId}`);
    },
  
    // Graveyard operations
    getGraveyard: async () => {
      const { data } = await apiClient.get<GraveyardItem[]>('/users/graveyard');
      return data;
    },
  
    addToGraveyard: async (graveyardData: {
      plantName: string;
      startDate: string;
      endDate: string;
    }) => {
      const { data } = await apiClient.post<GraveyardItem>('/users/graveyard', graveyardData);
      return data;
    },
  
    removeFromGraveyard: async (itemId: number) => {
      await apiClient.delete(`/users/graveyard?id=${itemId}`);
    },
  
    // Calendar operations
    getCalendarEvents: async (startDate: string, endDate: string) => {
      const { data } = await apiClient.get<CalendarEvent[]>('/users/calendar', {
        params: { startDate, endDate },
      });
      return data;
    },
  
    // Friend operations
    getFriends: async () => {
      const { data } = await apiClient.get<UserProfile[]>('/users/friends');
      return data;
    },
  
    addFriend: async (friendId: number) => {
      const { data } = await apiClient.post<UserProfile>('/users/friends', { friendId });
      return data;
    },
  
    removeFriend: async (friendId: number) => {
      await apiClient.delete(`/users/friends?id=${friendId}`);
    },
  
    // Notifications
    getNotifications: async () => {
      const { data } = await apiClient.get('/users/notifications');
      return data;
    },
  
    markNotificationRead: async (notificationId: number) => {
      const { data } = await apiClient.put(`/users/notifications?id=${notificationId}`);
      return data;
    },
  
    // Search users
    searchUsers: async (query: string) => {
      const { data } = await apiClient.get<UserProfile[]>('/users/search', {
        params: { q: query },
      });
      return data;
    },
  };