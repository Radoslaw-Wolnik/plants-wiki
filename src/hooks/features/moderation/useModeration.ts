// src/hooks/useModeration.ts
import { useApi } from '@/hooks/useApi';
import { ModerationType } from '@/types/global';

interface ModerationStats {
  pendingChangeRequests: number;
  pendingReports: number;
  flaggedContent: number;
  recentActions: {
    id: number;
    type: ModerationType;
    target: string;
    moderator: string;
    createdAt: string;
  }[];
}

export function useModeration() {
  const statsApi = useApi<ModerationStats>('/moderation/stats');
  const queueApi = useApi<any[]>('/moderation/queue');

  const handleReport = async (reportId: number, action: 'approve' | 'reject', reason?: string) => {
    await fetch(`/api/moderation/reports/${reportId}`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
    await Promise.all([statsApi.get(), queueApi.get()]);
  };

  const handleFlag = async (flagId: number, action: 'remove' | 'keep', reason?: string) => {
    await fetch(`/api/moderation/flags/${flagId}`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
    await Promise.all([statsApi.get(), queueApi.get()]);
  };

  return {
    stats: statsApi.data,
    queue: queueApi.data ?? [],
    isLoading: statsApi.isLoading || queueApi.isLoading,
    error: statsApi.error || queueApi.error,
    handleReport,
    handleFlag,
    refresh: async () => {
      await Promise.all([statsApi.get(), queueApi.get()]);
    },
  };
}