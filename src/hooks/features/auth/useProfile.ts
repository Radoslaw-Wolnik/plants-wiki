// useProfile.ts
import { useApi, useAuth, useToast } from '@/hooks';
import { UserProfileResponse } from '@/types';
import { updateUserProfile, uploadProfilePicture } from '@/lib/api';

interface ProfileStats {
  totalPlants: number;
  totalArticles: number;
  activePlants: number;
  graveyardPlants: number;
  contributedArticles: number;
}

export function useProfile() {
  const { user, refreshUser } = useAuth();
  const { data: stats, get: getStats } = useApi<ProfileStats>('/users/profile/stats');
  const toast = useToast();

  const updateProfile = async (updates: {
    username?: string;
    email?: string;
    profilePicture?: File;
  }) => {
    try {
      if (updates.profilePicture) {
        const formData = new FormData();
        formData.append('file', updates.profilePicture);
        await uploadProfilePicture(formData);
      }

      if (updates.username || updates.email) {
        await updateUserProfile({
          username: updates.username,
          email: updates.email
        });
      }
      
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      throw err;
    }
  };

  return {
    user,
    stats: stats ?? {
      totalPlants: 0,
      totalArticles: 0,
      activePlants: 0,
      graveyardPlants: 0,
      contributedArticles: 0,
    },
    updateProfile,
    refreshStats: getStats,
  };
}