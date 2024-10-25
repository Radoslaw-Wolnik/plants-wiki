// useModeration.ts
import { useApi } from '@/hooks';
import { ModerationType } from '@/types';
import { 
  reviewFlag,
  processModeratorRequest,
  getModeratorRequests
} from '@/lib/api';

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
    await processModeratorRequest(reportId, action);
    await Promise.all([statsApi.get(), queueApi.get()]);
  };

  const handleFlag = async (flagId: number, action: 'APPROVE' | 'REJECT', strikeUser?: boolean) => {
    await reviewFlag(flagId, action, strikeUser);
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
