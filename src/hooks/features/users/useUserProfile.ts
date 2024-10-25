// src/hooks/useUserProfile.ts
import { useApi, useFriends } from '@/hooks';
import { User, UserLibrary, PlantPhoto } from '@/types';

interface UserProfile extends User {
  library?: UserLibrary;
  photos?: PlantPhoto[];
  _count: {
    friends: number;
    articles: number;
    plants: number;
  };
}

export function useUserProfile(userId: number) {
  const { data: profile, isLoading, error } = useApi<UserProfile>(`/users/${userId}`);
  const { friends } = useFriends();

  const isFriend = friends.some(friend => friend.id === userId);
  const canViewLibrary = isFriend || profile?.id === userId;
  const canViewPhotos = isFriend || profile?.id === userId;

  return {
    profile,
    isLoading,
    error,
    isFriend,
    canViewLibrary,
    canViewPhotos,
  };
}