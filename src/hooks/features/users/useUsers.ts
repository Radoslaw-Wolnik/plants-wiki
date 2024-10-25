import { useCallback } from 'react';
import { getUserProfile } from '@/lib/api';

export function useUsers() {
  const getUser = useCallback(async (userId: number) => {
    try {
      const user = await getUserProfile(userId);
      return user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }, []);

  return {
    getUser
  };
}