// src/hooks/useProfile.ts
import { useApi, useAuth, useToast } from '@/hooks';
import { User } from '@/types';

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
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await fetch('/api/users/profile', {
        method: 'PUT',
        body: formData,
      });
      
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      throw err;
    }
  };

  const refreshStats = async () => {
    await getStats();
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
    refreshStats,
  };
}
