// src/hooks/useAdminDashboard.ts
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/ui/useToast';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPlants: number;
  totalArticles: number;
  pendingVerifications: number;
  reportedContent: number;
  newUsersToday: number;
  moderationQueue: number;
}

interface AdminActions {
  recentActions: {
    id: number;
    type: string;
    action: string;
    moderator: string;
    target: string;
    createdAt: string;
  }[];
}

export function useAdminDashboard() {
  const { data: stats, get: getStats } = useApi<AdminStats>('/admin/stats');
  const { data: actions, get: getActions } = useApi<AdminActions>('/admin/actions');
  const toast = useToast();

  const banUser = async (userId: number, duration: number) => {
    try {
      await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        body: JSON.stringify({ duration }),
      });
      toast.success('User banned successfully');
      await Promise.all([getStats(), getActions()]);
    } catch (err) {
      toast.error('Failed to ban user');
      throw err;
    }
  };

  const deleteContent = async (contentType: string, contentId: number) => {
    try {
      await fetch(`/api/admin/${contentType}/${contentId}`, {
        method: 'DELETE',
      });
      toast.success('Content deleted successfully');
      await Promise.all([getStats(), getActions()]);
    } catch (err) {
      toast.error('Failed to delete content');
      throw err;
    }
  };

  const refresh = () => Promise.all([getStats(), getActions()]);

  return {
    stats: stats ?? {
      totalUsers: 0,
      activeUsers: 0,
      totalPlants: 0,
      totalArticles: 0,
      pendingVerifications: 0,
      reportedContent: 0,
      newUsersToday: 0,
      moderationQueue: 0,
    },
    recentActions: actions?.recentActions ?? [],
    banUser,
    deleteContent,
    refresh,
  };
}