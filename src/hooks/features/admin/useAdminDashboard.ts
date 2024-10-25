import { useApi, useToast } from '@/hooks';
import { AdminStats } from '@/types';
import { banUser as banUserApi } from '@/lib/api';

export function useAdminDashboard() {
  const { data: stats, get: getStats } = useApi<AdminStats>('/admin/stats');
  const toast = useToast();

  const banUser = async (userId: number, duration: number) => {
    try {
      await banUserApi(userId, duration);
      toast.success('User banned successfully');
      await getStats();
    } catch (err) {
      toast.error('Failed to ban user');
      throw err;
    }
  };

  return {
    stats: stats ?? {
      totalUsers: 0,
      activeUsers: 0,
      totalPlants: 0,
      totalArticles: 0,
      totalComments: 0,
      flaggedContent: 0,
      moderationQueue: 0,
      pendingVerifications: 0,
      reportedContent: 0,
      newUsersToday: 0,
      topContributors: [],
    },
    banUser,
    refresh: getStats,
  };
}