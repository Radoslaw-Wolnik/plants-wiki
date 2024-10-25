// useUserProfile.ts
import { useApi, useFriends } from '@/hooks';
import { UserProfileResponse } from '@/types';
import { getUserProfile } from '@/lib/api';

export function useUserProfile(userId: number) {
  const { data: profile, isLoading, error } = useApi<UserProfileResponse>(`/users/${userId}`);
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
