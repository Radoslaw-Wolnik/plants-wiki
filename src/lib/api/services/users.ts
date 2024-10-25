// src/lib/api/services/users.ts
import { apiClient } from '../client';
import { 
  UserProfileResponse as UserProfile, 
  WishlistItemResponse as WishlistItem, 
  GraveyardItemResponse as GraveyardItem 
} from '@/types';
  
export async function getUserProfile(userId: number) {
  const { data } = await apiClient.get<UserProfile>(`/users/${userId}`);
  return data;
}

export async function updateUserProfile(profileData: {
  username?: string;
  email?: string;
}) {
  const { data } = await apiClient.put<UserProfile>('/users/profile', profileData);
  return data;
}

export async function uploadProfilePicture(photo: FormData) {
  const { data } = await apiClient.post<{ fileUrl: string }>(
    '/users/profile/picture',
    photo,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
}

export async function getWishlist() {
  const { data } = await apiClient.get<WishlistItem[]>('/users/wishlist');
  return data;
}

export async function addToWishlist(plantName: string) {
  const { data } = await apiClient.post<WishlistItem>('/users/wishlist', { plantName });
  return data;
}

export async function removeFromWishlist(itemId: number) {
  await apiClient.delete(`/users/wishlist?id=${itemId}`);
}

export async function getGraveyard() {
  const { data } = await apiClient.get<GraveyardItem[]>('/users/graveyard');
  return data;
}

export async function addToGraveyard(graveyardData: {
  plantName: string;
  startDate: string;
  endDate: string;
}) {
  const { data } = await apiClient.post<GraveyardItem>('/users/graveyard', graveyardData);
  return data;
}

export async function removeFromGraveyard(itemId: number) {
  await apiClient.delete(`/users/graveyard?id=${itemId}`);
}

export async function getFriends() {
  const { data } = await apiClient.get<UserProfile[]>('/users/friends');
  return data;
}

export async function addFriend(friendId: number) {
  const { data } = await apiClient.post<UserProfile>('/users/friends', { friendId });
  return data;
}

export async function removeFriend(friendId: number) {
  await apiClient.delete(`/users/friends?id=${friendId}`);
}

export async function searchUsers(query: string) {
  const { data } = await apiClient.get<UserProfile[]>('/users/search', {
    params: { q: query },
  });
  return data;
}

export async function getNotifications() {
  const { data } = await apiClient.get('/users/notifications');
  return data;
}

export async function markNotificationRead(notificationId: number) {
  const { data } = await apiClient.put(`/users/notifications?id=${notificationId}`);
  return data;
}
