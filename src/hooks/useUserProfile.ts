// src/hooks/useUserProfile.ts
import { useApi } from '@/hooks/useApi';
import { User, UserLibrary, UserPlantPhoto } from '@/types/global';
import { useFriends } from '@/hooks/useFriends';

interface UserProfile extends User {
  library?: UserLibrary;
  photos?: UserPlantPhoto[];
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